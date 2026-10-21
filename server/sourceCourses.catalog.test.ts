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

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-catalog-test",
      name: "Administrator",
      email: "admin@skillsphere.test",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("source course catalog", () => {
  it("lists the three newly imported public courses with their curriculum counts", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const courses = await caller.courses.list({ limit: 100 });
    const bySlug = new Map(courses.map(course => [course.slug, course]));

    expect(bySlug.get("data-centers-virtual-field-trip")).toMatchObject({
      title: "Data Centers: A Virtual Field Trip",
      totalModules: 16,
      isPublished: true,
    });
    expect(bySlug.get("python-forge-learn-by-building")).toMatchObject({
      title: "Python Forge — Learn by Building",
      totalModules: 42,
      isPublished: true,
    });
    expect(bySlug.get("10-ways-chatgpt-business-owners")).toMatchObject({
      title: "10 Ways to Use ChatGPT for Business Owners",
      totalModules: 20,
      isPublished: true,
    });
    expect(bySlug.get("cube-unlocked-visual-rubiks-cube-course")).toMatchObject(
      {
        title: "Cube, Unlocked — A Visual Rubik's Cube Course",
        totalDuration: 57,
        isPublished: true,
        isFree: false,
        price: "9.99",
      }
    );
    expect(
      bySlug.get("cube-unlocked-visual-rubiks-cube-course")?.totalModules
    ).toBeGreaterThanOrEqual(7);
    expect(bySlug.get("ai-in-data-analytics")).toMatchObject({
      title: "Using AI in Data Analytics",
      totalModules: 26,
      totalDuration: 435,
      isPublished: true,
      isFree: false,
      price: "297.00",
    });
    expect(bySlug.get("chief-ai-officer-caio-4-week-bootcamp")).toMatchObject({
      title: "Chief AI Officer (CAIO) 4-Week BootCamp",
      totalModules: 20,
      totalDuration: 1200,
      isPublished: true,
      isFree: false,
      price: "497.00",
    });
  });

  it("shows the complete catalog and newest CAIO BootCamp in the Admin Dashboard", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const courses = await caller.courses.listAll();

    expect(courses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "chief-ai-officer-caio-4-week-bootcamp",
        }),
      ])
    );
    expect(courses[0]).toMatchObject({
      slug: "chief-ai-officer-caio-4-week-bootcamp",
      title: "Chief AI Officer (CAIO) 4-Week BootCamp",
      totalModules: 20,
      isPublished: true,
    });
  });

  it("preserves source lesson content and knowledge checks for the imported curricula", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const courses = await caller.courses.list({ limit: 100 });
    const bySlug = new Map(courses.map(course => [course.slug, course]));

    const dataCenter = bySlug.get("data-centers-virtual-field-trip");
    const pyforge = bySlug.get("python-forge-learn-by-building");
    const chatGptBusiness = bySlug.get("10-ways-chatgpt-business-owners");
    const cubeUnlocked = bySlug.get("cube-unlocked-visual-rubiks-cube-course");
    const caioBootcamp = bySlug.get("chief-ai-officer-caio-4-week-bootcamp");

    expect(dataCenter).toBeDefined();
    expect(pyforge).toBeDefined();
    expect(chatGptBusiness).toBeDefined();
    expect(cubeUnlocked).toBeDefined();
    expect(caioBootcamp).toBeDefined();

    const dataCenterModules = await caller.modules.byCourse(dataCenter!.id);
    const pyforgeModules = await caller.modules.byCourse(pyforge!.id);
    const chatGptModules = await caller.modules.byCourse(chatGptBusiness!.id);
    const cubeModules = await caller.modules.byCourse(cubeUnlocked!.id);
    const caioModules = await caller.modules.byCourse(caioBootcamp!.id);

    expect(dataCenterModules).toHaveLength(16);
    expect(dataCenterModules[0]?.content).toContain("What Is a Data Center?");
    expect(dataCenterModules[1]).toMatchObject({
      type: "assessment",
      assessmentData: expect.objectContaining({
        questions: expect.arrayContaining([
          expect.objectContaining({ question: "What is a data center?" }),
        ]),
      }),
    });

    expect(pyforgeModules).toHaveLength(42);
    expect(pyforgeModules[0]?.content).toContain(
      "Programs make a plan explicit"
    );
    expect(pyforgeModules[0]?.content).toContain(
      "Hands-on activity: Map a pre-launch decision"
    );
    expect(pyforgeModules[0]?.content).toContain("Worked example");
    expect(pyforgeModules.at(-1)).toMatchObject({
      title: "Portfolio Project 12 · Portfolio-Ready Python Product",
      content: expect.stringContaining("Build requirements"),
    });

    expect(chatGptModules).toHaveLength(20);
    expect(chatGptModules[0]?.content).toContain(
      "Creating consistent, high-quality content"
    );
    expect(chatGptModules[1]).toMatchObject({
      type: "assessment",
      assessmentData: expect.objectContaining({ questions: expect.any(Array) }),
    });

    expect(cubeModules.length).toBeGreaterThanOrEqual(7);
    const cubeModuleByTitle = new Map(
      cubeModules.map(module => [module.title.toLocaleLowerCase(), module])
    );
    const cubeModule = (title: string) =>
      cubeModuleByTitle.get(title.toLocaleLowerCase());
    expect(cubeModule("01 · See the system, not the scramble")).toMatchObject({
      duration: expect.any(Number),
      isPreview: true,
    });
    expect(
      cubeModule("01 · See the system, not the scramble")?.content
    ).toEqual(expect.any(String));
    expect(
      cubeModule("02 · Learn the cube’s tiny language")?.content
    ).toContain("Guided Move Cards");
    expect(
      cubeModule("03 · Open. Act. Close. Restore.")?.content
    ).not.toContain("Guided Move Cards");
    expect(cubeModule("07 · Solve, explain, then solve again")).toBeDefined();

    expect(caioModules).toHaveLength(20);
    expect(caioModules[0]).toMatchObject({
      title: expect.stringContaining("The CAIO Window"),
      isPreview: true,
      content: expect.stringContaining("Open the supplied CAIO guide"),
    });
    expect(
      caioModules.filter(module => module.type === "assessment")
    ).toHaveLength(4);
    expect(caioModules.at(-2)).toMatchObject({
      title: expect.stringContaining("Capstone: Your 90-Day CAIO Plan"),
      content: expect.stringContaining(
        "Build and present your CAIO engagement brief"
      ),
    });
  });
});
