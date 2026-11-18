import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Keyboard, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type OperatingSystem = "macOS" | "Linux" | "Windows";

type PracticeStep = {
  label: string;
  instruction: string;
  command: string;
  accepted: string[];
  hint: string;
};

const steps: Record<OperatingSystem, PracticeStep[]> = {
  macOS: [
    { label: "Create the folder", instruction: "Create a folder named my-web-project in your home directory.", command: "mkdir -p ~/my-web-project", accepted: ["mkdir -p ~/my-web-project", "mkdir ~/my-web-project"], hint: "Use mkdir with the home shortcut ~/ and the folder name." },
    { label: "Verify the folder", instruction: "List the contents of your home directory.", command: "ls ~", accepted: ["ls ~", "ls -la ~", "ls"], hint: "On macOS, use ls to list directory contents." },
    { label: "Open the project", instruction: "Change into the new project folder.", command: "cd ~/my-web-project", accepted: ["cd ~/my-web-project", "cd my-web-project"], hint: "Use cd followed by the folder path." },
  ],
  Linux: [
    { label: "Create the folder", instruction: "Create a folder named my-web-project in your home directory.", command: "mkdir -p ~/my-web-project", accepted: ["mkdir -p ~/my-web-project", "mkdir ~/my-web-project"], hint: "Use mkdir with the home shortcut ~/ and the folder name." },
    { label: "Verify the folder", instruction: "List the contents of your home directory.", command: "ls ~", accepted: ["ls ~", "ls -la ~", "ls"], hint: "On Linux, use ls to list directory contents." },
    { label: "Open the project", instruction: "Change into the new project folder.", command: "cd ~/my-web-project", accepted: ["cd ~/my-web-project", "cd my-web-project"], hint: "Use cd followed by the folder path." },
  ],
  Windows: [
    { label: "Create the folder", instruction: "Create a folder named my-web-project in your home directory.", command: "mkdir $HOME\\my-web-project", accepted: ["mkdir $HOME\\my-web-project", "mkdir $HOME/my-web-project", "md $HOME\\my-web-project"], hint: "In PowerShell, use mkdir with $HOME and a backslash path." },
    { label: "Verify the folder", instruction: "List the contents of your home directory.", command: "dir $HOME", accepted: ["dir $HOME", "ls $HOME", "dir"], hint: "In PowerShell, dir and ls are aliases for listing a directory." },
    { label: "Open the project", instruction: "Change into the new project folder.", command: "cd $HOME\\my-web-project", accepted: ["cd $HOME\\my-web-project", "cd $HOME/my-web-project", "cd my-web-project"], hint: "Use cd followed by the PowerShell folder path." },
  ],
};

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").toLowerCase();
}

export default function AntigravityTerminalCommandPractice({ os }: { os: OperatingSystem }) {
  const practiceSteps = useMemo(() => steps[os], [os]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "try-again">("idle");
  const [completed, setCompleted] = useState<number[]>([]);
  const current = practiceSteps[stepIndex];
  const progress = Math.round((completed.length / practiceSteps.length) * 100);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const correct = current.accepted.some(value => normalize(value) === normalize(answer));
    if (!correct) {
      setFeedback("try-again");
      return;
    }
    setFeedback("correct");
    setCompleted(previous => previous.includes(stepIndex) ? previous : [...previous, stepIndex]);
  };

  const next = () => {
    if (stepIndex < practiceSteps.length - 1) {
      setStepIndex(value => value + 1);
      setAnswer("");
      setFeedback("idle");
    }
  };

  const reset = () => {
    setStepIndex(0);
    setAnswer("");
    setFeedback("idle");
    setCompleted([]);
  };

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/60" aria-labelledby="terminal-practice-title">
      <div className="border-b border-indigo-200 bg-indigo-950 px-5 py-5 text-white sm:px-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-200"><Keyboard className="h-4 w-4" /> Command practice</p>
        <h4 id="terminal-practice-title" className="mt-2 text-xl font-bold">Type the command, get instant feedback</h4>
        <p className="mt-2 text-sm leading-6 text-indigo-100">Practice safely in SkillSphere. Nothing is executed on your computer; the activity checks your command against the expected solution for {os}.</p>
        <div className="mt-4 flex items-center gap-3"><Progress value={progress} className="h-2 flex-1 bg-indigo-800 [&>div]:bg-emerald-400" /><span className="text-xs font-semibold text-indigo-100">{completed.length}/{practiceSteps.length} complete</span></div>
      </div>
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Practice steps">
          {practiceSteps.map((practiceStep, index) => <span key={practiceStep.label} className={`rounded-full px-3 py-1 text-xs font-semibold ${completed.includes(index) ? "bg-emerald-100 text-emerald-800" : index === stepIndex ? "bg-indigo-700 text-white" : "bg-white text-slate-500"}`}>{index + 1}. {practiceStep.label}</span>)}
        </div>
        <p className="text-sm font-semibold text-slate-900">Step {stepIndex + 1}: {current.instruction}</p>
        <p className="mt-2 text-xs text-slate-600">Expected pattern: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-indigo-800">{current.command}</code></p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor={`terminal-practice-${os}-${stepIndex}`} className="sr-only">Type the command for {current.label}</label>
          <input id={`terminal-practice-${os}-${stepIndex}`} value={answer} onChange={event => { setAnswer(event.target.value); if (feedback !== "idle") setFeedback("idle"); }} placeholder="Type a command..." autoComplete="off" spellCheck={false} className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-slate-950 px-3 font-mono text-sm text-emerald-300 outline-none ring-offset-2 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500" />
          <Button type="submit" className="min-h-11 bg-indigo-700 text-white hover:bg-indigo-800">Check command</Button>
        </form>
        <div className="mt-3 min-h-10" aria-live="polite">
          {feedback === "correct" && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Correct. Nice work — this command is safe to use for this step.</p>}
          {feedback === "try-again" && <div className="flex items-start gap-2 text-sm text-rose-700"><XCircle className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Not quite.</strong> {current.hint}</p></div>}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {feedback === "correct" && stepIndex < practiceSteps.length - 1 && <Button type="button" variant="outline" onClick={next}>Next command</Button>}
          {feedback === "correct" && stepIndex === practiceSteps.length - 1 && <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">All commands complete. Your workspace is ready for Antigravity.</p>}
          {completed.length > 0 && <Button type="button" variant="ghost" onClick={reset} className="text-slate-600"><RotateCcw className="mr-1.5 h-4 w-4" />Reset practice</Button>}
        </div>
      </div>
    </section>
  );
}
