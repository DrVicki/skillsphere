import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Code2, GraduationCap, LogIn, MousePointerClick, PlayCircle, Users } from "lucide-react";
import { Link } from "wouter";

const steps = [
  {
    number: 1,
    icon: BookOpen,
    label: "Find Python Forge",
    title: "Open the Python Forge course",
    body: "From SkillSphere, choose Courses and search for Python Forge — Learn by Building. Open the course card to view the course description and learning path.",
    screen: "Courses",
    detail: "Look for the course titled Python Forge — Learn by Building. You can also open it directly with the course button below.",
  },
  {
    number: 2,
    icon: LogIn,
    label: "Sign up or log in",
    title: "Use the email your instructor invited",
    body: "Choose Sign Up if you are new to SkillSphere, or Sign In if you already have an account. Use the same email address your instructor added to the classroom roster.",
    screen: "Sign Up / Sign In",
    detail: "Your email is the connection between your account and the classroom invitation. Classroom access is provided by the instructor; students do not pay again for an assigned seat.",
  },
  {
    number: 3,
    icon: Users,
    label: "Join automatically",
    title: "Your classroom assignment connects automatically",
    body: "After your first successful sign-in, SkillSphere matches your email to the classroom invitation. Your Python Forge course enrollment is created or activated automatically.",
    screen: "Classroom matched",
    detail: "If your account already existed, access is normally immediate. If you created the account during sign-in, the pending assignment activates after authentication.",
  },
  {
    number: 4,
    icon: GraduationCap,
    label: "Open Dashboard",
    title: "Find the classroom and assigned course",
    body: "Open Dashboard and look in My Classrooms or My Courses. Select Python Forge, then choose Start Learning or Continue Learning.",
    screen: "Dashboard",
    detail: "Your classroom card shows the class name and assigned course. The course card shows your progress and takes you back to your next lesson.",
  },
  {
    number: 5,
    icon: Code2,
    label: "Start learning",
    title: "Read, code, save, and complete",
    body: "Inside the course player, work through the lessons in order. Open each embedded Code Lab, run the examples, save your Python, complete activities, and mark lessons complete.",
    screen: "Course player",
    detail: "Your Python Forge Lab Progress panel tracks saved labs. Return to any lesson to continue from the latest saved version of your code.",
  },
];

export default function PythonForgeStudentPath() {
  const [selected, setSelected] = useState(0);
  const active = steps[selected];
  const Icon = active.icon;

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-[#2A63BF]/25 bg-white shadow-sm" aria-labelledby="python-forge-student-path-title">
      <div className="bg-gradient-to-r from-[#102A56] via-[#1F56A6] to-[#168C83] p-5 text-white sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white/15 p-2.5" aria-hidden="true"><Code2 className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Python Forge student path</p>
            <h3 id="python-forge-student-path-title" className="mt-1 text-xl font-bold sm:text-2xl">From invitation to your first Code Lab</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50">Follow the five-step path below. Your instructor’s classroom invitation connects your SkillSphere account to Python Forge automatically.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border-b border-slate-200 bg-slate-50 p-4 lg:border-b-0 lg:border-r sm:p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Your navigation map</p>
          <ol className="relative space-y-2" aria-label="Python Forge onboarding steps">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === selected;
              return (
                <li key={step.number} className="relative">
                  {index < steps.length - 1 && <span className="absolute left-[17px] top-9 h-7 w-px bg-slate-200" aria-hidden="true" />}
                  <button
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-current={isActive ? "step" : undefined}
                    className={`relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] ${isActive ? "bg-white shadow-sm ring-1 ring-[#2A63BF]/25" : "hover:bg-white/80"}`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-[#2A63BF] text-white" : "bg-white text-[#2A63BF] ring-1 ring-slate-200"}`}>
                      <StepIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">Step {step.number}</span>
                      <span className={`block truncate text-sm font-semibold ${isActive ? "text-[#163D78]" : "text-slate-700"}`}>{step.label}</span>
                    </span>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-[#2A63BF]" : "text-slate-300"}`} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/courses/python-forge-learn-by-building" className="inline-flex items-center gap-1.5 rounded-lg bg-[#2A63BF] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1e4e9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2">
              Open course page <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A63BF]/25 bg-white px-3 py-2 text-xs font-semibold text-[#1e4e9e] transition-colors hover:bg-[#EEF4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF] focus-visible:ring-offset-2">
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#EEF4FF] p-2.5 text-[#2A63BF]" aria-hidden="true"><Icon className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#2A63BF]">Step {active.number} · {active.screen}</p>
              <h4 className="mt-1 text-lg font-bold text-slate-900">{active.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">{active.body}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-950 p-4 text-white shadow-inner" aria-label={`Illustration of the ${active.screen} step`}>
            <div className="mb-3 flex items-center gap-1.5 border-b border-white/10 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] font-medium text-slate-400">SkillSphere · {active.screen}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-2 rounded-lg bg-white/5 p-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300"><MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" /> You are here</div>
                <div className="h-2 w-4/5 rounded bg-white/15" />
                <div className="h-2 w-3/5 rounded bg-white/10" />
                <div className="h-2 w-2/3 rounded bg-white/10" />
              </div>
              <div className="rounded-lg bg-white p-3 text-slate-900">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#163D78]">{active.screen}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{active.detail}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#2A63BF]"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> Continue to the next step</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-500">Select a step on the left to see what to look for.</p>
            <button type="button" onClick={() => setSelected((selected + 1) % steps.length)} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2A63BF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A63BF]">Next step <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
