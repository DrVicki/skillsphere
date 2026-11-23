import { useMemo, useState } from "react";
import JSZip from "jszip";
import { BookOpen, CheckCircle2, Download, FileArchive, FileCode2, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { createPythonNotebook, downloadPythonNotebook, getSavedPythonDraft } from "@/lib/pythonNotebook";
import { py30Activities, PY30_COURSE_SLUG } from "@/lib/py30Activities";
import { pythonForgeActivities, PYTHON_FORGE_COURSE_SLUG } from "@/lib/pythonForgeActivities";
import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";

interface Props {
  courseId: number;
  courseSlug: string;
  courseTitle: string;
}

type NotebookStatus = "completed" | "reviewed" | "resubmit" | "saved" | "not_started";

function activitiesForCourse(courseSlug: string) {
  if (courseSlug === PY30_COURSE_SLUG) return py30Activities;
  if (courseSlug === PYTHON_FORGE_COURSE_SLUG) return pythonForgeActivities;
  return [];
}

function statusLabel(status: NotebookStatus) {
  return {
    completed: "Completed",
    reviewed: "Reviewed",
    resubmit: "Resubmit requested",
    saved: "Saved for review",
    not_started: "Not started",
  }[status];
}

function statusClass(status: NotebookStatus) {
  return {
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    reviewed: "border-blue-200 bg-blue-50 text-blue-700",
    resubmit: "border-amber-200 bg-amber-50 text-amber-800",
    saved: "border-cyan-200 bg-cyan-50 text-cyan-700",
    not_started: "border-slate-200 bg-slate-50 text-slate-500",
  }[status];
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PythonNotebookCourse({ courseId, courseSlug, courseTitle }: Props) {
  const activities = activitiesForCourse(courseSlug);
  const { data: savedCode, isLoading } = trpc.pythonForgeLab.notebookData.useQuery(courseId, { enabled: courseId > 0 });
  const recordDownload = trpc.pythonForgeLab.recordDownload.useMutation();
  const [filter, setFilter] = useState("");

  const savedByActivity = useMemo(
    () => new Map((savedCode ?? []).map(item => [item.activityId, item])),
    [savedCode]
  );

  const allNotebooks = useMemo(() => activities.map(activity => {
    const saved = savedByActivity.get(activity.id);
    const browserDraft = saved ? undefined : getSavedPythonDraft(activity);
    const status: NotebookStatus = saved?.isCompleted
      ? "completed"
      : saved?.reviewStatus === "reviewed"
        ? "reviewed"
        : saved?.reviewStatus === "resubmit"
          ? "resubmit"
          : saved
            ? "saved"
            : "not_started";
    return {
      activity,
      code: saved?.code ?? browserDraft ?? activity.starterCode,
      source: saved ? "Saved learner code" : browserDraft ? "Browser draft" : "Starter code",
      status,
    };
  }), [activities, savedByActivity]);

  const notebooks = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return allNotebooks;
    return allNotebooks.filter(({ activity }) =>
      `${activity.title} ${activity.activity.title} ${activity.activity.brief}`.toLowerCase().includes(query)
    );
  }, [allNotebooks, filter]);

  const downloadOne = (activity: PythonForgeActivity, code: string) => {
    recordDownload.mutate({ courseId, activityId: activity.id, downloadType: "single" });
    downloadPythonNotebook(activity, code);
  };

  const downloadAll = async () => {
    if (allNotebooks.length === 0) return;
    recordDownload.mutate({ courseId, downloadType: "bundle" });
    const zip = new JSZip();
    allNotebooks.forEach(({ activity, code }) => {
      zip.file(`${activity.id}.ipynb`, JSON.stringify(createPythonNotebook(activity, code), null, 2));
    });
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    triggerBrowserDownload(blob, `${courseSlug}-notebooks.zip`);
    toast.success(`${allNotebooks.length} notebooks downloaded as a ZIP`);
  };

  if (activities.length === 0) return null;

  return (
    <section className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 shadow-sm" aria-labelledby={`notebooks-${courseId}-title`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-700"><FileCode2 className="h-5 w-5" aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.15em]">Downloadable learning files</p></div>
          <h2 id={`notebooks-${courseId}-title`} className="mt-1 text-xl font-bold text-slate-900">{courseTitle} notebooks</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Download any embedded Python lab or bundle the complete course. Each file includes the lesson brief, steps, reflection, and your latest available code.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="w-fit border-cyan-200 bg-white text-cyan-800">{activities.length} notebooks</Badge>
          <Button type="button" size="sm" onClick={() => void downloadAll()} disabled={isLoading || allNotebooks.length === 0} className="bg-slate-900 text-white hover:bg-slate-800">
            <FileArchive className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Download all ZIP
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><Input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Filter notebooks" aria-label={`Filter ${courseTitle} notebooks`} className="bg-white pl-9" /></div>
        <p className="text-xs text-slate-500">{notebooks.length} of {activities.length} shown</p>
      </div>

      {isLoading ? <div className="mt-4 h-24 animate-pulse rounded-xl bg-cyan-100/70" aria-label="Loading notebook status" /> : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {notebooks.map(({ activity, code, source, status }) => (
            <div key={activity.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700"><BookOpen className="h-5 w-5" aria-hidden="true" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900" title={activity.title}>{activity.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="flex items-center gap-1 text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />{source}</span>
                  <span className={`rounded-full border px-1.5 py-0.5 font-semibold ${statusClass(status)}`}>{statusLabel(status)}</span>
                </div>
              </div>
              <Button size="sm" className="shrink-0 bg-cyan-700 text-white hover:bg-cyan-800" onClick={() => downloadOne(activity, code)} aria-label={`Download ${activity.title} notebook`}><Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />.ipynb</Button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && notebooks.length === 0 && <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-600">No notebooks match that search. Try a lesson name such as “loops”, “functions”, or “review”.</p>}
    </section>
  );
}

export default function PythonNotebookLibrary({ enrollments }: { enrollments: Props[] }) {
  if (enrollments.length === 0) return null;
  return <div className="space-y-6">{enrollments.map(enrollment => <PythonNotebookCourse key={enrollment.courseId} {...enrollment} />)}</div>;
}
