import { useMemo, useState } from "react";
import { Check, Code2, Eye, FilePlus2, Folder, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const starterMarkup = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Task List</title>
</head>
<body>
  <header>
    <h1>My Task List</h1>
  </header>
  <main>
    <ul id="task-list"></ul>
    <button id="theme-toggle">Switch to Dark Theme</button>
  </main>
</body>
</html>`;

function isValidHtmlFileName(value: string) {
  return /^[a-z0-9][a-z0-9._-]*\.html$/i.test(value.trim());
}

export default function AntigravityCreateFileVisualization() {
  const [fileName, setFileName] = useState("index.html");
  const [code, setCode] = useState(starterMarkup);
  const [createdFile, setCreatedFile] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [showHint, setShowHint] = useState(false);
  const validName = isValidHtmlFileName(fileName);
  const previewDocument = useMemo(() => ({ __html: code }), [code]);

  const createFile = () => {
    if (!validName) return;
    setCreatedFile(fileName.trim());
    setActiveView("preview");
  };

  const reset = () => {
    setFileName("index.html");
    setCode(starterMarkup);
    setCreatedFile(null);
    setActiveView("editor");
    setShowHint(false);
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm" aria-labelledby="create-file-visualization-title">
      <div className="border-b border-violet-200 bg-gradient-to-r from-violet-950 to-indigo-900 px-5 py-5 text-white sm:px-7">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200"><FilePlus2 className="h-4 w-4" aria-hidden="true" /> Interactive file builder</p>
        <h3 id="create-file-visualization-title" className="mt-2 text-xl font-bold">Create your first file: index.html</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-violet-100">Practice the same workflow you will use in Antigravity: name a file, review the generated HTML, create it in your project, and preview the result.</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r" aria-label="Simulated project files">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><Folder className="h-4 w-4 text-amber-500" aria-hidden="true" /> my-web-project</div>
          <div className="mt-4 rounded-lg bg-white p-3 text-sm">
            <div className="flex items-center gap-2 text-slate-500"><Code2 className="h-4 w-4" aria-hidden="true" /> style.css <span className="ml-auto text-xs">next</span></div>
            <div className={`mt-2 flex items-center gap-2 rounded-md px-2 py-2 font-semibold ${createdFile ? "bg-violet-100 text-violet-800" : "text-slate-400"}`}><Code2 className="h-4 w-4" aria-hidden="true" /> {createdFile ?? "index.html"}{createdFile && <Check className="ml-auto h-4 w-4 text-emerald-600" aria-label="Created" />}</div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">The file tree is simulated for practice. Nothing is written to your computer.</p>
        </aside>

        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1"><label htmlFor="antigravity-file-name" className="text-sm font-semibold text-slate-900">1. Name your HTML file</label><Input id="antigravity-file-name" value={fileName} onChange={event => { setFileName(event.target.value); setCreatedFile(null); }} className="mt-2 font-mono" aria-describedby="file-name-help" /></div>
            <Button type="button" onClick={createFile} disabled={!validName} className="bg-violet-700 text-white hover:bg-violet-800"><FilePlus2 className="mr-1.5 h-4 w-4" />Create file</Button>
          </div>
          <p id="file-name-help" className={`mt-2 text-xs ${validName ? "text-slate-500" : "text-rose-600"}`}>{validName ? "Use an .html extension. index.html is the browser's conventional starting page." : "Enter a valid filename ending in .html, such as index.html."}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">2. Review or edit the markup</p><p className="mt-1 text-xs text-slate-500">Try changing the heading before you create the file.</p></div><Button type="button" variant="ghost" size="sm" onClick={() => setShowHint(value => !value)} className="text-violet-700 hover:bg-violet-50"><Sparkles className="mr-1.5 h-4 w-4" />{showHint ? "Hide hint" : "Show hint"}</Button></div>
          {showHint && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="note">In Antigravity, ask the Agent to create this file, then review its Implementation Plan before proceeding. Here, the editor lets you rehearse the structure yourself.</p>}
          <Textarea value={code} onChange={event => { setCode(event.target.value); setCreatedFile(null); }} className="mt-3 min-h-[290px] resize-y bg-slate-950 font-mono text-sm leading-6 text-emerald-200" aria-label="index.html editor" />

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5"><Button type="button" onClick={createFile} disabled={!validName} className="bg-emerald-600 text-white hover:bg-emerald-700"><Check className="mr-1.5 h-4 w-4" />{createdFile ? "Update file" : "Create index.html"}</Button><Button type="button" variant="outline" onClick={() => setActiveView("preview")} disabled={!createdFile}><Eye className="mr-1.5 h-4 w-4" />Preview</Button><Button type="button" variant="ghost" onClick={reset} className="text-slate-600"><RotateCcw className="mr-1.5 h-4 w-4" />Reset</Button>{createdFile && <span className="text-sm font-semibold text-emerald-700" role="status">{createdFile} is ready in your project.</span>}</div>

          {activeView === "preview" && createdFile && <div className="mt-6 overflow-hidden rounded-xl border border-slate-300" aria-label="Rendered index.html preview"><div className="flex items-center justify-between border-b bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600"><span>Browser preview — {createdFile}</span><button type="button" onClick={() => setActiveView("editor")} className="rounded px-2 py-1 text-violet-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">Back to editor</button></div><iframe title="Rendered index.html preview" sandbox="" srcDoc={previewDocument.__html} className="h-64 w-full bg-white" /></div>}
        </div>
      </div>
    </section>
  );
}
