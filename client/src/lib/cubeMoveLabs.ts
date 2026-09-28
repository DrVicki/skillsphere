export type CubeMoveLab = {
  sequence: string;
  label: string;
  note: string;
  moves: string[];
};

const GUIDED_MOVES_BLOCK = /\n## Guided move cards\s*\n+([\s\S]*?)(?=\n## |\n---|$)/;
const GUIDED_MOVE_LINE = /^-\s+\*\*(.+?)\s+—\s+(.+?):\*\*\s*(.+)$/gm;

export function splitCubeSequence(sequence: string): string[] {
  return sequence
    .replace(/[()]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Extract source-authored guided move cards from a Markdown lesson. */
export function parseGuidedMoveLabs(content: string | null | undefined): CubeMoveLab[] {
  if (!content) return [];

  const block = content.match(GUIDED_MOVES_BLOCK)?.[1];
  if (!block) return [];

  const labs: CubeMoveLab[] = [];
  for (const match of Array.from(block.matchAll(GUIDED_MOVE_LINE))) {
    const [, sequence, label, note] = match;
    const moves = splitCubeSequence(sequence);
    if (sequence && label && note && moves.length > 0) {
      labs.push({ sequence, label, note, moves });
    }
  }

  return labs;
}

/** Keep instructional copy in the lesson while rendering its guided moves as interactive labs. */
export function stripGuidedMoveLabs(content: string): string {
  return content.replace(GUIDED_MOVES_BLOCK, "").replace(/\n{3,}/g, "\n\n").trim();
}
