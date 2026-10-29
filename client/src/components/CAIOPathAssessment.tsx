import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Check, Clipboard, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type AssessmentQuestion = {
  id: number;
  tag: string;
  title: string;
  sub?: string;
  warning?: string;
  options: readonly string[];
};

const QUESTIONS: readonly AssessmentQuestion[] = [
  { id: 1, tag: "Your current role", title: "How good a launchpad is the job you hold right now?", options: [
    "I'm employed at an organisation of roughly thirty people or more, nobody clearly owns AI there, and I can get a meeting with decision-makers.",
    "I'm employed and could get AI work noticed, but the company is small, or someone half-owns AI already, or decision-makers are a layer away.",
    "I'm employed, but the company is tiny, or hostile to change, or I'm a contractor with no standing.",
    "I'm between jobs, or I'm leaving where I am regardless.",
  ]},
  { id: 2, tag: "Your background", title: "How many years have you spent running things: teams, processes, budgets, projects, clients?", options: [
    "Ten or more years with real management or ownership responsibility.", "Three to ten years.", "Under three years, but I've owned projects or client relationships.", "I haven't run anything yet.",
  ]},
  { id: 3, tag: "Your industry depth", title: "How deep are you in one industry?", options: [
    "Ten or more years in one industry; people inside it already call me for advice.", "Five to ten years in one industry.", "Solid experience, but spread across several industries.", "Early days everywhere.",
  ]},
  { id: 4, tag: "Your network", title: "How many business owners or decision-makers would take your call this week?", sub: "Count actual names, not theoretical reach.", warning: "Commonly inflated. People who once said ‘we should catch up’ do not count as decision-makers who would take a call.", options: ["Ten or more.", "Three to nine.", "One or two.", "None, honestly."] },
  { id: 5, tag: "Your runway", title: "If income stopped, how long could your household run at current spending?", options: ["Twelve months or more.", "Six to twelve months.", "Three to six months.", "Under three months."] },
  { id: 6, tag: "Your risk appetite", title: "Not the adventurous self-image. The truth, at 3am.", sub: "Pick the answer that is true at 3am, not the one you would like to be true.", warning: "Commonly inflated. Score the actual 3am, not the adventurous self-image.", options: ["Variable income doesn't scare me; I've been self-employed before, or I'd genuinely back myself.", "I could handle a lean year if the arithmetic made sense.", "I need predictability right now; people depend on my payslip.", "An unpredictable month would keep me up at night."] },
] as const;

const SCORE_MEANINGS = {
  anchor: "How strong your position is inside employment: a launchpad employer plus the management track record to be taken seriously there.",
  freedom: "Your capacity to earn independently: people who would buy from you, money that buys you time, and a nervous system that can handle the ride.",
  industry: "Outside both totals. It is the multiplier for the fractional and agency paths, and appears as its own condition in the routing rules.",
};

function scoreFor(answer: number | null, index: number, veto = false) {
  if (answer === null) return 0;
  return Math.max(0, 3 - answer - (veto && (index === 3 || index === 5) ? 1 : 0));
}

function ScoreCard({ label, value, max, meaning, formula }: { label: string; value: number; max: number; meaning: string; formula: string }) {
  return <div className="rounded-2xl border border-[#e3b85a]/30 bg-[#050f24]/60 p-5 text-[#f6f1e4]">
    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e3b85a]">{label}</h3>
    <div className="mt-2 font-serif text-5xl font-bold">{value}<small className="ml-1 text-xl font-normal text-[#aab6cf]">/{max}</small></div>
    <p className="text-xs text-[#aab6cf]">{formula}</p>
    <div className="my-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#b98a2c] to-[#f1d493] transition-all duration-700" style={{ width: `${(value / max) * 100}%` }} /></div>
    <p className="text-sm leading-6 text-[#aab6cf]">{meaning}</p>
  </div>;
}

