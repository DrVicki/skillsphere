import { describe, expect, it } from "vitest";
import {
  getVideoPlayback,
  normalizeEmbedContent,
  normalizeVideoLessonUrl,
} from "../client/src/lib/embedContent";

describe("normalizeEmbedContent", () => {
  it("converts YouTube watch links into privacy-enhanced embed URLs", () => {
    expect(
      normalizeEmbedContent(
        "https://www.youtube.com/watch?v=abc123&start=42",
        "Course walkthrough"
      )
    ).toEqual({
      src: "https://www.youtube-nocookie.com/embed/abc123?rel=0&modestbranding=1&start=42",
      title: "Course walkthrough",
      provider: "YouTube",
      kind: "video",
    });
  });

  it("accepts iframe snippets and recognizes Google Forms", () => {
    const result = normalizeEmbedContent(
      '<iframe src="https://docs.google.com/forms/d/e/form-id/viewform"></iframe>'
    );

    expect(result).toMatchObject({
      provider: "Google Forms",
      kind: "form",
      title: "Google Form",
    });
    expect(result.src).toContain("embedded=true");
  });

  it("uses embedded playback for YouTube and native playback for direct video files", () => {
    expect(getVideoPlayback("https://youtu.be/abc123")).toMatchObject({
      mode: "embed",
      provider: "YouTube",
      src: expect.stringContaining("youtube-nocookie.com/embed/abc123"),
    });
    expect(getVideoPlayback("/manus-storage/caio-introduction.mp4")).toEqual({
      mode: "native",
      src: "/manus-storage/caio-introduction.mp4",
    });
  });

  it("converts a pasted YouTube iframe into the stored embed player URL", () => {
    expect(
      normalizeVideoLessonUrl(
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/uQwepQQJ6Bw?si=pHPc_aiFLBx_FMDR" title="YouTube video player" allowfullscreen></iframe>'
      )
    ).toBe(
      "https://www.youtube-nocookie.com/embed/uQwepQQJ6Bw?rel=0&modestbranding=1"
    );
  });

  it("converts YouTube playlist links into a playlist player", () => {
    expect(
      normalizeVideoLessonUrl(
        "https://youtube.com/playlist?list=PLBfr9Gu76okk&si=4icoqHXncYYCeZYu"
      )
    ).toBe(
      "https://www.youtube-nocookie.com/embed/videoseries?list=PLBfr9Gu76okk&rel=0&modestbranding=1"
    );
    expect(getVideoPlayback("https://youtube.com/playlist?list=PLBfr9Gu76okk")).toMatchObject({
      mode: "embed",
      provider: "YouTube",
      src: expect.stringContaining("embed/videoseries?list=PLBfr9Gu76okk"),
    });
  });

  it("rejects unsafe or malformed sources", () => {
    expect(() => normalizeEmbedContent("javascript:alert(1)")).toThrow(
      "Only secure HTTPS embed sources are allowed."
    );
    expect(() => normalizeEmbedContent("<iframe></iframe>")).toThrow(
      "The iframe code needs a source URL."
    );
    expect(() => normalizeEmbedContent("not-a-url")).toThrow(
      "Enter a complete HTTPS URL or a valid iframe snippet."
    );
  });
});
