import { describe, expect, it } from "vitest";
import {
  getPythonForgeActivityForModule,
  pythonForgeActivities,
} from "../client/src/lib/pythonForgeActivities";

describe("Python Forge activity routing", () => {
  it("maps every source lesson and portfolio project to an embedded coding activity", () => {
    expect(pythonForgeActivities).toHaveLength(43);
    expect(
      getPythonForgeActivityForModule(
        "python-forge-learn-by-building",
        "From a Plan to Python Expressions"
      )
    ).toMatchObject({
      id: "m01-l01",
      starterCode: expect.stringContaining("project_name"),
      quiz: expect.objectContaining({ answer: 1 }),
    });
    expect(
      getPythonForgeActivityForModule(
        "python-forge-learn-by-building",
        "Module 1 - Lesson 1: From a Plan to Python Expressions"
      )
    ).toMatchObject({ id: "m01-l01" });
    expect(
      getPythonForgeActivityForModule(
        "python-forge-learn-by-building",
        "Portfolio Project 12 · Portfolio-Ready Python Product"
      )
    ).toMatchObject({
      id: "project-12",
      activity: expect.objectContaining({ title: "Portfolio build brief" }),
    });
    expect(
      getPythonForgeActivityForModule(
        "python-forge-learn-by-building",
        "Week 1 | Review Project 1: Guess the Number"
      )
    ).toMatchObject({
      id: "week1-review-project-1-guess-number",
      title: "Week 1 | Review Project 1: Guess the Number",
      starterCode: expect.stringContaining("secret_number"),
      activity: expect.objectContaining({
        title: "Review build: Guess the Number",
        steps: expect.arrayContaining([expect.stringContaining("Run the starter")]),
      }),
      reflectionPrompt: expect.stringContaining("Action assignment"),
    });
    for (const activity of pythonForgeActivities) {
      expect(
        getPythonForgeActivityForModule(
          "python-forge-learn-by-building",
          activity.title
        )
      ).toMatchObject({ id: activity.id });
    }
  });

  it("does not attach a Python Forge lab to other courses", () => {
    expect(
      getPythonForgeActivityForModule(
        "cube-unlocked-visual-rubiks-cube-course",
        "From a Plan to Python Expressions"
      )
    ).toBeNull();
    expect(
      getPythonForgeActivityForModule(
        "python-forge-learn-by-building",
        "A different lesson"
      )
    ).toBeNull();
    expect(
      getPythonForgeActivityForModule(
        "30-days-to-learn-python",
        "Week 1 | Review Project 1: Guess the Number"
      )
    ).toBeNull();
  });
});
