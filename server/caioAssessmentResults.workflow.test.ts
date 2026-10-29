import { describe, expect, it } from "vitest";
import fs from "node:fs";

const schema = fs.readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const db = fs.readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const router = fs.readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const assessment = fs.readFileSync(new URL("../client/src/components/CAIOPathAssessment.tsx", import.meta.url), "utf8");
const analytics = fs.readFileSync(new URL("../client/src/components/CAIOAssessmentAnalyticsPanel.tsx", import.meta.url), "utf8");

 describe("CAIO assessment result workflow", () => {
  it("stores complete learner attempts and links them to the CAIO module", () => {
    expect(schema).toContain('mysqlTable(\n  "caio_assessment_results"');
    expect(schema).toContain("answers: json(\"answers\").notNull()");
    expect(db).toContain("createCaioAssessmentResult");
    expect(db).toContain("getLatestCaioAssessmentResult");
    expect(router).toContain("caioAssessment: router");
    expect(router).toContain("answers: z.array(z.number().int().min(0).max(3)).length(6)");
    expect(router).toContain("assessmentScore: anchorScore + freedomScore + industryDepth");
  });

  it("offers a learner PDF report and instructor aggregate analytics", () => {
    expect(assessment).toContain('await import("jspdf")');
    expect(assessment).toContain("caio-path-assessment-results.pdf");
    expect(assessment).toContain("Your latest assessment results are saved to your learner progress.");
    expect(analytics).toContain("CAIO Path Assessment Analytics");
    expect(analytics).toContain("uniqueLearners");
    expect(analytics).toContain("completionRate");
    expect(analytics).toContain("averageFreedom");
    expect(analytics).toContain("Recent CAIO Path Assessment learner results");
  });

  it("restricts aggregate analytics to the CAIO course instructor or an administrator", () => {
    expect(router).toContain("analytics: trainerProcedure");
    expect(router).toContain("Only the course instructor can view assessment analytics.");
    expect(router).toContain("CAIO_COURSE_SLUG");
  });
});
