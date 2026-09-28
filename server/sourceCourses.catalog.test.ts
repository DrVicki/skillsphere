import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("source course catalog", () => {
  it("lists the three newly imported public courses with their curriculum counts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const courses = await caller.courses.list({ limit: 100 });
    const bySlug = new Map(courses.map((course) => [course.slug, course]));

    expect(bySlug.get("data-centers-virtual-field-trip")).toMatchObject({
      title: "Data Centers: A Virtual Field Trip",
      totalModules: 16,
      isPublished: true,
    });
    expect(bySlug.get("python-forge-learn-by-building")).toMatchObject({
      title: "Python Forge — Learn by Building",
      totalModules: 30,
      isPublished: true,
    });
    expect(bySlug.get("10-ways-chatgpt-business-owners")).toMatchObject({
      title: "10 Ways to Use ChatGPT for Business Owners",
      totalModules: 20,
      isPublished: true,
    });
    expect(bySlug.get("cube-unlocked-visual-rubiks-cube-course")).toMatchObject({
      title: "Cube, Unlocked — A Visual Rubik's Cube Course",
      totalDuration: 57,
      isPublished: true,
      isFree: false,
      price: "9.99",
    });
    expect(bySlug.get("cube-unlocked-visual-rubiks-cube-course")?.totalModules).toBeGreaterThanOrEqual(7);
  });

  it("preserves source lesson content and knowledge checks for the imported curricula", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const courses = await caller.courses.list({ limit: 100 });
    const bySlug = new Map(courses.map((course) => [course.slug, course]));

    const dataCenter = bySlug.get("data-centers-virtual-field-trip");
    const pyforge = bySlug.get("python-forge-learn-by-building");
    const chatGptBusiness = bySlug.get("10-ways-chatgpt-business-owners");
    const cubeUnlocked = bySlug.get("cube-unlocked-visual-rubiks-cube-course");

    expect(dataCenter).toBeDefined();
    expect(pyforge).toBeDefined();
    expect(chatGptBusiness).toBeDefined();
    expect(cubeUnlocked).toBeDefined();

    const [dataCenterModules, pyforgeModules, chatGptModules, cubeModules] = await Promise.all([
      caller.modules.byCourse(dataCenter!.id),
      caller.modules.byCourse(pyforge!.id),
      caller.modules.byCourse(chatGptBusiness!.id),
      caller.modules.byCourse(cubeUnlocked!.id),
    ]);

    expect(dataCenterModules).toHaveLength(16);
    expect(dataCenterModules[0]?.content).toContain("What Is a Data Center?");
    expect(dataCenterModules[1]).toMatchObject({
      type: "assessment",
      assessmentData: expect.objectContaining({ questions: expect.arrayContaining([expect.objectContaining({ question: "What is a data center?" })]) }),
    });

    expect(pyforgeModules).toHaveLength(30);
    expect(pyforgeModules[0]?.content).toContain("Programs make a plan explicit");

    expect(chatGptModules).toHaveLength(20);
    expect(chatGptModules[0]?.content).toContain("Creating consistent, high-quality content");
    expect(chatGptModules[1]).toMatchObject({
      type: "assessment",
      assessmentData: expect.objectContaining({ questions: expect.any(Array) }),
    });

    expect(cubeModules.length).toBeGreaterThanOrEqual(7);
    const cubeModuleByTitle = new Map(cubeModules.map((module) => [module.title.toLocaleLowerCase(), module]));
    const cubeModule = (title: string) => cubeModuleByTitle.get(title.toLocaleLowerCase());
    expect(cubeModule("01 · See the system, not the scramble")).toMatchObject({
      duration: 360,
      isPreview: true,
    });
    expect(cubeModule("01 · See the system, not the scramble")?.content).toEqual(expect.any(String));
    expect(cubeModule("03 · Open. Act. Close. Restore.")).toMatchObject({ isPreview: true });
    expect(cubeModule("07 · Solve, explain, then solve again")).toBeDefined();
  });
});
