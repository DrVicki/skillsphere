import { Code2, Download, LoaderCircle, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AIDataAnalyticsLab } from "@/lib/aiDataAnalyticsLabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type PyodideInstance = {
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
};

type PyodideModule = { loadPyodide: (options: { indexURL: string }) => Promise<PyodideInstance> };

declare global {
  interface Window { __skillSphereAnalyticsPyodide?: PyodideInstance }
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";

async function getRuntime(setOutput: (value: string) => void) {
  if (window.__skillSphereAnalyticsPyodide) return window.__skillSphereAnalyticsPyodide;
  setOutput("Loading the Python 3 runtime for your first run…");
  const module = (await import(/* @vite-ignore */ PYODIDE_URL)) as PyodideModule;
  const runtime = await module.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  window.__skillSphereAnalyticsPyodide = runtime;
  return runtime;
}

function downloadNotebook(lab: AIDataAnalyticsLab, code: string) {
  const notebook = {
    cells: [
      { cell_type: "markdown", metadata: {}, source: [`# ${lab.title}\n`, `\n${lab.focus}`] },
      { cell_type: "code", execution_count: null, metadata: {}, outputs: [], source: code.split("\n").map(line => `${line}\n`) },
    ],
    metadata: { kernelspec: { display_name: "Python 3", language: "python", name: "python3" }, language_info: { name: "python" } },
    nbformat: 4,
    nbformat_minor: 5,
  };
  const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: "application/x-ipynb+json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${lab.id}-analytics-lab.ipynb`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AIDataAnalyticsCodeLab({ lab, courseId, moduleId, canPersist, onLabCompleted }: { lab: AIDataAnalyticsLab; courseId?: number; moduleId?: number; canPersist?: boolean; onLabCompleted?: () => void }) {
  const storageKey = `skillsphere-ai-analytics-lab:${moduleId ?? lab.id}`;
  const [code, setCode] = useState(lab.starterCode);
  const [output, setOutput] = useState("Ready. Press Run or use Ctrl/Cmd + Enter.");
  const [running, setRunning] = useState(false);
  const latestCode = useRef(code);
  const utils = trpc.useUtils();
  const saveEvidence = trpc.aiDataAnalyticsEvidence.save.useMutation();
  const submitEvidence = trpc.aiDataAnalyticsEvidence.submit.useMutation();
  const { data: evidence } = trpc.aiDataAnalyticsEvidence.list.useQuery(courseId ?? 0, { enabled: Boolean(canPersist && courseId) });
  const currentEvidence = evidence?.find(item => item.moduleId === moduleId && item.evidenceType === "practice_code");

  useEffect(() => {
    setCode(window.localStorage.getItem(storageKey) ?? lab.starterCode);
    setOutput("Ready. Press Run or use Ctrl/Cmd + Enter.");
  }, [lab.id, lab.starterCode, storageKey]);

  useEffect(() => {
    latestCode.current = code;
    window.localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  const runCode = async () => {
    if (running) return;
    setRunning(true);
    try {
      const runtime = await getRuntime(setOutput);
      const lines: string[] = [];
      runtime.setStdout({ batched: text => lines.push(text) });
      runtime.setStderr({ batched: text => lines.push(text) });
      const result = await runtime.runPythonAsync(latestCode.current);
      if (result !== undefined && result !== null) lines.push(String(result));
      setOutput(lines.join("\n") || "Program finished successfully with no output.");
      if (canPersist && courseId && moduleId) {
        await saveEvidence.mutateAsync({ courseId, moduleId, evidenceType: "practice_code", content: latestCode.current, executed: true });
        await utils.aiDataAnalyticsEvidence.list.invalidate(courseId);
        onLabCompleted?.();
      }
    } catch (error) {
      setOutput(error instanceof Error ? error.message : String(error));
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-xl" aria-label={`${lab.title} embedded Python analytics lab`}>
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/15 via-blue-400/10 to-transparent px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3"><span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200"><Code2 className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Embedded Python analytics lab</p><h3 className="mt-0.5 text-base font-bold text-white">{lab.title}</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">{lab.focus} Edit the starter code and run it directly in this lesson.</p></div></div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">Python 3 · Browser</span>
        </div>
      </div>
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(250px,.75fr)]">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="font-mono text-xs font-semibold text-slate-200">{lab.id}-analytics.py</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setCode(lab.starterCode); setOutput("Starter code restored. Press Run to execute it."); }} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"><RotateCcw className="h-3.5 w-3.5" /> Reset</button><button type="button" onClick={() => downloadNotebook(lab, code)} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"><Download className="h-3.5 w-3.5" /> Download .ipynb</button><button type="button" onClick={() => void runCode()} disabled={running} className="inline-flex items-center gap-1.5 rounded-md bg-cyan-300 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-70">{running ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}{running ? "Running" : "Run"}</button></div></div>
          <textarea value={code} onChange={event => setCode(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); void runCode(); } }} spellCheck={false} aria-label={`${lab.title} Python code editor`} className="min-h-[330px] w-full resize-y rounded-xl border border-white/15 bg-[#101923] p-4 font-mono text-sm leading-6 text-cyan-100 outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15" />
          <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4"><div className="mb-2 flex items-center justify-between gap-3"><p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Output</p><p className="text-xs text-slate-500" role="status">Saved in this browser · Ctrl/⌘ Enter to run</p></div><pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-200">{output}</pre></div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs leading-5 text-slate-400">Runs locally through WebAssembly. Use the included sample data for practice; do not paste confidential learner, customer, or organizational data.</p>{canPersist && currentEvidence && <button type="button" onClick={() => submitEvidence.mutate({ id: currentEvidence.id, courseId: courseId! }, { onSuccess: () => toast.success("Practice code submitted for instructor review.") })} disabled={submitEvidence.isPending || currentEvidence.reviewStatus === "submitted" || currentEvidence.reviewStatus === "approved"} className="rounded-md bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50">{currentEvidence.reviewStatus === "approved" ? "Approved" : currentEvidence.reviewStatus === "submitted" ? "Submitted" : "Submit practice code"}</button>}</div>
        </div>
        <aside className="space-y-4"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Practice target</p><p className="mt-3 text-sm leading-6 text-slate-200">Complete the TODO lines, run the code, and compare your output with the expected result. Then change one input to test how the conclusion changes.</p><div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Expected result</p><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-300">{lab.expectedOutput}</p></div></div><div className="rounded-xl border border-amber-200/15 bg-amber-200/[0.06] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">Hints</p><ul className="mt-3 space-y-2">{lab.hints.map(hint => <li key={hint} className="text-sm leading-5 text-amber-50/90">{hint}</li>)}</ul></div></aside>
      </div>
    </section>
  );
}
