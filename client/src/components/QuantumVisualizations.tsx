import { RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { QuantumVisualizationType } from "@/lib/quantumVisualizations";

type Props = { visualization: QuantumVisualizationType };
type Gate = "H" | "X" | "Z" | "I";

const gateDetails: Array<{ gate: Gate; label: string; description: string; color: string }> = [
  { gate: "H", label: "Hadamard", description: "Creates superposition", color: "#38bdf8" },
  { gate: "X", label: "Pauli-X", description: "Bit flip (NOT)", color: "#a78bfa" },
  { gate: "Z", label: "Pauli-Z", description: "Phase flip", color: "#22d3ee" },
  { gate: "I", label: "Identity", description: "Leaves the state unchanged", color: "#94a3b8" },
];

function VizShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 shadow-xl" aria-label={title}>
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200"><Sparkles className="h-4 w-4" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Interactive visualization</p>
            <h3 className="mt-0.5 text-base font-bold text-white">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-300">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Probability({ label, probability, tone }: { label: string; probability: number; tone: "emerald" | "amber" }) {
  const color = tone === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  const text = tone === "emerald" ? "text-emerald-200" : "text-amber-200";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="font-mono text-[11px] text-slate-300">{label}</p>
      <p className={`mt-1 text-xl font-bold ${text}`}>{(probability * 100).toFixed(1)}%</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
        <div className={`h-full rounded-full transition-[width] duration-300 ${color}`} style={{ width: `${probability * 100}%` }} />
      </div>
    </div>
  );
}

function SuperpositionVisualization() {
  const [theta, setTheta] = useState(45);
  const [measurement, setMeasurement] = useState<0 | 1 | null>(null);
  const radians = (theta * Math.PI) / 180;
  const probabilityZero = Math.cos(radians / 2) ** 2;
  const probabilityOne = Math.sin(radians / 2) ** 2;
  const pointX = 150 + 72 * Math.sin(radians) * Math.cos(Math.PI / 4);
  const pointY = 150 - 72 * Math.cos(radians);

  const measure = () => {
    const result = Math.random() < probabilityZero ? 0 : 1;
    setMeasurement(result);
    setTheta(result === 0 ? 0 : 180);
  };

  return (
    <VizShell title="Interactive Bloch Sphere" subtitle="Adjust the polar angle, then measure the qubit to see a superposition collapse into |0⟩ or |1⟩.">
      <div className="grid gap-5 md:grid-cols-[260px_1fr] md:items-center">
        <svg viewBox="0 0 300 300" role="img" aria-label={`Bloch sphere at ${theta} degrees`} className="mx-auto w-full max-w-[260px] rounded-xl border border-violet-300/20 bg-slate-950">
          <defs>
            <radialGradient id="blochGlow" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" /><stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx="150" cy="150" r="88" fill="url(#blochGlow)" stroke="#a78bfa" strokeOpacity="0.45" strokeWidth="1.5" />
          <ellipse cx="150" cy="150" rx="88" ry="26" fill="none" stroke="#a78bfa" strokeOpacity="0.3" />
          <ellipse cx="150" cy="150" rx="26" ry="88" fill="none" stroke="#38bdf8" strokeOpacity="0.2" />
          <line x1="150" y1="47" x2="150" y2="253" stroke="white" strokeOpacity="0.35" />
          <line x1="47" y1="150" x2="253" y2="150" stroke="white" strokeOpacity="0.25" />
          <text x="150" y="33" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">|0⟩</text>
          <text x="150" y="284" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">|1⟩</text>
          <line x1="150" y1="150" x2={pointX} y2={pointY} stroke={measurement === null ? "#22d3ee" : measurement === 0 ? "#34d399" : "#fbbf24"} strokeWidth="4" strokeLinecap="round" />
          <circle cx={pointX} cy={pointY} r="8" fill={measurement === null ? "#22d3ee" : measurement === 0 ? "#34d399" : "#fbbf24"} />
        </svg>
        <div className="space-y-4">
          <label className="block" htmlFor="bloch-theta">
            <span className="mb-2 block font-mono text-xs text-slate-200">θ (polar angle): {theta}°</span>
            <input id="bloch-theta" type="range" min="0" max="180" value={theta} onChange={(event) => { setTheta(Number(event.target.value)); setMeasurement(null); }} className="w-full accent-cyan-400" />
          </label>
          <div className="grid grid-cols-2 gap-3"><Probability label="P(|0⟩)" probability={probabilityZero} tone="emerald" /><Probability label="P(|1⟩)" probability={probabilityOne} tone="amber" /></div>
          <div aria-live="polite" className={`min-h-11 rounded-xl border px-3 py-2 text-center text-sm font-semibold ${measurement === null ? "border-white/10 bg-white/[0.03] text-slate-300" : measurement === 0 ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-amber-400/40 bg-amber-400/10 text-amber-200"}`}>
            {measurement === null ? "The qubit is in a controllable superposition." : `Measured |${measurement}⟩ — the superposition has collapsed.`}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={measure} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.98]"><Zap className="h-4 w-4" />Measure</button>
            <button type="button" onClick={() => { setTheta(45); setMeasurement(null); }} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10" aria-label="Reset Bloch sphere"><RotateCcw className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </VizShell>
  );
}

