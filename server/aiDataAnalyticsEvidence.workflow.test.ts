import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("AI Data Analytics evidence workflow", () => {
  it("defines learner evidence types and classroom-scoped review procedures", () => {
    const schema = read("drizzle/schema.ts");
    const db = read("server/db.ts");
    const router = read("server/routers.ts");
    expect(schema).toContain('"ai_data_analytics_evidence"');
    expect(schema).toContain('"practice_code", "knowledge_check", "capstone", "reflection"');
    expect(db).toContain("getAIDataAnalyticsEvidenceForReview");
    expect(db).toContain("getAIDataAnalyticsClassroomMetrics");
    expect(router).toContain("aiDataAnalyticsEvidence: router");
    expect(router).toContain("classroomId");
    expect(router).toContain("exportClassroomCsv");
  });

  it("wires learner submission and instructor classroom UI", () => {
    const learner = read("client/src/components/AIDataAnalyticsCodeLab.tsx");
    const evidence = read("client/src/components/AIDataAnalyticsEvidencePanel.tsx");
    const review = read("client/src/components/AIDataAnalyticsReviewPanel.tsx");
    const page = read("client/src/pages/LearnCourse.tsx");
    const classroom = read("client/src/pages/admin/AdminClassrooms.tsx");
    expect(learner).toContain("Submit practice code");
    expect(learner).toContain("onLabCompleted");
    expect(evidence).toContain("Submit capstone evidence");
    expect(evidence).toContain("Submit your reflection");
    expect(review).toContain("Analytics evidence review");
    expect(review).toContain("Export CSV");
    expect(review).toContain("Export PDF");
    expect(review).toContain("jsPDF");
    expect(page).toContain("AIDataAnalyticsEvidencePanel");
    expect(classroom).toContain("AIDataAnalyticsReviewPanel");
    expect(read("server/email.ts")).toContain("sendAIDataAnalyticsEvidenceReviewEmail");
    expect(read("server/routers.ts")).toContain("sendAIDataAnalyticsEvidenceReviewEmail");
  });
});
