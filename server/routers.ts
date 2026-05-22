import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createChatMessage,
  createCoupon,
  createCourse,
  createEnrollment,
  createModule,
  createPayment,
  createReply,
  createReview,
  createThread,
  deleteModule,
  deleteCourse,
  getAllCoupons,
  getAllPayments,
  getAllUsers,
  getAnalyticsOverview,
  getBundles,
  getChatMessages,
  getCourseById,
  getCourseBySlug,
  getCourses,
  getCoursesByTrainer,
  getEnrollment,
  getEnrollmentsByUser,
  getModuleById,
  getModuleProgress,
  getModulesByCourse,
  getPaymentsByUser,
  getRepliesByThread,
  getRevenueByMonth,
  getReviewsByCourse,
  getSubscriptionsByUser,
  getThreadById,
  getThreadsByCourse,
  getTrainerAnalytics,
  getCouponByCode,
  incrementCouponUsage,
  updateCourse,
  updateModule,
  updateUserProfile,
  updateUserRole,
  upsertModuleProgress,
  upsertSubscription,
  updatePaymentBySessionId,
  updateUserStripeCustomerId,
} from "./db";
import { storagePut } from "./storage";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// ─── Admin guard ─────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  return next({ ctx });
});

// ─── Trainer guard ────────────────────────────────────────────────────────────
const trainerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "trainer" && ctx.user.role !== "admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Trainer or admin only" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ─────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({ name: z.string().optional(), bio: z.string().optional(), avatarUrl: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
    updateRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin", "trainer", "learner"]) }))
      .mutation(async ({ input }) => {
        await updateUserRole(input.userId, input.role);
        return { success: true };
      }),
    listUsers: adminProcedure.query(() => getAllUsers()),
  }),

  // ─── Courses ──────────────────────────────────────────────────────────────
  courses: router({
    list: publicProcedure
      .input(z.object({ search: z.string().optional(), category: z.string().optional(), level: z.string().optional(), isFree: z.boolean().optional(), limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(({ input }) => getCourses({ ...input, publishedOnly: true })),

    listAll: adminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(({ input }) => getCourses({ ...input, publishedOnly: false })),

    myTrainerCourses: trainerProcedure.query(({ ctx }) => getCoursesByTrainer(ctx.user.id)),

    bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      const course = await getCourseBySlug(input);
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      return course;
    }),

    byId: publicProcedure.input(z.number()).query(async ({ input }) => {
      const course = await getCourseById(input);
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      return course;
    }),

    create: trainerProcedure
      .input(z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        category: z.string().optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        price: z.string().optional(),
        isFree: z.boolean().optional(),
        thumbnailUrl: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
        const id = await createCourse({ ...input, trainerId: ctx.user.id, slug });
        return { id, slug };
      }),

    update: trainerProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        category: z.string().optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        price: z.string().optional(),
        comparePrice: z.string().optional(),
        isFree: z.boolean().optional(),
        thumbnailUrl: z.string().optional(),
        previewVideoUrl: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const course = await getCourseById(id);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.trainerId !== ctx.user.id && ctx.user.role !== "admin")
          throw new TRPCError({ code: "FORBIDDEN" });
        await updateCourse(id, data);
        return { success: true };
      }),

    delete: trainerProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const course = await getCourseById(input);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.trainerId !== ctx.user.id && ctx.user.role !== "admin")
          throw new TRPCError({ code: "FORBIDDEN" });
        await deleteCourse(input);
        return { success: true };
      }),
  }),

  // ─── Modules ──────────────────────────────────────────────────────────────
  modules: router({
    byCourse: publicProcedure.input(z.number()).query(({ input }) => getModulesByCourse(input)),

    create: trainerProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        type: z.enum(["video", "text", "assessment"]),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
        duration: z.number().optional(),
        sortOrder: z.number().optional(),
        isPreview: z.boolean().optional(),
        assessmentData: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const course = await getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.trainerId !== ctx.user.id && ctx.user.role !== "admin")
          throw new TRPCError({ code: "FORBIDDEN" });
        const id = await createModule(input);
        return { id };
      }),

    update: trainerProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
        duration: z.number().optional(),
        sortOrder: z.number().optional(),
        isPreview: z.boolean().optional(),
        assessmentData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateModule(id, data);
        return { success: true };
      }),

    delete: trainerProcedure
      .input(z.object({ id: z.number(), courseId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteModule(input.id, input.courseId);
        return { success: true };
      }),
  }),

  // ─── Enrollments ──────────────────────────────────────────────────────────
  enrollments: router({
    myCourses: protectedProcedure.query(async ({ ctx }) => {
      const userEnrollments = await getEnrollmentsByUser(ctx.user.id);
      const courseDetails = await Promise.all(userEnrollments.map((e) => getCourseById(e.courseId)));
      return userEnrollments.map((e, i) => ({ ...e, course: courseDetails[i] }));
    }),

    check: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
      const enrollment = await getEnrollment(ctx.user.id, input);
      return { enrolled: !!enrollment, enrollment };
    }),

    enrollFree: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
      const course = await getCourseById(input);
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      if (!course.isFree) throw new TRPCError({ code: "BAD_REQUEST", message: "Course is not free" });
      const existing = await getEnrollment(ctx.user.id, input);
      if (existing) return { success: true, enrollmentId: existing.id };
      const id = await createEnrollment({ userId: ctx.user.id, courseId: input, amountPaid: "0.00" });
      return { success: true, enrollmentId: id };
    }),
  }),

  // ─── Progress ─────────────────────────────────────────────────────────────
  progress: router({
    byCourse: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
      const enrollment = await getEnrollment(ctx.user.id, input);
      const progress = await getModuleProgress(ctx.user.id, input);
      return { enrollment, progress };
    }),

    markComplete: protectedProcedure
      .input(z.object({ moduleId: z.number(), courseId: z.number(), watchedSeconds: z.number().optional(), assessmentScore: z.number().optional(), assessmentPassed: z.boolean().optional() }))
      .mutation(async ({ ctx, input }) => {
        await upsertModuleProgress({ ...input, userId: ctx.user.id, isCompleted: true });
        return { success: true };
      }),

    updateWatched: protectedProcedure
      .input(z.object({ moduleId: z.number(), courseId: z.number(), watchedSeconds: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await upsertModuleProgress({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
  }),

  // ─── Payments ─────────────────────────────────────────────────────────────
  payments: router({
    myHistory: protectedProcedure.query(({ ctx }) => getPaymentsByUser(ctx.user.id)),

    allHistory: adminProcedure.query(() => getAllPayments()),

    validateCoupon: publicProcedure
      .input(z.object({ code: z.string(), courseId: z.number().optional() }))
      .query(async ({ input }) => {
        const coupon = await getCouponByCode(input.code);
        if (!coupon || !coupon.isActive) return { valid: false, message: "Invalid coupon code" };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { valid: false, message: "Coupon expired" };
        if (coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses) return { valid: false, message: "Coupon usage limit reached" };
        if (coupon.courseId && input.courseId && coupon.courseId !== input.courseId) return { valid: false, message: "Coupon not valid for this course" };
        return { valid: true, coupon: { discountType: coupon.discountType, discountValue: coupon.discountValue } };
      }),

    createCheckout: protectedProcedure
      .input(z.object({ courseId: z.number(), couponCode: z.string().optional(), origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const course = await getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        const existing = await getEnrollment(ctx.user.id, input.courseId);
        if (existing) throw new TRPCError({ code: "BAD_REQUEST", message: "Already enrolled" });

        let price = parseFloat(course.price ?? "0");
        let discountAmount = 0;
        let couponCode: string | undefined;

        if (input.couponCode) {
          const coupon = await getCouponByCode(input.couponCode);
          if (coupon && coupon.isActive) {
            if (coupon.discountType === "percent") discountAmount = price * (parseFloat(String(coupon.discountValue)) / 100);
            else discountAmount = parseFloat(String(coupon.discountValue));
            price = Math.max(0, price - discountAmount);
            couponCode = coupon.code;
          }
        }

        const finalPrice = Math.max(50, Math.round(price * 100));

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{ price_data: { currency: "usd", product_data: { name: course.title, description: course.shortDescription ?? undefined }, unit_amount: finalPrice }, quantity: 1 }],
          mode: "payment",
          success_url: `${input.origin}/learn/${course.slug}?enrolled=true`,
          cancel_url: `${input.origin}/courses/${course.slug}`,
          customer_email: ctx.user.email ?? undefined,
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          metadata: { user_id: ctx.user.id.toString(), course_id: input.courseId.toString(), customer_email: ctx.user.email ?? "", coupon_code: couponCode ?? "" },
        });

        await createPayment({ userId: ctx.user.id, courseId: input.courseId, stripeSessionId: session.id, amount: (finalPrice / 100).toFixed(2), status: "pending", couponCode, discountAmount: discountAmount.toFixed(2) });

        return { url: session.url };
      }),

    mySubscriptions: protectedProcedure.query(({ ctx }) => getSubscriptionsByUser(ctx.user.id)),

    allCoupons: adminProcedure.query(() => getAllCoupons()),

    createCoupon: adminProcedure
      .input(z.object({ code: z.string(), discountType: z.enum(["percent", "fixed"]), discountValue: z.string(), maxUses: z.number().optional(), courseId: z.number().optional(), expiresAt: z.date().optional() }))
      .mutation(async ({ input }) => {
        await createCoupon(input);
        return { success: true };
      }),

    getBundles: publicProcedure.query(() => getBundles()),
  }),

  // ─── Discussions ──────────────────────────────────────────────────────────
  discussions: router({
    threads: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
      const enrollment = await getEnrollment(ctx.user.id, input);
      const course = await getCourseById(input);
      if (!enrollment && course?.trainerId !== ctx.user.id && ctx.user.role !== "admin")
        throw new TRPCError({ code: "FORBIDDEN", message: "Must be enrolled" });
      const threads = await getThreadsByCourse(input);
      const withUsers = await Promise.all(threads.map(async (t) => {
        const { getUserById } = await import("./db");
        const user = await getUserById(t.userId);
        return { ...t, userName: user?.name ?? "Unknown" };
      }));
      return withUsers;
    }),

    createThread: protectedProcedure
      .input(z.object({ courseId: z.number(), title: z.string().min(3), body: z.string().min(10) }))
      .mutation(async ({ ctx, input }) => {
        const id = await createThread({ ...input, userId: ctx.user.id });
        return { id };
      }),

    replies: protectedProcedure.input(z.number()).query(async ({ input }) => {
      const replies = await getRepliesByThread(input);
      const withUsers = await Promise.all(replies.map(async (r) => {
        const { getUserById } = await import("./db");
        const user = await getUserById(r.userId);
        return { ...r, userName: user?.name ?? "Unknown" };
      }));
      return withUsers;
    }),

    createReply: protectedProcedure
      .input(z.object({ threadId: z.number(), courseId: z.number(), body: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const id = await createReply({ ...input, userId: ctx.user.id });
        return { id };
      }),
  }),

  // ─── Chat ─────────────────────────────────────────────────────────────────
  chat: router({
    messages: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
      const enrollment = await getEnrollment(ctx.user.id, input);
      const course = await getCourseById(input);
      if (!enrollment && course?.trainerId !== ctx.user.id && ctx.user.role !== "admin")
        throw new TRPCError({ code: "FORBIDDEN" });
      const msgs = await getChatMessages(input, 50);
      const withUsers = await Promise.all(msgs.map(async (m) => {
        const { getUserById } = await import("./db");
        const user = await getUserById(m.userId);
        return { ...m, userName: user?.name ?? "Unknown", userRole: user?.role ?? "learner" };
      }));
      return withUsers;
    }),

    send: protectedProcedure
      .input(z.object({ courseId: z.number(), message: z.string().min(1).max(1000) }))
      .mutation(async ({ ctx, input }) => {
        const id = await createChatMessage({ ...input, userId: ctx.user.id });
        return { id };
      }),
  }),

  // ─── Reviews ──────────────────────────────────────────────────────────────
  reviews: router({
    byCourse: publicProcedure.input(z.number()).query(({ input }) => getReviewsByCourse(input)),
    create: protectedProcedure
      .input(z.object({ courseId: z.number(), rating: z.number().min(1).max(5), review: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await createReview({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
  }),

  // ─── Analytics ────────────────────────────────────────────────────────────
  analytics: router({
    overview: adminProcedure.query(() => getAnalyticsOverview()),
    revenueByMonth: adminProcedure.query(() => getRevenueByMonth()),
    trainerStats: trainerProcedure.query(({ ctx }) => getTrainerAnalytics(ctx.user.id)),
  }),

  // ─── File Upload ──────────────────────────────────────────────────────────
  upload: router({
    getSignedUrl: trainerProcedure
      .input(z.object({ fileName: z.string(), contentType: z.string(), folder: z.string().default("uploads") }))
      .mutation(async ({ ctx, input }) => {
        const key = `${input.folder}/${ctx.user.id}-${Date.now()}-${input.fileName}`;
        return { key, uploadPath: `/api/upload?key=${encodeURIComponent(key)}` };
      }),
  }),
});

export type AppRouter = typeof appRouter;