function ScorePlot({ anchor, freedom, industry, vetoAnchor, vetoFreedom }: { anchor: number; freedom: number; industry: number; vetoAnchor?: number; vetoFreedom?: number }) {
  const x = (v: number) => 38 + v * 38;
  const y = (v: number) => 214 - v * 20;
  const r = (v: number) => 8 + v * 3;
  return <div className="rounded-2xl border border-[#e3b85a]/25 bg-[#050f24]/40 p-3">
    <svg viewBox="0 0 300 255" className="h-auto w-full" role="img" aria-label="Chart of Anchor score against Freedom score; dot size shows industry depth">
      {Array.from({ length: 7 }, (_, i) => <g key={`x-${i}`}><line x1={x(i)} y1="14" x2={x(i)} y2="214" stroke="rgba(246,241,228,.1)" /><text x={x(i)} y="229" textAnchor="middle" fill="#aab6cf" fontSize="9">{i}</text></g>)}
      {Array.from({ length: 10 }, (_, i) => <g key={`y-${i}`}><line x1="38" y1={y(i)} x2="266" y2={y(i)} stroke="rgba(246,241,228,.1)" /><text x="30" y={y(i) + 3} textAnchor="end" fill="#aab6cf" fontSize="9">{i}</text></g>)}
      <rect x="38" y="14" width="228" height="200" fill="none" stroke="rgba(227,184,90,.4)" />
      {vetoFreedom !== undefined && <circle cx={x(vetoAnchor ?? anchor)} cy={y(vetoFreedom)} r={r(industry)} fill="none" stroke="#e3b85a" strokeWidth="1.5" strokeDasharray="3 3" />}
      <circle cx={x(anchor)} cy={y(freedom)} r={r(industry)} fill="#e3b85a" fillOpacity=".92" stroke="#fff3cf" strokeWidth="1.5" />
      <circle cx={x(anchor)} cy={y(freedom)} r="2.5" fill="#2a1d02" />
      <text x="152" y="249" textAnchor="middle" fill="#e3b85a" fontSize="10">Anchor score</text>
      <text transform="translate(10 115) rotate(-90)" textAnchor="middle" fill="#e3b85a" fontSize="10">Freedom score</text>
    </svg>
    <p className="text-center text-xs text-[#aab6cf]">Dot size shows industry depth. Dashed ring shows the household-veto result.</p>
  </div>;
}

