import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Download, FileCode2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { py30Activities, PY30_COURSE_SLUG } from "@/lib/py30Activities";
import {
  downloadPythonNotebook,
  getSavedPythonDraft,
} from "@/lib/pythonNotebook";
import {
  pythonForgeActivities,
  PYTHON_FORGE_COURSE_SLUG,
} from "@/lib/pythonForgeActivities";
import type { PythonForgeActivity } from "@/lib/pythonForgeActivities";

interface Props {
  courseId: number;
  courseSlug: string;
  courseTitle: string;
}

function activitiesForCourse(courseSlug: string) {
  if (courseSlug === PY30_COURSE_SLUG) return py30Activities;
  if (courseSlug === PYTHON_FORGE_COURSE_SLUG) return pythonForgeActivities;
  return [];
}

function PythonNotebookCourse({ courseId, courseSlug, courseTitle }: Props) {
  const activities = activitiesForCourse(courseSlug);
  const { data: savedCode, isLoading } = trpc.pythonForgeLab.notebookData.useQuery(
    courseId,
    { enabled: courseId > 0 }
  );
  const [filter, setFilter] = useState("");

  const savedByActivity = useMemo(
    () => new Map((savedCode ?? []).map(item => [item.activityId, item.code])),
    [savedCode]
  );
  const notebooks = useMemo(() => {
    const query = filter.trim().toLowerCase();
    return activities
      .map(activity => {
        const saved = savedByActivity.get(activity.id);
        const browserDraft = saved ? undefined : getSavedPythonDraft(activity);
        return {
          activity,
          code: saved ?? browserDraft ?? activity.starterCode,
          source: saved
            ? "Saved learner code"
            : browserDraft
              ? "Browser draft"
              : "Starter code",
        };
      })
      .filter(({ activity }) => {
        if (!query) return true;
        return `${activity.title} ${activity.activity.title} ${activity.activity.brief}`
          .toLowerCase()
          .includes(query);
      });
  }, [activities, filter, savedByActivity]);

  if (activities.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 shadow-sm"
      aria-labelledby={`notebooks-${courseId}-title`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-700">
            <FileCode2 className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.15em]">
              Downloadable learning files
            </p>
          </div>
          <h2 id={`notebooks-${courseId}-title`} className="mt-1 text-xl font-bold text-slate-900">
            {courseTitle} notebooks
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Download any embedded Python lab as a valid Jupyter Notebook. Each file includes the lesson brief, steps, reflection, and your latest available code.
          </p>
        </div>
        <Badge className="w-fit border-cyan-200 bg-white text-cyan-800">
          {activities.length} notebooks
        </Badge>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="Filter notebooks"
            aria-label={`Filter ${courseTitle} notebooks`}
            className="bg-white pl-9"
          />
        </div>
        <p className="text-xs text-slate-500">
          {notebooks.length} of {activities.length} shown
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 h-24 animate-pulse rounded-xl bg-cyan-100/70" aria-label="Loading notebook status" />
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {notebooks.map(({ activity, code, source }) => (
            <div
              key={activity.id}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900" title={activity.title}>
                  {activity.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  {source}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-cyan-700 text-white hover:bg-cyan-800"
                onClick={() => downloadPythonNotebook(activity, code)}
                aria-label={`Download ${activity.title} notebook`}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                .ipynb
              </Button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && notebooks.length === 0 && (
        <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-600">
          No notebooks match that search. Try a lesson name such as “loops”, “functions”, or “review”.
        </p>
      )}
    </section>
  );
}

export default function PythonNotebookLibrary({ enrollments }: { enrollments: Props[] }) {
  if (enrollments.length === 0) return null;

  return (
    <div className="space-y-6">
      {enrollments.map(enrollment => (
        <PythonNotebookCourse key={enrollment.courseId} {...enrollment} />
      ))}
    </div>
  );
}
