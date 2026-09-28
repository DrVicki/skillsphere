import { describe, expect, it } from "vitest";

const secret = process.env.TURNSTILE_SECRET_KEY;
const validateConfiguredSecret = secret ? it : it.skip;

describe("Cloudflare Turnstile production credential", () => {
  validateConfiguredSecret("accepts the configured secret without sending a contact message", async () => {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secret!,
        // Deliberately invalid: validates the key without accepting a CAPTCHA or sending a form submission.
        response: "skillsphere-production-secret-validation",
      }),
    });

    expect(response.ok).toBe(true);
    const result = await response.json() as { success?: boolean; "error-codes"?: string[] };

    expect(result.success).toBe(false);
    expect(result["error-codes"] ?? []).not.toContain("invalid-input-secret");
  });
});
