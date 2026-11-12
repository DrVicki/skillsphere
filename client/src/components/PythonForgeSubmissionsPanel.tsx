import { useEffect, useMemo, useState } from "react";
import { Code2, Eye, Search, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  courseId: number;
  classroomId?: number;
  classroomName?: string;
}

export default function PythonForgeSubmissionsPanel({ courseId, classroomId, classroomName }: Props) {
  const queryInput = { courseId, ...(classroomId !== undefined ? { classroomId } : {}) };
  const { data: submissions, isLoading, isError } = trpc.pythonForgeLab.submissions.useQuery(queryInput, {
    enabled: courseId > 0,
  });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const utils = trpc.useUtils();
  const saveFeedback = trpc.pythonForgeLab.feedback.useMutation({
    onSuccess: () => {
      void utils.pythonForgeLab.submissions.invalidate(queryInput);
      toast.success("Feedback saved for the learner.");
    },
    onError: error => toast.error(error.message || "Feedback could not be saved."),
  });

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return submissions ?? [];
    return (submissions ?? []).filter(item =>
      [item.learnerName, item.learnerEmail, item.moduleTitle, item.activityId]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalized))
    );
  }, [query, submissions]);
  const selected = submissions?.find(item => item.id === selectedId) ?? null;
  const learnerCount = new Set((submissions ?? []).map(item => item.userId)).size;

  useEffect(() => {
    setFeedback(selected?.instructorFeedback ?? "");
  }, [selected?.id, selected?.instructorFeedback]);

  const submitFeedback = () => {
    if (!selected) return;
    saveFeedback.mutate({
      id: selected.id,
      courseId,
      ...(classroomId !== undefined ? { classroomId } : {}),
      feedback: feedback.trim() || null,
    });
  };

  return (
    <section className="rounded-2xl border border-blue-200 bg-white shadow-sm" aria-labelledby="python-forge-submissions-title">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-700">
            <Code2 className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.15em]">Python Forge instructor view</p>
          </div>
          <h2 id="python-forge-submissions-title" className="mt-1 text-xl font-bold text-slate-900">
            {classroomName ? `${classroomName} lab submissions` : "Learner lab submissions"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {classroomName
              ? "Review saved code from active students in this classroom, then leave optional feedback they can read in the lab."
              : "Review the latest saved code for each learner and lesson, then leave optional feedback they can read in the lab."}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
          <Users className="h-4 w-4" aria-hidden="true" /> {learnerCount} learners · {submissions?.length ?? 0} saves
        </div>
      </div>

      <div className="p-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search learner, email, lesson, or activity" aria-label="Search Python Forge submissions" className="pl-9" />
        </div>
        {isLoading ? (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-slate-100" aria-label="Loading submissions" />
        ) : isError ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Submissions could not be loaded. Confirm you are viewing your own Python Forge course.</p>
        ) : filtered.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <Code2 className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-slate-700">No saved lab code yet</p>
            <p className="mt-1 text-xs text-slate-500">Learner saves will appear here automatically.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[680px] text-left text-sm">
              <caption className="sr-only">Python Forge learner code submissions</caption>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Learner</th>
                  <th className="px-4 py-3 font-semibold">Lesson</th>
                  <th className="px-4 py-3 font-semibold">Last saved</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(item => (
                  <tr key={item.id} className="bg-white">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{item.learnerName || "Unnamed learner"}</p>
                      <p className="text-xs text-slate-500">{item.learnerEmail || "No email"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[300px] truncate font-medium text-slate-700">{item.moduleTitle}</p>
                      <Badge variant="outline" className="mt-1 text-[10px]">{item.activityId}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Recently"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedId(item.id)}><Eye className="mr-1.5 h-3.5 w-3.5" /> Review code</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelectedId(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.learnerName || "Learner"} — {selected?.moduleTitle}</DialogTitle>
            <DialogDescription>{selected?.learnerEmail || "No email available"} · Last saved {selected?.updatedAt ? new Date(selected.updatedAt).toLocaleString() : "recently"}</DialogDescription>
          </DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-emerald-100" aria-label="Learner submitted Python code"><code>{selected?.code}</code></pre>
          <div className="space-y-2">
            <label htmlFor="python-forge-feedback" className="text-sm font-semibold text-slate-900">Optional instructor feedback</label>
            <Textarea
              id="python-forge-feedback"
              value={feedback}
              onChange={event => setFeedback(event.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Share one specific strength and one next step…"
              aria-describedby="python-forge-feedback-help"
            />
            <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span id="python-forge-feedback-help">Learners see feedback the next time they open this lab.</span>
              <span>{feedback.length}/5000</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFeedback("")} disabled={saveFeedback.isPending || !feedback}>Clear draft</Button>
              <Button onClick={submitFeedback} disabled={saveFeedback.isPending}>{saveFeedback.isPending ? "Saving…" : "Save feedback"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
