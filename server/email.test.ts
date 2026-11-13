import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendAIDataAnalyticsEvidenceReviewEmail, sendCompletionEmail, sendEnrollmentEmail } from "./email";

describe("transactional course emails", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    delete process.env.RESEND_FROM_EMAIL;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
  });

  it("sends an enrollment welcome with a SkillSphere learning link", async () => {
    const delivered = await sendEnrollmentEmail(
      { name: "Avery Learner", email: "avery@example.com" },
      { title: "AI for Business", slug: "ai-for-business" },
      "https://myskillsphere.com",
    );

    expect(delivered).toBe(true);
    expect(fetch).toHaveBeenCalledOnce();
    const request = vi.mocked(fetch).mock.calls[0];
    expect(request?.[0]).toBe("https://api.resend.com/emails");
    expect(JSON.parse(String(request?.[1]?.body))).toMatchObject({
      to: ["avery@example.com"],
      subject: "You’re enrolled in AI for Business | SkillSphere",
    });
  });

  it("uses the production learning link for an unapproved origin in a completion email", async () => {
    await sendCompletionEmail(
      { name: "Avery Learner", email: "avery@example.com" },
      { title: "AI for Business", slug: "ai-for-business" },
      "https://untrusted.example.com",
    );

    const request = vi.mocked(fetch).mock.calls[0];
    const email = JSON.parse(String(request?.[1]?.body)) as { html: string };
    expect(email.html).toContain("https://myskillsphere.com/learn/ai-for-business");
    expect(email.html).not.toContain("untrusted.example.com");
  });

  it("sends analytics evidence approval and revision notifications", async () => {
    await sendAIDataAnalyticsEvidenceReviewEmail(
      { name: "Avery Learner", email: "avery@example.com" },
      { title: "Using AI in Data Analytics", slug: "ai-in-data-analytics" },
      "Customer Analytics Dashboard",
      "capstone",
      "Please add one paragraph explaining your data-quality decision.",
      "needs_revision",
      "https://myskillsphere.com",
    );
    const request = vi.mocked(fetch).mock.calls[0];
    const email = JSON.parse(String(request?.[1]?.body)) as { subject: string; text: string; html: string };
    expect(email.subject).toContain("analytics evidence was reviewed");
    expect(email.text).toContain("Revision requested");
    expect(email.html).toContain("Customer Analytics Dashboard");
    expect(email.html).not.toContain("<script");
  });
});
