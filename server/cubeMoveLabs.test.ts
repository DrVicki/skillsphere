import { describe, expect, it } from "vitest";
import { parseGuidedMoveLabs, splitCubeSequence, stripGuidedMoveLabs } from "../client/src/lib/cubeMoveLabs";

const commutatorLesson = `# Open. Act. Close. Restore.

## Guided move cards

- **R U R′ U′ — Atomic exchange:** Open → act → close → restore
- **U R U′ R′ — Same idea, rotated:** Change the setup, keep the logic
- **M U M′ U′ — Middle-slice version:** Useful in the last-six-edges stage

## Practice

1. Run the first sequence slowly.`;

describe("Cube Move Labs", () => {
  it("extracts source-authored move sequences into interactive lab definitions", () => {
    expect(parseGuidedMoveLabs(commutatorLesson)).toEqual([
      {
        sequence: "R U R′ U′",
        label: "Atomic exchange",
        note: "Open → act → close → restore",
        moves: ["R", "U", "R′", "U′"],
      },
      {
        sequence: "U R U′ R′",
        label: "Same idea, rotated",
        note: "Change the setup, keep the logic",
        moves: ["U", "R", "U′", "R′"],
      },
      {
        sequence: "M U M′ U′",
        label: "Middle-slice version",
        note: "Useful in the last-six-edges stage",
        moves: ["M", "U", "M′", "U′"],
      },
    ]);
  });

  it("preserves lesson prose while removing the duplicate guided-moves block", () => {
    const stripped = stripGuidedMoveLabs(commutatorLesson);
    expect(stripped).toContain("# Open. Act. Close. Restore.");
    expect(stripped).toContain("## Practice");
    expect(stripped).not.toContain("## Guided move cards");
    expect(splitCubeSequence("(R U R′ U′)")).toEqual(["R", "U", "R′", "U′"]);
    expect(parseGuidedMoveLabs("# A normal lesson")).toEqual([]);
  });
});
