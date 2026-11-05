import { describe, expect, it } from "vitest";
import { isHTML } from "../client/src/components/LessonContent";
import { isRichHTML } from "../client/src/components/RichTextEditor";

describe("Python lesson content formatting", () => {
  it("treats Markdown headings, emphasis, and Python comparisons as Markdown", () => {
    const markdown = `# Compose Behavior\n\n**ADVANCED**\n\nif score < limit:\n    return score`;
    expect(isHTML(markdown)).toBe(false);
    expect(isRichHTML(markdown)).toBe(false);
  });

  it("recognizes Tiptap block HTML as rich content", () => {
    const html = "<h1>Compose Behavior</h1><p><strong>ADVANCED</strong></p>";
    expect(isHTML(html)).toBe(true);
    expect(isRichHTML(html)).toBe(true);
  });

  it("does not classify inline angle-bracket code as rich HTML", () => {
    const markdown = "Use list[str] and compare value < threshold.";
    expect(isHTML(markdown)).toBe(false);
    expect(isRichHTML(markdown)).toBe(false);
  });
});
