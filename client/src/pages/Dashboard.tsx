import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCertificate from "@/components/CourseCertificate";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Clock, Award, ArrowRight, TrendingUp, Download, ExternalLink, GraduationCap, Pencil, Check, X, CreditCard, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

interface CertificateState {
  open: boolean;
  courseTitle: string;
  completionDate: Date;
  certificateId: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: enrollments } = trpc.enrollments.myCourses.useQuery(undefined, { enabled: isAuthenticated });
  const { data: payments } = trpc.payments.myHistory.useQuery(undefined, { enabled: isAuthenticated });
  const { data: subscriptions } = trpc.payments.mySubscriptions.useQuery(undefined, { enabled: isAuthenticated });

  const [cert, setCert] = useState<CertificateState | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [certName, setCertName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingCert, setPendingCert] = useState<CertificateState | null>(null);

  const utils = trpc.useUtils();
  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      toast.success("Certificate name updated!");
      setEditingName(false);
    },
    onError: () => toast.error("Failed to update name"),
  });
  const openBillingPortal = trpc.payments.createBillingPortal.useMutation({
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
    onError: (error) => {
      toast.error(error.message || "Unable to open billing management. Please try again.");
    },
  });

  useEffect(() => {
    if (user?.name) setCertName(user.name);
  }, [user?.name]);

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

  function openCert(enrollment: typeof completedCourses[0]) {
    const courseId = enrollment.course?.id ?? enrollment.courseId;
    const certId = `SS-${courseId}-${user?.id ?? 0}-${new Date().getFullYear()}`;
    const certData: CertificateState = {
      open: true,
      courseTitle: enrollment.course?.title ?? "Course",
      completionDate: enrollment.completedAt ? new Date(enrollment.completedAt) : new Date(),
      certificateId: certId,
    };
    // If user has no name set, prompt them first
    if (!user?.name || user.name.trim() === "") {
      setPendingCert(certData);
      setCertName("");
      setShowNamePrompt(true);
    } else {
      setCert(certData);
    }
  }

  function confirmNameAndOpenCert() {
    if (!certName.trim()) { toast.error("Please enter your name"); return; }
    updateProfile.mutate({ name: certName.trim() }, {
      onSuccess: () => {
        setShowNamePrompt(false);
        if (pendingCert) { setCert(pendingCert); setPendingCert(null); }
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="brand-gradient text-white py-10">
        <div className="container">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name ?? ""} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-white">{(user?.name ?? "L")[0].toUpperCase()}</span>
              }
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-0.5">Welcome back, {user?.name?.split(" ")[0] ?? "Learner"}! 👋</h1>
              <p className="text-white/70 text-sm">Continue your learning journey</p>
              {/* Certificate name editor */}
              <div className="mt-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#F5B942] shrink-0" />
                <span className="text-white/60 text-xs">Certificate name:</span>
                {editingName ? (
                  <>
                    <Input
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") updateProfile.mutate({ name: certName.trim() }); if (e.key === "Escape") { setCertName(user?.name ?? ""); setEditingName(false); } }}
                      className="h-7 text-xs bg-white/10 border-white/30 text-white placeholder:text-white/40 w-48 focus:bg-white/20"
                      placeholder="Your full name"
                      autoFocus
                    />
                    <button onClick={() => updateProfile.mutate({ name: certName.trim() })} disabled={updateProfile.isPending} className="w-6 h-6 rounded-full bg-[#F5B942] flex items-center justify-center hover:bg-[#e8a020] transition-colors">
                      <Check className="h-3.5 w-3.5 text-[#0d1b3e]" />
                    </button>
                    <button onClick={() => { setCertName(user?.name ?? ""); setEditingName(false); }} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                      <X className="h-3.5 w-3.5 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-white text-xs font-semibold">{user?.name ?? <span className="text-white/40 italic">Not set</span>}</span>
                    <button onClick={() => { setCertName(user?.name ?? ""); setEditingName(true); }} className="flex items-center gap-1 text-[#F5B942] text-xs hover:text-[#e8a020] transition-colors">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
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
              { label: "Certificates", value: completedCourses.length, icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
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

          {/* Tabs */}
          <Tabs defaultValue="learning">
            <TabsList className="bg-white border border-border rounded-xl p-1 mb-6 h-auto gap-1">
              <TabsTrigger value="learning" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-1.5" /> My Courses
              </TabsTrigger>
              <TabsTrigger value="certificates" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm font-medium">
                <GraduationCap className="h-4 w-4 mr-1.5" /> My Certificates
                {completedCourses.length > 0 && (
                  <span className="ml-1.5 bg-[#F5B942] text-[#0d1b3e] text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {completedCourses.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm font-medium">
                <Clock className="h-4 w-4 mr-1.5" /> Payment History
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm font-medium">
                <CreditCard className="h-4 w-4 mr-1.5" /> My Plans
                {!!subscriptions?.length && (
                  <span className="ml-1.5 bg-[#F5B942] text-[#0d1b3e] text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {subscriptions.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── My Courses Tab ── */}
            <TabsContent value="learning">
              {/* In Progress */}
              {inProgressCourses.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-500" /> Continue Learning
                  </h2>
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
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" /> Completed Courses
                  </h2>
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
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/learn/${enrollment.course?.slug}`}>Review</Link>
                          </Button>
                          <Button size="sm" className="flex-1 bg-[#2A63BF] hover:bg-[#2A63BF]/90 text-white" onClick={() => openCert(enrollment)}>
                            <Award className="h-3.5 w-3.5 mr-1" /> Certificate
                          </Button>
                        </div>
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
            </TabsContent>

            {/* ── My Certificates Tab ── */}
            <TabsContent value="certificates">
              {completedCourses.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold">My Certificates</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {completedCourses.length} certificate{completedCourses.length !== 1 ? "s" : ""} earned
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedCourses.map((enrollment) => {
                      const courseId = enrollment.course?.id ?? enrollment.courseId;
                      const certId = `SS-${courseId}-${user?.id ?? 0}-${new Date().getFullYear()}`;
                      const completionDate = enrollment.completedAt
                        ? new Date(enrollment.completedAt)
                        : new Date();
                      const formattedDate = completionDate.toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      });

                      return (
                        <div
                          key={enrollment.id}
                          className="relative overflow-hidden rounded-2xl border border-[#F5B942]/30 shadow-md"
                          style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 60%, #0d1b3e 100%)" }}
                        >
                          {/* Decorative corners */}
                          <div style={{ position: "absolute", top: 0, left: 0, width: "80px", height: "80px", background: "linear-gradient(135deg, rgba(245,185,66,0.2) 0%, transparent 60%)", borderRadius: "0 0 100% 0" }} />
                          <div style={{ position: "absolute", bottom: 0, right: 0, width: "80px", height: "80px", background: "linear-gradient(315deg, rgba(245,185,66,0.2) 0%, transparent 60%)", borderRadius: "100% 0 0 0" }} />

                          {/* Gold border */}
                          <div style={{ position: "absolute", inset: "8px", border: "1px solid rgba(245,185,66,0.25)", borderRadius: "12px", pointerEvents: "none" }} />

                          <div className="relative z-10 p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <img
                                src={LOGO_URL}
                                alt="SkillSphere"
                                className="w-10 h-10 rounded-full border border-[#F5B942]/50"
                              />
                              <div>
                                <p className="text-white font-bold text-sm leading-tight">SkillSphere</p>
                                <p className="text-[#F5B942] text-xs">Empowering Skills. Building Futures.</p>
                              </div>
                              <div className="ml-auto">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5B942, #e8a020)" }}>
                                  <GraduationCap className="h-5 w-5 text-[#0d1b3e]" />
                                </div>
                              </div>
                            </div>

                            {/* Certificate label */}
                            <p className="text-[#F5B942] text-xs font-semibold tracking-widest uppercase mb-1">Certificate of Completion</p>

                            {/* Learner name */}
                            <p className="text-white text-xl font-bold mb-1 leading-tight">{user?.name ?? "Learner"}</p>

                            {/* Course title */}
                            <p className="text-white/70 text-sm mb-4 line-clamp-2">{enrollment.course?.title}</p>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#F5B942]/40 to-transparent mb-4" />

                            {/* Footer meta */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-white/50 text-xs uppercase tracking-wide">Issued by</p>
                                <p className="text-white text-sm font-semibold">Dr. Vicki Bealman</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/50 text-xs uppercase tracking-wide">Completed</p>
                                <p className="text-white text-sm font-semibold">{formattedDate}</p>
                              </div>
                            </div>

                            {/* Cert ID */}
                            <p className="text-white/30 text-xs mb-4">ID: {certId}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-[#F5B942] hover:bg-[#e8a020] text-[#0d1b3e] font-semibold"
                                onClick={() => openCert(enrollment)}
                              >
                                <Download className="h-3.5 w-3.5 mr-1.5" /> View & Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                                asChild
                              >
                                <Link href={`/learn/${enrollment.course?.slug}`}>
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Course
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2A63BF]/10 to-[#F5B942]/10 border-2 border-[#F5B942]/20 flex items-center justify-center mx-auto mb-5">
                    <GraduationCap className="h-10 w-10 text-[#2A63BF]/40" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Complete a course to earn your first certificate of completion, issued by Dr. Vicki Bealman.
                  </p>
                  <Button asChild className="bg-[#2A63BF] hover:bg-[#2A63BF]/90 text-white">
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* ── Payment History Tab ── */}
            <TabsContent value="payments">
              {payments && payments.length > 0 ? (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-bold text-foreground">Payment History</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {payments.map((p: any) => (
                      <div key={p.id} className="px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.course?.title ?? "Course Purchase"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">${parseFloat(p.amount ?? "0").toFixed(2)}</p>
                          <Badge className="text-xs bg-green-100 text-green-700 border-green-200">{p.status ?? "completed"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-border">
                  <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                  <p className="text-muted-foreground mb-6">Your purchase history will appear here.</p>
                  <Button asChild><Link href="/courses">Browse Courses</Link></Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="subscriptions">
              {subscriptions && subscriptions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Your Plans</h2>
                      <p className="text-sm text-muted-foreground">Review the status and renewal timing for your SkillSphere subscriptions.</p>
                    </div>
                    <p className="text-xs text-muted-foreground">For plan changes, use the billing link in your subscription email.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {subscriptions.map((subscription: any) => {
                      const active = subscription.status === "active" || subscription.status === "trialing";
                      const renewalDate = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : null;
                      return (
                        <div key={subscription.id} className="bg-white rounded-xl border border-border p-5 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">SkillSphere Learning Plan</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Subscription ID: {subscription.stripeSubscriptionId?.slice(-8) ?? "Pending"}</p>
                              </div>
                            </div>
                            <Badge className={active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                              {subscription.status}
                            </Badge>
                          </div>
                          <div className="mt-5 rounded-lg bg-gray-50 px-3.5 py-3 flex items-center gap-2.5">
                            <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                            <div className="text-sm">
                              <span className="font-medium text-foreground">
                                {subscription.cancelAtPeriodEnd ? "Access ends" : "Next renewal"}
                              </span>
                              <span className="text-muted-foreground"> {renewalDate ? `on ${renewalDate}` : "will be confirmed by email"}</span>
                            </div>
                          </div>
                          {subscription.cancelAtPeriodEnd && (
                            <p className="mt-3 text-xs text-amber-700">This plan is set to end at the close of the current billing period.</p>
                          )}
                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                            <p className="text-xs text-muted-foreground">Update payment details, change, or cancel your plan securely through Stripe.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
                              onClick={() => openBillingPortal.mutate({ origin: window.location.origin })}
                              disabled={openBillingPortal.isPending}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                              {openBillingPortal.isPending ? "Opening…" : "Manage Plan"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-border">
                  <CreditCard className="h-12 w-12 text-primary/25 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active plans</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">When you subscribe to a SkillSphere learning plan, its status and renewal details will appear here.</p>
                  <Button asChild><Link href="/courses">Explore Courses</Link></Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />

      {/* Certificate Modal */}
      {cert && (
        <CourseCertificate
          open={cert.open}
          onClose={() => setCert(null)}
          learnerName={certName.trim() || user?.name || "Learner"}
          courseTitle={cert.courseTitle}
          completionDate={cert.completionDate}
          certificateId={cert.certificateId}
        />
      )}

      {/* Name Prompt Dialog — shown when user has no name set */}
      <Dialog open={showNamePrompt} onOpenChange={(v) => { if (!v) { setShowNamePrompt(false); setPendingCert(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#F5B942]" />
              Set Your Certificate Name
            </DialogTitle>
            <DialogDescription>
              Enter your full name exactly as you want it to appear on your certificate. This will also update your profile name.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <Input
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmNameAndOpenCert(); }}
                placeholder="e.g. Jane Smith"
                className="w-full"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#2A63BF] hover:bg-[#2A63BF]/90 text-white"
                onClick={confirmNameAndOpenCert}
                disabled={updateProfile.isPending || !certName.trim()}
              >
                {updateProfile.isPending ? "Saving..." : "Save & View Certificate"}
              </Button>
              <Button variant="outline" onClick={() => { setShowNamePrompt(false); setPendingCert(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
