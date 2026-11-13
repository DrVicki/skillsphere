import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { aiDataAnalyticsLabs, getAIDataAnalyticsLabForModule } from "../client/src/lib/aiDataAnalyticsLabs";

const curriculum = JSON.parse(fs.readFileSync(new URL("../references/ai-data-analytics-curriculum.json", import.meta.url), "utf8")) as {
  modules: Array<{ lessons: Array<{ id: string; title: string }> }>;
};
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const labComponent = fs.readFileSync(new URL("../client/src/components/AIDataAnalyticsCodeLab.tsx", import.meta.url), "utf8");

describe("AI Data Analytics embedded coding labs", () => {
  it("provides one runnable lab for every source learning item", () => {
    const lessons = curriculum.modules.flatMap(module => module.lessons);
    expect(lessons).toHaveLength(25);
    expect(aiDataAnalyticsLabs).toHaveLength(26);
    expect(new Set(aiDataAnalyticsLabs.map(lab => lab.id)).size).toBe(26);
    expect(aiDataAnalyticsLabs.every(lab => lab.starterCode.includes("TODO"))).toBe(true);
  });

  it("supports browser execution and notebook download", () => {
    expect(labComponent).toContain("loadPyodide");
    expect(labComponent).toContain("runPythonAsync");
    expect(labComponent).toContain("application/x-ipynb+json");
    expect(labComponent).toContain("localStorage");
    expect(labComponent).toContain("Download .ipynb");
  });

  it("routes the stored Module prefix and imported capstone to labs", () => {
    expect(getAIDataAnalyticsLabForModule("ai-in-data-analytics", "Module 1 · What Is AI in the Context of Data Analytics?")?.id).toBe("m1-l1");
    expect(getAIDataAnalyticsLabForModule("ai-in-data-analytics", "Capstone · Build an AI-Powered Customer Analytics Dashboard")?.id).toBe("capstone");
  });

  it("renders the lab through the learner course player", () => {
    expect(learnCourse).toContain("getAIDataAnalyticsLabForModule");
    expect(learnCourse).toContain("<AIDataAnalyticsCodeLab");
    expect(learnCourse).toContain("Embedded Python Analytics Lab below");
  });
});
