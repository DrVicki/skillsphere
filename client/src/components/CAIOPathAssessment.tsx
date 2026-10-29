import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Clipboard, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";

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
  return <div className="rounded-2xl border-2 border-[#f1d493] bg-[#0b1d3f] p-5 text-[#ffffff] shadow-lg">
    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e3b85a]">{label}</h3>
    <div className="mt-2 font-serif text-5xl font-bold text-white">{value}<small className="ml-1 text-xl font-normal text-[#e5edf8]">/{max}</small></div>
    <p className="text-xs font-medium text-[#e5edf8]">{formula}</p>
    <div className="my-3 h-2.5 overflow-hidden rounded-full bg-[#405477]"><div className="h-full rounded-full bg-[#ffd76a] transition-all duration-700" style={{ width: `${(value / max) * 100}%` }} /></div>
    <p className="text-sm leading-6 text-[#f0f5fc]">{meaning}</p>
  </div>;
}

function ScorePlot({ anchor, freedom, industry, vetoAnchor, vetoFreedom }: { anchor: number; freedom: number; industry: number; vetoAnchor?: number; vetoFreedom?: number }) {
  const x = (v: number) => 38 + v * 38;
  const y = (v: number) => 214 - v * 20;
  const r = (v: number) => 8 + v * 3;
  return <div className="rounded-2xl border-2 border-[#f1d493] bg-[#0b1d3f] p-3 shadow-lg">
    <svg viewBox="0 0 300 255" className="h-auto w-full" role="img" aria-label="Chart of Anchor score against Freedom score; dot size shows industry depth">
      {Array.from({ length: 7 }, (_, i) => <g key={`x-${i}`}><line x1={x(i)} y1="14" x2={x(i)} y2="214" stroke="#486184" strokeWidth="1" /><text x={x(i)} y="229" textAnchor="middle" fill="#e5edf8" fontSize="10">{i}</text></g>)}
      {Array.from({ length: 10 }, (_, i) => <g key={`y-${i}`}><line x1="38" y1={y(i)} x2="266" y2={y(i)} stroke="#486184" strokeWidth="1" /><text x="30" y={y(i) + 3} textAnchor="end" fill="#e5edf8" fontSize="10">{i}</text></g>)}
      <rect x="38" y="14" width="228" height="200" fill="none" stroke="#f1d493" strokeWidth="1.5" />
      {vetoFreedom !== undefined && <circle cx={x(vetoAnchor ?? anchor)} cy={y(vetoFreedom)} r={r(industry)} fill="none" stroke="#e3b85a" strokeWidth="1.5" strokeDasharray="3 3" />}
      <circle cx={x(anchor)} cy={y(freedom)} r={r(industry)} fill="#e3b85a" fillOpacity=".92" stroke="#fff3cf" strokeWidth="1.5" />
      <circle cx={x(anchor)} cy={y(freedom)} r="2.5" fill="#2a1d02" />
      <text x="152" y="249" textAnchor="middle" fill="#e3b85a" fontSize="10">Anchor score</text>
      <text transform="translate(10 115) rotate(-90)" textAnchor="middle" fill="#e3b85a" fontSize="10">Freedom score</text>
    </svg>
    <p className="text-center text-xs font-medium text-[#e5edf8]">Dot size shows industry depth. Dashed ring shows the household-veto result.</p>
  </div>;
}

type CAIOPathAssessmentProps = {
  courseId: number;
  moduleId: number;
  learnerName?: string;
  canPersist?: boolean;
};

