import { useEffect, useState } from "react";
import { ClipboardCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = { courseId: number; moduleId: number; moduleTitle: string; reflectionPrompt?: string; isCapstone?: boolean; canPersist: boolean };

export default function AIDataAnalyticsEvidencePanel({ courseId, moduleId, moduleTitle, reflectionPrompt, isCapstone, canPersist }: Props) {
  const { data: evidence } = trpc.aiDataAnalyticsEvidence.list.useQuery(courseId, { enabled: canPersist });
  const save = trpc.aiDataAnalyticsEvidence.save.useMutation();
  const submit = trpc.aiDataAnalyticsEvidence.submit.useMutation();
  const entries = evidence?.filter(item => item.moduleId === moduleId) ?? [];
  const reflection = entries.find(item => item.evidenceType === "reflection");
  const capstone = entries.find(item => item.evidenceType === "capstone");
  const [reflectionText, setReflectionText] = useState("");
  const [capstoneText, setCapstoneText] = useState("");
  useEffect(() => { setReflectionText(reflection?.content ?? ""); setCapstoneText(capstone?.content ?? ""); }, [reflection?.content, capstone?.content]);
  if (!canPersist) return <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">Enroll to save and submit your practice code, knowledge checks, capstone evidence, and reflection for instructor review.</div>;
  const saveAndSubmit = async (type: "reflection" | "capstone", content: string, existing?: typeof reflection) => {
    if (!content.trim()) { toast.error("Add your evidence before submitting."); return; }
    const saved = await save.mutateAsync({ courseId, moduleId, evidenceType: type, content });
    await submit.mutateAsync({ id: saved!.id, courseId });
    toast.success(`${type === "capstone" ? "Capstone evidence" : "Reflection"} submitted for review.`);
  };
  const card = (type: "reflection" | "capstone", value: string, setValue: (value: string) => void, existing: typeof reflection, title: string, prompt: string) => <section className="rounded-xl border border-teal-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 font-semibold text-slate-900"><ClipboardCheck className="h-4 w-4 text-teal-700" />{title}</div><p className="mt-2 text-sm leading-6 text-slate-600">{prompt}</p><Textarea value={value} onChange={event => setValue(event.target.value)} placeholder="Paste your work, observations, links, or next steps…" className="mt-3 min-h-28" aria-label={`${title} for ${moduleTitle}`} /><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-500">Status: {existing?.reviewStatus ?? "not started"}{existing?.instructorFeedback ? ` · Feedback: ${existing.instructorFeedback}` : ""}</span><Button type="button" size="sm" onClick={() => void saveAndSubmit(type, value, existing)} disabled={save.isPending || submit.isPending}><Send className="mr-1.5 h-3.5 w-3.5" />Submit for review</Button></div></section>;
  return <div className="mt-6 grid gap-4">{card("reflection", reflectionText, setReflectionText, reflection, "Submit your reflection", reflectionPrompt ?? `What did you learn from ${moduleTitle}, and how would you apply it in a real analytics decision?`)}{isCapstone && card("capstone", capstoneText, setCapstoneText, capstone, "Submit capstone evidence", "Add your dashboard link, screenshots, code notes, data-quality decisions, model findings, governance considerations, and executive recommendation.")}</div>;
}
