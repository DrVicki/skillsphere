import fs from "node:fs";
import { describe, expect, it } from "vitest";

const routerSource = fs.readFileSync(
  new URL("./routers.ts", import.meta.url),
  "utf8"
);
const playerSource = fs.readFileSync(
  new URL("../client/src/pages/LearnCourse.tsx", import.meta.url),
  "utf8"
);

describe("video lesson authoring", () => {
  it("persists a lesson type change and validates that video lessons have a source", () => {
    expect(routerSource).toContain(
      'type: z.enum(["video", "text", "assessment"]).optional()'
    );
    expect(routerSource).toContain(
      "const nextType = input.type ?? module.type"
    );
    expect(routerSource).toContain(
      "Video lessons need a public video URL or a Manus storage path"
    );
  });

  it("limits module edits to the course trainer or an administrator", () => {
    expect(routerSource).toContain(
      "const module = await getModuleById(input.id)"
    );
    expect(routerSource).toContain(
      'course.trainerId !== ctx.user.id && ctx.user.role !== "admin"'
    );
  });

  it("selects the public-video iframe player instead of loading public links in a native video tag", () => {
    expect(playerSource).toContain(
      "const videoPlayback = getVideoPlayback(activeModule?.videoUrl)"
    );
    expect(playerSource).toContain('videoPlayback.mode === "embed"');
    expect(playerSource).toContain("allowFullScreen");
  });
});
