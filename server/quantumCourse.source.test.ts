import fs from "node:fs";
import { describe, expect, it } from "vitest";

const curriculum = JSON.parse(
  fs.readFileSync(new URL("../references/quantum-computing-for-beginners-curriculum.json", import.meta.url), "utf8"),
) as {
  lessonCount: number;
  modules: Array<{
    number: number;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      content: string;
      quiz: Array<{ id: string; question: string; options: string[]; correctIndex: number }>;
    }>;
  }>;
};
const finalExam = JSON.parse(
  fs.readFileSync(new URL("../references/quantum-computing-for-beginners-final-exam.json", import.meta.url), "utf8"),
) as Array<{ id: string; question: string; options: string[]; correctIndex: number; explanation?: string }>;
const importer = fs.readFileSync(new URL("../import-quantum-computing-for-beginners.mjs", import.meta.url), "utf8");

describe("Quantum Computing for Beginners source import", () => {
  it("preserves the six-module, fourteen-lesson source curriculum", () => {
    expect(curriculum.modules).toHaveLength(6);
    expect(curriculum.lessonCount).toBe(14);
    expect(curriculum.modules.map((module) => module.lessons.length)).toEqual([2, 3, 2, 3, 2, 2]);
    expect(curriculum.modules[0]?.lessons[0]).toMatchObject({
      id: "m1l1",
      title: "What is Quantum Computing?",
      duration: "8 min",
    });
    expect(curriculum.modules[1]?.lessons[0]?.content).toContain("Superposition");
    expect(curriculum.modules[3]?.lessons.map((lesson) => lesson.title)).toEqual([
      "Deutsch-Jozsa: The First Quantum Speedup",
      "Shor's Algorithm: Breaking Encryption",
      "Grover's Algorithm: Quantum Search",
    ]);
    expect(curriculum.modules.flatMap((module) => module.lessons).every((lesson) => lesson.quiz.length === 2)).toBe(true);
  });

  it("preserves the 15-question, 70-percent final exam", () => {
    expect(finalExam).toHaveLength(15);
    expect(finalExam[0]).toMatchObject({ id: "fe1", correctIndex: 1 });
    expect(finalExam[0]?.question).toContain("classical bit and a qubit");
    expect(finalExam.every((question) => question.options.length === 4)).toBe(true);
    expect(finalExam.every((question) => question.explanation)).toBe(true);
  });

  it("maps the source into a free, published SkillSphere course with two preview lessons", () => {
    expect(importer).toContain('slug: "quantum-computing-for-beginners-1791574031102"');
    expect(importer).toContain('totalDuration: 125');
    expect(importer).toContain('isFree = 1, isPublished = 1');
    expect(importer).toContain('isPreview: module.number === 1');
    expect(importer).toContain('title: "Final Exam · Quantum Computing for Beginners"');
    expect(importer).toContain('passingScore: 70');
    expect(importer).toContain('finalExamQuestions: finalExamQuestions.length');
  });
});
