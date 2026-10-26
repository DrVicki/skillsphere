import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  GameDesignActivity,
  GameDesignKnowledgeQuestion,
  GameDesignVisualizationKey,
} from "@/lib/gameDesignCourse";

interface GameDesignActivityCardProps {
  activity: GameDesignActivity;
  onWriteDiary?: () => void;
}

export function GameDesignActivityCard({
  activity,
  onWriteDiary,
}: GameDesignActivityCardProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const progress = Math.round((completedSteps.length / activity.steps.length) * 100);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(current =>
      current.includes(stepIndex)
        ? current.filter(index => index !== stepIndex)
        : [...current, stepIndex].sort((a, b) => a - b)
    );
  };

  const reset = () => setCompletedSteps([]);

  return (
    <Card className="mt-6 overflow-hidden border-[#2A63BF]/20 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-[#EEF4FF] to-[#FFFBF0] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#2A63BF] p-2 text-white" aria-hidden="true">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <Badge variant="outline" className="mb-2 border-[#2A63BF]/30 text-[#2A63BF]">
                Hands-on activity
              </Badge>
              <CardTitle className="text-lg text-[#1e3a6e]">{activity.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Check off each move as you build evidence for your Game Diary.
              </p>
            </div>
          </div>
          <div className="min-w-28 text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {completedSteps.length}/{activity.steps.length} complete
            </div>
            <Progress value={progress} className="mt-2 h-2" aria-label={`${progress}% of activity complete`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <ol className="space-y-3">
          {activity.steps.map((step, index) => {
            const done = completedSteps.includes(index);
            return (
              <li key={step}>
                <button
                  type="button"
                  onClick={() => toggleStep(index)}
                  aria-pressed={done}
                  className="flex w-full items-start gap-3 rounded-xl border border-border/70 p-3 text-left transition-colors hover:border-[#2A63BF]/40 hover:bg-[#EEF4FF]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF]"
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${done ? "border-green-600 bg-green-600 text-white" : "border-[#2A63BF]/40 text-[#2A63BF]"}`}
                    aria-hidden="true"
                  >
                    {done ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={done ? "text-sm leading-6 text-muted-foreground line-through" : "text-sm leading-6 text-foreground"}>
                    {step}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="rounded-xl border border-[#F5B942]/40 bg-[#FFF8E7] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7a5a00]">Evidence to keep</p>
          <p className="mt-1 text-sm leading-6 text-[#4b5563]">{activity.deliverable}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={reset} disabled={completedSteps.length === 0}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset steps
          </Button>
          {onWriteDiary && (
            <Button type="button" size="sm" className="bg-[#2A63BF] text-white hover:bg-[#1e4fa3]" onClick={onWriteDiary}>
              Write this into your Diary <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function GameDesignKnowledgeCheck({
  questions,
}: {
  questions: readonly GameDesignKnowledgeQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = questions.reduce(
    (total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0),
    0
  );

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  return (
    <Card className="mt-6 border-[#3fb950]/30 shadow-sm">
      <CardHeader className="bg-[#F0FFF3] pb-4">
        <Badge variant="outline" className="mb-2 w-fit border-[#3fb950]/40 text-[#207a35]">
          Knowledge check
        </Badge>
        <CardTitle className="text-lg text-[#1b5e2a]">Pause, retrieve, apply</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">Use this two-question check to connect the reading to your next design decision.</p>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {questions.map((question, questionIndex) => {
          const answer = answers[questionIndex];
          const correct = answer === question.correctIndex;
          return (
            <fieldset key={question.question} className="space-y-3">
              <legend className="text-sm font-semibold leading-6 text-foreground">
                {questionIndex + 1}. {question.question}
              </legend>
              <div className="grid gap-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${answer === optionIndex ? "border-[#2A63BF] bg-[#EEF4FF]" : "border-border hover:bg-muted/50"}`}
                  >
                    <input
                      type="radio"
                      name={`game-design-check-${questionIndex}`}
                      checked={answer === optionIndex}
                      onChange={() => { setAnswers(current => ({ ...current, [questionIndex]: optionIndex })); setChecked(false); }}
                      className="mt-0.5 accent-[#2A63BF]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {checked && (
                <p className={`rounded-lg p-3 text-sm leading-6 ${correct ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
                  {correct ? "Correct. " : "Not quite. "}{question.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" className="bg-[#207a35] text-white hover:bg-[#176326]" onClick={() => setChecked(true)} disabled={Object.keys(answers).length < questions.length}>
            Check answers
          </Button>
          {checked && <span className="text-sm font-semibold text-[#1b5e2a]">Score: {score}/{questions.length}</span>}
          {checked && <Button type="button" variant="ghost" size="sm" onClick={reset}><RotateCcw className="mr-1.5 h-4 w-4" /> Try again</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

const VISUALIZATION_COPY: Record<GameDesignVisualizationKey, { label: string; prompt: string; dimensions: string[] }> = {
  "territory-map": { label: "Design territory map", prompt: "Place your question at the intersection of craft, culture, and player experience.", dimensions: ["Craft", "Culture", "Experience"] },
  "rule-loop": { label: "Rules → agency loop", prompt: "Trace how a rule creates a choice, a consequence, and a new possibility.", dimensions: ["Rule", "Choice", "Consequence", "Possibility"] },
  "community-map": { label: "Play community map", prompt: "Surface the roles and rituals that shape participation around a game.", dimensions: ["Players", "Rituals", "Norms", "Care"] },
  mda: { label: "MDA lens", prompt: "Move from mechanics to dynamics to the aesthetic experience you want players to feel.", dimensions: ["Mechanics", "Dynamics", "Aesthetics"] },
  "interaction-loop": { label: "Interaction loop", prompt: "Tune the loop between player input, system response, feedback, and the next decision.", dimensions: ["Input", "Response", "Feedback", "Decision"] },
  "emergence-sandbox": { label: "Emergence sandbox", prompt: "Combine simple rules and watch for complex behavior that was not scripted.", dimensions: ["Rules", "Freedom", "Interaction", "Emergence"] },
  "choice-chance": { label: "Choice and chance balance", prompt: "Adjust agency and uncertainty to find the tension your mechanic needs.", dimensions: ["Agency", "Uncertainty", "Risk", "Fairness"] },
  "ideation-matrix": { label: "Concept selection matrix", prompt: "Compare concepts by novelty, player value, and feasibility before choosing a test.", dimensions: ["Novelty", "Value", "Feasibility"] },
  "prototype-fidelity": { label: "Prototype fidelity ladder", prompt: "Choose the lowest-fidelity artifact that can answer your current design question.", dimensions: ["Paper", "Tabletop", "Clickable", "Digital"] },
  "playtest-loop": { label: "Playtest iteration loop", prompt: "Turn observation into a prioritized change and run the loop again.", dimensions: ["Question", "Observe", "Interpret", "Change"] },
  "usability-check": { label: "Usability check", prompt: "Audit how the design teaches, signals, and supports a first-time player.", dimensions: ["Learnability", "Legibility", "Feedback", "Flow"] },
  "responsibility-lens": { label: "Responsibility lens", prompt: "Make impact, evidence, affected perspectives, and mitigation visible in the design decision.", dimensions: ["Impact", "Evidence", "Perspective", "Mitigation"] },
  "accessibility-audit": { label: "Accessibility audit", prompt: "Switch between access needs and turn each barrier into an actionable acceptance criterion.", dimensions: ["Visual", "Audio", "Motor", "Cognitive"] },
  "team-workflow": { label: "Team prototype workflow", prompt: "Move a design decision through roles, handoffs, review, and a shared definition of done.", dimensions: ["Design", "Build", "Review", "Playtest"] },
  "development-cadence": { label: "Development cadence", prompt: "Set a repeatable rhythm for planning, making, reviewing, and documenting decisions.", dimensions: ["Plan", "Build", "Review", "Record"] },
  "game-feel": { label: "Game-feel scorecard", prompt: "Tune responsiveness and feedback so every input communicates clearly to the player.", dimensions: ["Input", "Motion", "Sound", "Impact"] },
  "scope-matrix": { label: "Scope matrix", prompt: "Compare player impact with effort and protect the smallest viable game.", dimensions: ["Core", "Support", "Risk", "Later"] },
  "black-box": { label: "Black-box explainer", prompt: "Open one hidden system by naming inputs, outputs, assumptions, and failure cases.", dimensions: ["Inputs", "Process", "Outputs", "Failure"] },
  "pitch-builder": { label: "Pitch builder", prompt: "Sequence promise, proof, playable slice, and next step for your audience.", dimensions: ["Promise", "Proof", "Slice", "Ask"] },
  "business-model": { label: "Business model canvas", prompt: "Align audience value, discovery, sustainability, and player trust.", dimensions: ["Audience", "Value", "Model", "Trust"] },
  "industry-map": { label: "Industry role map", prompt: "Connect a role to the skills, evidence, and collaborators that make it real.", dimensions: ["Role", "Skills", "Evidence", "Network"] },
  "industry-voices": { label: "Industry voice study", prompt: "Extract decisions and constraints from a practitioner talk or postmortem.", dimensions: ["Decision", "Constraint", "Trade-off", "Question"] },
  "capstone-plan": { label: "Capstone plan", prompt: "Move from player promise to riskiest assumption, prototype, and first playtest.", dimensions: ["Promise", "Assumption", "Prototype", "Playtest"] },
  "capstone-showcase": { label: "Capstone showcase", prompt: "Tell a complete design story from evidence to iteration to portfolio-ready outcome.", dimensions: ["Concept", "Evidence", "Rationale", "Outcome"] },
};

interface GameDesignVisualizationProps {
  visualizationKey: GameDesignVisualizationKey;
}

export function GameDesignVisualization({ visualizationKey }: GameDesignVisualizationProps) {
  const copy = VISUALIZATION_COPY[visualizationKey];
  const [activeIndex, setActiveIndex] = useState(0);
  const [intensity, setIntensity] = useState(62);
  const [checks, setChecks] = useState<number[]>([]);
  const activeDimension = copy.dimensions[activeIndex % copy.dimensions.length];
  const completion = Math.round((checks.length / copy.dimensions.length) * 100);
  const bars = useMemo(
    () => copy.dimensions.map((dimension, index) => ({ dimension, value: Math.max(18, (intensity + index * 11) % 94) })),
    [copy.dimensions, intensity]
  );

  const toggleCheck = (index: number) => {
    setChecks(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  };

  return (
    <Card className="mt-6 border-[#58a6ff]/30 bg-slate-950 text-white shadow-lg">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#58a6ff]/15 p-2 text-[#8ec5ff]" aria-hidden="true">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <Badge variant="outline" className="mb-2 border-[#58a6ff]/40 text-[#8ec5ff]">Interactive visualization</Badge>
              <CardTitle className="text-lg text-white">{copy.label}</CardTitle>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">{copy.prompt}</p>
            </div>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 text-right text-xs text-slate-300">
            <div className="font-semibold text-[#8ec5ff]">Focus: {activeDimension}</div>
            <div>{completion}% mapped</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bars.map(({ dimension, value }, index) => {
            const selected = activeIndex === index;
            const checked = checks.includes(index);
            return (
              <button
                key={dimension}
                type="button"
                onClick={() => { setActiveIndex(index); toggleCheck(index); }}
                aria-pressed={checked}
                className={`rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ec5ff] ${selected ? "border-[#8ec5ff]/80 bg-[#58a6ff]/15" : "border-white/10 bg-white/[0.03] hover:border-white/25"}`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <span>{dimension}</span>
                  {checked ? <Check className="h-4 w-4 text-green-400" aria-label="Mapped" /> : <CircleHelp className="h-4 w-4 text-slate-500" aria-hidden="true" />}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#58a6ff] to-[#f6c90e] transition-all" style={{ width: `${value}%` }} />
                </div>
                <div className="mt-2 text-right text-xs text-slate-400">{value}% signal</div>
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto] md:items-center">
          <label className="text-sm text-slate-200" htmlFor={`game-design-intensity-${visualizationKey}`}>
            Adjust the design signal to test a different balance.
            <input
              id={`game-design-intensity-${visualizationKey}`}
              type="range"
              min="10"
              max="90"
              value={intensity}
              onChange={event => setIntensity(Number(event.target.value))}
              className="mt-3 w-full accent-[#58a6ff]"
            />
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BarChart3 className="h-4 w-4 text-[#8ec5ff]" />
            <span>{intensity}/90 signal strength</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Target className="h-4 w-4 text-[#f6c90e]" />
          <span>Choose a dimension, adjust the signal, and capture the design decision in your Diary.</span>
          <Eye className="ml-1 h-4 w-4 text-[#8ec5ff]" />
          <span>Works with keyboard focus and reduced-motion preferences.</span>
          <Lightbulb className="ml-1 h-4 w-4 text-[#f6c90e]" />
          <span>Mapped dimensions: {checks.length}/{copy.dimensions.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
