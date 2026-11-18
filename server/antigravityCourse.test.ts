import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ANTIGRAVITY_COURSE_SLUG, ANTIGRAVITY_LABS, getAntigravityLabForModule } from "../client/src/lib/antigravityLabs";

const curriculum = JSON.parse(fs.readFileSync(new URL("../references/antigravity-course-curriculum.json", import.meta.url), "utf8"));
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const importer = fs.readFileSync(new URL("../import-antigravity-course.mjs", import.meta.url), "utf8");
const terminalVisualization = fs.readFileSync(new URL("../client/src/components/AntigravityTerminalVisualization.tsx", import.meta.url), "utf8");
const commandPractice = fs.readFileSync(new URL("../client/src/components/AntigravityTerminalCommandPractice.tsx", import.meta.url), "utf8");

describe("Antigravity course integration", () => {
  it("preserves the source's two modules and fourteen units", () => {
    expect(curriculum.courseTitle).toBe("Web Development with Antigravity AI Agent");
    expect(curriculum.modules).toHaveLength(2);
    expect(curriculum.modules.flatMap((module: { units: unknown[] }) => module.units)).toHaveLength(14);
    expect(curriculum.modules.every((module: { units: unknown[] }) => module.units)).toBe(true);
  });

  it("imports source action assignments and both assessments", () => {
    const units = curriculum.modules.flatMap((module: { units: any[] }) => module.units);
    expect(units.filter((unit: any) => unit.actionAssignment).length).toBeGreaterThanOrEqual(10);
    expect(units.filter((unit: any) => unit.knowledgeCheck?.length === 5)).toHaveLength(2);
    expect(importer).toContain("ON DUPLICATE KEY UPDATE");
    expect(importer).toContain("assessmentData");
  });

  it("maps every source coding exercise to an embedded lab", () => {
    const titles = curriculum.modules.flatMap((module: { units: any[] }) => module.units.map((unit: any) => unit.title));
    const exerciseTitles = titles.filter((title: string) => title.includes("Set up") || title.includes("Add basic HTML") || title.includes("Style your HTML") || title.includes("Add interactivity") || title.includes("Understand the Fetch") || title.includes("Fetch and display") || title.includes("loading states") || title.includes("Send data with POST"));
    expect(exerciseTitles).toHaveLength(8);
    expect(ANTIGRAVITY_LABS).toHaveLength(8);
    expect(exerciseTitles.every(title => getAntigravityLabForModule(ANTIGRAVITY_COURSE_SLUG, title))).toBe(true);
    expect(getAntigravityLabForModule("other-course", exerciseTitles[0])).toBeNull();
  });

  it("renders the lab integration and visible lesson label", () => {
    expect(learnCourse).toContain("<AntigravityWebLab");
    expect(learnCourse).toContain("Embedded Antigravity coding lab below");
    expect(learnCourse).toContain("<AntigravityTerminalVisualization />");
    expect(learnCourse).toContain('antigravityLab.kind === "setup"');
  });

  it("includes safe OS-specific command practice with immediate feedback", () => {
    expect(terminalVisualization).toContain("<AntigravityTerminalCommandPractice os={os} />");
    expect(commandPractice).toContain("Nothing is executed on your computer");
    expect(commandPractice).toContain("Check command");
    expect(commandPractice).toContain("Correct. Nice work");
    expect(commandPractice).toContain("Not quite");
    expect(commandPractice).toContain("Windows");
    expect(commandPractice).toContain("macOS");
    expect(commandPractice).toContain("Linux");
  });
});
