import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";

export function createPythonNotebook(activity: PythonForgeActivity, code: string) {
  const markdown = [
    `# ${activity.title}`,
    "",
    activity.activity.brief,
    "",
    "## Steps",
    ...activity.activity.steps.map((step, index) => `${index + 1}. ${step}`),
    ...(activity.expectedOutput
      ? ["", "## Expected output", activity.expectedOutput]
      : []),
    ...(activity.reflectionPrompt
      ? ["", "## Reflection", activity.reflectionPrompt]
      : []),
  ];

  return {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: markdown.map(line => `${line}\n`),
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: code.split("\n").map(line => `${line}\n`),
      },
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
      language_info: { name: "python" },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
}

export function downloadPythonNotebook(
  activity: PythonForgeActivity,
  code = activity.starterCode
) {
  const notebook = createPythonNotebook(activity, code);
  const file = new Blob([JSON.stringify(notebook, null, 2)], {
    type: "application/x-ipynb+json",
  });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${activity.id}.ipynb`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function getSavedPythonDraft(activity: PythonForgeActivity) {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(`skillsphere-python-forge:${activity.id}`) ?? undefined;
}
