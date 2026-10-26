import { useEffect, useMemo, useState } from "react";
import { BookOpen, Download, Edit3, FilePenLine, Info, Plus, Search, Send, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GameDesignDiaryPanelProps {
  courseId: number;
  learnerName?: string;
  moduleId?: number;
  moduleTitle?: string;
  reflectionPrompt?: string;
  canWrite: boolean;
}

export default function GameDesignDiaryPanel({
  courseId,
  learnerName,
  moduleId,
  moduleTitle,
  reflectionPrompt,
  canWrite,
}: GameDesignDiaryPanelProps) {
  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.gameDesignDiary.list.useQuery(courseId, {
    enabled: canWrite,
  });
  const { data: portfolio } = trpc.gameDesignDiary.portfolio.useQuery(courseId, {
    enabled: canWrite,
  });
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [week, setWeek] = useState("");
  const [showOnboardingTip, setShowOnboardingTip] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    setShowOnboardingTip(window.localStorage.getItem("skillsphere.game-diary.onboarding-seen") !== "1");
  }, []);

  const createEntry = trpc.gameDesignDiary.create.useMutation({
    onSuccess: async () => {
      toast.success("Diary entry saved");
      await utils.gameDesignDiary.list.invalidate(courseId);
      resetEditor();
    },
    onError: error => toast.error(error.message),
  });
  const updateEntry = trpc.gameDesignDiary.update.useMutation({
    onSuccess: async () => {
      toast.success("Diary entry updated");
      await utils.gameDesignDiary.list.invalidate(courseId);
      resetEditor();
    },
    onError: error => toast.error(error.message),
  });
  const deleteEntry = trpc.gameDesignDiary.delete.useMutation({
    onSuccess: async () => {
      toast.success("Diary entry deleted");
      await utils.gameDesignDiary.list.invalidate(courseId);
    },
    onError: error => toast.error(error.message),
  });
  const submitEntry = trpc.gameDesignDiary.submit.useMutation({
    onSuccess: async () => {
      toast.success("Diary entry submitted for instructor review");
      await utils.gameDesignDiary.list.invalidate(courseId);
      await utils.gameDesignDiary.portfolio.invalidate(courseId);
    },
    onError: error => toast.error(error.message),
  });

  useEffect(() => {
    if (!isWriting || editingId || !moduleTitle) return;
    setTitle(`Reflection — ${moduleTitle}`);
    setWeek(`Module ${moduleTitle.match(/\d+/)?.[0]?.padStart(2, "0") ?? ""}`);
    setBody(reflectionPrompt ? `Reflection prompt:\n${reflectionPrompt}\n\nMy notes:\n` : "My notes:\n");
  }, [editingId, isWriting, moduleTitle, reflectionPrompt]);

  const visibleEntries = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return entries ?? [];
    return (entries ?? []).filter(entry =>
      [entry.title, entry.body, entry.week ?? ""].some(value => value.toLowerCase().includes(needle))
    );
  }, [entries, search]);

  const resetEditor = () => {
    setIsWriting(false);
    setEditingId(null);
    setTitle("");
    setBody("");
    setWeek("");
  };

  const startNewEntry = () => {
    setEditingId(null);
    setTitle("");
    setBody("");
    setWeek("");
    setIsWriting(true);
  };

  const startEdit = (entry: NonNullable<typeof entries>[number]) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setBody(entry.body);
    setWeek(entry.week ?? "");
    setIsWriting(true);
  };

  const save = () => {
    if (!title.trim() || !body.trim()) return;
    if (editingId) {
      updateEntry.mutate({ id: editingId, courseId, moduleId: moduleId ?? null, week, title, body });
    } else {
      createEntry.mutate({ courseId, moduleId: moduleId ?? null, week, title, body });
    }
  };

  const exportDiary = () => {
    const text = (entries ?? [])
      .map(entry => `${entry.title}\n${entry.week ?? ""}\n${entry.body}\n\n---\n`)
      .join("\n");
    const blob = new Blob([
      `Game Diary\nProfessional Certificate in Game Design\nDr. Vicki Bealman\n\n${text}`,
    ], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "game-design-diary.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPortfolio = () => {
    if (!portfolio) return;
    const capstone = portfolio.capstoneModules
      .map(module => `## ${module.title}\nStatus: ${module.completed ? "Completed" : "Not completed yet"}\n\n${module.content ?? ""}`)
      .join("\n\n---\n\n");
    const diary = portfolio.entries
      .map(entry => `## ${entry.title}\n${entry.week ?? "Game Design Diary"}\nReview status: ${entry.reviewStatus.replace("_", " ")}\n${entry.instructorFeedback ? `Instructor feedback: ${entry.instructorFeedback}\n` : ""}\n${entry.body}`)
      .join("\n\n---\n\n");
    const markdown = `# Game Design Portfolio\n\nCourse: ${portfolio.course?.title ?? "Professional Certificate in Game Design"}\nGenerated: ${new Date().toLocaleDateString()}\n\n## Capstone evidence\n\n${capstone || "No capstone modules found."}\n\n# Game Diary\n\n${diary || "No Diary entries yet."}\n`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "game-design-portfolio.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPortfolioPdf = async () => {
    if (!portfolio) return;
    setIsExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 44;
      const navy = "#0F2747";
      const blue = "#2A63BF";
      const gold = "#F5B942";
      const muted = "#536273";
      let y = 0;

      const plainText = (value: string) => value
        .replace(/<[^>]*>/g, " ")
        .replace(/```[\s\S]*?```/g, "[code excerpt]")
        .replace(/[#*_>`]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const startPage = () => {
        doc.setFillColor(navy);
        doc.rect(0, 0, pageWidth, 64, "F");
        doc.setFillColor(gold);
        doc.rect(0, 64, pageWidth, 4, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("SkillSphere", margin, 29);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#DCEBFF");
        doc.text("Empowering Skills. Building Futures.", margin, 44);
        doc.setTextColor("#1F2937");
        y = 96;
      };

      const ensureSpace = (height: number) => {
        if (y + height > pageHeight - 42) {
          doc.addPage();
          startPage();
        }
      };

      const addParagraph = (text: string, options?: { size?: number; color?: string; bold?: boolean; gap?: number }) => {
        const cleaned = plainText(text) || "—";
        const size = options?.size ?? 10;
        const lines = doc.splitTextToSize(cleaned, pageWidth - margin * 2) as string[];
        doc.setFont("helvetica", options?.bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(options?.color ?? "#1F2937");
        for (const line of lines) {
          ensureSpace(size + 6);
          doc.text(line, margin, y);
          y += size + 4;
        }
        y += options?.gap ?? 5;
      };

      const addSectionTitle = (title: string) => {
        ensureSpace(38);
        doc.setFillColor("#EEF4FF");
        doc.roundedRect(margin - 6, y - 18, pageWidth - margin * 2 + 12, 28, 5, 5, "F");
        doc.setTextColor(blue);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(title, margin, y);
        y += 25;
      };

      startPage();
      doc.setTextColor(navy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(23);
      doc.text("Game Design Portfolio", margin, y);
      y += 25;
      addParagraph(portfolio.course?.title ?? "Professional Certificate in Game Design", { size: 13, color: blue, bold: true, gap: 2 });
      addParagraph(`Learner: ${learnerName?.trim() || "Learner"}`, { color: navy, bold: true, gap: 0 });
      addParagraph(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, { size: 9, color: muted, gap: 14 });
      doc.setDrawColor(gold);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 24;

      addSectionTitle("Capstone evidence");
      if (portfolio.capstoneModules.length === 0) {
        addParagraph("No capstone modules found yet.", { color: muted });
      } else {
        portfolio.capstoneModules.forEach(module => {
          addParagraph(module.title, { size: 11, color: navy, bold: true, gap: 1 });
          addParagraph(`Status: ${module.completed ? "Completed" : "Not completed yet"}`, { size: 9, color: module.completed ? "#207A35" : muted, gap: 2 });
          addParagraph(module.content ?? "", { size: 9, color: muted, gap: 10 });
        });
      }

      addSectionTitle("Game Diary entries");
      if (portfolio.entries.length === 0) {
        addParagraph("No Diary entries yet.", { color: muted });
      } else {
        portfolio.entries.forEach(entry => {
          addParagraph(entry.title, { size: 11, color: navy, bold: true, gap: 1 });
          addParagraph(`${entry.week ?? "Game Design Diary"} · Review status: ${entry.reviewStatus.replace("_", " ")}`, { size: 9, color: muted, gap: 2 });
          addParagraph(entry.body, { size: 10, gap: 2 });
          if (entry.instructorFeedback) addParagraph(`Instructor feedback: ${entry.instructorFeedback}`, { size: 9, color: "#7A4B00", gap: 8 });
        });
      }

      const filename = `SkillSphere-Game-Design-Portfolio-${(learnerName?.trim() || "Learner").replace(/[^a-z0-9]+/gi, "-")}.pdf`;
      doc.save(filename);
      toast.success("Branded PDF portfolio downloaded");
    } catch (error) {
      console.error("Portfolio PDF generation failed", error);
      toast.error("Unable to create the PDF portfolio. Try the Markdown export instead.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const dismissOnboardingTip = () => {
    window.localStorage.setItem("skillsphere.game-diary.onboarding-seen", "1");
    setShowOnboardingTip(false);
  };

  if (!canWrite) {
    return (
      <Card className="mx-auto mt-6 max-w-3xl border-[#58a6ff]/20 bg-[#EEF4FF]/50">
        <CardContent className="p-6 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-[#2A63BF]" />
          <h3 className="mt-3 text-lg font-semibold text-[#1e3a6e]">Your Game Diary</h3>
          <p className="mt-1 text-sm text-muted-foreground">Enroll and sign in to save reflections, experiments, and portfolio evidence to your account.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="overflow-hidden border-[#58a6ff]/25">
        <CardHeader className="bg-gradient-to-r from-[#0f2747] to-[#1e4fa3] text-white">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-2 border-white/30 text-white">Portfolio studio</Badge>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6" /> Game Diary
                <Tooltip open={showOnboardingTip} onOpenChange={setShowOnboardingTip}>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="How Game Diary saving works" className="rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">Entries save privately to your SkillSphere account when you click Save entry. Submit an entry when you want your instructor to review it; feedback and status will appear here.</TooltipContent>
                </Tooltip>
              </CardTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Capture design decisions, playtest evidence, and reflection as you move through the 24-module certificate.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={exportPortfolioPdf} disabled={!portfolio || isExportingPdf}>
                <Download className="mr-1.5 h-4 w-4" /> {isExportingPdf ? "Creating PDF…" : "PDF portfolio"}
              </Button>
              <Button type="button" variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={exportPortfolio} disabled={!portfolio}>
                <Download className="mr-1.5 h-4 w-4" /> Portfolio
              </Button>
              <Button type="button" variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={exportDiary} disabled={!entries?.length}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
              <Button type="button" size="sm" className="bg-white text-[#1e4fa3] hover:bg-blue-50" onClick={startNewEntry}>
                <Plus className="mr-1.5 h-4 w-4" /> New entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {showOnboardingTip && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-[#58a6ff]/25 bg-[#EEF4FF] px-3 py-2 text-xs text-[#1e3a6e]">
              <span><strong>How saving works:</strong> Save drafts privately, then use Submit for review when you want instructor feedback.</span>
              <Button type="button" variant="ghost" size="sm" className="h-6 shrink-0 px-2 text-[#1e3a6e]" onClick={dismissOnboardingTip}>Got it</Button>
            </div>
          )}
          {isWriting && (
            <div className="rounded-xl border border-[#58a6ff]/25 bg-[#EEF4FF]/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1e3a6e]"><FilePenLine className="h-4 w-4" /> {editingId ? "Edit entry" : "New entry"}</div>
                <Button type="button" variant="ghost" size="icon" onClick={resetEditor} aria-label="Close Diary editor"><X className="h-4 w-4" /></Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <Input aria-label="Diary entry title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Entry title" />
                <Input aria-label="Diary entry week or module" value={week} onChange={event => setWeek(event.target.value)} placeholder="Week or module" />
              </div>
              <Textarea aria-label="Diary entry body" value={body} onChange={event => setBody(event.target.value)} placeholder="Describe what you noticed, built, tested, or changed." className="mt-3 min-h-44 bg-white" />
              <p className="mt-2 text-xs text-muted-foreground">Avoid confidential employer, customer, student, or proprietary information.</p>
              <Button type="button" className="mt-3 bg-[#2A63BF] text-white hover:bg-[#1e4fa3]" onClick={save} disabled={!title.trim() || !body.trim() || createEntry.isPending || updateEntry.isPending}>
                <FilePenLine className="mr-1.5 h-4 w-4" /> {editingId ? "Update entry" : "Save entry"}
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input aria-label="Search Game Diary" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search entries, prompts, or modules" />
          </div>
          {isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading your Diary…</p> : visibleEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <BookOpen className="mx-auto h-7 w-7 text-[#2A63BF]" />
              <p className="mt-2 font-medium text-foreground">Your Diary is ready for its first entry.</p>
              <p className="mt-1 text-sm text-muted-foreground">Use “Write this into your Diary” from a module activity or start a new entry here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleEntries.map(entry => (
                <article key={entry.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1e3a6e]">{entry.title}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        {entry.week || "Game Design Diary"} · Updated {new Date(entry.updatedAt).toLocaleDateString()} ·
                        <Badge variant="outline" className="capitalize">{entry.reviewStatus === "needs_revision" ? "Needs revision" : entry.reviewStatus}</Badge>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(entry)} aria-label={`Edit ${entry.title}`}><Edit3 className="h-4 w-4" /></Button>
                      <Button type="button" variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => deleteEntry.mutate({ id: entry.id, courseId })} aria-label={`Delete ${entry.title}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{entry.body}</p>
                  {entry.instructorFeedback && <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"><p className="font-semibold">Instructor feedback</p><p className="mt-1 whitespace-pre-wrap leading-6">{entry.instructorFeedback}</p></div>}
                  {(entry.reviewStatus === "draft" || entry.reviewStatus === "needs_revision") && <Button type="button" size="sm" className="mt-3 bg-[#2A63BF] text-white hover:bg-[#1e4fa3]" onClick={() => submitEntry.mutate({ id: entry.id, courseId })} disabled={submitEntry.isPending}><Send className="mr-1.5 h-4 w-4" /> Submit for review</Button>}
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
