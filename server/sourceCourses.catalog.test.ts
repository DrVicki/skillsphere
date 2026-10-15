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
      title: "Python Forge Bootcamp — Learn by Building",
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
    expect(bySlug.get("ai-in-data-analytics")).toMatchObject({
      title: "Using AI in Data Analytics",
      totalModules: 26,
      totalDuration: 435,
      isPublished: true,
      isFree: false,
      price: "297.00",
    });
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

    const dataCenterModules = await caller.modules.byCourse(dataCenter!.id);
    const pyforgeModules = await caller.modules.byCourse(pyforge!.id);
    const chatGptModules = await caller.modules.byCourse(chatGptBusiness!.id);
    const cubeModules = await caller.modules.byCourse(cubeUnlocked!.id);

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
      duration: expect.any(Number),
      isPreview: true,
    });
    expect(cubeModule("01 · See the system, not the scramble")?.content).toEqual(expect.any(String));
    expect(cubeModule("02 · Learn the cube’s tiny language")?.content).toContain("Guided Move Cards");
    expect(cubeModule("03 · Open. Act. Close. Restore.")?.content).not.toContain("Guided Move Cards");
    expect(cubeModule("07 · Solve, explain, then solve again")).toBeDefined();


  });
});
