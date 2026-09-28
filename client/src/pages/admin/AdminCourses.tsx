import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, ChevronDown, ChevronUp, GripVertical, X, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Career Skills", "Technology", "Cybersecurity", "Web3 & Blockchain", "Canvas LMS", "AI in Engineering", "Game Design", "Data Science", "Business", "Quantum Computing", "Other"];
const LEVELS = ["beginner", "intermediate", "advanced"] as const;

type CourseForm = {
  title: string; description: string; shortDescription: string;
  category: string; level: "beginner" | "intermediate" | "advanced";
  price: string; isFree: boolean; isPublished: boolean; isFeatured: boolean;
  thumbnailUrl: string; tags: string;
};

const defaultForm: CourseForm = {
  title: "", description: "", shortDescription: "", category: "", level: "beginner",
  price: "0.00", isFree: true, isPublished: false, isFeatured: false, thumbnailUrl: "", tags: "",
};

type ModuleForm = {
  title: string; type: "video" | "text" | "assessment"; content: string;
  videoUrl: string; duration: string; isPreview: boolean; sortOrder: string;
};

const defaultModuleForm: ModuleForm = {
  title: "", type: "text", content: "", videoUrl: "", duration: "0", isPreview: false, sortOrder: "0",
};

export default function AdminCourses() {
  const utils = trpc.useUtils();
  const { data: courses, isLoading } = trpc.courses.listAll.useQuery();

  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(defaultForm);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<number | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleForm>(defaultModuleForm);
  const [moduleCourseId, setModuleCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: expandedModules } = trpc.modules.byCourse.useQuery(expandedCourse!, {
    enabled: !!expandedCourse,
  });

  const createCourse = trpc.courses.create.useMutation({
    onSuccess: () => { utils.courses.listAll.invalidate(); setShowCourseDialog(false); toast.success("Course created!"); },
    onError: (e) => toast.error(e.message),
  });
  const updateCourse = trpc.courses.update.useMutation({
    onSuccess: () => { utils.courses.listAll.invalidate(); setShowCourseDialog(false); toast.success("Course updated!"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteCourse = trpc.courses.delete.useMutation({
    onSuccess: () => { utils.courses.listAll.invalidate(); toast.success("Course deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const createModule = trpc.modules.create.useMutation({
    onSuccess: () => { if (moduleCourseId) utils.modules.byCourse.invalidate(moduleCourseId); setShowModuleDialog(false); toast.success("Lesson added!"); },
    onError: (e) => toast.error(e.message),
  });
  const updateModule = trpc.modules.update.useMutation({
    onSuccess: () => { if (moduleCourseId) utils.modules.byCourse.invalidate(moduleCourseId); setShowModuleDialog(false); toast.success("Lesson updated!"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteModule = trpc.modules.delete.useMutation({
    onSuccess: () => { if (moduleCourseId) utils.modules.byCourse.invalidate(moduleCourseId); toast.success("Lesson deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const openNewCourse = () => {
    setEditingCourse(null);
    setCourseForm(defaultForm);
    setShowCourseDialog(true);
  };

  const openEditCourse = (course: any) => {
    setEditingCourse(course.id);
    setCourseForm({
      title: course.title ?? "",
      description: course.description ?? "",
      shortDescription: course.shortDescription ?? "",
      category: course.category ?? "",
      level: course.level ?? "beginner",
      price: course.price ?? "0.00",
      isFree: course.isFree ?? true,
      isPublished: course.isPublished ?? false,
      isFeatured: course.isFeatured ?? false,
      thumbnailUrl: course.thumbnailUrl ?? "",
      tags: Array.isArray(course.tags) ? course.tags.join(", ") : "",
    });
    setShowCourseDialog(true);
  };

  const saveCourse = () => {
    const tags = courseForm.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse, ...courseForm, tags });
    } else {
      createCourse.mutate({ ...courseForm, tags });
    }
  };

  const openNewModule = (courseId: number) => {
    setEditingModule(null);
    setModuleCourseId(courseId);
    setModuleForm(defaultModuleForm);
    setShowModuleDialog(true);
  };

  const openEditModule = (mod: any, courseId: number) => {
    setEditingModule(mod.id);
    setModuleCourseId(courseId);
    setModuleForm({
      title: mod.title ?? "",
      type: mod.type ?? "text",
      content: mod.content ?? "",
      videoUrl: mod.videoUrl ?? "",
      duration: String(mod.duration ?? 0),
      isPreview: mod.isPreview ?? false,
      sortOrder: String(mod.sortOrder ?? 0),
    });
    setShowModuleDialog(true);
  };

  const saveModule = () => {
    if (!moduleCourseId) return;
    const data = {
      ...moduleForm,
      duration: parseInt(moduleForm.duration) || 0,
      sortOrder: parseInt(moduleForm.sortOrder) || 0,
    };
    if (editingModule) {
      updateModule.mutate({ id: editingModule, ...data });
    } else {
      createModule.mutate({ courseId: moduleCourseId, ...data });
    }
  };

  const filtered = courses?.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout title="Courses">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <span className="text-sm text-gray-500">{filtered.length} courses</span>
        </div>
        <Button onClick={openNewCourse} className="gap-2">
          <Plus className="h-4 w-4" /> Add Course
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Course row */}
            <div className="flex items-center gap-4 p-4">
              {course.thumbnailUrl
                ? <img src={course.thumbnailUrl} className="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />
                : <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><BookOpen className="h-6 w-6 text-gray-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                  {course.isFeatured && <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 border-0">Featured</Badge>}
                  <Badge variant="outline" className={`text-[10px] border-0 ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {course.isFree && <Badge variant="outline" className="text-[10px] border-0 bg-blue-100 text-blue-700">Free</Badge>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{course.category} · {course.level} · {course.totalModules ?? 0} lessons · {course.enrollmentCount ?? 0} enrolled</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => openEditCourse(course)} className="h-8 w-8 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => updateCourse.mutate({ id: course.id, isPublished: !course.isPublished })}
                  className="h-8 w-8 p-0"
                  title={course.isPublished ? "Unpublish" : "Publish"}
                >
                  {course.isPublished ? <EyeOff className="h-3.5 w-3.5 text-gray-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => { if (confirm("Delete this course?")) deleteCourse.mutate(course.id); }}
                  className="h-8 w-8 p-0 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm" variant="ghost"
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="h-8 w-8 p-0"
                >
                  {expandedCourse === course.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Modules panel */}
            {expandedCourse === course.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Lessons / Modules</h4>
                  <Button size="sm" variant="outline" onClick={() => openNewModule(course.id)} className="h-7 text-xs gap-1">
                    <Plus className="h-3 w-3" /> Add Lesson
                  </Button>
                </div>
                {!expandedModules || expandedModules.length === 0
                  ? <p className="text-xs text-gray-400 py-2">No lessons yet. Add your first lesson.</p>
                  : (
                    <div className="space-y-2">
                      {expandedModules.map((mod, idx) => (
                        <div key={mod.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                          <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                          <span className="text-xs text-gray-400 w-5 shrink-0">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{mod.title}</p>
                            <p className="text-xs text-gray-400">{mod.type} {mod.duration ? `· ${mod.duration}min` : ""}</p>
                          </div>
                          {mod.isPreview && <Badge variant="outline" className="text-[10px] border-0 bg-blue-50 text-blue-600 shrink-0">Preview</Badge>}
                          <Button size="sm" variant="ghost" onClick={() => openEditModule(mod, course.id)} className="h-7 w-7 p-0 shrink-0">
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => { if (confirm("Delete this lesson?")) deleteModule.mutate({ id: mod.id, courseId: course.id }); }}
                            className="h-7 w-7 p-0 shrink-0 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "New Course"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Title *</Label>
              <Input value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} placeholder="Course title" />
            </div>
            <div>
              <Label>Short Description</Label>
              <Input value={courseForm.shortDescription} onChange={e => setCourseForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="One-line summary" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <Label>Full Description</Label>
                <span className="text-xs text-gray-500">Use the video button to embed a video, slide deck, form, or secure website.</span>
              </div>
              <RichTextEditor
                value={courseForm.description}
                onChange={html => setCourseForm(f => ({ ...f, description: html }))}
                placeholder="Write the course overview, outcomes, and supporting embeds..."
                minHeight="220px"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={courseForm.category} onValueChange={v => setCourseForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select value={courseForm.level} onValueChange={v => setCourseForm(f => ({ ...f, level: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price ($)</Label>
                <Input value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" disabled={courseForm.isFree} />
              </div>
              <div>
                <Label>Thumbnail URL</Label>
                <Input value={courseForm.thumbnailUrl} onChange={e => setCourseForm(f => ({ ...f, thumbnailUrl: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={courseForm.tags} onChange={e => setCourseForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. AI, Python, Beginner" />
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch id="isFree" checked={courseForm.isFree} onCheckedChange={v => setCourseForm(f => ({ ...f, isFree: v }))} />
                <Label htmlFor="isFree">Free Course</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="isPublished" checked={courseForm.isPublished} onCheckedChange={v => setCourseForm(f => ({ ...f, isPublished: v }))} />
                <Label htmlFor="isPublished">Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="isFeatured" checked={courseForm.isFeatured} onCheckedChange={v => setCourseForm(f => ({ ...f, isFeatured: v }))} />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>Cancel</Button>
            <Button onClick={saveCourse} disabled={createCourse.isPending || updateCourse.isPending} className="gap-2">
              <Save className="h-4 w-4" /> {editingCourse ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule ? "Edit Lesson" : "New Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Lesson Title *</Label>
              <Input value={moduleForm.title} onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))} placeholder="Lesson title" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={moduleForm.type} onValueChange={v => setModuleForm(f => ({ ...f, type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={moduleForm.duration} onChange={e => setModuleForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={moduleForm.sortOrder} onChange={e => setModuleForm(f => ({ ...f, sortOrder: e.target.value }))} />
              </div>
            </div>
            {moduleForm.type === "video" && (
              <div>
                <Label>Video URL</Label>
                <Input value={moduleForm.videoUrl} onChange={e => setModuleForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/..." />
              </div>
            )}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <Label>Lesson Content</Label>
                <span className="text-xs text-gray-500">Use the video button to embed a video, slide deck, form, or secure website.</span>
              </div>
              <RichTextEditor
                value={moduleForm.content}
                onChange={html => setModuleForm(f => ({ ...f, content: html }))}
                placeholder="Write lesson content here..."
                minHeight="320px"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isPreview" checked={moduleForm.isPreview} onCheckedChange={v => setModuleForm(f => ({ ...f, isPreview: v }))} />
              <Label htmlFor="isPreview">Free Preview (visible without enrollment)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModuleDialog(false)}>Cancel</Button>
            <Button onClick={saveModule} disabled={createModule.isPending || updateModule.isPending} className="gap-2">
              <Save className="h-4 w-4" /> {editingModule ? "Save Changes" : "Add Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
