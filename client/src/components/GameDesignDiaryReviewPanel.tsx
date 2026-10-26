import { useState } from "react";
import { CheckCircle2, ClipboardCheck, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const GAME_DESIGN_COURSE_SLUG = "professional-certificate-game-design";

type ReviewStatus = "draft" | "submitted" | "needs_revision" | "approved";

export default function GameDesignDiaryReviewPanel({ courseId }: { courseId: number }) {
  const utils = trpc.useUtils();
  const [status, setStatus] = useState<ReviewStatus>("submitted");
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const { data: entries, isLoading } = trpc.gameDesignDiary.reviewQueue.useQuery(
    { courseId, status },
    { enabled: courseId > 0 }
  );
  const review = trpc.gameDesignDiary.review.useMutation({
    onSuccess: async () => {
      toast.success("Diary review saved");
      await utils.gameDesignDiary.reviewQueue.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  return (
    <Card className="border-[#2A63BF]/15 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg"><ClipboardCheck className="h-5 w-5 text-[#2A63BF]" /> Game Diary reviews</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Review learner reflections, return revision requests, or approve evidence for the portfolio.</p>
        </div>
        <Select value={status} onValueChange={value => setStatus(value as ReviewStatus)}>
          <SelectTrigger className="w-40" aria-label="Diary review status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="needs_revision">Needs revision</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="py-6 text-center text-sm text-muted-foreground">Loading Diary submissions…</p> : entries?.length ? (
          <div className="space-y-4">
            {entries.map(entry => {
              const currentFeedback = feedback[entry.id] ?? entry.instructorFeedback ?? "";
              return (
                <article key={entry.id} className="rounded-xl border border-border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1e3a6e]">{entry.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{entry.learnerName ?? entry.learnerEmail ?? "Learner"} · {entry.moduleTitle ?? entry.week ?? "Game Design"}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{entry.reviewStatus === "needs_revision" ? "Needs revision" : entry.reviewStatus}</Badge>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{entry.body}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <label className="text-sm font-medium text-foreground">Instructor feedback
                      <Textarea aria-label={`Feedback for ${entry.title}`} value={currentFeedback} onChange={event => setFeedback(current => ({ ...current, [entry.id]: event.target.value }))} placeholder="Name the evidence that is strong and the next revision to try." className="mt-1 min-h-24" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => review.mutate({ id: entry.id, courseId, reviewStatus: "needs_revision", instructorFeedback: currentFeedback })} disabled={review.isPending}><RotateCcw className="mr-1.5 h-4 w-4" /> Request revision</Button>
                      <Button type="button" className="bg-[#207a35] text-white hover:bg-[#176326]" onClick={() => review.mutate({ id: entry.id, courseId, reviewStatus: "approved", instructorFeedback: currentFeedback })} disabled={review.isPending}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve</Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground"><MessageSquare className="mx-auto mb-2 h-6 w-6" />No {status.replace("_", " ")} Diary entries.</div>}
      </CardContent>
    </Card>
  );
}

export { GAME_DESIGN_COURSE_SLUG };
