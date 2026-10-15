import { BrainCircuit, CheckCircle2, Database, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { AIDataAnalyticsVisualizationType } from "@/lib/aiDataAnalyticsVisualizations";

type Props = { visualization: AIDataAnalyticsVisualizationType };

function VizShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-teal-950 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-slate-100 shadow-xl" aria-label={title}>
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-300/10 text-teal-100"><Sparkles className="h-4 w-4" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">Interactive visualization</p>
            <h3 className="mt-0.5 text-base font-bold text-white">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-300">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function MaturityVisualization() {
  const stages = [
    { name: "Descriptive", question: "What happened?", example: "Weekly revenue dashboard", color: "#38bdf8" },
    { name: "Diagnostic", question: "Why did it happen?", example: "Root-cause analysis", color: "#a78bfa" },
    { name: "Predictive", question: "What will happen?", example: "Customer churn forecast", color: "#fbbf24" },
    { name: "Prescriptive", question: "What should we do?", example: "Next-best-action recommendation", color: "#34d399" },
  ];
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];

  return (
    <VizShell title="Analytics Maturity Explorer" subtitle="Move through the four maturity stages to see how AI helps teams progress from reporting to action.">
      <div className="grid gap-3 sm:grid-cols-4">
        {stages.map((item, index) => (
          <button key={item.name} type="button" onClick={() => setSelected(index)} className="rounded-xl border p-3 text-left transition-transform hover:-translate-y-0.5 active:translate-y-0" style={{ borderColor: selected === index ? item.color : "rgba(255,255,255,0.13)", background: selected === index ? `${item.color}22` : "rgba(255,255,255,0.04)" }}>
            <span className="text-xs font-semibold text-slate-300">Stage {index + 1}</span>
            <p className="mt-1 text-sm font-bold" style={{ color: item.color }}>{item.name}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-start gap-3"><BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-teal-200" /><div><p className="font-semibold text-white">{stage.question}</p><p className="mt-1 text-sm text-slate-300">Example: {stage.example}</p><p className="mt-2 text-xs leading-5 text-slate-400">AI has its strongest impact in the predictive and prescriptive stages, while accelerating reporting and diagnosis through automation.</p></div></div>
      </div>
    </VizShell>
  );
}

function DataQualityVisualization() {
  const issues = [
    { id: "missing", label: "Missing values", detail: "Use ML-based imputation when other features carry useful signal.", percent: 23, tone: "#fbbf24" },
    { id: "duplicates", label: "Near-duplicates", detail: "Compare semantic embeddings to catch records that exact matching misses.", percent: 12, tone: "#a78bfa" },
    { id: "outliers", label: "Outliers", detail: "Use isolation methods and domain thresholds before automatic removal.", percent: 8, tone: "#fb7185" },
    { id: "drift", label: "Schema & distribution drift", detail: "Monitor changes continuously so downstream models remain reliable.", percent: 17, tone: "#38bdf8" },
  ];
  const [selected, setSelected] = useState(issues[0].id);
  const active = issues.find((issue) => issue.id === selected) ?? issues[0];

  return (
    <VizShell title="AI Data Quality Triage" subtitle="Explore the issues AI-assisted preparation workflows are designed to surface and address.">
      <div className="space-y-3">
        {issues.map((issue) => (
          <button key={issue.id} type="button" onClick={() => setSelected(issue.id)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-colors hover:bg-white/[0.08]" aria-pressed={selected === issue.id}>
            <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-white">{issue.label}</span><span className="font-mono text-xs" style={{ color: issue.tone }}>{issue.percent}% signal</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${issue.percent}%`, background: issue.tone }} /></div>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-teal-300/20 bg-teal-300/10 p-4"><div className="flex gap-3"><Database className="mt-0.5 h-5 w-5 shrink-0 text-teal-100" /><div><p className="text-sm font-bold text-teal-50">{active.label}</p><p className="mt-1 text-xs leading-5 text-teal-50/80">{active.detail}</p></div></div></div>
    </VizShell>
  );
}

function ChurnRiskVisualization() {
  const [tickets, setTickets] = useState(2);
  const [purchases, setPurchases] = useState(5);
  const [review, setReview] = useState(3);
  const risk = useMemo(() => Math.round(Math.min(96, Math.max(4, tickets * 9 + (12 - purchases) * 5 + (5 - review) * 12))), [tickets, purchases, review]);
  const tier = risk >= 70 ? { label: "Critical", color: "#fb7185", action: "Assign a customer-success intervention within 24 hours." } : risk >= 45 ? { label: "High", color: "#fbbf24", action: "Offer proactive support and a retention incentive." } : { label: "Monitor", color: "#34d399", action: "Keep tracking behavior and sentiment changes." };

  const slider = (id: string, label: string, value: number, min: number, max: number, onChange: (value: number) => void) => (
    <label htmlFor={id} className="block"><span className="mb-1 flex justify-between text-xs text-slate-300"><span>{label}</span><strong className="text-white">{value}</strong></span><input id={id} type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-teal-300" /></label>
  );

  return (
    <VizShell title="Customer Churn Risk Explorer" subtitle="Adjust behavioral signals to see how a predictive model can translate inputs into an intervention tier.">
      <div className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center"><div className="space-y-4">{slider("support-tickets", "Support tickets", tickets, 0, 10, setTickets)}{slider("purchase-count", "Recent purchases", purchases, 0, 12, setPurchases)}{slider("review-score", "Review score", review, 1, 5, setReview)}</div><div className="rounded-2xl border p-5 text-center" style={{ borderColor: `${tier.color}99`, background: `${tier.color}1c` }}><TrendingUp className="mx-auto h-6 w-6" style={{ color: tier.color }} /><p className="mt-2 text-4xl font-bold" style={{ color: tier.color }}>{risk}%</p><p className="mt-1 text-sm font-semibold text-white">{tier.label} risk</p><p className="mt-3 text-xs leading-5 text-slate-300">{tier.action}</p></div></div>
    </VizShell>
  );
}

function NlpVisualization() {
  const reviews = [
    { label: "Shipping", text: "My order arrived late and tracking never updated.", sentiment: "Negative", score: 88, color: "#fb7185" },
    { label: "Product", text: "The product quality is excellent and exactly as described.", sentiment: "Positive", score: 91, color: "#34d399" },
    { label: "Support", text: "Customer support resolved my billing question quickly.", sentiment: "Positive", score: 79, color: "#38bdf8" },
    { label: "Value", text: "It is fine, but the price feels high for what I received.", sentiment: "Mixed", score: 62, color: "#fbbf24" },
  ];
  const [selected, setSelected] = useState(0);
  const review = reviews[selected];

  return (
    <VizShell title="NLP Insight Lens" subtitle="Select a customer comment to inspect the kind of aspect-level sentiment signal an analytics workflow can derive.">
      <div className="grid gap-2 sm:grid-cols-2">{reviews.map((item, index) => <button key={item.label} type="button" onClick={() => setSelected(index)} className="rounded-xl border p-3 text-left transition-colors" style={{ borderColor: selected === index ? item.color : "rgba(255,255,255,.12)", background: selected === index ? `${item.color}20` : "rgba(255,255,255,.04)" }}><p className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</p><p className="mt-1 text-xs text-slate-300 line-clamp-2">{item.text}</p></button>)}</div>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-white">{review.sentiment} sentiment · {review.label}</p><p className="mt-2 text-sm leading-6 text-slate-300">“{review.text}”</p></div><span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold" style={{ color: review.color, background: `${review.color}24` }}>{review.score}% confidence</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${review.score}%`, background: review.color }} /></div></div>
    </VizShell>
  );
}

function FairnessVisualization() {
  const dimensions = [
    { name: "Age group", values: ["18–34", "35–54", "55+"] },
    { name: "Region", values: ["Northeast", "Midwest", "West"] },
  ];
  const [dimensionIndex, setDimensionIndex] = useState(0);
  const [valueIndex, setValueIndex] = useState(0);
  const dimension = dimensions[dimensionIndex];
  const value = dimension.values[valueIndex] ?? dimension.values[0];
  const selectionRate = dimensionIndex === 0 ? [72, 70, 69][valueIndex] : [71, 70, 72][valueIndex];
  const parity = Math.round((selectionRate / 72) * 100);

  return (
    <VizShell title="Fairness Audit Snapshot" subtitle="Review selection-rate parity across a protected-group dimension before deploying an analytics model.">
      <div className="flex flex-wrap gap-2">{dimensions.map((item, index) => <button key={item.name} type="button" onClick={() => { setDimensionIndex(index); setValueIndex(0); }} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${dimensionIndex === index ? "border-teal-200 bg-teal-300/15 text-teal-100" : "border-white/15 bg-white/[.04] text-slate-300 hover:bg-white/[.08]"}`}>{item.name}</button>)}</div>
      <div className="mt-3 flex flex-wrap gap-2">{dimension.values.map((item, index) => <button key={item} type="button" onClick={() => setValueIndex(index)} className={`rounded-full px-3 py-1.5 text-xs ${valueIndex === index ? "bg-white text-slate-950 font-bold" : "bg-white/10 text-slate-200 hover:bg-white/15"}`}>{item}</button>)}</div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-xs text-slate-400">Selection rate · {value}</p><p className="mt-1 text-3xl font-bold text-teal-100">{selectionRate}%</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-teal-300" style={{ width: `${selectionRate}%` }} /></div></div><div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-xs text-slate-400">Parity vs. benchmark</p><p className="mt-1 text-3xl font-bold text-emerald-200">{parity}%</p><p className="mt-3 text-xs leading-5 text-slate-300">Within this illustrative audit, the rate is above the common 80% adverse-impact threshold. Continue monitoring with real deployment data.</p></div></div>
    </VizShell>
  );
}

function CapstoneVisualization() {
  const steps = ["Data exploration & quality assessment", "AI-assisted data cleaning", "Feature engineering & selection", "Churn prediction model", "Customer feedback NLP analysis", "Executive report & governance documentation"];
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const progress = Math.round((completed.size / steps.length) * 100);

  return (
    <VizShell title="Customer Analytics Capstone Studio" subtitle="Use this project tracker alongside the full source brief, tasks, starter code, deliverables, and hints below.">
      <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-white">Project progress</p><p className="mt-1 text-xs text-slate-300">{completed.size} of {steps.length} project steps complete</p></div><div className="text-2xl font-bold text-teal-100">{progress}%</div></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-emerald-300 transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
      <div className="mt-4 space-y-2">{steps.map((step, index) => { const done = completed.has(index); return <button key={step} type="button" onClick={() => setCompleted((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; })} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${done ? "border-emerald-300/35 bg-emerald-300/10" : "border-white/10 bg-white/[.04] hover:bg-white/[.08]"}`} aria-pressed={done}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${done ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-white/20 text-slate-300"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span><span className={`text-sm ${done ? "text-emerald-100 line-through" : "text-slate-100"}`}>{step}</span></button>; })}</div>
      <button type="button" onClick={() => setCompleted(new Set())} className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-100 hover:text-white"><RotateCcw className="h-3.5 w-3.5" />Reset project tracker</button>
    </VizShell>
  );
}

export default function AIDataAnalyticsVisualizations({ visualization }: Props) {
  if (visualization === "maturity") return <MaturityVisualization />;
  if (visualization === "data-quality") return <DataQualityVisualization />;
  if (visualization === "churn-risk") return <ChurnRiskVisualization />;
  if (visualization === "nlp-insights") return <NlpVisualization />;
  if (visualization === "fairness-audit") return <FairnessVisualization />;
  return <CapstoneVisualization />;
}
