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
  });

  it("preserves source lesson content and knowledge checks for the imported curricula", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const courses = await caller.courses.list({ limit: 100 });
    const bySlug = new Map(courses.map((course) => [course.slug, course]));

    const dataCenter = bySlug.get("data-centers-virtual-field-trip");
    const pyforge = bySlug.get("python-forge-learn-by-building");
    const chatGptBusiness = bySlug.get("10-ways-chatgpt-business-owners");

    expect(dataCenter).toBeDefined();
    expect(pyforge).toBeDefined();
    expect(chatGptBusiness).toBeDefined();

    const [dataCenterModules, pyforgeModules, chatGptModules] = await Promise.all([
      caller.modules.byCourse(dataCenter!.id),
      caller.modules.byCourse(pyforge!.id),
      caller.modules.byCourse(chatGptBusiness!.id),
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
  });
});
