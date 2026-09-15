import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createContext(overrides: Partial<TrpcContext["user"]> = {}): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const user: NonNullable<TrpcContext["user"]> = {
    id: 1,
    openId: "test-user",
    email: "test@skillsphere.com",
    name: "Test User",
    loginMethod: "manus",
    role: "learner",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: any) => clearedCookies.push({ name, options }),
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

function createPublicContext(): { ctx: TrpcContext } {
  return {
    ctx: {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    },
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const { ctx, clearedCookies } = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1, httpOnly: true, path: "/" });
  });
});

describe("auth.me", () => {
  it("returns the current user when authenticated", async () => {
    const { ctx } = createContext({ name: "Alice", email: "alice@example.com" });
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user?.name).toBe("Alice");
    expect(user?.email).toBe("alice@example.com");
  });

  it("returns null when unauthenticated", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

// ─── Courses (public procedures) ─────────────────────────────────────────────

describe("courses.list", () => {
  it("accepts optional filter parameters without throwing", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // This will attempt a DB query; we just verify the procedure exists and accepts input
    await expect(
      caller.courses.list({ search: "leadership", category: "Leadership", level: "beginner", limit: 5 })
    ).resolves.toBeDefined();
  });
});

// ─── Access control ───────────────────────────────────────────────────────────

describe("admin-only procedures", () => {
  it("throws FORBIDDEN when a learner calls auth.listUsers", async () => {
    const { ctx } = createContext({ role: "learner" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.listUsers()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when a learner calls analytics.overview", async () => {
    const { ctx } = createContext({ role: "learner" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.analytics.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when a learner calls payments.allHistory", async () => {
    const { ctx } = createContext({ role: "learner" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payments.allHistory()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("trainer-only procedures", () => {
  it("throws FORBIDDEN when a learner calls courses.myTrainerCourses", async () => {
    const { ctx } = createContext({ role: "learner" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.courses.myTrainerCourses()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows a trainer to call courses.myTrainerCourses", async () => {
    const { ctx } = createContext({ role: "trainer" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.courses.myTrainerCourses()).resolves.toBeDefined();
  });

  it("allows an admin to call courses.myTrainerCourses", async () => {
    const { ctx } = createContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.courses.myTrainerCourses()).resolves.toBeDefined();
  });
});

// ─── Protected procedures ────────────────────────────────────────────────────

describe("protected procedures", () => {
  it("throws UNAUTHORIZED when unauthenticated user calls enrollments.myCourses", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.enrollments.myCourses()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("throws UNAUTHORIZED when unauthenticated user calls payments.myHistory", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payments.myHistory()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("allows authenticated learner to call enrollments.myCourses", async () => {
    const { ctx } = createContext({ role: "learner" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.enrollments.myCourses()).resolves.toBeDefined();
  });
});

// ─── Coupon validation ────────────────────────────────────────────────────────

describe("payments.validateCoupon", () => {
  it("returns invalid for a non-existent coupon code", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.payments.validateCoupon({ code: "NONEXISTENT999" });
    expect(result.valid).toBe(false);
    expect(result.message).toBeTruthy();
  });
});

// ─── Course slug validation ───────────────────────────────────────────────────

describe("courses.bySlug", () => {
  it("throws for a non-existent slug", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // The procedure throws NOT_FOUND when course is not found
    await expect(caller.courses.bySlug("this-course-does-not-exist-xyz")).rejects.toBeDefined();
  });
});

// ─── Auth profile update ──────────────────────────────────────────────────────

describe("auth.updateProfile", () => {
  it("allows authenticated user to update their profile", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.updateProfile({ name: "Updated Name" })).resolves.toEqual({ success: true });
  });

  it("throws UNAUTHORIZED when unauthenticated user tries to update profile", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.updateProfile({ name: "Hacker" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

// ─── Contact ──────────────────────────────────────────────────────────────────

function publicCaller() {
  const { ctx } = createPublicContext();
  return appRouter.createCaller(ctx);
}

describe("contact.submit", () => {
  it("accepts a valid contact form submission", async () => {
    const caller = publicCaller();
    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message with enough characters.",
      category: "general",
      captchaToken: "1x00000000000000000000AA",
    });
    expect(result).toHaveProperty("id");
  });

  it("rejects an invalid email", async () => {
    const caller = publicCaller();
    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "not-an-email",
        subject: "Test Subject",
        message: "This is a test message with enough characters.",
        category: "general",
      })
    ).rejects.toThrow();
  });

  it("rejects a message that is too short", async () => {
    const caller = publicCaller();
    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Short",
        category: "support",
      })
    ).rejects.toThrow();
  });

  it("blocks admin-only contact.list from unauthenticated caller", async () => {
    const caller = publicCaller();
    await expect(caller.contact.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
