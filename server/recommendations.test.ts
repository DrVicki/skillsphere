import { describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: '{"recommendations":[]}' } }],
  }),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("recommendations.generate", () => {
  it("rejects an underspecified learner goal before invoking the recommendation model", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.recommendations.generate({
      goal: "Short",
      experience: "beginner",
      weeklyTime: "1-to-3-hours",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns self-contained fallback cards when the model provides no usable matches", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.recommendations.generate({
      goal: "I want practical AI skills for a small business marketing workflow.",
      experience: "beginner",
      weeklyTime: "1-to-3-hours",
    });

    expect(result.generatedBy).toBe("catalog");
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0]).toMatchObject({
      course: { id: expect.any(Number), slug: expect.any(String), title: expect.any(String) },
      reason: expect.any(String),
    });
  });
});
