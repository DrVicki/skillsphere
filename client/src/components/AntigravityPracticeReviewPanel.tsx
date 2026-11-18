import { useMemo, useState } from "react";
import { BarChart3, Download, Eye, Search, Terminal } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props { courseId: number; classroomId: number; classroomName?: string }

export default function AntigravityPracticeReviewPanel({ courseId, classroomId, classroomName }: Props) {
  const input = { courseId, classroomId };
  const { data: attempts, isLoading, isError } = trpc.antigravityPractice.submissions.useQuery(input);
  const { data: metrics } = trpc.antigravityPractice.classroomMetrics.useQuery(input);
  const exportReport = trpc.antigravityPractice.exportClassroomCsv.useMutation();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = attempts?.find(item => item.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attempts ?? [];
    return (attempts ?? []).filter(item => [item.learnerName, item.learnerEmail, item.moduleTitle, item.operatingSystem, item.command].some(value => String(value ?? "").toLowerCase().includes(q)));
  }, [attempts, query]);
  const downloadReport = async () => {
    const csv = await exportReport.mutateAsync(input);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(classroomName || "classroom").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-antigravity-practice.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <section className="mt-6 overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm" aria-labelledby="antigravity-review-title">
    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div><div className="flex items-center gap-2 text-indigo-700"><Terminal className="h-5 w-5" aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.15em]">Antigravity instructor view</p></div><h2 id="antigravity-review-title" className="mt-1 text-xl font-bold text-slate-900">{classroomName ? `${classroomName} terminal practice` : "Terminal practice"}</h2><p className="mt-1 text-sm text-slate-600">See learner commands, successful steps, and retry attempts from the classroom environment setup activity.</p></div>
      <Button size="sm" variant="outline" onClick={downloadReport} disabled={exportReport.isPending}><Download className="mr-1.5 h-3.5 w-3.5" />{exportReport.isPending ? "Preparing…" : "Export CSV"}</Button>
    </div>
    {metrics && <div className="grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-5">{[["Learners practicing", metrics.learnersPracticing], ["Attempts", metrics.attempts], ["Retry attempts", metrics.retryAttempts], ["Completed steps", metrics.completedSteps], ["Success rate", `${metrics.successRate}%`]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-3"><div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700"><BarChart3 className="h-4 w-4" aria-hidden="true" /></div><p className="text-lg font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div>}
    <div className="p-5"><div className="relative max-w-md"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search learner, lesson, OS, or command" aria-label="Search Antigravity practice" className="pl-9" /></div>
      {isLoading ? <div className="mt-4 h-24 animate-pulse rounded-xl bg-slate-100" aria-label="Loading practice attempts" /> : isError ? <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Practice attempts could not be loaded.</p> : filtered.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center"><Terminal className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-slate-700">No terminal practice attempts yet</p></div> : <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">Antigravity learner terminal practice attempts</caption><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Learner</th><th className="px-4 py-3">Lesson / OS</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Attempted</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-200">{filtered.map(item => <tr key={item.id}><td className="px-4 py-3"><p className="font-semibold text-slate-900">{item.learnerName || "Unnamed learner"}</p><p className="text-xs text-slate-500">{item.learnerEmail || "No email"}</p></td><td className="px-4 py-3"><p className="max-w-[300px] truncate font-medium text-slate-700">{item.moduleTitle}</p><Badge variant="outline" className="mt-1 text-[10px]">{item.operatingSystem} · Step {item.stepIndex + 1}</Badge></td><td className="px-4 py-3"><Badge className={item.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>{item.isCorrect ? "Correct" : "Retry"}</Badge></td><td className="px-4 py-3 text-xs text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}</td><td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => setSelectedId(item.id)}><Eye className="mr-1.5 h-3.5 w-3.5" />View command</Button></td></tr>)}</tbody></table></div>}
    </div>
    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelectedId(null); }}><DialogContent><DialogHeader><DialogTitle>{selected?.learnerName || "Learner"} — terminal practice</DialogTitle><DialogDescription>{selected?.moduleTitle} · {selected?.operatingSystem} · Step {(selected?.stepIndex ?? 0) + 1}</DialogDescription></DialogHeader><pre className="rounded-xl bg-slate-950 p-4 font-mono text-sm text-emerald-200" aria-label="Learner command"><code>{selected?.command}</code></pre><p className="text-sm text-slate-600">{selected?.isCorrect ? "This command matched the expected pattern." : "This was a retry attempt; review the learner's next successful attempt for completion."}</p></DialogContent></Dialog>
  </section>;
}
