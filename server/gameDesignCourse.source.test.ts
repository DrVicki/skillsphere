import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GAME_DESIGN_COURSE_SLUG,
  GAME_DESIGN_MODULE_INTERACTIONS,
  getGameDesignInteractionForModule,
} from "../client/src/lib/gameDesignCourse";

const curriculum = JSON.parse(
  fs.readFileSync(new URL("../references/game-design-curriculum.json", import.meta.url), "utf8")
) as {
  sourceUrl: string;
  course: { title: string; slug: string; modules: number; parts: number };
  parts: Array<{ id: number; title: string }>;
  outcomes: string[];
  modules: Array<{
    num: string;
    title: string;
    partId: number;
    overview: string;
    objectives: string[];
    topics: string[];
    resources: Array<{ label: string; url: string; type: string }>;
    reflectionPrompt: string;
    activity: { title: string; steps: string[]; deliverable: string };
    visualizationKey: string;
  }>;
};
const importer = fs.readFileSync(new URL("../import-game-design-course.mjs", import.meta.url), "utf8");

describe("Professional Certificate in Game Design source import", () => {
  it("preserves the source course identity and four-part, 24-module structure", () => {
    expect(curriculum.sourceUrl).toContain("gamedesign-fmsfaqpu.manus.space");
    expect(curriculum.course).toMatchObject({
      title: "Professional Certificate in Game Design",
      slug: GAME_DESIGN_COURSE_SLUG,
      modules: 24,
      parts: 4,
    });
    expect(curriculum.parts.map(part => part.title)).toEqual([
      "The Foundations of Game Design",
      "Tabletop and Low Fidelity Prototyping",
      "Using a Game Engine",
      "Putting It All Together",
    ]);
    expect(curriculum.modules).toHaveLength(24);
    expect(curriculum.modules[0]).toMatchObject({ num: "01", title: "The Territory of Game Design", partId: 1 });
    expect(curriculum.modules.at(-1)).toMatchObject({ num: "24", title: "Designing a Game II", partId: 4 });
  });

  it("keeps substantive readings, resources, activities, and reflections for every module", () => {
    expect(curriculum.modules.every(module => module.overview.length > 200)).toBe(true);
    expect(curriculum.modules.every(module => module.objectives.length === 4)).toBe(true);
    expect(curriculum.modules.every(module => module.topics.length >= 6)).toBe(true);
    expect(curriculum.modules.every(module => module.resources.length === 3)).toBe(true);
    expect(curriculum.modules.every(module => module.activity.steps.length === 3)).toBe(true);
    expect(curriculum.modules.every(module => module.activity.deliverable.length > 20)).toBe(true);
    expect(curriculum.modules.every(module => module.reflectionPrompt.length > 80)).toBe(true);
    expect(curriculum.modules.every(module => module.resources.every(resource => /^https?:\/\//.test(resource.url)))).toBe(true);
  });

  it("maps all 24 modules to activity, visualization, and two-question checks", () => {
    expect(GAME_DESIGN_MODULE_INTERACTIONS).toHaveLength(24);
    expect(GAME_DESIGN_MODULE_INTERACTIONS.every(module => module.activity.steps.length === 3)).toBe(true);
    expect(GAME_DESIGN_MODULE_INTERACTIONS.every(module => module.knowledgeCheck.length === 2)).toBe(true);
    expect(GAME_DESIGN_MODULE_INTERACTIONS.every(module => module.visualizationKey)).toBe(true);
    expect(getGameDesignInteractionForModule(GAME_DESIGN_COURSE_SLUG, "Choice and Chance")?.num).toBe("07");
    expect(getGameDesignInteractionForModule("other-course", "Choice and Chance")).toBeNull();
  });

  it("updates the existing course in place and leaves enrollment and progress rows intact", () => {
    expect(importer).toContain("UPDATE courses SET");
    expect(importer).toContain("SELECT id, sortOrder FROM modules");
    expect(importer).toContain("WHERE id = ? AND courseId = ?");
    expect(importer).toContain("preservedModuleIds");
    expect(importer).not.toContain("DELETE FROM modules");
    expect(importer).toContain("totalModules = ?");
    expect(importer).toContain("isPreview: module.num === \"01\" || module.num === \"02\"");
  });
});
