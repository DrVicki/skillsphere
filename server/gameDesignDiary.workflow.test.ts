import fs from "node:fs";
import { describe, expect, it } from "vitest";

const schema = fs.readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const db = fs.readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const router = fs.readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const diaryPanel = fs.readFileSync(new URL("../client/src/components/GameDesignDiaryPanel.tsx", import.meta.url), "utf8");
const reviewPanel = fs.readFileSync(new URL("../client/src/components/GameDesignDiaryReviewPanel.tsx", import.meta.url), "utf8");
const dashboard = fs.readFileSync(new URL("../client/src/pages/Dashboard.tsx", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");

describe("Game Design Diary workflow", () => {
  it("stores review state, feedback, reviewer, and submission timestamps", () => {
    expect(schema).toContain('reviewStatus: mysqlEnum("reviewStatus", ["draft", "submitted", "needs_revision", "approved"])');
    expect(schema).toContain("instructorFeedback: text");
    expect(schema).toContain("reviewedBy: int");
    expect(schema).toContain("reviewedAt: timestamp");
    expect(schema).toContain("submittedAt: timestamp");
  });

  it("keeps learner permissions separate from instructor review permissions", () => {
    expect(router).toContain("submit: protectedProcedure");
    expect(router).toContain("reviewQueue: trainerProcedure");
    expect(router).toContain("review: trainerProcedure");
    expect(router).toContain("You do not review this course.");
    expect(db).toContain("getGameDesignDiaryEntriesForReview");
    expect(db).toContain('reviewStatus: "submitted"');
    expect(db).toContain("reviewedBy: null");
  });

  it("includes capstone modules and Diary entries in a protected portfolio export payload", () => {
    expect(router).toContain("portfolio: protectedProcedure");
    expect(router).toContain("Enroll in the course before exporting your portfolio.");
    expect(db).toContain("getGameDesignPortfolio");
    expect(db).toContain("capstoneModules");
    expect(db).toContain("/designing a game|capstone/i");
    expect(diaryPanel).toContain('link.download = "game-design-portfolio.md"');
    expect(diaryPanel).toContain("Capstone evidence");
  });

  it("explains saving on first use and exposes learner review status and feedback", () => {
    expect(diaryPanel).toContain("skillsphere.game-diary.onboarding-seen");
    expect(diaryPanel).toContain("Entries save privately to your SkillSphere account");
    expect(diaryPanel).toContain("Submit for review");
    expect(diaryPanel).toContain("Instructor feedback");
    expect(reviewPanel).toContain("Request revision");
    expect(reviewPanel).toContain("Approve");
  });

  it("uses a non-empty authenticated name or email fallback on certificates", () => {
    expect(dashboard).toContain("function certificateName");
    expect(dashboard).toContain("certificateName(user)");
    expect(learnCourse).toContain('user?.name?.trim() || user?.email?.split("@")[0]?.trim() || "Learner"');
  });
});
