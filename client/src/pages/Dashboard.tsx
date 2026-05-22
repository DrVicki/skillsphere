import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: enrollments } = trpc.enrollments.myCourses.useQuery(undefined, { enabled: isAuthenticated });
  const { data: payments } = trpc.payments.myHistory.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <BookOpen className="h-14 w-14 text-primary/30" />
        <h2 className="text-2xl font-bold">Sign in to access your dashboard</h2>
        <p className="text-muted-foreground max-w-sm">Track your learning progress, access enrolled courses, and manage your profile.</p>
        <Button asChild><a href={getLoginUrl("/dashboard")}>Sign In</a></Button>
      </div>
    </div>
  );

  const completedCourses = enrollments?.filter((e) => e.progressPercent === 100) ?? [];
  const inProgressCourses = enrollments?.filter((e) => (e.progressPercent ?? 0) < 100) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="brand-gradient text-white py-10">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {user?.name?.split(" ")[0] ?? "Learner"}! 👋</h1>
          <p className="text-white/70">Continue your learning journey</p>
        </div>
      </section>

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Enrolled Courses", value: enrollments?.length ?? 0, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
              { label: "In Progress", value: inProgressCourses.length, icon: TrendingUp, color: "text-yellow-600 bg-yellow-50" },
              { label: "Completed", value: completedCourses.length, icon: Award, color: "text-green-600 bg-green-50" },
              { label: "Purchases", value: payments?.length ?? 0, icon: Clock, color: "text-purple-600 bg-purple-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* In Progress */}
          {inProgressCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressCourses.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-xl border border-border p-4 card-hover">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2">{enrollment.course?.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{enrollment.course?.level ?? "Course"}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{enrollment.progressPercent ?? 0}%</span>
                      </div>
                      <Progress value={enrollment.progressPercent ?? 0} className="h-2" />
                    </div>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link href={`/learn/${enrollment.course?.slug}`}>
                        Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Completed Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedCourses.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2">{enrollment.course?.title}</h3>
                        <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 text-xs">Completed</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href={`/learn/${enrollment.course?.slug}`}>Review Course</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!enrollments || enrollments.length === 0) && (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <BookOpen className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course.</p>
              <Button asChild><Link href="/courses">Browse Courses</Link></Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
