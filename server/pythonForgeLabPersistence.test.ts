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
});
