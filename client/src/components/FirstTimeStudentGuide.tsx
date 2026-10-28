import { useEffect, useState } from "react";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  ListChecks,
  PlayCircle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FirstTimeStudentGuideProps {
  courseTitle?: string;
  lessonCount?: number;
  compact?: boolean;
}

const steps = [
  {
    icon: GraduationCap,
    title: "Sign in with the email used for your invitation",
    body: "Open SkillSphere and choose Sign In. Use the same email address your instructor or classroom manager added to the classroom. Your assigned course becomes available after your first successful sign-in.",
  },
  {
    icon: BookOpenCheck,
    title: "Open your Dashboard and find the course",
    body: "From the Dashboard, look under My Courses or My Classrooms. Select the assigned course title, then choose Continue Learning or Start Learning to open the course player.",
  },
  {
    icon: ListChecks,
    title: "Work through the lessons in order",
    body: "Use the Course Content list on the left to choose a lesson. Start with Lesson 1 unless your instructor gives different directions. On a phone or tablet, use the lesson selector at the top of the course player.",
  },
  {
    icon: PlayCircle,
    title: "Read, watch, and complete each activity",
    body: "Review the lesson reading or video, follow the examples, and complete the hands-on activity. Save any required notes, files, screenshots, or links so you can use them as evidence later.",
  },
  {
    icon: CheckCircle2,
    title: "Mark the lesson complete",
    body: "When you finish a lesson, select Mark Complete. The progress indicator and the lesson icon update when the completion is saved. If the button is unavailable, confirm that you are signed in and enrolled.",
  },
  {
    icon: ClipboardCheck,
    title: "Pass every knowledge check or assessment",
    body: "Open each assessment when it becomes available, answer all questions, and submit it. If you do not reach the required score, review the lesson and try again until the assessment is passed.",
  },
  {
    icon: Target,
    title: "Complete the final project or capstone",
    body: "Use the capstone instructions to create the required deliverable. Check the definition of done, gather your evidence, and submit or save the completed work wherever the course directs.",
  },
  {
    icon: Award,
    title: "Reach 100% and download your certificate",
    body: "Finish every required lesson and assessment until the course progress reaches 100%. The certificate section then appears in the course player and your Dashboard, where you can download or share it.",
  },
];

export default function FirstTimeStudentGuide({
  courseTitle,
  lessonCount,
  compact = false,
}: FirstTimeStudentGuideProps) {
  const storageKey = `skillsphere.first-student-guide.${courseTitle ?? "course"}`;
  const [open, setOpen] = useState(true);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem(storageKey) === "1";
    setHasSeen(seen);
    setOpen(!seen);
  }, [storageKey]);

  const dismiss = () => {
    window.localStorage.setItem(storageKey, "1");
    setHasSeen(true);
    setOpen(false);
  };

  const reopen = () => {
    setOpen(true);
    setHasSeen(false);
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={reopen}
        className="gap-2 border-[#2A63BF]/25 text-[#2A63BF] hover:bg-[#EEF4FF]"
      >
        <HelpCircle className="h-4 w-4" />
        How to complete this course
      </Button>
    );
  }

  return (
    <Card className={compact ? "border-[#2A63BF]/20 bg-[#F8FBFF]" : "border-[#2A63BF]/25 bg-gradient-to-br from-[#EEF4FF] via-white to-[#FFF9EA] shadow-sm"}>
      <CardHeader className={compact ? "p-4" : "p-5 pb-3"}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#2A63BF] p-2.5 text-white shadow-sm" aria-hidden="true">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-[#1e3a6e]">First time here? Start with these steps</CardTitle>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {courseTitle ? `A simple path for completing ${courseTitle}.` : "A simple path from your assignment to course completion."}
                {lessonCount ? ` This course has ${lessonCount} lessons.` : ""}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Collapse first-time student guide">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={compact ? "p-4 pt-0" : "p-5 pt-2"}>
        <ol className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="flex gap-3 rounded-xl border border-[#2A63BF]/10 bg-white/80 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A63BF]/10 text-xs font-bold text-[#2A63BF]" aria-hidden="true">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#2A63BF]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#2A63BF]/10 pt-4">
          <p className="text-xs text-muted-foreground">Your progress saves as you complete lessons. You can leave and return anytime.</p>
          <Button type="button" variant="outline" size="sm" onClick={dismiss} className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Got it
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
