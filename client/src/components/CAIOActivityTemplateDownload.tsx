import { Download, FileText, PenLine, Printer } from "lucide-react";
import type { CAIOActivityTemplate } from "@/lib/caioActivityTemplates";

interface Props {
  template: CAIOActivityTemplate;
}

export default function CAIOActivityTemplateDownload({ template }: Props) {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-[#2A63BF]/20 bg-gradient-to-br from-[#EEF4FF] via-white to-[#FFF8E7] shadow-sm"
      aria-label={`Week ${template.week} downloadable activity template`}
    >
      <div className="border-b border-[#2A63BF]/15 bg-[#2A63BF] px-5 py-4 text-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <PenLine className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                Week {template.week} action assignment
              </p>
              <h3 className="mt-0.5 text-base font-bold">{template.title}</h3>
            </div>
          </div>
          <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-semibold">
            Evidence file
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm leading-6 text-slate-700">{template.summary}</p>
        <div className="mt-4 rounded-xl border border-[#F5B942]/40 bg-[#FFF8E7] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8A5A00]">
            Complete before moving on
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {template.actionAssignment}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={template.docxUrl}
            download
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2A63BF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E4E9D] focus:outline-none focus:ring-2 focus:ring-[#2A63BF] focus:ring-offset-2"
          >
            <FileText className="h-4 w-4" /> Download editable DOCX
          </a>
          <a
            href={template.pdfUrl}
            download
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#2A63BF]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E3A6E] transition-colors hover:bg-[#EEF4FF] focus:outline-none focus:ring-2 focus:ring-[#2A63BF] focus:ring-offset-2"
          >
            <Printer className="h-4 w-4" /> Download print PDF
          </a>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Download className="h-3.5 w-3.5" /> Save the completed workbook with
          your name and date in your CAIO evidence file.
        </p>
      </div>
    </section>
  );
}
