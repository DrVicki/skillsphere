import { describe, expect, it } from "vitest";
import {
  getPythonForgeActivityForModule,
  pythonForgeActivities,
} from "../client/src/lib/pythonForgeActivities";

describe("Python Forge activity routing", () => {
  it("maps every source lesson and portfolio project to an embedded coding activity", () => {
    expect(pythonForgeActivities).toHaveLength(42);
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
        "Portfolio Project 12 · Portfolio-Ready Python Product"
      )
    ).toMatchObject({
      id: "project-12",
      activity: expect.objectContaining({ title: "Portfolio build brief" }),
    });
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
  });
});