export default function CAIOPathAssessment() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(6).fill(null));
  const [veto, setVeto] = useState(false);
  const [copied, setCopied] = useState(false);
  const totals = useMemo(() => {
    const score = (index: number, withVeto = false) => scoreFor(answers[index], index, withVeto);
    return { anchor: score(0) + score(1), freedom: score(3) + score(4) + score(5), industry: score(2), vetoFreedom: score(3, true) + score(4, true) + score(5, true) };
  }, [answers]);

  const startOver = () => { setAnswers(Array(6).fill(null)); setVeto(false); setCopied(false); setStep(-1); };
  const copyScores = async () => {
    const text = `CAIO Path Assessment\nAnchor score (Q1 + Q2): ${totals.anchor}/6\nFreedom score (Q4 + Q5 + Q6): ${totals.freedom}/9\nIndustry depth (Q3): ${totals.industry}/3`;
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { setCopied(false); }
  };

  if (step < 0) return <section className="my-10 overflow-hidden rounded-3xl border border-[#e3b85a]/30 bg-[radial-gradient(circle_at_80%_0%,rgba(227,184,90,.14),transparent_45%),#050f24] p-5 text-[#f6f1e4] shadow-xl sm:p-8">
    <div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[0.22em] text-[#e3b85a]">CAIO Path Assessment</span><span className="text-xs text-[#aab6cf]">6 questions</span></div>
    <h3 className="font-serif text-3xl font-bold leading-tight sm:text-5xl">Which path fits your <em className="font-normal text-[#f1d493]">facts</em>, not your hopes?</h3>
    <p className="mt-4 max-w-2xl text-[#aab6cf]">Six questions, graded at the end. You finish with two numbers — Anchor and Freedom — plus a separate reading of your industry depth.</p>
    <div className="mt-7 rounded-2xl border-l-4 border-[#e3b85a] bg-[#112a57]/70 p-5"><h4 className="font-serif text-lg font-bold text-[#f1d493]">One calibration check before you start</h4><p className="mt-2 text-sm leading-6 text-[#aab6cf]">This instrument has a known fault: <strong className="text-[#f6f1e4]">people score their hopes, not their facts.</strong> The two questions most commonly inflated are <strong className="text-[#f6f1e4]">network</strong> and <strong className="text-[#f6f1e4]">risk appetite</strong>.</p><p className="mt-2 text-sm leading-6 text-[#aab6cf]">If you live with someone whose finances are tied to yours, read them your six answers and let them veto the generous ones.</p></div>
    <Button className="mt-7 bg-[#e3b85a] text-[#2a1d02] hover:bg-[#f1d493]" onClick={() => setStep(0)}>Begin the assessment <ArrowRight className="ml-2 h-4 w-4" /></Button>
  </section>;

  if (step < QUESTIONS.length) {
    const question = QUESTIONS[step]; const selected = answers[step];
    return <section className="my-10 overflow-hidden rounded-3xl border border-[#e3b85a]/30 bg-[radial-gradient(circle_at_80%_0%,rgba(227,184,90,.14),transparent_45%),#050f24] p-5 text-[#f6f1e4] shadow-xl sm:p-8">
      <div className="mb-6 flex gap-1.5" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>{QUESTIONS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#b98a2c]" : i === step ? "bg-[#e3b85a]" : "bg-white/15"}`} />)}</div>
      <div className="mb-4 flex items-end gap-3"><span className="font-serif text-6xl font-bold leading-none text-[#e3b85a]">{step + 1}</span><span className="pb-1 text-xs uppercase tracking-[0.18em] text-[#aab6cf]">Question {step + 1} of {QUESTIONS.length} · {question.tag}</span></div>
      <h3 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">{question.title}</h3>{question.sub && <p className="mt-2 text-[#aab6cf]">{question.sub}</p>}
      {question.warning && <div className="mt-4 flex gap-2 rounded-xl border border-[#e57d6e]/40 bg-[#e57d6e]/10 p-3 text-sm text-[#f6c9c2]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{question.warning}</div>}
      <fieldset className="mt-6 space-y-3"><legend className="sr-only">{question.tag}</legend>{question.options.map((option, index) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${selected === index ? "border-[#e3b85a] bg-[#e3b85a]/15" : "border-white/15 bg-[#050f24]/40 hover:border-[#e3b85a]/60"}`}><input className="sr-only" type="radio" name={`caio-q-${question.id}`} checked={selected === index} onChange={() => setAnswers(current => current.map((value, i) => i === step ? index : value))} /><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold ${selected === index ? "border-[#e3b85a] bg-[#e3b85a] text-[#2a1d02]" : "border-[#b98a2c] text-[#e3b85a]"}`}>{String.fromCharCode(65 + index)}</span><span className="pt-1 text-sm leading-6">{option}</span></label>)}</fieldset>
      <div className="mt-7 flex items-center gap-3"><Button variant="outline" className="border-white/30 bg-transparent text-[#f6f1e4] hover:bg-white/10" onClick={() => setStep(step - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><span className="flex-1" /><Button className="bg-[#e3b85a] text-[#2a1d02] hover:bg-[#f1d493]" disabled={selected === null} onClick={() => setStep(step + 1)}>{step === QUESTIONS.length - 1 ? "See my scores" : "Next question"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
    </section>;
  }

  return <section className="my-10 overflow-hidden rounded-3xl border border-[#e3b85a]/30 bg-[radial-gradient(circle_at_80%_0%,rgba(227,184,90,.14),transparent_45%),#050f24] p-5 text-[#f6f1e4] shadow-xl sm:p-8">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-xs uppercase tracking-[0.22em] text-[#e3b85a]">CAIO Path Assessment</span><h3 className="mt-2 font-serif text-4xl font-bold">Your <em className="font-normal text-[#f1d493]">scores</em></h3></div><BarChart3 className="h-9 w-9 text-[#e3b85a]" /></div>
    <p className="mt-3 text-[#aab6cf]">Keep the three numbers together; they are read side by side.</p>
    <div className="mt-7 grid gap-4 md:grid-cols-3"><ScoreCard label="Anchor score" value={totals.anchor} max={6} formula="Question 1 + Question 2" meaning={SCORE_MEANINGS.anchor} /><ScoreCard label="Freedom score" value={totals.freedom} max={9} formula="Question 4 + Question 5 + Question 6" meaning={SCORE_MEANINGS.freedom} /><ScoreCard label="Industry depth" value={totals.industry} max={3} formula="Question 3 · stands alone" meaning={SCORE_MEANINGS.industry} /></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:items-center"><ScorePlot anchor={totals.anchor} freedom={totals.freedom} industry={totals.industry} vetoFreedom={veto ? totals.vetoFreedom : undefined} /><div><label className="flex cursor-pointer gap-3 rounded-2xl border border-dashed border-[#e3b85a]/60 p-4"><Checkbox checked={veto} onCheckedChange={value => setVeto(value === true)} className="mt-1 border-[#e3b85a] data-[state=checked]:bg-[#e3b85a] data-[state=checked]:text-[#2a1d02]" /><span><strong className="block font-serif text-lg text-[#f1d493]">Run the household veto test</strong><span className="text-sm leading-6 text-[#aab6cf]">What if the people who share your finances veto the generous answers? This lowers Network and Risk appetite by one step each.</span></span></label><p className="mt-3 text-sm text-[#f6f1e4]">{veto ? `With the veto applied: Freedom score ${totals.freedom} → ${totals.vetoFreedom}. Anchor stays ${totals.anchor}; Industry depth stays ${totals.industry}.` : "Dot size shows your industry depth."}</p></div></div>
    <div className="mt-8"><h4 className="font-serif text-2xl font-bold">Your answers</h4>{QUESTIONS.map((question, index) => <div key={question.id} className="grid gap-3 border-t border-white/10 py-4 sm:grid-cols-[34px_1fr_auto] sm:items-start"><div className="font-serif text-2xl text-[#e3b85a]">{index + 1}</div><div><b className="text-xs uppercase tracking-[0.14em] text-[#aab6cf]">{question.tag}</b><p className="mt-1 text-sm leading-6">{question.options[answers[index] ?? 0]}</p>{(index === 3 || index === 5) && <span className="mt-1 inline-block rounded-full border border-[#e57d6e]/50 px-2 py-0.5 text-xs text-[#f6c9c2]">Most commonly inflated: check it</span>}</div><div className="font-serif text-2xl text-[#f1d493]">{scoreFor(answers[index], index)}<small className="text-sm text-[#aab6cf]">/3</small></div></div>)}</div>
    <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-[#aab6cf]"><strong className="text-[#f6f1e4]">Next step:</strong> take your Anchor score, Freedom score and Industry depth to the chapter's routing rules. This quiz grades the three numbers; it does not choose your path for you.</div>
    <div className="mt-6 flex flex-wrap gap-3"><Button className="bg-[#e3b85a] text-[#2a1d02] hover:bg-[#f1d493]" onClick={copyScores}><Clipboard className="mr-2 h-4 w-4" />{copied ? "Scores copied" : "Copy my scores"}</Button><Button variant="outline" className="border-white/30 bg-transparent text-[#f6f1e4] hover:bg-white/10" onClick={() => setStep(0)}><ArrowLeft className="mr-2 h-4 w-4" />Change an answer</Button><Button variant="outline" className="border-white/30 bg-transparent text-[#f6f1e4] hover:bg-white/10" onClick={startOver}><RotateCcw className="mr-2 h-4 w-4" />Retake</Button></div>
  </section>;
}
