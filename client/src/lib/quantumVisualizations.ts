export const QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG = "quantum-computing-for-beginners-1791574031102";

export const quantumVisualizationTypes = ["superposition", "entanglement", "gates", "grover"] as const;
export type QuantumVisualizationType = (typeof quantumVisualizationTypes)[number];

export const quantumVisualizationLessons: Array<{
  lessonTitle: string;
  visualization: QuantumVisualizationType;
}> = [
  { lessonTitle: "Superposition: Being in Two Places at Once", visualization: "superposition" },
  { lessonTitle: "Entanglement: Spooky Action at a Distance", visualization: "entanglement" },
  { lessonTitle: "Quantum Gates: The Building Blocks", visualization: "gates" },
  { lessonTitle: "Grover's Algorithm: Quantum Search", visualization: "grover" },
];

export function getQuantumVisualizationForModule(
  courseSlug?: string | null,
  moduleTitle?: string | null,
): QuantumVisualizationType | null {
  if (courseSlug !== QUANTUM_COMPUTING_FOR_BEGINNERS_SLUG || !moduleTitle) return null;

  return quantumVisualizationLessons.find(({ lessonTitle }) => moduleTitle.includes(lessonTitle))?.visualization ?? null;
}
