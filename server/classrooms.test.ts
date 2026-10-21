import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { normalizeClassroomEmail } from "./db";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "trainer" | "learner" | null): TrpcContext {
  return {
    user: role
      ? {
          id: 900001,
          openId: `classroom-${role}`,
          name: "Classroom Test User",
          email: "classroom-test@example.com",
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("classroom enrollment utilities", () => {
  it("normalizes roster email addresses before matching invitations", () => {
    expect(normalizeClassroomEmail("  Student@Example.COM ")).toBe(
      "student@example.com"
    );
  });
});

describe("classroom API authorization", () => {
  it("requires sign-in to view a learner's classrooms", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.classrooms.listMine()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("does not allow learners to manage classrooms", async () => {
    const caller = appRouter.createCaller(context("learner"));
    await expect(caller.classrooms.listManaged()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("validates classroom names before creating a classroom", async () => {
    const caller = appRouter.createCaller(context("trainer"));
    await expect(
      caller.classrooms.create({ name: "", description: "" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates student email addresses before roster assignment", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(
      caller.classrooms.addStudents({
        classroomId: 1,
        emails: ["not-an-email"],
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
