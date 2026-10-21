import {
  CheckCircle2,
  Code2,
  Download,
  Lightbulb,
  LoaderCircle,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";

interface Props {
  activity: PythonForgeActivity;
}

type PyodideInstance = {
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
};

type PyodideModule = {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideInstance>;
};

declare global {
  interface Window {
    __skillSpherePythonForgePyodide?: PyodideInstance;
  }
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";

function downloadPythonFile(filename: string, code: string) {
  const file = new Blob([code], { type: "text/x-python;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "python-forge"}.py`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function getPythonRuntime(
  setOutput: (output: string) => void
): Promise<PyodideInstance> {
  if (window.__skillSpherePythonForgePyodide)
    return window.__skillSpherePythonForgePyodide;

  setOutput("Loading the Python 3 runtime for your first run…");
  const module = (await import(
    /* @vite-ignore */ PYODIDE_URL
  )) as PyodideModule;
  const runtime = await module.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  window.__skillSpherePythonForgePyodide = runtime;
  return runtime;
}

export default function PythonForgeLab({ activity }: Props) {
  const storageKey = `skillsphere-python-forge:${activity.id}`;
  const [code, setCode] = useState(activity.starterCode);
  const [output, setOutput] = useState(
    "Ready. Press Run or use Ctrl/Cmd + Enter."
  );
  const [running, setRunning] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const latestCode = useRef(code);

  useEffect(() => {
    const savedCode = window.localStorage.getItem(storageKey);
    setCode(savedCode ?? activity.starterCode);
    setOutput("Ready. Press Run or use Ctrl/Cmd + Enter.");
    setHintsOpen(false);
    setSelectedAnswer(null);
  }, [activity.id, activity.starterCode, storageKey]);

  useEffect(() => {
    latestCode.current = code;
    const timer = window.setTimeout(
      () => window.localStorage.setItem(storageKey, code),
      350
    );
    return () => window.clearTimeout(timer);
  }, [code, storageKey]);

  const runCode = async () => {
    if (running) return;
    setRunning(true);
    try {
      const runtime = await getPythonRuntime(setOutput);
      const lines: string[] = [];
      runtime.setStdout({ batched: text => lines.push(text) });
      runtime.setStderr({ batched: text => lines.push(text) });
      const result = await runtime.runPythonAsync(latestCode.current);
      if (result !== undefined && result !== null) lines.push(String(result));
      setOutput(
        lines.join("\n") || "Program finished successfully with no output."
      );
    } catch (error) {
      setOutput(error instanceof Error ? error.message : String(error));
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    window.localStorage.removeItem(storageKey);
    setCode(activity.starterCode);
    setOutput("Starter code restored. Press Run or use Ctrl/Cmd + Enter.");
  };

  const quiz = activity.quiz;
  const isCorrect = quiz && selectedAnswer === quiz.answer;

  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-xl"
      aria-label={`${activity.title} Python lab`}
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-emerald-400/15 via-teal-400/10 to-transparent px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-300/15 text-emerald-200">
              <Code2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                Embedded coding lab
              </p>
              <h3 className="mt-0.5 text-base font-bold text-white">
                {activity.activity.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                {activity.activity.brief}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
            Python 3 · Browser
          </span>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(250px,.75fr)]">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs font-semibold text-slate-200">
              {activity.title
                .replace(/^Portfolio Project \d+ · /, "")
                .replace(/\s+/g, "-")
                .toLowerCase()}
              .py
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={() => downloadPythonFile(activity.id, code)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10"
              >
                <Download className="h-3.5 w-3.5" /> Save .py
              </button>
              <button
                type="button"
                onClick={runCode}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-300 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {running ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}{" "}
                {running ? "Running" : "Run"}
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={event => setCode(event.target.value)}
            onKeyDown={event => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                void runCode();
              }
            }}
            spellCheck={false}
            aria-label="Python code editor"
            className="min-h-[330px] w-full resize-y rounded-xl border border-white/15 bg-[#101923] p-4 font-mono text-sm leading-6 text-emerald-100 outline-none ring-0 transition-shadow placeholder:text-slate-500 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/15"
          />
          <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                Output
              </p>
              <p className="text-xs text-slate-500">Ctrl/⌘ Enter to run</p>
            </div>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-200">
              {output}
            </pre>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            This browser lab runs standard-library Python locally through
            WebAssembly. Network requests, OS automation, Flask servers, browser
            drivers, and heavy desktop libraries belong in a local or hosted
            Python environment.
          </p>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
              Activity steps
            </p>
            <ol className="mt-3 space-y-3">
              {activity.activity.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-2.5 text-sm leading-5 text-slate-200"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-bold text-emerald-100">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
              <CheckCircle2 className="h-4 w-4" /> Definition of done
            </p>
            <ul className="mt-3 space-y-2">
              {activity.activity.successCriteria.map(criterion => (
                <li
                  key={criterion}
                  className="flex gap-2 text-sm leading-5 text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200/15 bg-amber-200/[0.06] p-4">
            <button
              type="button"
              onClick={() => setHintsOpen(open => !open)}
              className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-amber-100"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />{" "}
                {hintsOpen ? "Hide hints" : "Show static hints"}
              </span>
              <span aria-hidden="true">{hintsOpen ? "−" : "+"}</span>
            </button>
            {hintsOpen && (
              <ul className="mt-3 space-y-2">
                {activity.hints.map(hint => (
                  <li key={hint} className="text-sm leading-5 text-amber-50/90">
                    {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {activity.expectedOutput && (
        <div className="border-t border-white/10 bg-white/[0.025] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Expected outcome
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {activity.expectedOutput}
          </p>
        </div>
      )}

      {activity.reflectionPrompt && (
        <div className="border-t border-white/10 bg-white/[0.025] px-5 py-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">
            <Sparkles className="h-4 w-4" /> Reflection
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            {activity.reflectionPrompt}
          </p>
        </div>
      )}

      {quiz && (
        <div className="border-t border-white/10 bg-slate-900 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
            Knowledge check
          </p>
          <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-white">
            {quiz.question}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quiz.options.map((option, index) => {
              const showAnswer = selectedAnswer !== null;
              const isAnswer = index === quiz.answer;
              const selected = index === selectedAnswer;
              const tone =
                showAnswer && isAnswer
                  ? "border-emerald-300/60 bg-emerald-300/15 text-emerald-50"
                  : selected && !isAnswer
                    ? "border-rose-300/60 bg-rose-300/15 text-rose-50"
                    : "border-white/15 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]";
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAnswer(index)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${tone}`}
                  aria-pressed={selected}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <p
              className={`mt-3 text-sm leading-6 ${isCorrect ? "text-emerald-200" : "text-amber-100"}`}
            >
              {isCorrect ? "Correct. " : "Not quite. "}
              {quiz.explanation}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
