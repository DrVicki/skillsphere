import { describe, expect, it } from "vitest";

describe("Resend configuration", () => {
  it("accepts the configured server-only API key without sending an email", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const body = await response.json() as { name?: string };

    // A restricted send-only key is valid but cannot list domains; full-access keys return 200.
    expect([200, 401]).toContain(response.status);
    if (response.status === 401) expect(body.name).toBe("restricted_api_key");
  });
});
