import { useEffect, useMemo, useState } from "react";
import { BookOpen, Download, Edit3, FilePenLine, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface GameDesignDiaryPanelProps {
  courseId: number;
  moduleId?: number;
  moduleTitle?: string;
  reflectionPrompt?: string;
  canWrite: boolean;
}

export default function GameDesignDiaryPanel({
  courseId,
  moduleId,
  moduleTitle,
  reflectionPrompt,
  canWrite,
}: GameDesignDiaryPanelProps) {
  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.gameDesignDiary.list.useQuery(courseId, {
    enabled: canWrite,
  });
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [week, setWeek] = useState("");

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
              <CardTitle className="flex items-center gap-2 text-2xl"><BookOpen className="h-6 w-6" /> Game Diary</CardTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Capture design decisions, playtest evidence, and reflection as you move through the 24-module certificate.</p>
            </div>
            <div className="flex gap-2">
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
                      <p className="mt-1 text-xs text-muted-foreground">{entry.week || "Game Design Diary"} · Updated {new Date(entry.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(entry)} aria-label={`Edit ${entry.title}`}><Edit3 className="h-4 w-4" /></Button>
                      <Button type="button" variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => deleteEntry.mutate({ id: entry.id, courseId })} aria-label={`Delete ${entry.title}`}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{entry.body}</p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
