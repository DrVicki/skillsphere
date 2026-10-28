import fs from "node:fs";
import { describe, expect, it } from "vitest";

const guide = fs.readFileSync(new URL("../client/src/components/FirstTimeStudentGuide.tsx", import.meta.url), "utf8");
const dashboard = fs.readFileSync(new URL("../client/src/pages/Dashboard.tsx", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");

describe("first-time student course guide", () => {
  it("covers access, lessons, activities, assessments, capstone, and certificate completion", () => {
    expect(guide).toContain("Sign in with the email used for your invitation");
    expect(guide).toContain("Open your Dashboard and find the course");
    expect(guide).toContain("Work through the lessons in order");
    expect(guide).toContain("Read, watch, and complete each activity");
    expect(guide).toContain("Mark the lesson complete");
    expect(guide).toContain("Pass every knowledge check or assessment");
    expect(guide).toContain("Complete the final project or capstone");
    expect(guide).toContain("Reach 100% and download your certificate");
  });

  it("can be dismissed and reopened without changing learner progress", () => {
    expect(guide).toContain("skillsphere.first-student-guide.");
    expect(guide).toContain("How to complete this course");
    expect(guide).toContain("Your progress saves as you complete lessons");
  });

  it("appears for enrolled learners on both the dashboard and course player", () => {
    expect(dashboard).toContain("<FirstTimeStudentGuide");
    expect(dashboard).toContain("enrollments?.length");
    expect(learnCourse).toContain("<FirstTimeStudentGuide");
    expect(learnCourse).toContain("hasCourseAccess");
    expect(learnCourse).toContain("lessonCount={modules?.length}");
  });
});
