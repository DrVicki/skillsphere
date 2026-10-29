import { describe, expect, it } from "vitest";
import fs from "node:fs";

const assessment = fs.readFileSync(new URL("../client/src/components/CAIOPathAssessment.tsx", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const curriculum = JSON.parse(fs.readFileSync(new URL("../references/caio-bootcamp-curriculum.json", import.meta.url), "utf8"));

describe("CAIO Path Assessment", () => {
  it("contains the six supplied questions and hidden-until-results scoring model", () => {
    expect(assessment).toContain("Which path fits your");
    expect(assessment).toContain("One calibration check before you start");
    expect(assessment).toContain("Commonly inflated");
    expect(assessment).toContain("Run the household veto test");
    expect(assessment).toContain("Copy my scores");
    expect(assessment).toContain("Change an answer");
    expect(assessment).toContain("Dot size shows industry depth");
    expect(assessment).toContain("Question 4 + Question 5 + Question 6");
    expect(assessment).toContain("Math.max(0, 3 - answer -");
  });

  it("is placed in the CAIO Week 2 Proof Ladder lesson", () => {
    const weekTwo = curriculum.weeks.find((week: any) => week.number === 2);
    const lesson = weekTwo.lessons[0];
    expect(lesson.title).toContain("The Proof Ladder");
    expect(learnCourse).toContain("isCAIOPathAssessmentLesson");
    expect(learnCourse).toContain("<CAIOPathAssessment />");
  });
});
