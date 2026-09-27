const cubePracticeImagePattern = /<img[^>]*src=["'][^"']*1790548323943-Screenshot_2026-09-27_at_3\.24\.57_PM_debcfa26\.png[^"']*["'][^>]*>/i;

export type CubeLabPlacement = {
  beforeLab: string;
  afterLab: string;
};

export function splitCubePracticeContent(content: string, title?: string): CubeLabPlacement | null {
  const isCubeOrientationLesson = title?.toLowerCase().includes("see the system") ?? false;
  const imageMatch = isCubeOrientationLesson ? content.match(cubePracticeImagePattern) : null;

  if (!imageMatch || imageMatch.index === undefined) return null;

  const splitAt = imageMatch.index + imageMatch[0].length;
  return {
    beforeLab: content.slice(0, splitAt),
    afterLab: content.slice(splitAt),
  };
}