function EntanglementVisualization() {
  const [result, setResult] = useState<0 | 1 | null>(null);
  const [trials, setTrials] = useState(0);

  const measure = () => {
    setResult(Math.random() < 0.5 ? 0 : 1);
    setTrials((current) => current + 1);
  };
  const state = result === null ? "⟨ψ⟩" : `|${result}⟩`;

  return (
    <VizShell title="Bell State Entanglement Demo" subtitle="Measure either qubit in the Bell state (|00⟩ + |11⟩)/√2 and observe the perfectly correlated result.">
      <div className="flex flex-col items-center gap-5">
        <div className="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          {["Qubit A", "Qubit B"].map((label, index) => (
            <div key={label} className={index === 0 ? "col-start-1" : "col-start-3"}>
              <p className="mb-2 font-mono text-xs text-slate-300">{label}</p>
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl font-bold transition-all ${result === null ? "border-violet-300/50 bg-violet-400/15 text-violet-100" : result === 0 ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100" : "border-amber-300/60 bg-amber-400/15 text-amber-100"}`}>{state}</div>
              <p className="mt-2 text-xs text-slate-400">{result === null ? "Superposition" : `Measured: ${result}`}</p>
            </div>
          ))}
          <div className="col-start-2 row-start-1 self-center text-center"><div className="text-2xl">🔗</div><p className="mt-1 font-mono text-[10px] font-bold text-violet-200">ENTANGLED</p></div>
        </div>
        <div aria-live="polite" className="w-full rounded-xl border border-violet-300/25 bg-violet-400/10 p-3 text-center">
          <p className="text-xs text-slate-300">Correlation statistics</p>
          <p className="mt-1 text-sm font-bold text-violet-100">{trials === 0 ? "Measure the pair to begin." : `${trials}/${trials} measurements matched (100%)`}</p>
          <p className="mt-1 text-xs text-slate-400">Each individual outcome is random; their correlation is not.</p>
        </div>
        <div className="flex w-full gap-2">
          <button type="button" onClick={measure} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-sky-500 px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.98]"><Zap className="h-4 w-4" />Measure both</button>
          <button type="button" onClick={() => { setResult(null); setTrials(0); }} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10" aria-label="Reset entanglement demo"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
    </VizShell>
  );
}

