import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type SourceLesson = {
  id: string;
  title: string;
  explanation: Array<{ heading: string; body: string }>;
  starterCode: string;
  activity: { title: string; steps: string[]; successCriteria: string[] };
  quiz: { question: string; options: string[]; answer: number };
};

type SourceProject = {
  number: number;
  title: string;
  starterCode: string;
  requirements: string[];
  successCriteria: string[];
};

const source = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), "references/pyforge-source-content.json"),
    "utf8"
  )
) as { lessons: SourceLesson[]; projects: SourceProject[] };

describe("Python Forge source curriculum", () => {
  it("preserves the complete guided curriculum with code, activities, and knowledge checks", () => {
    expect(source.lessons).toHaveLength(30);
    expect(source.lessons[0]).toMatchObject({
      id: "m01-l01",
      title: "From a Plan to Python Expressions",
      starterCode: expect.stringContaining("project_name"),
      activity: expect.objectContaining({ title: "Map a pre-launch decision" }),
      quiz: expect.objectContaining({ answer: 1 }),
    });
    expect(
      source.lessons.every(
        lesson =>
          lesson.explanation.length > 0 &&
          lesson.starterCode.length > 0 &&
          lesson.activity.steps.length > 0 &&
          lesson.activity.successCriteria.length > 0 &&
          lesson.quiz.options.length === 4
      )
    ).toBe(true);
  });

  it("preserves all twelve source portfolio briefs", () => {
    expect(source.projects).toHaveLength(12);
    expect(source.projects[0]).toMatchObject({
      title: "Launch Checklist Generator",
      number: 1,
    });
    expect(source.projects.at(-1)).toMatchObject({
      title: "Portfolio-Ready Python Product",
      number: 12,
    });
    expect(
      source.projects.every(
        project =>
          project.starterCode.length > 0 &&
          project.requirements.length > 0 &&
          project.successCriteria.length > 0
      )
    ).toBe(true);
  });
});
