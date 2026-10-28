import fs from "node:fs";
import { describe, expect, it } from "vitest";

const guide = fs.readFileSync(new URL("../client/src/components/FirstTimeStudentGuide.tsx", import.meta.url), "utf8");
const dashboard = fs.readFileSync(new URL("../client/src/pages/Dashboard.tsx", import.meta.url), "utf8");
const learnCourse = fs.readFileSync(new URL("../client/src/pages/LearnCourse.tsx", import.meta.url), "utf8");
const courseDetail = fs.readFileSync(new URL("../client/src/pages/CourseDetail.tsx", import.meta.url), "utf8");
const contact = fs.readFileSync(new URL("../client/src/pages/Contact.tsx", import.meta.url), "utf8");
const adminDashboard = fs.readFileSync(new URL("../client/src/pages/AdminDashboard.tsx", import.meta.url), "utf8");

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
    expect(guide).toContain("Classroom invitations provide access at no charge");
    expect(guide).toContain("skillsphere-student-welcome_432e7ca4.mp4");
    expect(guide).toContain("Recommended four-week plan");
    expect(guide).toContain("Using AI in Data Analytics");
    expect(guide).toContain("Week 4 · Capstone");
    expect(guide).toContain("How to use a PROMO coupon code");
    expect(guide).toContain("Add promotion code");
    expect(guide).toContain("confirm that the discount and updated total appear");
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

  it("documents that classroom assignments do not send students through checkout", () => {
    const classrooms = fs.readFileSync(new URL("../client/src/pages/admin/AdminClassrooms.tsx", import.meta.url), "utf8");
    expect(classrooms).toContain("Classroom access is provided at");
    expect(classrooms).toContain("students are not sent through");
  });

  it("keeps promotion-code entry inside checkout instead of the course card", () => {
    expect(courseDetail).toContain("Promotion codes can be entered securely after checkout opens.");
    expect(courseDetail).not.toContain('placeholder="Coupon code"');
    expect(courseDetail).not.toContain("validateCoupon");
    expect(courseDetail).toContain("createCheckout.mutate({ courseId: course.id, origin: window.location.origin })");
    expect(courseDetail).toContain("select Add promotion code in Stripe Checkout");
  });

  it("explains missing promotion fields and shows redemption analytics", () => {
    expect(contact).toContain("Why can't I see the promotion-code field?");
    expect(contact).toContain("Promotion codes are entered in Stripe Checkout after you select Enroll Now");
    expect(adminDashboard).toContain("Promo Redemptions");
    expect(adminDashboard).toContain("promotionDiscountTotal");
  });
});
