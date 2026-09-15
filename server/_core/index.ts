import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import Stripe from "stripe";
import { createEnrollment, createPayment, getCourseById, getEnrollment, getUserById, updatePaymentBySessionId, updateUserStripeCustomerId, upsertSubscription } from "../db";
import { storagePut } from "../storage";
import { sendEnrollmentEmail } from "../email";
import multer from "multer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── www → apex redirect ────────────────────────────────────────────────
  app.use((req, res, next) => {
    const host = req.headers.host ?? "";
    if (host.startsWith("www.")) {
      const apex = host.slice(4);
      const proto = req.headers["x-forwarded-proto"] ?? "https";
      return res.redirect(301, `${proto}://${apex}${req.originalUrl}`);
    }
    next();
  });

  // ─── Stripe Webhook (must be before json parser) ─────────────────────────
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
    } catch (err: any) {
      console.error("[Webhook] Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected");
      return res.json({ verified: true });
    }
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id ?? "0");
        const courseId = parseInt(session.metadata?.course_id ?? "0");
        const couponCode = session.metadata?.coupon_code ?? undefined;
        if (userId && courseId) {
          await updatePaymentBySessionId(session.id, { status: "completed", stripePaymentIntentId: session.payment_intent as string });
          const existing = await getEnrollment(userId, courseId);
          if (!existing) {
            await createEnrollment({ userId, courseId, amountPaid: ((session.amount_total ?? 0) / 100).toFixed(2), stripePaymentIntentId: session.payment_intent as string });
            const [learner, course] = await Promise.all([getUserById(userId), getCourseById(courseId)]);
            if (learner && course) {
              await sendEnrollmentEmail(learner, course, session.metadata?.site_origin);
            }
          }
          if (session.customer) await updateUserStripeCustomerId(userId, session.customer as string);
        }
      } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
        const sub = event.data.object as Stripe.Subscription;
        const userId = parseInt(sub.metadata?.user_id ?? "0");
        if (userId) {
          const periodEnd = (sub as any).current_period_end ?? (sub as any).currentPeriodEnd;
          await upsertSubscription({ userId, stripeSubscriptionId: sub.id, stripePriceId: (sub.items.data[0]?.price.id) ?? undefined, status: sub.status as any, currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined });
        }
      }
    } catch (err) {
      console.error("[Webhook] Processing error:", err);
    }
    res.json({ received: true });
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ─── File Upload Endpoint ─────────────────────────────────────────────────
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
  app.post("/api/upload", upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file" });
      const key = (req.query.key as string) || `uploads/${Date.now()}-${req.file.originalname}`;
      const { url } = await storagePut(key, req.file.buffer, req.file.mimetype);
      res.json({ url, key });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
