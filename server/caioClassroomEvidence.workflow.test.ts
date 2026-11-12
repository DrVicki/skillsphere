import { describe, expect, it } from "vitest";
import fs from "node:fs";
const schema = fs.readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const db = fs.readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const router = fs.readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const learner = fs.readFileSync(new URL("../client/src/components/CAIOEvidencePanel.tsx", import.meta.url), "utf8");
const review = fs.readFileSync(new URL("../client/src/components/CAIOClassroomReviewPanel.tsx", import.meta.url), "utf8");
const classrooms = fs.readFileSync(new URL("../client/src/pages/admin/AdminClassrooms.tsx", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const email = fs.readFileSync(new URL("./email.ts", import.meta.url), "utf8");
const chart = fs.readFileSync(new URL("../client/src/components/CAIOProgressChart.tsx", import.meta.url), "utf8");

describe("CAIO classroom evidence workflow", () => {
  it("stores separate action and reflection evidence with review state", () => {
    expect(schema).toContain('"caio_evidence_submissions"');
    expect(schema).toContain('mysqlEnum("submissionType", ["action", "reflection"])');
    expect(schema).toContain('mysqlEnum("reviewStatus", ["draft", "submitted", "needs_revision", "approved"])');
    expect(schema).toContain("caio_evidence_user_module_type_unique");
    expect(db).toContain("upsertCaioEvidenceSubmission");
    expect(db).toContain("reviewCaioEvidenceSubmission");
  });
  it("lets learners save and submit both evidence types from CAIO lessons", () => {
    expect(learner).toContain("Action Assignment");
    expect(learner).toContain("Reflection");
    expect(learner).toContain("Save draft");
    expect(learner).toContain("Submit for review");
    expect(router).toContain("caioEvidence: router");
    expect(router).toContain("submissionType: z.enum([\"action\", \"reflection\"])");
    expect(learnCourse).toContain("<CAIOEvidencePanel");
    expect(learnCourse).toContain("isCAIOCourse");
  });
  it("scopes instructor review and CAIO knowledge checks to an assigned classroom", () => {
    expect(router).toContain("reviewQueue: trainerProcedure");
    expect(router).toContain("classroomKnowledge: trainerProcedure");
    expect(router).toContain("CAIO is not assigned to this classroom");
    expect(db).toContain("getCaioClassroomKnowledgeChecks");
    expect(db).toContain("EXISTS (SELECT 1 FROM classroom_members cm");
    expect(review).toContain("Request revision");
    expect(review).toContain("Recent knowledge checks");
    expect(classrooms).toContain("CAIOClassroomReviewPanel");
  });
  it("provides a combined classroom report, four-week summary, and review emails", () => {
    expect(db).toContain("getCaioClassroomProgressSummary");
    expect(db).toContain("exportCaioClassroomReportCsv");
    expect(db).toContain("Weekly learner progress");
    expect(router).toContain("classroomProgress: trainerProcedure");
    expect(router).toContain("exportClassroomReport: trainerProcedure");
    expect(router).toContain("sendCaioEvidenceReviewEmail");
    expect(review).toContain("CSV");
    expect(review).toContain("Four-week learner progress");
    expect(email).toContain("sendCaioEvidenceReviewEmail");
    expect(email).toContain("Revision requested");
    expect(review).toContain("CSV");
    expect(review).toContain("jsPDF");
    expect(schema).toContain('"caio_evidence_notifications"');
    expect(db).toContain("getCaioEvidenceNotifications");
    expect(db).toContain("markCaioEvidenceNotificationRead");
    expect(router).toContain("notifications: protectedProcedure");
    expect(router).toContain("learnerProgress: protectedProcedure");
    expect(learner).toContain("Instructor feedback history");
    expect(learner).toContain("markNotificationRead");
    expect(chart).toContain("BarChart");
    expect(chart).toContain("weekly progress");
  });
});