export default function CAIOPathAssessment({ courseId, moduleId, learnerName = "Learner", canPersist = false }: CAIOPathAssessmentProps) {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(6).fill(null));
  const [veto, setVeto] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);
  const [hydratedSavedAttempt, setHydratedSavedAttempt] = useState(false);
  const utils = trpc.useUtils();
  const { data: savedResult } = trpc.caioAssessment.latest.useQuery(
    { courseId, moduleId },
    { enabled: canPersist }
  );
  const saveResult = trpc.caioAssessment.save.useMutation({
    onSuccess: () => {
      setHasSavedAttempt(true);
      void utils.caioAssessment.latest.invalidate({ courseId, moduleId });
    },
  });

  useEffect(() => {
    if (!savedResult || hydratedSavedAttempt) return;
    const storedAnswers = Array.isArray(savedResult.answers)
      ? savedResult.answers.map(value => typeof value === "number" ? value : null).slice(0, 6)
      : [];
    if (storedAnswers.length === 6) {
      setAnswers(storedAnswers);
      setVeto(savedResult.householdVeto);
      setStep(QUESTIONS.length);
      setHasSavedAttempt(true);
    }
    setHydratedSavedAttempt(true);
  }, [savedResult, hydratedSavedAttempt]);

  const totals = useMemo(() => {
    const score = (index: number, withVeto = false) => scoreFor(answers[index], index, withVeto);
    return { anchor: score(0) + score(1), freedom: score(3) + score(4) + score(5), industry: score(2), vetoFreedom: score(3, true) + score(4, true) + score(5, true) };
  }, [answers]);

  const startOver = () => { setAnswers(Array(6).fill(null)); setVeto(false); setCopied(false); setHasSavedAttempt(false); setHydratedSavedAttempt(true); setStep(-1); };
  const copyScores = async () => {
    const text = `CAIO Path Assessment\nAnchor score (Q1 + Q2): ${totals.anchor}/6\nFreedom score (Q4 + Q5 + Q6): ${totals.freedom}/9\nIndustry depth (Q3): ${totals.industry}/3`;
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { setCopied(false); }
  };

  useEffect(() => {
    if (step !== QUESTIONS.length || !canPersist || hasSavedAttempt || saveResult.isPending) return;
    if (answers.some(answer => answer === null)) return;
    saveResult.mutate({
      courseId,
      moduleId,
      answers: answers as number[],
      householdVeto: veto,
    });
  }, [step, canPersist, hasSavedAttempt, answers, veto, courseId, moduleId]);

  const downloadReport = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const left = 52;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 54;
    const addWrapped = (text: string, size = 10, color: [number, number, number] = [55, 65, 85]) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, pageWidth - left * 2);
      if (y + lines.length * (size + 5) > 735) { doc.addPage(); y = 54; }
      doc.text(lines, left, y);
      y += lines.length * (size + 5) + 8;
    };
    doc.setFillColor(5, 15, 36); doc.rect(0, 0, pageWidth, 92, "F");
    doc.setFontSize(11); doc.setTextColor(227, 184, 90); doc.text("SKILLSPHERE · CAIO BOOTCAMP", left, 34);
    doc.setFontSize(22); doc.setTextColor(246, 241, 228); doc.text("CAIO Path Assessment Results", left, 68);
    y = 125;
    addWrapped(`Learner: ${learnerName}`, 11, [5, 15, 36]);
    addWrapped(`Completed: ${new Date().toLocaleString()}`, 9, [105, 116, 140]);
    addWrapped(`Anchor score: ${totals.anchor}/6 · Freedom score: ${totals.freedom}/9 · Industry depth: ${totals.industry}/3`, 13, [185, 138, 44]);
    addWrapped("Anchor measures the strength of your position inside employment. Freedom measures your capacity to earn independently. Industry depth stands alone and acts as a multiplier for fractional and agency paths.");
    if (veto) addWrapped(`Household veto test: Freedom ${totals.freedom}/9 → ${totals.vetoFreedom}/9. Anchor remains ${totals.anchor}/6; industry depth remains ${totals.industry}/3.`, 10, [145, 75, 65]);
    addWrapped("Answer review", 16, [5, 15, 36]);
    QUESTIONS.forEach((question, index) => {
      addWrapped(`${index + 1}. ${question.tag} — ${question.options[answers[index] ?? 0]} (${scoreFor(answers[index], index)}/3)`);
    });
    addWrapped("Next step: take your three scores to the chapter's routing rules. This assessment grades the numbers; it does not choose your path for you.", 10, [105, 116, 140]);
    doc.save("caio-path-assessment-results.pdf");
  };

  if (step < 0) return <section className="my-10 overflow-hidden rounded-3xl border-2 border-[#f1d493] bg-[#071631] p-5 text-[#ffffff] shadow-xl sm:p-8">
    <div className="mb-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[0.22em] text-[#ffd76a]">CAIO Path Assessment</span><span className="text-xs font-medium text-[#e5edf8]">6 questions</span></div>
    <h3 className="font-serif text-3xl font-bold leading-tight sm:text-5xl">Which path fits your <em className="font-normal text-[#f1d493]">facts</em>, not your hopes?</h3>
    <p className="mt-4 max-w-2xl text-[#e5edf8]">Six questions, graded at the end. You finish with two numbers — Anchor and Freedom — plus a separate reading of your industry depth.</p>
    <div className="mt-7 rounded-2xl border-l-4 border-[#ffd76a] bg-[#102a57] p-5"><h4 className="font-serif text-lg font-bold text-[#ffd76a]">One calibration check before you start</h4><p className="mt-2 text-sm leading-6 text-[#f0f5fc]">This instrument has a known fault: <strong className="text-white">people score their hopes, not their facts.</strong> The two questions most commonly inflated are <strong className="text-white">network</strong> and <strong className="text-white">risk appetite</strong>.</p><p className="mt-2 text-sm leading-6 text-[#f0f5fc]">If you live with someone whose finances are tied to yours, read them your six answers and let them veto the generous ones.</p></div>
    <Button className="mt-7 bg-[#e3b85a] text-[#2a1d02] hover:bg-[#f1d493]" onClick={() => setStep(0)}>Begin the assessment <ArrowRight className="ml-2 h-4 w-4" /></Button>
  </section>;

  if (step < QUESTIONS.length) {
    const question = QUESTIONS[step]; const selected = answers[step];
    return <section className="my-10 overflow-hidden rounded-3xl border-2 border-[#f1d493] bg-[#071631] p-5 text-[#ffffff] shadow-xl sm:p-8">
      <div className="mb-6 flex gap-1.5" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>{QUESTIONS.map((_, i) => <div key={i} className={`h-2 flex-1 rounded-full ${i < step ? "bg-[#ffd76a]" : i === step ? "bg-white" : "bg-[#405477]"}`} />)}</div>
      <div className="mb-4 flex items-end gap-3"><span className="font-serif text-6xl font-bold leading-none text-[#ffd76a]">{step + 1}</span><span className="pb-1 text-xs uppercase tracking-[0.18em] text-[#e5edf8]">Question {step + 1} of {QUESTIONS.length} · {question.tag}</span></div>
      <h3 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">{question.title}</h3>{question.sub && <p className="mt-2 text-[#e5edf8]">{question.sub}</p>}
      {question.warning && <div className="mt-4 flex gap-2 rounded-xl border-2 border-[#ffb4a8] bg-[#5a2027] p-3 text-sm text-white"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{question.warning}</div>}
      <fieldset className="mt-6 space-y-3"><legend className="sr-only">{question.tag}</legend>{question.options.map((option, index) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition focus-within:ring-2 focus-within:ring-[#ffd76a] ${selected === index ? "border-[#ffd76a] bg-[#214777]" : "border-[#6f87aa] bg-[#102a57] hover:border-[#ffd76a]"}`}><input className="sr-only" type="radio" name={`caio-q-${question.id}`} checked={selected === index} onChange={() => setAnswers(current => current.map((value, i) => i === step ? index : value))} /><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold ${selected === index ? "border-[#ffd76a] bg-[#ffd76a] text-[#071631]" : "border-[#ffd76a] text-[#ffd76a]"}`}>{String.fromCharCode(65 + index)}</span><span className="pt-1 text-sm leading-6 text-white">{option}</span></label>)}</fieldset>
      <div className="mt-7 flex items-center gap-3"><Button variant="outline" className="border-white/30 bg-transparent text-[#f6f1e4] hover:bg-white/10" onClick={() => setStep(step - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><span className="flex-1" /><Button className="bg-[#e3b85a] text-[#2a1d02] hover:bg-[#f1d493]" disabled={selected === null} onClick={() => setStep(step + 1)}>{step === QUESTIONS.length - 1 ? "See my scores" : "Next question"}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
    </section>;
  }

  return <section className="my-10 overflow-hidden rounded-3xl border-2 border-[#f1d493] bg-[#071631] p-5 text-white shadow-xl sm:p-8">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-xs uppercase tracking-[0.22em] text-[#ffd76a]">CAIO Path Assessment</span><h3 className="mt-2 font-serif text-4xl font-bold">Your <em className="font-normal text-[#ffd76a]">scores</em></h3></div><BarChart3 className="h-9 w-9 text-[#ffd76a]" /></div>
    <p className="mt-3 text-[#e5edf8]">Keep the three numbers together; they are read side by side.</p>
    <div className="mt-7 grid gap-4 md:grid-cols-3"><ScoreCard label="Anchor score" value={totals.anchor} max={6} formula="Question 1 + Question 2" meaning={SCORE_MEANINGS.anchor} /><ScoreCard label="Freedom score" value={totals.freedom} max={9} formula="Question 4 + Question 5 + Question 6" meaning={SCORE_MEANINGS.freedom} /><ScoreCard label="Industry depth" value={totals.industry} max={3} formula="Question 3 · stands alone" meaning={SCORE_MEANINGS.industry} /></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:items-center"><ScorePlot anchor={totals.anchor} freedom={totals.freedom} industry={totals.industry} vetoFreedom={veto ? totals.vetoFreedom : undefined} /><div><label className="flex cursor-pointer gap-3 rounded-2xl border-2 border-dashed border-[#ffd76a] bg-[#102a57] p-4 focus-within:ring-2 focus-within:ring-white"><Checkbox checked={veto} onCheckedChange={value => { setVeto(value === true); setHasSavedAttempt(false); }} className="mt-1 h-5 w-5 border-2 border-[#ffd76a] data-[state=checked]:bg-[#ffd76a] data-[state=checked]:text-[#071631]" /><span><strong className="block font-serif text-lg text-[#ffd76a]">Run the household veto test</strong><span className="text-sm leading-6 text-[#f0f5fc]">What if the people who share your finances veto the generous answers? This lowers Network and Risk appetite by one step each.</span></span></label><p className="mt-3 text-sm text-white">{veto ? `With the veto applied: Freedom score ${totals.freedom} → ${totals.vetoFreedom}. Anchor stays ${totals.anchor}; Industry depth stays ${totals.industry}.` : "Dot size shows your industry depth."}</p></div></div>
    <div className="mt-8"><h4 className="font-serif text-2xl font-bold text-white">Your answers</h4>{QUESTIONS.map((question, index) => <div key={question.id} className="grid gap-3 border-t-2 border-[#486184] py-4 sm:grid-cols-[34px_1fr_auto] sm:items-start"><div className="font-serif text-2xl text-[#ffd76a]">{index + 1}</div><div><b className="text-xs uppercase tracking-[0.14em] text-[#e5edf8]">{question.tag}</b><p className="mt-1 text-sm leading-6 text-white">{question.options[answers[index] ?? 0]}</p>{(index === 3 || index === 5) && <span className="mt-1 inline-block rounded-full border-2 border-[#ffb4a8] bg-[#5a2027] px-2 py-0.5 text-xs font-medium text-white">Most commonly inflated: check it</span>}</div><div className="font-serif text-2xl text-[#ffd76a]">{scoreFor(answers[index], index)}<small className="text-sm text-[#e5edf8]">/3</small></div></div>)}</div>
    <div className="mt-5 rounded-2xl border border-[#6f87aa] bg-[#102a57] p-4 text-sm leading-6 text-[#f0f5fc]"><strong className="text-white">Next step:</strong> take your Anchor score, Freedom score and Industry depth to the chapter's routing rules. This quiz grades the three numbers; it does not choose your path for you.</div>
    <div className="mt-6 flex flex-wrap gap-3"><Button className="bg-[#ffd76a] font-semibold text-[#071631] hover:bg-[#fff0a8]" onClick={copyScores}><Clipboard className="mr-2 h-4 w-4" />{copied ? "Scores copied" : "Copy my scores"}</Button><Button variant="outline" className="border-2 border-[#e5edf8] bg-transparent text-white hover:bg-[#214777]" onClick={downloadReport}><Download className="mr-2 h-4 w-4" />Download PDF report</Button><Button variant="outline" className="border-2 border-[#e5edf8] bg-transparent text-white hover:bg-[#214777]" onClick={() => { setHasSavedAttempt(false); setStep(0); }}><ArrowLeft className="mr-2 h-4 w-4" />Change an answer</Button><Button variant="outline" className="border-2 border-[#e5edf8] bg-transparent text-white hover:bg-[#214777]" onClick={startOver}><RotateCcw className="mr-2 h-4 w-4" />Retake</Button></div>
    {canPersist && <p className="mt-3 text-xs font-medium text-[#e5edf8]" role="status">{saveResult.isPending ? "Saving your assessment results…" : hasSavedAttempt ? "Your latest assessment results are saved to your learner progress." : "Complete the assessment to save your results."}</p>}
  </section>;
}
