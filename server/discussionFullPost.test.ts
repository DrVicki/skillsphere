import { describe, expect, it } from "vitest";
import fs from "node:fs";

const learnCourse = fs.readFileSync(
  new URL("../client/src/pages/LearnCourse.tsx", import.meta.url),
  "utf8"
);

describe("full discussion post reader", () => {
  it("keeps the compact preview but provides a full-post action", () => {
    expect(learnCourse).toContain('line-clamp-2');
    expect(learnCourse).toContain("Read full post");
    expect(learnCourse).toContain("setReadThreadId(thread.id)");
    expect(learnCourse).toContain("whitespace-pre-wrap");
  });

  it("uses an accessible dialog with title and description", () => {
    expect(learnCourse).toContain("DialogContent");
    expect(learnCourse).toContain("DialogTitle");
    expect(learnCourse).toContain("DialogDescription");
    expect(learnCourse).toContain("aria-label={`Read the full post:");
  });
});
