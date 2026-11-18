import { useState } from "react";
import { Check, CheckCircle2, Clipboard, Command, Monitor, Terminal, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";

type OperatingSystem = "macOS" | "Linux" | "Windows";

type TerminalGuide = {
  title: string;
  prompt: string;
  openSteps: string[];
  createCommand: string;
  verifyCommand: string;
  output: string[];
  tip: string;
};

const guides: Record<OperatingSystem, TerminalGuide> = {
  macOS: {
    title: "How to open the Terminal on macOS",
    prompt: "yourname@MacBook ~ %",
    openSteps: ["Press Command + Space to open Spotlight Search", "Type Terminal and press Return", "The Terminal opens with a prompt like yourname@MacBook ~ %"],
    createCommand: "mkdir -p ~/my-web-project",
    verifyCommand: "ls ~",
    output: ["Desktop", "Documents", "Downloads", "my-web-project"],
    tip: "You can also open Terminal from Applications → Utilities.",
  },
  Linux: {
    title: "How to open the Terminal on Linux",
    prompt: "yourname@ubuntu:~$",
    openSteps: ["Press Ctrl + Alt + T to open a terminal window", "The terminal opens in your home directory", "You will see a prompt like yourname@ubuntu:~$"],
    createCommand: "mkdir -p ~/my-web-project",
    verifyCommand: "ls ~",
    output: ["Desktop", "Documents", "Downloads", "my-web-project"],
    tip: "On many Linux desktops, you can also search for Terminal in the applications menu.",
  },
  Windows: {
    title: "How to open the Terminal on Windows",
    prompt: "PS C:\\Users\\yourname>",
    openSteps: ["Press Windows + X to open the Power User menu", "Click Terminal or Windows PowerShell", "The terminal opens with a prompt like PS C:\\Users\\yourname>"],
    createCommand: "mkdir $HOME\\my-web-project",
    verifyCommand: "dir $HOME",
    output: ["Desktop", "Documents", "Downloads", "my-web-project"],
    tip: "On Windows, you can also use Command Prompt (cmd.exe) with the same mkdir command.",
  },
};

const osIcon = (os: OperatingSystem) => {
  if (os === "macOS") return <Apple className="h-5 w-5" aria-hidden="true" />;
  if (os === "Linux") return <Terminal className="h-5 w-5" aria-hidden="true" />;
  return <Monitor className="h-5 w-5" aria-hidden="true" />;
};

export default function AntigravityTerminalVisualization() {
  const [os, setOs] = useState<OperatingSystem>("Windows");
  const [copied, setCopied] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const guide = guides[os];

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(current => current === key ? null : current), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="terminal-visualization-title">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 px-5 py-5 sm:px-7">
        <h3 id="terminal-visualization-title" className="text-xl font-bold tracking-tight text-slate-900">How to open the terminal on your operating system</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Choose your operating system, follow the three steps, then copy the command to create your Antigravity project folder.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2" role="tablist" aria-label="Select your operating system">
          <span className="mr-1 text-sm font-semibold text-slate-600">Select your OS:</span>
          {(Object.keys(guides) as OperatingSystem[]).map(option => (
            <button key={option} type="button" role="tab" aria-selected={os === option} onClick={() => { setOs(option); setVerified(false); }} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${os === option ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 hover:bg-white"}`}>
              {osIcon(option)} {option}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <h4 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-blue-700"><Command className="h-5 w-5" /> {guide.title}</h4>
        <ol className="mt-4 space-y-3">
          {guide.openSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-base text-slate-700">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-slate-950 px-5 py-5 font-mono text-sm text-slate-100 sm:px-7">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-400"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /><span className="ml-2 text-xs font-semibold tracking-wide">{os === "Windows" ? "Windows PowerShell" : `${os} Terminal`}</span></div>
        <p className="mt-5 text-slate-400"># Run this command to create your project folder:</p>
        <div className="mt-2 flex flex-wrap items-center gap-3"><span className="font-bold text-blue-400">{guide.prompt}</span><code className="break-all text-slate-100">{guide.createCommand}</code><Button type="button" variant="outline" size="sm" onClick={() => copy(guide.createCommand, "create")} className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white"><Clipboard className="mr-1.5 h-4 w-4" />{copied === "create" ? "Copied" : "Copy"}</Button></div>
        <p className="mt-2 text-xs italic text-slate-500">(no output means success — the folder was created)</p>
        <p className="mt-6 text-slate-400"># Verify the folder was created:</p>
        <div className="mt-2 flex flex-wrap items-center gap-3"><span className="font-bold text-blue-400">{guide.prompt}</span><code className="break-all text-slate-100">{guide.verifyCommand}</code><Button type="button" variant="outline" size="sm" onClick={() => copy(guide.verifyCommand, "verify")} className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white"><Clipboard className="mr-1.5 h-4 w-4" />{copied === "verify" ? "Copied" : "Copy"}</Button></div>
        <div className="mt-4 rounded-lg border border-slate-800 bg-black/30 p-4 text-slate-400"><p>{os === "Windows" ? "Directory" : "total 16"}</p>{guide.output.map(item => <p key={item} className={item === "my-web-project" ? "font-semibold text-emerald-400" : ""}>{item === "my-web-project" ? "✓ " : "    "}{item}</p>)}</div>
        <Button type="button" size="sm" onClick={() => setVerified(true)} className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"><CheckCircle2 className="mr-1.5 h-4 w-4" />I verified my folder</Button>
        {verified && <p className="mt-3 flex items-center gap-2 font-sans text-sm font-semibold text-emerald-400" role="status"><Check className="h-4 w-4" /> Great — your {os} project folder is ready for Antigravity.</p>}
      </div>
      <p className="bg-indigo-50 px-5 py-4 text-sm text-slate-700 sm:px-7"><span className="mr-1">💡</span><strong className="text-indigo-700">Tip:</strong> {guide.tip}</p>
    </section>
  );
}
