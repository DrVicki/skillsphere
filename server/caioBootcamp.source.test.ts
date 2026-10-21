import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Curriculum = {
  source: { title: string; author: string; readingUrl: string };
  course: { title: string; slug: string; totalDuration: number };
  weeks: Array<{
    number: number;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      reading: string;
      outcomes: string[];
      teaching: string[];
      example: { title: string; body: string };
      activity: { title: string; steps: string[]; definitionOfDone: string[] };
      reflection: string;
    }>;
    assessment: {
      questions: Array<{ id: string; options: string[]; correctIndex: number }>;
    };
  }>;
};

const curriculum = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), "references/caio-bootcamp-curriculum.json"),
    "utf8"
  )
) as Curriculum;

describe("CAIO 4-Week BootCamp source curriculum", () => {
  it("preserves a complete four-week source-grounded learning path", () => {
    expect(curriculum.source).toMatchObject({
      title: "How to Become a CAIO",
      author: "Benjamin Simkin",
      readingUrl: expect.stringContaining("How-to-Become-a-CAIO"),
    });
    expect(curriculum.course).toMatchObject({
      title: "Chief AI Officer (CAIO) 4-Week BootCamp",
      slug: "chief-ai-officer-caio-4-week-bootcamp",
      totalDuration: 1200,
    });
    expect(curriculum.weeks).toHaveLength(4);
    expect(curriculum.weeks.map(week => week.title)).toEqual([
      "The CAIO Mandate and Your Starting Position",
      "Proof, Diagnosis, and the Business Case",
      "Deploy One Process Responsibly",
      "Win the Seat, Lead the Conversation, and Scale the Work",
    ]);
  });

  it("includes readings, applied examples, hands-on activities, and checks for every week", () => {
    expect(curriculum.weeks.flatMap(week => week.lessons)).toHaveLength(16);
    for (const week of curriculum.weeks) {
      expect(week.lessons).toHaveLength(4);
      expect(week.assessment.questions).toHaveLength(4);
      expect(
        week.assessment.questions.every(
          question =>
            question.options.length === 4 &&
            question.correctIndex >= 0 &&
            question.correctIndex < question.options.length
        )
      ).toBe(true);
      expect(
        week.lessons.every(
          lesson =>
            lesson.reading.length > 0 &&
            lesson.outcomes.length >= 3 &&
            lesson.teaching.length >= 2 &&
            lesson.example.body.length > 0 &&
            lesson.activity.steps.length >= 4 &&
            lesson.activity.definitionOfDone.length >= 3 &&
            lesson.reflection.length > 0
        )
      ).toBe(true);
    }
  });

  it("ends in a leadership-ready 90-day CAIO capstone", () => {
    const capstone = curriculum.weeks.at(-1)?.lessons.at(-1);
    expect(capstone).toMatchObject({
      title: "Capstone: Your 90-Day CAIO Plan and Leadership Briefing",
      activity: expect.objectContaining({
        title: "Build and present your CAIO engagement brief",
      }),
    });
    expect(capstone?.activity.definitionOfDone).toEqual(
      expect.arrayContaining([
        expect.stringContaining("first process"),
        expect.stringContaining("stop conditions"),
      ])
    );
  });
});
