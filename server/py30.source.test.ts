import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Py30Day = {
  day: number;
  kind: "lesson" | "review";
  title: string;
  concepts?: Array<{ sheet: number; title: string; code: string; plain: string }>;
  lab?: { starter: string; hint: string };
  starter?: string;
  checks?: Array<{ question: string; options: string[]; answer: number }>;
};

const source = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), "references/py30-source-content.json"),
    "utf8"
  )
) as { weeks: unknown[]; days: Py30Day[] };

describe("30 Days to Learn Python source curriculum", () => {
  it("preserves five weeks, thirty days, and one hundred concept sheets", () => {
    expect(source.weeks).toHaveLength(5);
    expect(source.days).toHaveLength(30);
    expect(source.days.reduce((total, day) => total + (day.concepts?.length ?? 0), 0)).toBe(100);
  });

  it("preserves a runnable lab for every daily lesson and review build", () => {
    expect(
      source.days.every(day =>
        day.kind === "lesson"
          ? Boolean(day.lab?.starter && day.lab?.hint)
          : Boolean(day.starter)
      )
    ).toBe(true);
  });

  it("preserves the source review-build sequence", () => {
    expect(source.days.filter(day => day.kind === "review").map(day => day.title)).toEqual([
      "Review 1: Guess the Number",
      "Review 2: Contact Book",
      "Review 3: File-Backed Contact Book",
      "Review 4: Expense Tracker",
      "Capstone: Ship the To-Do CLI",
    ]);
  });
});
