import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, BookOpen, Users, Award, TrendingUp, Star, CheckCircle,
  Play, MessageSquare, BarChart3, Shield, Zap, Globe
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const LOGO_URL = "/manus-storage/skillsphere-logo_e90b0563.png";
const LOGO_CIRCLE_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

const STATS = [
  { label: "Active Learners", value: "10,000+", icon: Users },
  { label: "Expert Courses", value: "200+", icon: BookOpen },
  { label: "Completion Rate", value: "94%", icon: Award },
  { label: "Organizations", value: "500+", icon: Globe },
];

const FEATURES = [
  { icon: Play, title: "Rich Course Content", desc: "Video, text, and interactive assessments in one seamless experience.", color: "text-blue-600 bg-blue-50" },
  { icon: MessageSquare, title: "Discussion & Chat", desc: "Per-course boards and real-time chat keep learners and instructors connected.", color: "text-purple-600 bg-purple-50" },
  { icon: BarChart3, title: "Progress Analytics", desc: "Track completion, engagement, and revenue with detailed dashboards.", color: "text-green-600 bg-green-50" },
  { icon: Shield, title: "Secure Payments", desc: "Stripe-powered checkout with coupons, bundles, and subscriptions.", color: "text-yellow-600 bg-yellow-50" },
  { icon: Users, title: "Role-Based Access", desc: "Distinct experiences for admins, trainers, and learners.", color: "text-red-600 bg-red-50" },
  { icon: Zap, title: "Instant Enrollment", desc: "One-click enrollment for free courses; seamless checkout for paid content.", color: "text-indigo-600 bg-indigo-50" },
];

const PILLARS = [
  {
    icon: '🤖',
    title: 'AI-Driven Workforce Solutions',
    color: '#2A63BF',
    bg: '#eff6ff',
    border: '#2A63BF22',
    body: "Gone are the days of one-size-fits-all training. SkillSphere harnesses the power of artificial intelligence to deliver personalized learning journeys that adapt in real time to each employee's pace, role, and performance. Our intelligent platform identifies skill gaps before they become business gaps — keeping your organization agile, competitive, and future-ready.",
  },
  {
    icon: '🎯',
    title: 'Competency-Based Training Models',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#7c3aed22',
    body: "We don't just train employees — we engineer expertise. SkillSphere's competency-based framework breaks every role down into its essential tasks, behaviors, and skills. The result? Laser-focused training that targets exactly what matters, eliminates wasted time, and delivers measurable performance improvements your leadership team can actually see.",
  },
  {
    icon: '🏢',
    title: 'Custom Learning Solutions for Enterprises',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#05966922',
    body: "No two businesses are alike, and your training program shouldn't be either. SkillSphere partners closely with your team to design bespoke learning experiences — from onboarding to leadership development — that align with your culture, industry, and strategic goals. Scalable, flexible, and built entirely around you.",
  },
  {
    icon: '🧠',
    title: 'Institutional Knowledge Optimization',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#d9770622',
    body: "Your organization's greatest asset is the expertise living inside your people. SkillSphere captures, structures, and amplifies that knowledge — transforming it into accessible, transferable learning content that survives turnover, fuels growth, and ensures your best practices endure for generations.",
  },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "HR Director", text: "SkillSphere transformed our onboarding. Our team's productivity increased by 40% in just three months.", avatar: "SM" },
  { name: "James K.", role: "Senior Trainer", text: "The platform is intuitive and powerful. I can create and publish courses in hours, not days.", avatar: "JK" },
  { name: "Priya R.", role: "Learner", text: "The discussion boards and live chat make learning feel personal even in an online environment.", avatar: "PR" },
];

function PillarsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = PILLARS.length;

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  const pillar = PILLARS[active];

  return (
    <div
      className="relative max-w-2xl mx-auto mb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Previous pillar"
        className="absolute -left-5 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Card */}
      <div
        key={active}
        className="rounded-2xl p-8 transition-all duration-300 hover:shadow-xl"
        style={{
          background: pillar.bg,
          border: `1.5px solid ${pillar.border}`,
          animation: 'pillarFadeIn 0.35s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{pillar.icon}</span>
          <h3 className="text-xl font-bold" style={{ color: pillar.color }}>{pillar.title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{pillar.body}</p>
        {/* Progress indicator inside card */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: pillar.color }}>{active + 1} / {total}</span>
          <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((active + 1) / total) * 100}%`, background: pillar.color }}
            />
          </div>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next pillar"
        className="absolute -right-5 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {PILLARS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to pillar ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === active ? '28px' : '10px',
              height: '10px',
              borderRadius: '9999px',
              background: i === active ? p.color : '#d1d5db',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pillarFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="section-padding bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trusted by <span className="brand-gradient-text">Thousands</span>
          </h2>
        </div>

        {/* Card + arrows */}
        <div className="relative max-w-2xl mx-auto">
          {/* Prev button */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-5 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Card */}
          <div
            key={active}
            className="bg-white rounded-2xl p-8 border border-border shadow-md"
            style={{ animation: 'testimonialFadeIn 0.35s cubic-bezier(0.23,1,0.32,1)' }}
          >
            {/* Quote mark */}
            <div className="text-5xl font-serif leading-none text-primary/20 mb-2 select-none">&ldquo;</div>
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            {/* Text */}
            <p className="text-base md:text-lg text-muted-foreground italic leading-relaxed mb-6">
              &ldquo;{TESTIMONIALS[active].text}&rdquo;
            </p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow">
                {TESTIMONIALS[active].avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">{TESTIMONIALS[active].name}</p>
                <p className="text-sm text-muted-foreground">{TESTIMONIALS[active].role}</p>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-5 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === active ? '28px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                background: i === active ? 'var(--primary)' : '#d1d5db',
              }}
            />
          ))}
        </div>
      </div>

      {/* Keyframe for card entrance */}
      <style>{`
        @keyframes testimonialFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </section>
  );
}

// ─── Featured Courses Carousel ──────────────────────────────────────────────

type CourseItem = {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string | null;
  thumbnailUrl?: string | null;
  price?: string | null;
  isFree?: boolean | null;
  level?: string | null;
  category?: string | null;
  rating?: string | null;
  ratingCount?: number | null;
  enrollmentCount?: number | null;
  totalModules?: number | null;
  trainerName?: string | null;
};

