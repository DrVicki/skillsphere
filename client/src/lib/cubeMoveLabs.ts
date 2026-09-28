export type CubeMoveLab = {
  sequence: string;
  label: string;
  note: string;
  moves: string[];
};

const MARKDOWN_GUIDED_MOVES_BLOCK = /\n## Guided move cards\s*\n+([\s\S]*?)(?=\n## |\n---|$)/;
const MARKDOWN_GUIDED_MOVE_LINE = /^-\s+\*\*(.+?)\s+—\s+(.+?):\*\*\s*(.+)$/gm;
const HTML_GUIDED_MOVES_BLOCK = /<h2[^>]*>\s*Guided\s+Move\s+Cards\s*<\/h2>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i;
const HTML_LIST_ITEM = /<li[^>]*>([\s\S]*?)<\/li>/gi;
const HTML_GUIDED_MOVE_LINE = /<strong[^>]*>\s*(.+?)\s+—\s+(.+?):\s*<\/strong>\s*([\s\S]*)/i;

function htmlToText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&mdash;/gi, "—")
    .replace(/&rsquo;|&#8217;/gi, "′")
    .replace(/&prime;|&#8242;/gi, "′")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitCubeSequence(sequence: string): string[] {
  return sequence
    .replace(/[()]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function makeLab(sequence: string, label: string, note: string): CubeMoveLab | null {
  const moves = splitCubeSequence(sequence);
  if (!sequence || !label || !note || moves.length === 0) return null;
  return { sequence, label, note, moves };
}

/** Extract source-authored guided move cards from either Markdown or rich-text HTML lessons. */
export function parseGuidedMoveLabs(content: string | null | undefined): CubeMoveLab[] {
  if (!content) return [];

  const markdownBlock = content.match(MARKDOWN_GUIDED_MOVES_BLOCK)?.[1];
  if (markdownBlock) {
    const labs: CubeMoveLab[] = [];
    for (const match of Array.from(markdownBlock.matchAll(MARKDOWN_GUIDED_MOVE_LINE))) {
      const lab = makeLab(match[1], match[2], match[3]);
      if (lab) labs.push(lab);
    }
    return labs;
  }

  const htmlBlock = content.match(HTML_GUIDED_MOVES_BLOCK)?.[1];
  if (!htmlBlock) return [];

  const labs: CubeMoveLab[] = [];
  for (const item of Array.from(htmlBlock.matchAll(HTML_LIST_ITEM))) {
    const match = item[1].match(HTML_GUIDED_MOVE_LINE);
    if (!match) continue;
    const lab = makeLab(htmlToText(match[1]), htmlToText(match[2]), htmlToText(match[3]));
    if (lab) labs.push(lab);
  }
  return labs;
}

/** Keep instructional copy in the lesson while rendering its guided moves as interactive labs. */
export function stripGuidedMoveLabs(content: string): string {
  if (MARKDOWN_GUIDED_MOVES_BLOCK.test(content)) {
    return content.replace(MARKDOWN_GUIDED_MOVES_BLOCK, "").replace(/\n{3,}/g, "\n\n").trim();
  }
  return content.replace(HTML_GUIDED_MOVES_BLOCK, "").trim();
}
