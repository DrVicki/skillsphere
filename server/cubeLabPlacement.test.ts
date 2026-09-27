import { describe, expect, it } from "vitest";
import { splitCubePracticeContent } from "../client/src/lib/cubeLabPlacement";

const practiceImage = '<img class="max-w-full rounded-lg my-4" src="/manus-storage/editor-images/1790548323943-Screenshot_2026-09-27_at_3.24.57_PM_debcfa26.png" alt="Touch the cube, then explain what moved.">';

describe("splitCubePracticeContent", () => {
  it("splits the Cube orientation lesson immediately after the practice image", () => {
    const content = `<h1>Orientation</h1><h2>Practice: Your Turn</h2>${practiceImage}<h2>Knowledge Check</h2><p>Reflect before continuing.</p>`;

    const result = splitCubePracticeContent(content, "01 · See the System, Not the Scramble");

    expect(result).toEqual({
      beforeLab: `<h1>Orientation</h1><h2>Practice: Your Turn</h2>${practiceImage}`,
      afterLab: "<h2>Knowledge Check</h2><p>Reflect before continuing.</p>",
    });
  });

  it("does not insert the lab in other lessons or when the placement image is absent", () => {
    expect(splitCubePracticeContent(`${practiceImage}<p>Other lesson</p>`, "02 · Learn the cube’s tiny language")).toBeNull();
    expect(splitCubePracticeContent("<h1>Orientation</h1><p>No target image.</p>", "01 · See the System, Not the Scramble")).toBeNull();
  });
});
