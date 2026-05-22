import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus, BookOpen, Users, BarChart3, Edit, Trash2, Eye, EyeOff,
  Upload, Video, FileText, ClipboardList, DollarSign, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const CATEGORIES = ["Leadership", "Technology", "Communication", "Project Management", "HR & Compliance", "Sales", "Finance", "Health & Safety"];

export default function TrainerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const [courseForm, setCourseForm] = useState({
    title: "", shortDescription: "", description: "", price: "0", isFree: true,
    category: "", level: "beginner" as "beginner" | "intermediate" | "advanced",
    thumbnailUrl: "", tags: "",
  });
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [moduleForm, setModuleForm] = useState({
    title: "", type: "text" as "video" | "text" | "assessment",
    content: "", videoUrl: "", duration: 0, isPreview: false, order: 0,
  });
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

  const { data: myCourses, refetch: refetchCourses } = trpc.courses.myTrainerCourses.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myModules, refetch: refetchModules } = trpc.modules.byCourse.useQuery(activeCourseId ?? 0, { enabled: !!activeCourseId });
  const { data: analytics } = trpc.analytics.trainerStats.useQuery(undefined, { enabled: isAuthenticated });

  const createCourse = trpc.courses.create.useMutation({
    onSuccess: () => { toast.success("Course created!"); setCourseDialogOpen(false); refetchCourses(); resetCourseForm(); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateCourse = trpc.courses.update.useMutation({
    onSuccess: () => { toast.success("Course updated!"); setCourseDialogOpen(false); refetchCourses(); resetCourseForm(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteCourse = trpc.courses.delete.useMutation({
    onSuccess: () => { toast.success("Course deleted!"); refetchCourses(); },
    onError: (e: any) => toast.error(e.message),
  });

  const publishCourse = trpc.courses.update.useMutation({
    onSuccess: () => { toast.success("Course status updated!"); refetchCourses(); },
    onError: (e: any) => toast.error(e.message),
  });

  const createModule = trpc.modules.create.useMutation({
    onSuccess: () => { toast.success("Module added!"); setModuleDialogOpen(false); refetchModules(); resetModuleForm(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteModule = trpc.modules.delete.useMutation({
    onSuccess: () => { toast.success("Module deleted!"); refetchModules(); },
    onError: (e: any) => toast.error(e.message),
  });

  const resetCourseForm = () => {
    setCourseForm({ title: "", shortDescription: "", description: "", price: "0", isFree: true, category: "", level: "beginner", thumbnailUrl: "", tags: "" });
    setEditingCourseId(null);
  };

  const resetModuleForm = () => {
    setModuleForm({ title: "", type: "text", content: "", videoUrl: "", duration: 0, isPreview: false, order: 0 });
  };

  const openEditCourse = (course: any) => {
    setCourseForm({
      title: course.title, shortDescription: course.shortDescription ?? "",
      description: course.description ?? "", price: course.price ?? "0",
      isFree: course.isFree, category: course.category ?? "", level: course.level ?? "beginner",
      thumbnailUrl: course.thumbnailUrl ?? "", tags: Array.isArray(course.tags) ? course.tags.join(", ") : "",
    });
    setEditingCourseId(course.id);
    setCourseDialogOpen(true);
  };

  const handleSaveCourse = () => {
    const data = {
      ...courseForm,
      price: courseForm.isFree ? "0" : courseForm.price,
      tags: courseForm.tags ? courseForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    if (editingCourseId) {
      updateCourse.mutate({ id: editingCourseId, ...data });
    } else {
      createCourse.mutate(data);
    }
  };

  const handleSaveModule = () => {
    if (!activeCourseId) return;
    const { order, ...rest } = moduleForm;
    createModule.mutate({ courseId: activeCourseId, ...rest, sortOrder: order });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Trainer access required</h2>
        <Button asChild><a href={getLoginUrl("/trainer")}>Sign In</a></Button>
      </div>
    </div>
  );

  if (user?.role !== "trainer" && user?.role !== "admin") return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold">Trainer access required</h2>
        <p className="text-muted-foreground">Contact an admin to upgrade your account to trainer status.</p>
        <Button asChild><Link href="/dashboard">Back to Dashboard</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="brand-gradient text-white py-10">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Trainer Dashboard</h1>
            <p className="text-white/70">Manage your courses and track learner progress</p>
          </div>
          <Dialog open={courseDialogOpen} onOpenChange={(open) => { setCourseDialogOpen(open); if (!open) resetCourseForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Plus className="h-4 w-4 mr-2" /> New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCourseId ? "Edit Course" : "Create New Course"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label>Course Title *</Label>
                  <Input placeholder="e.g. Leadership Fundamentals" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Short Description</Label>
                  <Input placeholder="Brief overview (shown in cards)" value={courseForm.shortDescription} onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Full Description</Label>
                  <Textarea placeholder="Detailed course description..." value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows={4} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={courseForm.category} onValueChange={(v) => setCourseForm({ ...courseForm, category: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Level</Label>
                    <Select value={courseForm.level} onValueChange={(v: any) => setCourseForm({ ...courseForm, level: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Thumbnail URL</Label>
                  <Input placeholder="https://..." value={courseForm.thumbnailUrl} onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input placeholder="leadership, management, skills" value={courseForm.tags} onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })} className="mt-1" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="isFree" checked={courseForm.isFree} onCheckedChange={(v) => setCourseForm({ ...courseForm, isFree: v })} />
                    <Label htmlFor="isFree">Free Course</Label>
                  </div>
                  {!courseForm.isFree && (
                    <div className="flex-1">
                      <Label>Price (USD)</Label>
                      <Input type="number" min="0" step="0.01" placeholder="29.99" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} className="mt-1" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setCourseDialogOpen(false); resetCourseForm(); }}>Cancel</Button>
                  <Button onClick={handleSaveCourse} disabled={createCourse.isPending || updateCourse.isPending || !courseForm.title} className="bg-primary hover:bg-primary/90 text-white">
                    {editingCourseId ? "Update Course" : "Create Course"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container">
          {/* Analytics Summary */}
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Courses", value: analytics.totalCourses, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
                { label: "Total Learners", value: analytics.totalEnrollments, icon: Users, color: "text-green-600 bg-green-50" },
                { label: "Revenue", value: `$${parseFloat(analytics.totalRevenue ?? "0").toFixed(0)}`, icon: DollarSign, color: "text-yellow-600 bg-yellow-50" },
                { label: "Avg. Rating", value: analytics.avgRating ? parseFloat(analytics.avgRating).toFixed(1) : "N/A", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
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
          )}

          {/* Courses Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden mb-8">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">My Courses</h2>
            </div>
            {myCourses && myCourses.length > 0 ? (
              <div className="divide-y divide-border">
                {myCourses.map((course) => (
                  <div key={course.id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground text-sm">{course.title}</h3>
                        <Badge variant={course.isPublished ? "default" : "secondary"} className={`text-xs ${course.isPublished ? "bg-green-100 text-green-700 border-green-200" : ""}`}>
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {course.isFree ? <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">Free</Badge> : <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">${course.price}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{course.enrollmentCount} learners · {course.totalModules} modules</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => publishCourse.mutate({ id: course.id, isPublished: !course.isPublished })} title={course.isPublished ? "Unpublish" : "Publish"}>
                        {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setActiveCourseId(course.id); }} title="Manage Modules">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditCourse(course)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this course?")) deleteCourse.mutate(course.id); }} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No courses yet. Create your first course!</p>
              </div>
            )}
          </div>

          {/* Module Manager */}
          {activeCourseId && (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Modules — {myCourses?.find((c) => c.id === activeCourseId)?.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{myModules?.length ?? 0} modules</p>
                </div>
                <Dialog open={moduleDialogOpen} onOpenChange={(open) => { setModuleDialogOpen(open); if (!open) resetModuleForm(); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                      <Plus className="h-4 w-4 mr-1" /> Add Module
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Add Module</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label>Module Title *</Label>
                        <Input placeholder="e.g. Introduction to Leadership" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={moduleForm.type} onValueChange={(v: any) => setModuleForm({ ...moduleForm, type: v })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video"><span className="flex items-center gap-2"><Video className="h-4 w-4" /> Video</span></SelectItem>
                            <SelectItem value="text"><span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Text</span></SelectItem>
                            <SelectItem value="assessment"><span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Assessment</span></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {moduleForm.type === "video" && (
                        <div>
                          <Label>Video URL</Label>
                          <Input placeholder="https://..." value={moduleForm.videoUrl} onChange={(e) => setModuleForm({ ...moduleForm, videoUrl: e.target.value })} className="mt-1" />
                        </div>
                      )}
                      <div>
                        <Label>{moduleForm.type === "video" ? "Transcript / Notes" : "Content"}</Label>
                        <Textarea placeholder="Module content..." value={moduleForm.content} onChange={(e) => setModuleForm({ ...moduleForm, content: e.target.value })} rows={5} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Duration (seconds)</Label>
                          <Input type="number" min="0" value={moduleForm.duration} onChange={(e) => setModuleForm({ ...moduleForm, duration: parseInt(e.target.value) || 0 })} className="mt-1" />
                        </div>
                        <div>
                          <Label>Order</Label>
                          <Input type="number" min="0" value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) || 0 })} className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="isPreview" checked={moduleForm.isPreview} onCheckedChange={(v) => setModuleForm({ ...moduleForm, isPreview: v })} />
                        <Label htmlFor="isPreview">Free Preview (visible without enrollment)</Label>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => { setModuleDialogOpen(false); resetModuleForm(); }}>Cancel</Button>
                        <Button onClick={handleSaveModule} disabled={createModule.isPending || !moduleForm.title} className="bg-primary hover:bg-primary/90 text-white">Add Module</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {myModules && myModules.length > 0 ? (
                <div className="divide-y divide-border">
                  {myModules.map((mod, i) => (
                    <div key={mod.id} className="p-4 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {mod.type === "video" ? <Video className="h-4 w-4 text-blue-500" /> : mod.type === "assessment" ? <ClipboardList className="h-4 w-4 text-purple-500" /> : <FileText className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{mod.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{mod.type}{mod.duration ? ` · ${Math.round(mod.duration / 60)} min` : ""}{mod.isPreview ? " · Free Preview" : ""}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this module?")) deleteModule.mutate({ id: mod.id, courseId: activeCourseId! }); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">No modules yet. Add your first module!</div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
