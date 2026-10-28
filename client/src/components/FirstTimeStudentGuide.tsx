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

const coursePlans = [
  {
    match: "using ai in data analytics",
    label: "Using AI in Data Analytics",
    weeks: [
      "Week 1 · Foundations: understand the analytics workflow, data preparation, and responsible AI use.",
      "Week 2 · Methods and tools: practice analysis techniques, visualization, prompting, and interpretation.",
      "Week 3 · Applied analytics: complete the case-study lessons, check your findings, and plan your dashboard.",
      "Week 4 · Capstone: build the Customer Analytics Dashboard, document insights, and submit your evidence.",
    ],
  },
  {
    match: "chief ai officer",
    label: "Chief AI Officer BootCamp",
    weeks: [
      "Week 1 · Win the seat: understand the CAIO role and create your evidence baseline.",
      "Week 2 · Lead the conversation: map value, risk, stakeholders, and a practical pilot.",
      "Week 3 · Scale the work: build governance, operating rhythms, and reusable delivery artifacts.",
      "Week 4 · Capstone: prepare the 90-day leadership briefing and CAIO engagement brief.",
    ],
  },
  {
    match: "professional certificate in game design",
    label: "Professional Certificate in Game Design",
    weeks: [
      "Week 1 · Foundations: study game systems, rules, players, and the designer’s field notes.",
      "Week 2 · Making: move through ideation, prototyping, playtesting, usability, and accessibility.",
      "Week 3 · Practice: develop game feel, scope the project, and communicate the design clearly.",
      "Week 4 · Portfolio: complete the two-part game project, save Diary evidence, and prepare your portfolio.",
    ],
  },
];

function getCoursePlan(courseTitle?: string) {
  const normalized = courseTitle?.toLowerCase() ?? "";
  return coursePlans.find(plan => normalized.includes(plan.match));
}

const steps = [
  {
    icon: GraduationCap,
    title: "Sign in with the email used for your invitation",
    body: "Open SkillSphere and choose Sign In. Use the same email address your instructor or classroom manager added to the classroom. Classroom invitations provide access at no charge; they do not ask you to pay again. Your assigned course becomes available after your first successful sign-in.",
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
  const coursePlan = getCoursePlan(courseTitle);

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
        {!compact && (
          <div className="mb-5 overflow-hidden rounded-xl border border-[#2A63BF]/15 bg-[#0f2747]">
            <video
              className="aspect-video w-full bg-[#0f2747] object-cover"
              controls
              preload="metadata"
              playsInline
              aria-label="SkillSphere welcome video for first-time students"
            >
              <source src="/manus-storage/skillsphere-student-welcome_432e7ca4.mp4" type="video/mp4" />
              Your browser does not support the welcome video. Follow the written steps below.
            </video>
            <p className="px-3 py-2 text-xs text-[#DCEBFF]">Welcome video · 20 seconds · captions are included in the video</p>
          </div>
        )}
        {coursePlan && (
          <div className="mb-5 rounded-xl border border-[#F5B942]/35 bg-[#FFF9EA] p-4">
            <div className="flex items-start gap-2">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6500]" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-[#704900]">Recommended four-week plan for {coursePlan.label}</h3>
                <p className="mt-1 text-xs leading-5 text-[#7A5B20]">Plan for about 3–5 focused hours each week. Your instructor’s deadlines always take priority.</p>
              </div>
            </div>
            <ol className="mt-3 grid gap-2 sm:grid-cols-2">
              {coursePlan.weeks.map((week, index) => (
                <li key={week} className="rounded-lg bg-white/75 p-3 text-xs leading-5 text-[#5C4A24]">
                  <span className="font-bold text-[#9A6500]">{index + 1}. </span>{week}
                </li>
              ))}
            </ol>
          </div>
        )}
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
