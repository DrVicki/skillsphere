import { BarChart3 } from "lucide-react";
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from "recharts";
import { trpc } from "@/lib/trpc";

type Props = { courseId: number };

export default function CAIOProgressChart({ courseId }: Props) {
  const { data, isLoading, isError } = trpc.caioEvidence.learnerProgress.useQuery(courseId);
  if (isError) return null;
  return <section className="mb-8 rounded-2xl border border-[#2A63BF]/20 bg-white p-5 shadow-sm" aria-labelledby="caio-progress-chart-title">
    <div className="flex items-start gap-3"><div className="rounded-lg bg-[#EEF4FF] p-2 text-[#2A63BF]"><BarChart3 className="h-5 w-5" /></div><div><h2 id="caio-progress-chart-title" className="text-xl font-bold text-slate-900">CAIO BootCamp weekly progress</h2><p className="mt-1 text-sm text-slate-600">Your completion across the four-week leadership journey.</p></div></div>
    {isLoading ? <div className="mt-5 h-56 animate-pulse rounded-xl bg-slate-100" aria-label="Loading CAIO progress chart" /> : <div className="mt-5 h-56" role="img" aria-label={`CAIO weekly progress: ${(data?.weeks ?? []).map(week => `${week.title} ${week.percent}%`).join(", ")}`}><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.weeks ?? []} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="#dbe5f2" /><XAxis dataKey="title" tick={{ fontSize: 12 }} /><YAxis domain={[0, 100]} tickFormatter={value => `${value}%`} tick={{ fontSize: 11 }} /><Tooltip formatter={value => [`${value}%`, "Complete"]} /><Bar dataKey="percent" name="Complete" fill="#2A63BF" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>}
  </section>;
}
