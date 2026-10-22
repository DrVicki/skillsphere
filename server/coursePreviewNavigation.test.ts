import fs from "node:fs";
import { describe, expect, it } from "vitest";

const courseDetail = fs.readFileSync(
  new URL("../client/src/pages/CourseDetail.tsx", import.meta.url),
  "utf8"
);
const learnCourse = fs.readFileSync(
  new URL("../client/src/pages/LearnCourse.tsx", import.meta.url),
  "utf8"
);

describe("course curriculum preview navigation", () => {
  it("links every previewable curriculum row to its selected lesson", () => {
    expect(courseDetail).toContain(
      "href={`/learn/${course.slug}?module=${mod.id}`}"
    );
    expect(courseDetail).toContain('{mod.isPreview ? "Preview" : "Open"}');
  });

  it("uses the requested module query parameter when initializing the learner view", () => {
    expect(learnCourse).toMatch(
      /new URLSearchParams\(window\.location\.search\)\.get\(\s*"module"\s*\)/
    );
    expect(learnCourse).toMatch(
      /modules\.find\(\s*\(?module\)?\s*=>\s*module\.id\s*===\s*requestedModuleId\s*\)/
    );
  });

  it("limits non-enrolled learners to preview lessons and displays an enrollment path for locked content", () => {
    expect(learnCourse).toMatch(
      /const hasCourseAccess = Boolean\(\s*enrollment\?\.enrolled \|\|\s*course\?\.trainerId === user\?\.id \|\|\s*user\?\.role === "admin"\s*\)/
    );
    expect(learnCourse).toContain(
      "hasCourseAccess || Boolean(module.isPreview)"
    );
    expect(learnCourse).toContain("Course lesson locked");
    expect(learnCourse).toContain("View Course & Enroll");
  });

  it("keeps progress tracking, assessments, discussion, and chat behind enrollment", () => {
    expect(learnCourse).toMatch(
      /!isModuleCompleted\(activeModule\.id\)\s*&&\s*hasCourseAccess/
    );
    expect(learnCourse).toContain("Enroll to complete this knowledge check");
    expect(learnCourse).toMatch(/\{?hasCourseAccess\s*\?\s*\(/);
    expect(learnCourse).toContain("Join the course discussion");
    expect(learnCourse).toContain(
      "Live chat is available to enrolled learners"
    );
  });

  it("requires a passing score before an assessment records course completion", () => {
    expect(learnCourse).toContain("if (!passed)");
    expect(learnCourse).toContain(
      "Reach the passing score to complete this assessment."
    );
  });
});
