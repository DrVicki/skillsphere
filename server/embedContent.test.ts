import { describe, expect, it } from "vitest";
import { normalizeEmbedContent } from "../client/src/lib/embedContent";

describe("normalizeEmbedContent", () => {
  it("converts YouTube watch links into privacy-enhanced embed URLs", () => {
    expect(normalizeEmbedContent("https://www.youtube.com/watch?v=abc123&start=42", "Course walkthrough")).toEqual({
      src: "https://www.youtube-nocookie.com/embed/abc123?rel=0&modestbranding=1&start=42",
      title: "Course walkthrough",
      provider: "YouTube",
      kind: "video",
    });
  });

  it("accepts iframe snippets and recognizes Google Forms", () => {
    const result = normalizeEmbedContent('<iframe src="https://docs.google.com/forms/d/e/form-id/viewform"></iframe>');

    expect(result).toMatchObject({
      provider: "Google Forms",
      kind: "form",
      title: "Google Form",
    });
    expect(result.src).toContain("embedded=true");
  });

  it("rejects unsafe or malformed sources", () => {
    expect(() => normalizeEmbedContent("javascript:alert(1)")).toThrow("Only secure HTTPS embed sources are allowed.");
    expect(() => normalizeEmbedContent("<iframe></iframe>")).toThrow("The iframe code needs a source URL.");
    expect(() => normalizeEmbedContent("not-a-url")).toThrow("Enter a complete HTTPS URL or a valid iframe snippet.");
  });
});
