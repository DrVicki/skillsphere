import { BarChart3, Users, Target, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

function average(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

export default function CAIOAssessmentAnalyticsPanel({ courseId, moduleId }: { courseId: number; moduleId: number }) {
  const { data, isLoading, isError } = trpc.caioAssessment.analytics.useQuery({ courseId, moduleId });

  return <section className="rounded-xl border border-border bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-foreground"><BarChart3 className="h-5 w-5 text-primary" /> CAIO Path Assessment Analytics</h3>
        <p className="mt-1 text-sm text-muted-foreground">Instructor view of saved Week 2 assessment attempts. Individual responses are shown only in the recent-attempt table.</p>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Week 2 · Proof Ladder</span>
    </div>
    {isLoading && <div className="mt-6 h-28 animate-pulse rounded-lg bg-muted" aria-label="Loading assessment analytics" />}
    {isError && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">Assessment analytics could not be loaded. Confirm that you are the course instructor or an administrator.</p>}
    {data && <>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
        <div className="rounded-lg border border-border p-4"><Users className="h-4 w-4 text-blue-600" /><p className="mt-2 text-2xl font-bold">{data.uniqueLearners}<small className="text-sm font-normal text-muted-foreground">/{data.enrolledLearners}</small></p><p className="text-xs text-muted-foreground">Learners completed</p></div>
        <div className="rounded-lg border border-border p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completion</p><p className="mt-2 text-2xl font-bold">{data.completionRate}%</p><p className="text-xs text-muted-foreground">Of enrolled learners</p></div>
        <div className="rounded-lg border border-border p-4"><Target className="h-4 w-4 text-amber-600" /><p className="mt-2 text-2xl font-bold">{data.totalAttempts}</p><p className="text-xs text-muted-foreground">Total attempts</p></div>
        <div className="rounded-lg border border-border p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Anchor</p><p className="mt-2 text-2xl font-bold">{average(data.averageAnchor)}<small className="text-sm font-normal text-muted-foreground">/6</small></p></div>
        <div className="rounded-lg border border-border p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Freedom</p><p className="mt-2 text-2xl font-bold">{average(data.averageFreedom)}<small className="text-sm font-normal text-muted-foreground">/9</small></p></div>
        <div className="rounded-lg border border-border p-4"><ShieldCheck className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-2xl font-bold">{average(data.averageIndustry)}<small className="text-sm font-normal text-muted-foreground">/3</small></p><p className="text-xs text-muted-foreground">Avg industry depth</p></div>
      </div>
      {data.recent.length > 0 ? <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Recent CAIO Path Assessment learner results</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Learner</th><th className="px-4 py-3">Anchor</th><th className="px-4 py-3">Freedom</th><th className="px-4 py-3">Industry</th><th className="px-4 py-3">Household veto</th><th className="px-4 py-3">Completed</th></tr></thead>
          <tbody className="divide-y divide-border">{data.recent.map(result => <tr key={result.id}><td className="px-4 py-3"><p className="font-medium text-foreground">{result.learnerName ?? "Learner"}</p><p className="text-xs text-muted-foreground">{result.learnerEmail ?? "No email"}</p></td><td className="px-4 py-3 font-semibold">{result.anchorScore}/6</td><td className="px-4 py-3 font-semibold">{result.freedomScore}/9</td><td className="px-4 py-3 font-semibold">{result.industryDepth}/3</td><td className="px-4 py-3">{result.householdVeto ? "Applied" : "Not applied"}</td><td className="px-4 py-3 text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div> : <div className="mt-6 rounded-lg bg-muted/30 p-8 text-center text-sm text-muted-foreground">No saved assessment results yet. Learner results will appear here after they complete the assessment.</div>}
    </>}
  </section>;
}
