import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG,
  getQuantumVisualizationForModule,
  quantumVisualizationLessons,
  quantumVisualizationTypes,
} from "../client/src/lib/quantumVisualizations";

const learnerPage = fs.readFileSync(
  new URL("../client/src/pages/LearnCourse.tsx", import.meta.url),
  "utf8"
);
const visualizations = fs.readFileSync(
  new URL(
    "../client/src/components/QuantumVisualizations.tsx",
    import.meta.url
  ),
  "utf8"
);

describe("Quantum Computing for Beginners visualizations", () => {
  it("maps every source-authored interactive lesson to its visualization", () => {
    expect(quantumVisualizationTypes).toEqual([
      "superposition",
      "entanglement",
      "gates",
      "grover",
    ]);
    expect(quantumVisualizationLessons).toHaveLength(4);
    expect(
      getQuantumVisualizationForModule(
        QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG,
        "Module 2 · Superposition: Being in Two Places at Once"
      )
    ).toBe("superposition");
    expect(
      getQuantumVisualizationForModule(
        QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG,
        "Module 2 · Entanglement: Spooky Action at a Distance"
      )
    ).toBe("entanglement");
    expect(
      getQuantumVisualizationForModule(
        QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG,
        "Module 3 · Quantum Gates: The Building Blocks"
      )
    ).toBe("gates");
    expect(
      getQuantumVisualizationForModule(
        QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG,
        "Module 4 · Grover's Algorithm: Quantum Search"
      )
    ).toBe("grover");
    expect(
      getQuantumVisualizationForModule(
        "another-course",
        "Module 2 · Superposition: Being in Two Places at Once"
      )
    ).toBeNull();
  });

  it("embeds the mapped interactive tools in the protected learner lesson view", () => {
    expect(learnerPage).toMatch(
      /getQuantumVisualizationForModule\(\s*course\?\.slug,\s*activeModule\?\.title\s*\)/
    );
    expect(learnerPage).toMatch(
      /<QuantumVisualizations\s+visualization=\{quantumVisualization\}\s*\/?\s*>/
    );
    expect(visualizations).toContain("Interactive Bloch Sphere");
    expect(visualizations).toContain("Bell State Entanglement Demo");
    expect(visualizations).toContain("Quantum Gate Simulator");
    expect(visualizations).toContain(
      "Grover’s Algorithm — Amplitude Amplification"
    );
  });
});