function GateVisualization() {
  const [amplitudes, setAmplitudes] = useState<[number, number]>([1, 0]);
  const [activeGate, setActiveGate] = useState<Gate | null>(null);
  const [history, setHistory] = useState(["Initial: |0⟩"]);
  const probabilityZero = amplitudes[0] ** 2;
  const probabilityOne = amplitudes[1] ** 2;

  const applyGate = (gate: Gate) => {
    setAmplitudes(([a, b]) => {
      let next: [number, number] = [a, b];
      if (gate === "X") next = [b, a];
      if (gate === "H") next = [(a + b) / Math.sqrt(2), (a - b) / Math.sqrt(2)];
      if (gate === "Z") next = [a, -b];
      const norm = Math.hypot(next[0], next[1]) || 1;
      const normalized: [number, number] = [next[0] / norm, next[1] / norm];
      const label = Math.abs(normalized[0]) > 0.99 ? "|0⟩" : Math.abs(normalized[1]) > 0.99 ? "|1⟩" : `${(normalized[0] ** 2 * 100).toFixed(0)}% |0⟩ + ${(normalized[1] ** 2 * 100).toFixed(0)}% |1⟩`;
      setHistory((current) => [...current.slice(-4), `${gate}: ${label}`]);
      return normalized;
    });
    setActiveGate(gate);
  };

  return (
    <VizShell title="Quantum Gate Simulator" subtitle="Apply reversible quantum gates and watch how they transform a single qubit’s probability amplitudes.">
      <div className="rounded-xl border border-sky-300/25 bg-sky-400/10 p-4 text-center">
        <p className="font-mono text-xs text-slate-300">Current qubit state</p>
        <div className="mt-3 grid grid-cols-2 gap-3"><Probability label="|0⟩" probability={probabilityZero} tone="emerald" /><Probability label="|1⟩" probability={probabilityOne} tone="amber" /></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {gateDetails.map(({ gate, label, description, color }) => (
          <button key={gate} type="button" onClick={() => applyGate(gate)} className="rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 active:translate-y-0" style={{ borderColor: activeGate === gate ? color : "rgba(255,255,255,0.12)", background: activeGate === gate ? `${color}26` : "rgba(255,255,255,0.04)" }}>
            <span className="font-mono text-base font-bold" style={{ color }}>{gate}</span><span className="ml-2 text-xs font-semibold text-white">{label}</span><p className="mt-1 text-xs text-slate-400">{description}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="font-mono text-[11px] uppercase tracking-wide text-slate-400">Gate history</p>
        <div className="mt-2 space-y-1 font-mono text-xs" aria-live="polite">{history.map((item, index) => <p key={`${item}-${index}`} className={index === history.length - 1 ? "text-cyan-200" : "text-slate-400"}>{index === history.length - 1 ? "→ " : "  "}{item}</p>)}</div>
      </div>
      <button type="button" onClick={() => { setAmplitudes([1, 0]); setActiveGate(null); setHistory(["Reset: |0⟩"]); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"><RotateCcw className="h-4 w-4" />Reset to |0⟩</button>
    </VizShell>
  );
}

function groverAmplitudes(target: number, iterations: number) {
  const amplitudes = Array<number>(8).fill(1 / Math.sqrt(8));
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    amplitudes[target] *= -1;
    const mean = amplitudes.reduce((sum, amplitude) => sum + amplitude, 0) / amplitudes.length;
    for (let index = 0; index < amplitudes.length; index += 1) amplitudes[index] = 2 * mean - amplitudes[index];
  }
  return amplitudes;
}

function GroverVisualization() {
  const [target, setTarget] = useState(3);
  const [iteration, setIteration] = useState(0);
  const optimalIterations = 2;
  const amplitudes = useMemo(() => groverAmplitudes(target, iteration), [target, iteration]);
  const probability = amplitudes[target] ** 2;
  const maxAmplitude = Math.max(...amplitudes.map((amplitude) => Math.abs(amplitude)));
  const found = iteration > 0 && Math.abs(amplitudes[target]) === maxAmplitude && probability > 0.8;

  return (
    <VizShell title="Grover’s Algorithm — Amplitude Amplification" subtitle="Choose a target state and step through the oracle plus diffusion process as its measurement probability increases.">
      <label htmlFor="grover-target" className="flex items-center gap-3 text-xs text-slate-200"><span className="shrink-0 font-mono">Target item:</span><input id="grover-target" type="range" min="0" max="7" value={target} onChange={(event) => { setTarget(Number(event.target.value)); setIteration(0); }} className="w-full accent-violet-400" /><span className="w-7 text-center font-mono text-sm font-bold text-violet-200">{target}</span></label>
      <div className="mt-5 flex h-32 items-end gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 pb-4 pt-3" aria-label="Amplitude chart">
        {amplitudes.map((amplitude, index) => {
          const height = Math.max(6, (Math.abs(amplitude) / (2 / Math.sqrt(8))) * 100);
          const isTarget = index === target;
          const isMaximum = iteration > 0 && Math.abs(amplitude) === maxAmplitude;
          return <div className="flex flex-1 flex-col items-center gap-1" key={index}><div className="flex h-24 w-full items-end"><div className="w-full rounded-t transition-[height] duration-500" style={{ height: `${height}%`, opacity: amplitude < 0 ? 0.45 : 1, background: isTarget ? isMaximum ? "linear-gradient(to top, #f59e0b, #fcd34d)" : "linear-gradient(to top, #8b5cf6, #c4b5fd)" : "linear-gradient(to top, #0ea5e9, #7dd3fc)", boxShadow: isTarget && isMaximum ? "0 0 14px #f59e0b" : "none" }} /></div><span className="font-mono text-[10px] text-slate-400">{index}</span></div>;
        })}
      </div>
      <p className="mt-3 text-center font-mono text-xs text-slate-300">Step {iteration}/{optimalIterations} · P(target) = {(probability * 100).toFixed(1)}% {found && <span className="ml-2 font-bold text-amber-200">✓ Target found</span>}</p>
      <div className="mt-4 flex gap-2"><button type="button" onClick={() => setIteration((current) => Math.min(optimalIterations, current + 1))} disabled={iteration >= optimalIterations} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-sky-500 px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"><Search className="h-4 w-4" />{iteration === 0 ? "Start" : iteration >= optimalIterations ? "Done" : "Next iteration"}</button><button type="button" onClick={() => setIteration(0)} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10" aria-label="Reset Grover visualization"><RotateCcw className="h-4 w-4" /></button></div>
    </VizShell>
  );
}

export default function QuantumVisualizations({ visualization }: Props) {
  if (visualization === "superposition") return <SuperpositionVisualization />;
  if (visualization === "entanglement") return <EntanglementVisualization />;
  if (visualization === "gates") return <GateVisualization />;
  return <GroverVisualization />;
}
