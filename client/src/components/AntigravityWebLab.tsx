import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, ExternalLink, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { AntigravityLab } from "@/lib/antigravityLabs";

const STORAGE_PREFIX = "skillsphere-antigravity-lab:";
type FileKey = "html" | "css" | "javascript";

export default function AntigravityWebLab({ lab, canPersist, onLabCompleted }: { lab: AntigravityLab; canPersist?: boolean; onLabCompleted?: () => void }) {
  const storageKey = `${STORAGE_PREFIX}${lab.id}`;
  const [activeFile, setActiveFile] = useState<FileKey>(lab.openFile ?? "html");
  const [files, setFiles] = useState(lab.starter);
  const [ran, setRan] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (saved?.html && saved?.css && saved?.javascript) setFiles(saved);
    } catch { /* Ignore malformed local drafts and restore the source starter. */ }
  }, [storageKey]);

  useEffect(() => {
    if (canPersist) localStorage.setItem(storageKey, JSON.stringify(files));
  }, [canPersist, files, storageKey]);

  const preview = useMemo(() => {
    const script = files.javascript.replace(/<\/script/gi, "<\\/script");
    return files.html.replace("</head>", `<style>${files.css}</style></head>`).replace("</body>", `<script>${script}</script></body>`);
  }, [files]);

  const updateFile = (value: string) => setFiles(current => ({ ...current, [activeFile]: value }));
  const reset = () => { setFiles(lab.starter); setRan(false); localStorage.removeItem(storageKey); };
  const download = () => {
    const blob = new Blob([preview], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${lab.id}.html`; anchor.click();
    URL.revokeObjectURL(url); setDownloaded(true);
  };

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/60 shadow-sm" aria-labelledby={`${lab.id}-title`}>
      <div className="border-b border-sky-200 bg-gradient-to-r from-sky-950 to-blue-900 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-sky-200" /><p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Antigravity coding lab</p></div>
          <Badge className="border-sky-300/30 bg-white/10 text-sky-50">{canPersist ? "Draft saved on this device" : "Preview mode"}</Badge>
        </div>
        <h3 id={`${lab.id}-title`} className="mt-2 text-xl font-bold">{lab.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-sky-50">{lab.objective}</p>
        <div className="mt-3 rounded-lg border border-white/15 bg-white/10 p-3 text-sm text-sky-50"><strong className="text-white">Try this prompt:</strong> {lab.prompt}</div>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div className="rounded-xl border border-sky-200 bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2" role="tablist" aria-label="Lab files">
            {(["html", "css", "javascript"] as FileKey[]).map(file => (
              <button key={file} type="button" role="tab" aria-selected={activeFile === file} onClick={() => setActiveFile(file)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeFile === file ? "bg-sky-700 text-white" : "bg-sky-50 text-sky-800 hover:bg-sky-100"}`}>{file === "javascript" ? "script.js" : `index.${file}`}</button>
            ))}
          </div>
          <label htmlFor={`${lab.id}-${activeFile}`} className="sr-only">Edit {activeFile} code</label>
          <Textarea id={`${lab.id}-${activeFile}`} value={files[activeFile]} onChange={e => updateFile(e.target.value)} className="min-h-[300px] resize-y font-mono text-xs leading-5" spellCheck={false} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => { setRan(true); onLabCompleted?.(); }}><Play className="mr-1.5 h-4 w-4" />Run preview</Button>
            <Button type="button" size="sm" variant="outline" onClick={reset}><RotateCcw className="mr-1.5 h-4 w-4" />Reset</Button>
            <Button type="button" size="sm" variant="outline" onClick={download}><Download className="mr-1.5 h-4 w-4" />Download HTML</Button>
          </div>
          {ran && <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700" role="status"><CheckCircle2 className="h-4 w-4" /> Preview ran successfully. {downloaded ? "Your HTML file is ready." : "Try changing a file and run it again."}</p>}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-slate-950" aria-label="Live code preview">
          <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300"><span>Live preview</span><span className="inline-flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" /> Sandboxed</span></div>
          <iframe title={`${lab.title} live preview`} srcDoc={preview} sandbox="allow-scripts" className="h-[360px] w-full bg-white" />
        </div>
      </div>
    </section>
  );
}
