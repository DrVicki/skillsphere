import { useState } from "react";
import { trpc } from "@/lib/trpc";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Filter, X } from "lucide-react";

const CATEGORIES = ["Leadership", "Technology", "Communication", "Project Management", "HR & Compliance", "Sales", "Finance", "Health & Safety"];
const LEVELS = ["beginner", "intermediate", "advanced"];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [isFree, setIsFree] = useState<boolean | undefined>();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: courses, isLoading } = trpc.courses.list.useQuery({
    search: debouncedSearch || undefined,
    category,
    level,
    isFree,
    limit: 24,
  });

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
            <Select value={category ?? ""} onValueChange={(v) => setCategory(v || undefined)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={level ?? ""} onValueChange={(v) => setLevel(v || undefined)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
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
