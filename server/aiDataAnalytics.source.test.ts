import fs from "node:fs";
import { describe, expect, it } from "vitest";

const curriculum = JSON.parse(
  fs.readFileSync(new URL("../references/ai-data-analytics-curriculum.json", import.meta.url), "utf8"),
) as { modules: Array<{ number: number; title: string; lessons: Array<{ id: string; type: string; title: string; content: string; questions?: unknown[] }> }> };

const capstone = JSON.parse(
  fs.readFileSync(new URL("../references/ai-data-analytics-capstone.json", import.meta.url), "utf8"),
) as { title: string; steps: Array<{ stepNumber: number; title: string; tasks: string[]; codeSnippet: string; dataGeneratorScript?: string }> };

describe("AI data analytics source curriculum", () => {
  it("preserves all five source modules, 25 learning items, and 35 knowledge-check questions", () => {
    expect(curriculum.modules).toHaveLength(5);
    expect(curriculum.modules.map((module) => module.title)).toEqual([
      "Foundations of AI in Data Analytics",
      "Data Preparation & Feature Engineering with AI",
      "Predictive Analytics & Machine Learning",
      "NLP & Unstructured Data Analytics",
      "AI Ethics, Governance & the Future",
    ]);

    const lessons = curriculum.modules.flatMap((module) => module.lessons);
    const checks = lessons.filter((lesson) => lesson.type === "quiz");
    expect(lessons).toHaveLength(25);
    expect(checks).toHaveLength(5);
    expect(checks.flatMap((check) => check.questions ?? [])).toHaveLength(35);
    expect(lessons.find((lesson) => lesson.id === "m3-l2")?.content).toContain("Explainable AI");
    expect(lessons.find((lesson) => lesson.id === "m4-l2")?.content).toContain("Text-to-SQL");
  });

  it("preserves the complete six-step customer analytics capstone", () => {
    expect(capstone.title).toBe("Build an AI-Powered Customer Analytics Dashboard");
    expect(capstone.steps).toHaveLength(6);
    expect(capstone.steps.map((step) => step.stepNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(capstone.steps[0]?.dataGeneratorScript).toContain("SYNTHETIC DATASET GENERATOR");
    expect(capstone.steps[5]?.tasks).toContain("Prepare a 5-slide stakeholder presentation summarizing the entire project");
  });
});
