import { describe, expect, it } from "vitest";
import {
  getPy30ActivityForModule,
  py30Activities,
} from "../client/src/lib/py30Activities";

describe("py30 embedded lab routing", () => {
  it("maps Week | Concept module titles to every daily lab", () => {
    expect(py30Activities).toHaveLength(30);
    expect(
      getPy30ActivityForModule(
        "30-days-to-learn-python",
        "Week 1 | First Words"
      )
    ).toMatchObject({
      id: "py30-d01",
      activity: expect.objectContaining({ title: "Daily exercise: First Words" }),
    });
    expect(
      getPy30ActivityForModule(
        "30-days-to-learn-python",
        "Week 1 | Review 1: Guess the Number"
      )
    ).toMatchObject({ id: "py30-d06" });
    expect(
      getPy30ActivityForModule(
        "30-days-to-learn-python",
        "Week 1 | Review  Project 1: Guess the Number"
      )
    ).toMatchObject({ id: "py30-d06" });
    expect(
      getPy30ActivityForModule(
        "30-days-to-learn-python",
        "  Week 1 | Review Project 1:   Guess the Number  "
      )
    ).toMatchObject({ id: "py30-d06" });
    expect(
      getPy30ActivityForModule(
        "30-days-to-learn-python",
        "Week 5 | Capstone: Ship the To-Do CLI"
      )
    ).toMatchObject({ id: "py30-d30" });
  });

  it("does not attach py30 labs to other courses", () => {
    expect(
      getPy30ActivityForModule("python-forge-learn-by-building", "Week 1 | First Words")
    ).toBeNull();
  });
});
