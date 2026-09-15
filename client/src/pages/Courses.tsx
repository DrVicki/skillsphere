import { useState } from "react";
import { trpc } from "@/lib/trpc";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, BookOpen, Filter, X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = ["Leadership", "Technology", "Communication", "Project Management", "HR & Compliance", "Sales", "Finance", "Health & Safety"];
const LEVELS = ["beginner", "intermediate", "advanced"];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [isFree, setIsFree] = useState<boolean | undefined>();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [recommendationGoal, setRecommendationGoal] = useState("");
  const [recommendationExperience, setRecommendationExperience] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [weeklyTime, setWeeklyTime] = useState<"under-1-hour" | "1-to-3-hours" | "3-to-5-hours" | "5-plus-hours">("1-to-3-hours");

  const { data: courses, isLoading } = trpc.courses.list.useQuery({
    search: debouncedSearch || undefined,
    category,
    level,
    isFree,
    limit: 24,
  });
  const recommendCourses = trpc.recommendations.generate.useMutation();
  const recommendationResults = recommendCourses.data?.recommendations ?? [];

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const clearFilters = () => {
    setSearch(""); setDebouncedSearch(""); setCategory(undefined); setLevel(undefined); setIsFree(undefined);
  };

  const hasFilters = debouncedSearch || category || level || isFree !== undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="brand-gradient text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <Badge className="mb-3 bg-white/20 text-white border-white/30">Course Catalog</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore Our Courses</h1>
            <p className="text-white/80">Discover expert-led workforce development courses tailored to your career goals.</p>
          </div>
        </div>
      </section>

      {/* AI Course Finder */}
      <section className="border-b border-primary/10 bg-gradient-to-br from-primary/[0.06] via-white to-[#F5B942]/10">
        <div className="container py-8 md:py-10">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI Course Finder
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Find your next best course</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Tell SkillSphere what you want to accomplish and how much time you have. We will match you with up to three relevant courses from the current catalog.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Select value={recommendationExperience} onValueChange={(value) => setRecommendationExperience(value as typeof recommendationExperience)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Experience level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">I am new to this topic</SelectItem>
                    <SelectItem value="intermediate">I have some experience</SelectItem>
                    <SelectItem value="advanced">I am ready for advanced work</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={weeklyTime} onValueChange={(value) => setWeeklyTime(value as typeof weeklyTime)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Weekly time" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1-hour">Under 1 hour each week</SelectItem>
                    <SelectItem value="1-to-3-hours">1–3 hours each week</SelectItem>
                    <SelectItem value="3-to-5-hours">3–5 hours each week</SelectItem>
                    <SelectItem value="5-plus-hours">5+ hours each week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                className="mt-3 min-h-24 resize-y bg-white"
                maxLength={600}
                placeholder="Example: I lead a small business and want practical ways to use AI responsibly for marketing, operations, and planning."
                value={recommendationGoal}
                onChange={(event) => setRecommendationGoal(event.target.value)}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => recommendCourses.mutate({ goal: recommendationGoal, experience: recommendationExperience, weeklyTime })}
                  disabled={recommendationGoal.trim().length < 8 || recommendCourses.isPending}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {recommendCourses.isPending ? "Finding matches…" : "Recommend Courses"}
                </Button>
                <span className="text-xs text-muted-foreground">Your response is used only to generate this recommendation.</span>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-white/90 p-5 shadow-sm backdrop-blur">
              {recommendCourses.isError ? (
                <div className="py-5 text-center">
                  <p className="font-semibold text-foreground">We could not generate matches right now.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Please try again or browse the filters below.</p>
                </div>
              ) : recommendationResults.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-foreground">Recommended for you</h3>
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">{recommendCourses.data?.generatedBy === "ai" ? "AI-matched" : "Catalog-matched"}</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {recommendationResults.map(({ course, reason }) => (
                      <Link key={course.id} href={`/courses/${course.slug}`} className="group block rounded-xl border border-border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                            {course.thumbnailUrl ? <img src={course.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <BookOpen className="m-3 h-4 w-4 text-primary" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2"><p className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">{course.title}</p><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" /></div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{reason}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-60 flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5B942]/15 text-[#b77900]"><Sparkles className="h-5 w-5" /></div>
                  <h3 className="mt-4 font-semibold text-foreground">Personalized picks will appear here</h3>
                  <p className="mt-1 max-w-xs text-sm leading-5 text-muted-foreground">Share a goal to receive focused recommendations from the SkillSphere catalog.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="container py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category ?? "all"} onValueChange={(v) => setCategory(v === "all" ? undefined : v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={level ?? "all"} onValueChange={(v) => setLevel(v === "all" ? undefined : v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((l) => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              variant={isFree === true ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFree(isFree === true ? undefined : true)}
            >
              Free Only
            </Button>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 bg-gray-50 py-10">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing <strong>{courses.length}</strong> course{courses.length !== 1 ? "s" : ""}
                {hasFilters && " matching your filters"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
