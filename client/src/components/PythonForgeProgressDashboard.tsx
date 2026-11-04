import { useMemo, useState } from "react";
import { CheckCircle2, Code2, Clock3, Filter, Target } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Props {
  courseId: number;
}

export default function PythonForgeProgressDashboard({ courseId }: Props) {
  const { data: labs, isLoading, isError } = trpc.pythonForgeLab.progress.useQuery(courseId, {
    enabled: courseId > 0,
  });
  const [filter, setFilter] = useState("");

  const filteredLabs = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return labs ?? [];
    return (labs ?? []).filter(lab => lab.title.toLowerCase().includes(query));
  }, [filter, labs]);

  const completed = labs?.filter(lab => !!lab.codeUpdatedAt).length ?? 0;
  const total = labs?.length ?? 0;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const nextLab = labs?.find(lab => !lab.codeUpdatedAt);

  return (
    <section className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm" aria-labelledby="python-forge-progress-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <Code2 className="h-5 w-5" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.15em]">Python Forge lab progress</p>
          </div>
          <h2 id="python-forge-progress-title" className="mt-1 text-xl font-bold text-slate-900">Build your coding portfolio</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">Your code saves automatically as you work. Return to any lesson to continue from your latest saved version.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm" aria-label={`${completed} of ${total} labs saved`}>
          <Target className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {completed}/{total || 42} labs saved
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 h-16 animate-pulse rounded-xl bg-slate-200/70" aria-label="Loading lab progress" />
      ) : isError ? (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Lab progress will appear after your enrollment is refreshed.</p>
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Overall lab coverage</span>
            <span className="font-bold text-emerald-700">{percent}%</span>
          </div>
          <Progress value={percent} className="mt-2 h-3 bg-emerald-100 [&>div]:bg-emerald-600" />
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-teal-600" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next recommended lab</p>
                <p className="text-sm font-semibold text-slate-900">{nextLab?.title ?? "All labs have saved code"}</p>
              </div>
            </div>
            <Badge className={nextLab ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}>
              {nextLab ? "Continue building" : "Portfolio in progress"}
            </Badge>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <Input value={filter} onChange={event => setFilter(event.target.value)} placeholder="Filter lessons" aria-label="Filter Python Forge lab lessons" className="max-w-sm bg-white" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLabs.slice(0, 9).map(lab => (
              <div key={lab.moduleId} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                {lab.codeUpdatedAt ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Saved" /> : <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" aria-label="Not started" />}
                <span className="truncate text-xs font-medium text-slate-700">{lab.title}</span>
              </div>
            ))}
          </div>
          {filteredLabs.length > 9 && <p className="mt-3 text-xs text-slate-500">Showing 9 of {filteredLabs.length} matching lessons. Open the course to work through the full lab list.</p>}
        </>
      )}
    </section>
  );
}
