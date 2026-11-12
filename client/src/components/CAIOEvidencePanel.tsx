import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardPenLine, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

type Props = {
  courseId: number;
  moduleId: number;
  moduleTitle: string;
  actionPrompt?: string;
  reflectionPrompt?: string;
  canPersist: boolean;
};

function statusLabel(status?: string) {
  if (status === "submitted") return "Submitted";
  if (status === "needs_revision") return "Resubmit requested";
  if (status === "approved") return "Approved";
  return "Draft";
}

export default function CAIOEvidencePanel({ courseId, moduleId, moduleTitle, actionPrompt, reflectionPrompt, canPersist }: Props) {
  const utils = trpc.useUtils();
  const { data: submissions, isLoading } = trpc.caioEvidence.list.useQuery(courseId, { enabled: canPersist });
  const save = trpc.caioEvidence.save.useMutation({ onSuccess: () => utils.caioEvidence.list.invalidate(courseId) });
  const submit = trpc.caioEvidence.submit.useMutation({ onSuccess: () => utils.caioEvidence.list.invalidate(courseId) });
  const current = useMemo(() => submissions?.filter(item => item.moduleId === moduleId) ?? [], [submissions, moduleId]);
  const action = current.find(item => item.submissionType === "action");
  const reflection = current.find(item => item.submissionType === "reflection");
  const [actionText, setActionText] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setInitialized(false);
    setActionText("");
    setReflectionText("");
  }, [moduleId]);
  useEffect(() => {
    if (submissions && !initialized) {
      setActionText(action?.content ?? "");
      setReflectionText(reflection?.content ?? "");
      setInitialized(true);
    }
  }, [submissions, initialized, action?.content, reflection?.content]);
  if (!canPersist) return null;
  const saveOne = async (submissionType: "action" | "reflection", content: string) => {
    if (!content.trim()) return;
    await save.mutateAsync({ courseId, moduleId, submissionType, content });
  };
  const submitOne = async (id: number | undefined, submissionType: "action" | "reflection", content: string) => {
    const saved = await save.mutateAsync({ courseId, moduleId, submissionType, content });
    const savedId = saved?.id ?? id;
    if (savedId) await submit.mutateAsync({ id: savedId, courseId });
  };
  const card = (type: "action" | "reflection", value: string, setValue: (value: string) => void, existing: typeof action, prompt: string, title: string) => (
    <div className="rounded-xl border border-[#2A63BF]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2A63BF]">{type === "action" ? "Action Assignment" : "Reflection"}</p><h4 className="mt-1 font-semibold text-foreground">{title}</h4></div>
        <Badge variant="outline" className={existing?.reviewStatus === "approved" ? "border-emerald-300 text-emerald-700" : "border-[#2A63BF]/30 text-[#1E3A6E]"}>{statusLabel(existing?.reviewStatus)}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{prompt}</p>
      <Textarea className="mt-3 min-h-32" value={value} onChange={event => setValue(event.target.value)} placeholder={type === "action" ? "Describe or paste your completed evidence…" : "Write your reflection…"} aria-label={`${type} for ${moduleTitle}`} />
      {existing?.instructorFeedback && <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"><strong>Instructor feedback:</strong> {existing.instructorFeedback}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => saveOne(type, value)} disabled={!value.trim() || save.isPending}><ClipboardPenLine className="mr-1.5 h-4 w-4" /> Save draft</Button>
        <Button type="button" size="sm" className="bg-[#2A63BF] text-white hover:bg-[#1E4E9D]" onClick={() => submitOne(existing?.id, type, value)} disabled={!value.trim() || save.isPending || submit.isPending}><Send className="mr-1.5 h-4 w-4" /> Submit for review</Button>
      </div>
    </div>
  );
  return <section className="mt-6 rounded-2xl border border-[#F5B942]/40 bg-[#FFFDF5] p-5" aria-label={`CAIO evidence submission for ${moduleTitle}`}>
    <div className="flex items-start gap-3"><div className="rounded-lg bg-[#2A63BF] p-2 text-white"><CheckCircle2 className="h-5 w-5" /></div><div><h3 className="font-bold text-foreground">CAIO Action &amp; Reflection Diary</h3><p className="mt-1 text-sm text-muted-foreground">Save a draft while you work, then submit both pieces for instructor review. Your feedback and status stay attached to this lesson.</p></div></div>
    {isLoading ? <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading your saved evidence…</div> : <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {card("action", actionText, setActionText, action, actionPrompt ?? "Complete the action steps in this lesson and describe the artifact, decision, or evidence you created.", "Turn the lesson into an artifact")}
      {card("reflection", reflectionText, setReflectionText, reflection, reflectionPrompt ?? `What did you learn from ${moduleTitle}, and how will it change your next CAIO decision?`, "Capture your leadership reflection")}
    </div>}
  </section>;
}
