import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("embedded Python lab placement", () => {
  it("renders the reusable lab at the bottom of lesson content before navigation", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "client/src/pages/LearnCourse.tsx"),
      "utf8"
    );

    const lessonContentIndex = source.indexOf("{/* Text/Assessment Content */}");
    const labIndex = source.indexOf(
      "{/* Embedded Python labs are intentionally placed at the bottom of lesson content. */}"
    );
    const navigationIndex = source.indexOf("{/* Navigation */}");

    expect(lessonContentIndex).toBeGreaterThan(-1);
    expect(labIndex).toBeGreaterThan(lessonContentIndex);
    expect(navigationIndex).toBeGreaterThan(labIndex);
  });
});
