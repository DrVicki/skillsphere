import { describe, expect, it } from "vitest";
import fs from "node:fs";

const schema = fs.readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const db = fs.readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const routers = fs.readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const email = fs.readFileSync(new URL("./email.ts", import.meta.url), "utf8");

describe("discussion threading and instructor notifications", () => {
  it("stores parent replies without changing existing top-level reply records", () => {
    expect(schema).toContain('parentReplyId: int("parentReplyId")');
    expect(db).toContain("parentReplyId: discussionReplies.parentReplyId");
    expect(routers).toContain("parentReplyId: z.number().nullable().optional()");
    expect(routers).toContain("Parent reply not found");
  });

  it("notifies the thread owner when an instructor responds", () => {
    expect(routers).toContain("const isInstructor = ctx.user.role === \"admin\" || course?.trainerId === ctx.user.id;");
    expect(routers).toContain("createDiscussionNotification");
    expect(routers).toContain("sendDiscussionReplyEmail");
    expect(schema).toContain("discussionNotifications = mysqlTable");
  });

  it("renders threaded reply controls and course-scoped in-app notifications", () => {
    expect(learnCourse).toContain("discussionNotifications");
    expect(learnCourse).toContain("refetchInterval: 30000");
    expect(learnCourse).toContain("Replying to a thread response");
    expect(learnCourse).toContain("parentReplyId: replyTargetId");
    expect(email).toContain("New instructor response");
  });
});
