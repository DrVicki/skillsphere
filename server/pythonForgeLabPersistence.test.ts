import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  fs.readFileSync(path.resolve(process.cwd(), relativePath), "utf8");

describe("Python Forge learner lab persistence", () => {
  it("renders an explicit lab label and passes learner/course/module context", () => {
    const learnCourse = read("client/src/pages/LearnCourse.tsx");
    expect(learnCourse).toContain("Interactive Python Lab below");
    expect(learnCourse).toContain("courseId={course.id}");
    expect(learnCourse).toContain("moduleId={activeModule.id}");
    expect(learnCourse).toContain("canPersist={hasCourseAccess && isAuthenticated}");
  });

  it("defines learner-scoped storage and protected latest/save procedures", () => {
    const schema = read("drizzle/schema.ts");
    const db = read("server/db.ts");
    const router = read("server/routers.ts");
    const lab = read("client/src/components/PythonForgeLab.tsx");

    expect(schema).toContain('mysqlTable(\n  "python_forge_lab_code"');
    expect(schema).toContain("python_forge_lab_code_user_module_unique");
    expect(db).toContain("getPythonForgeLabCode");
    expect(db).toContain("upsertPythonForgeLabCode");
    expect(router).toContain("pythonForgeLab: router({");
    expect(router).toContain("latest: protectedProcedure");
    expect(router).toContain("save: protectedProcedure");
    expect(lab).toContain("trpc.pythonForgeLab.latest.useQuery");
    expect(lab).toContain("trpc.pythonForgeLab.save.useMutation");
    expect(lab).toContain("Saving to your learner progress");
  });

  it("exposes learner progress and instructor-only submission dashboards", () => {
    const router = read("server/routers.ts");
    const db = read("server/db.ts");
    const learnerDashboard = read("client/src/components/PythonForgeProgressDashboard.tsx");
    const instructorDashboard = read("client/src/components/PythonForgeSubmissionsPanel.tsx");
    const lab = read("client/src/components/PythonForgeLab.tsx");
    const dashboard = read("client/src/pages/Dashboard.tsx");
    const trainer = read("client/src/pages/TrainerDashboard.tsx");
    const admin = read("client/src/pages/AdminDashboard.tsx");

    expect(router).toContain("progress: protectedProcedure");
    expect(router).toContain("submissions: trainerProcedure");
    expect(router).toContain("feedback: trainerProcedure");
    expect(router).toContain("Only the course instructor can provide lab feedback.");
    expect(router).toContain("Only the course instructor can view lab submissions.");
    expect(db).toContain("getPythonForgeLabProgress");
    expect(db).toContain("getPythonForgeLabSubmissions");
    expect(db).toContain("updatePythonForgeLabFeedback");
    expect(learnerDashboard).toContain("Python Forge lab progress");
    expect(learnerDashboard).toContain("trpc.pythonForgeLab.progress.useQuery");
    expect(instructorDashboard).toContain("Learner lab submissions");
    expect(instructorDashboard).toContain("trpc.pythonForgeLab.submissions.useQuery");
    expect(instructorDashboard).toContain("Optional instructor feedback");
    expect(instructorDashboard).toContain("trpc.pythonForgeLab.feedback.useMutation");
    expect(lab).toContain("Instructor feedback");
    expect(dashboard).toContain("PythonForgeProgressDashboard");
    expect(trainer).toContain("PythonForgeSubmissionsPanel");
    expect(admin).toContain("PythonForgeSubmissionsPanel");
  });

  it("supports classroom-scoped submission review and feedback", () => {
    const router = read("server/routers.ts");
    const db = read("server/db.ts");
    const panel = read("client/src/components/PythonForgeSubmissionsPanel.tsx");
    const classrooms = read("client/src/pages/admin/AdminClassrooms.tsx");

    expect(router).toContain("classroomId: z.number().optional()");
    expect(router).toContain("Python Forge is not assigned to this classroom.");
    expect(router).toContain("requireClassroomManager(ctx.user, input.classroomId)");
    expect(db).toContain("getPythonForgeLabSubmissions(\n  courseId: number,\n  classroomId?: number");
    expect(db).toContain("FROM classroom_members cm");
    expect(panel).toContain("classroomName?: string");
    expect(panel).toContain("active students in this classroom");
    expect(classrooms).toContain("PythonForgeSubmissionsPanel");
    expect(classrooms).toContain("classroomId={expanded.id}");
  });

  it("supports classroom review statuses, metrics, export, and learner notifications", () => {
    const schema = read("drizzle/schema.ts");
    const db = read("server/db.ts");
    const router = read("server/routers.ts");
    const panel = read("client/src/components/PythonForgeSubmissionsPanel.tsx");
    const lab = read("client/src/components/PythonForgeLab.tsx");
    const email = read("server/email.ts");

    expect(schema).toContain('mysqlEnum("reviewStatus", ["needs_review", "reviewed", "resubmit"])');
    expect(schema).toContain('mysqlTable(\n  "python_forge_lab_notifications"');
    expect(db).toContain("getPythonForgeClassroomMetrics");
    expect(db).toContain("exportPythonForgeClassroomCsv");
    expect(db).toContain("createPythonForgeLabNotification");
    expect(router).toContain("classroomMetrics: trainerProcedure");
    expect(router).toContain("exportClassroomCsv: trainerProcedure");
    expect(router).toContain("notifications: protectedProcedure");
    expect(router).toContain("sendPythonForgeFeedbackEmail");
    expect(panel).toContain("Needs review");
    expect(panel).toContain("Resubmit");
    expect(panel).toContain("Lab completion");
    expect(panel).toContain("Export CSV");
    expect(lab).toContain("New instructor notification");
    expect(lab).toContain("markNotificationRead");
    expect(email).toContain("sendPythonForgeFeedbackEmail");
  });
});