function FeaturedCoursesCarousel({ courses }: { courses: CourseItem[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (courses.length === 0) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Courses coming soon. Check back shortly!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">Featured Courses</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Expand Your <span className="brand-gradient-text">Professional Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover expert-led courses designed to advance your career and empower your organization.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-8 md:px-12">
          <Carousel
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
            plugins={[autoplayRef.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {courses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full">
                    <CourseCard {...course} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Prev button */}
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Previous course"
              className="absolute -left-1 md:-left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next button */}
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Next course"
              className="absolute -right-1 md:-right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </Carousel>
        </div>

        {/* Dot indicators */}
        {count > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === current ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '9999px',
                  background: i === current ? 'var(--primary)' : '#d1d5db',
                }}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link href="/courses">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: courses } = trpc.courses.list.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden brand-gradient text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🚀 Workforce Development Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Empower Your
                <span className="block" style={{ color: "#F5B942" }}>Workforce Skills</span>
              </h1>
              <p
                className="font-semibold uppercase mb-6 text-[10px] sm:text-xs md:text-sm leading-relaxed animate-fade-in-up stagger-3"
                style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em' }}
              >
                <span className="inline sm:hidden">Individuals&nbsp;|&nbsp;Teams&nbsp;|<br />Organizations&nbsp;|&nbsp;Educational Institutions</span>
                <span className="hidden sm:inline">Individuals&nbsp;&nbsp;|&nbsp;&nbsp;Teams&nbsp;&nbsp;|&nbsp;&nbsp;Organizations&nbsp;&nbsp;|&nbsp;&nbsp;Educational Institutions</span>
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
                A secure, interactive platform where professionals and organizations learn, collaborate, and advance workforce capabilities through world-class courses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link href="/courses">
                    Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 bg-transparent"
                    asChild
                  >
                    <a href={getLoginUrl("/dashboard")}>Start Learning Free</a>
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> Free courses available</span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden md:flex justify-center animate-fade-in-up stagger-2">
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <img src={LOGO_CIRCLE_URL} alt="SkillSphere" className="w-full h-full object-cover drop-shadow-2xl" />
                </div>
                {/* Company name + tagline below the circle */}
                <div className="mt-5 text-center">
                  <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>SkillSphere</p>
                  <p className="text-sm mt-0.5 font-medium" style={{ fontFamily: 'Lato, sans-serif', color: '#F5B942' }}>Empowering Skills. Building Futures.</p>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-8 bg-white rounded-xl shadow-xl p-3 text-gray-900 text-xs font-medium animate-pulse-glow">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span>Course Completed!</span>
                  </div>
                </div>
                {/* 7 o'clock = 210°: x = 144 + 144*cos(210°) ≈ 19, y = 144 + 144*sin(210°) ≈ 216 from top-left of circle */}
                <div className="absolute bg-white rounded-xl shadow-xl p-3 text-gray-900 text-xs font-medium animate-pulse-glow" style={{ top: '196px', left: '-44px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    </div>
                    <span><span className="font-bold">4.9</span> Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Courses Carousel ─────────────────────────────────────── */}
      <FeaturedCoursesCarousel courses={courses ?? []} />

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-secondary/20 text-yellow-700 border-secondary/30">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="brand-gradient-text">Succeed</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={feature.title} className={`p-6 rounded-xl border border-border hover:shadow-md transition-shadow animate-fade-in-up stagger-${Math.min(i + 1, 4)}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section-padding brand-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your <span style={{ color: "#F5B942" }}>Future?</span>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of professionals advancing their careers with SkillSphere's expert-led courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" asChild>
                <a href={getLoginUrl("/dashboard")}>Create Free Account</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Transforming Workforce Potential ─────────────────────────────── */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Geometric background pattern */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#2A63BF" fillOpacity="0.07" />
            </pattern>
            <pattern id="hex-lines" x="0" y="0" width="60" height="104" patternUnits="userSpaceOnUse">
              <path d="M30 2 L58 17 L58 47 L30 62 L2 47 L2 17 Z" fill="none" stroke="#2A63BF" strokeOpacity="0.04" strokeWidth="1" />
              <path d="M30 54 L58 69 L58 99 L30 114 L2 99 L2 69 Z" fill="none" stroke="#f59e0b" strokeOpacity="0.04" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
          <rect width="100%" height="100%" fill="url(#hex-lines)" />
        </svg>
        {/* Soft radial glow top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(42,99,191,0.08) 0%, transparent 70%)' }}
        />
        {/* Soft radial glow bottom-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }}
        />
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Why SkillSphere</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              SkillSphere for Organizations: <span style={{color: '#2A63BF'}}>Transforming</span> Workforce Potential
            </h2>
            <p className="text-xl text-gray-500 font-medium">Empowering People. Elevating Organizations.</p>
            <div className="mt-6 mx-auto w-20 h-1 rounded-full" style={{background: 'linear-gradient(90deg, #2A63BF, #f59e0b)'}} />
          </div>

          {/* Intro paragraph */}
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
            In a world where skills become obsolete overnight, SkillSphere equips your workforce with the tools, knowledge, and confidence to stay ahead — not just today, but for every challenge tomorrow brings.
          </p>

          {/* Four pillars carousel */}
          <PillarsCarousel />

          {/* Closing statement */}
          <div className="text-center rounded-2xl py-12 px-8" style={{ background: 'linear-gradient(135deg, #1e3a6e 0%, #2A63BF 60%, #4a90d9 100%)' }}>
            <p className="text-white text-xl font-medium mb-6 leading-relaxed">
              At SkillSphere, we believe that when people grow, businesses thrive.<br />
              <span className="font-bold">Let's build a smarter, stronger workforce — together.</span>
            </p>
            <p className="text-blue-100 mb-8">Ready to invest in your team's future?</p>
            <a
              href="/contact"
              className="group relative inline-flex items-center gap-3 font-bold text-lg px-10 py-4 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
                backgroundSize: '200% 100%',
                color: '#1e3a6e',
                transition: 'transform 0.2s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s cubic-bezier(0.23,1,0.32,1), background-position 0.4s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.06) translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 20px 40px rgba(245,158,11,0.45)';
                (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = '100% 0';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1) translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.25)';
                (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = '0% 0';
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.97) translateY(0)';
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.06) translateY(-2px)';
              }}
            >
              {/* Shimmer overlay */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                }}
              />
              <span>Get Started with SkillSphere</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Carousel ─────────────────────────────────────── */}
      <TestimonialsCarousel />

      <Footer />
    </div>
  );
}
