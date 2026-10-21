import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type ClassroomForm = { name: string; description: string };
const emptyForm: ClassroomForm = { name: "", description: "" };

function splitEmails(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\s,;]+/)
        .map(email => email.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function formatMemberStatus(status: "active" | "pending" | "removed") {
  if (status === "active")
    return { label: "Active", className: "bg-emerald-100 text-emerald-700" };
  if (status === "pending")
    return {
      label: "Pending sign-in",
      className: "bg-amber-100 text-amber-700",
    };
  return { label: "Removed", className: "bg-gray-100 text-gray-600" };
}

export default function AdminClassrooms() {
  const utils = trpc.useUtils();
  const { data: classrooms, isLoading } =
    trpc.classrooms.listManaged.useQuery();
  const { data: courses } = trpc.courses.listAll.useQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ClassroomForm>(emptyForm);
  const [expandedClassroom, setExpandedClassroom] = useState<number | null>(
    null
  );
  const [emailInput, setEmailInput] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const rosterQuery = trpc.classrooms.roster.useQuery(expandedClassroom ?? 0, {
    enabled: !!expandedClassroom,
  });
  const classroomCoursesQuery = trpc.classrooms.courses.useQuery(
    expandedClassroom ?? 0,
    { enabled: !!expandedClassroom }
  );

  const refreshClassroom = (classroomId?: number) => {
    utils.classrooms.listManaged.invalidate();
    if (classroomId) {
      utils.classrooms.roster.invalidate(classroomId);
      utils.classrooms.courses.invalidate(classroomId);
    }
  };

  const createClassroom = trpc.classrooms.create.useMutation({
    onSuccess: ({ id }) => {
      refreshClassroom();
      setCreateOpen(false);
      setForm(emptyForm);
      setExpandedClassroom(id);
      toast.success(
        "Classroom created. Add a course and students to get started."
      );
    },
    onError: error => toast.error(error.message),
  });

  const updateClassroom = trpc.classrooms.update.useMutation({
    onSuccess: () => {
      refreshClassroom(expandedClassroom ?? undefined);
      toast.success("Classroom updated");
    },
    onError: error => toast.error(error.message),
  });

  const assignCourse = trpc.classrooms.assignCourse.useMutation({
    onSuccess: (result, variables) => {
      refreshClassroom(variables.classroomId);
      setSelectedCourseId("");
      toast.success(
        result.assigned
          ? `Course assigned. ${result.enrolledStudents} learner${result.enrolledStudents === 1 ? "" : "s"} enrolled automatically.`
          : "That course is already assigned to this classroom."
      );
    },
    onError: error => toast.error(error.message),
  });

  const removeCourse = trpc.classrooms.removeCourse.useMutation({
    onSuccess: (_, variables) => {
      refreshClassroom(variables.classroomId);
      toast.success(
        "Course removed from classroom. Learner progress was kept."
      );
    },
    onError: error => toast.error(error.message),
  });

  const addStudents = trpc.classrooms.addStudents.useMutation({
    onSuccess: (result, variables) => {
      refreshClassroom(variables.classroomId);
      setEmailInput("");
      const pendingNote = result.pendingStudents
        ? ` ${result.pendingStudents} pending until they sign in with the assigned email.`
        : "";
      toast.success(
        `${result.activeStudents} active student${result.activeStudents === 1 ? "" : "s"} added; ${result.enrollmentsCreated} course enrollment${result.enrollmentsCreated === 1 ? "" : "s"} created.${pendingNote}`
      );
    },
    onError: error => toast.error(error.message),
  });

  const removeStudent = trpc.classrooms.removeStudent.useMutation({
    onSuccess: (_, variables) => {
      refreshClassroom(variables.classroomId);
      toast.success(
        "Student removed from classroom. Existing learning history was kept."
      );
    },
    onError: error => toast.error(error.message),
  });

  const expanded =
    classrooms?.find(classroom => classroom.id === expandedClassroom) ?? null;
  const assignedCourseIds = new Set(
    (classroomCoursesQuery.data ?? []).map(course => course.courseId)
  );
  const availableCourses = useMemo(
    () =>
      (courses ?? []).filter(
        course => course.isPublished && !assignedCourseIds.has(course.id)
      ),
    [courses, assignedCourseIds]
  );

  const toggleClassroom = (classroomId: number) => {
    if (expandedClassroom === classroomId) {
      setExpandedClassroom(null);
      setEmailInput("");
      setSelectedCourseId("");
    } else {
      setExpandedClassroom(classroomId);
      setEmailInput("");
      setSelectedCourseId("");
    }
  };

  return (
    <AdminLayout title="Classrooms">
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Learning cohorts</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Classrooms & student assignments
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create a classroom, attach any published SkillSphere course, and
            assign students by email. Existing learners enroll immediately; new
            learners activate their assignment when they sign in.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm);
            setCreateOpen(true);
          }}
          className="gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> New Classroom
        </Button>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Classrooms
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-950">
            {classrooms?.length ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
            Assigned students
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-950">
            {(classrooms ?? []).reduce(
              (total, classroom) => total + Number(classroom.memberCount ?? 0),
              0
            )}
          </p>
        </div>
        <div className="col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Course assignments
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-950">
            {(classrooms ?? []).reduce(
              (total, classroom) => total + Number(classroom.courseCount ?? 0),
              0
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(index => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : classrooms?.length ? (
        <div className="space-y-4">
          {classrooms.map(classroom => {
            const isExpanded = expandedClassroom === classroom.id;
            const archived = classroom.status === "archived";
            return (
              <article
                key={classroom.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${archived ? "bg-gray-100 text-gray-400" : "bg-primary/10 text-primary"}`}
                  >
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {classroom.name}
                      </h3>
                      <Badge
                        className={
                          archived
                            ? "border-0 bg-gray-100 text-gray-600"
                            : "border-0 bg-emerald-100 text-emerald-700"
                        }
                      >
                        {archived ? "Archived" : "Active"}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {classroom.description || "No classroom description yet."}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {classroom.memberCount ?? 0} students
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {classroom.courseCount ?? 0} courses
                      </span>
                      <span>Owner: {classroom.ownerName ?? "SkillSphere"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateClassroom.mutate({
                          classroomId: classroom.id,
                          status: archived ? "active" : "archived",
                        })
                      }
                      title={
                        archived ? "Restore classroom" : "Archive classroom"
                      }
                    >
                      <Archive className="mr-1.5 h-3.5 w-3.5" />{" "}
                      {archived ? "Restore" : "Archive"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => toggleClassroom(classroom.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="mr-1.5 h-4 w-4" />
                      ) : (
                        <ChevronDown className="mr-1.5 h-4 w-4" />
                      )}
                      {isExpanded ? "Close" : "Manage"}
                    </Button>
                  </div>
                </div>

                {isExpanded && expanded && (
                  <div className="border-t border-gray-100 bg-slate-50 p-5">
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                      <section className="space-y-5">
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Assigned courses
                              </h4>
                              <p className="text-xs text-gray-500">
                                A new course enrolls every active student
                                automatically.
                              </p>
                            </div>
                            <Badge variant="outline">
                              {classroomCoursesQuery.data?.length ?? 0}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {classroomCoursesQuery.data?.map(course => (
                              <div
                                key={course.courseId}
                                className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                  <BookOpen className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-800">
                                    {course.title}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {course.totalModules ?? 0} lessons ·{" "}
                                    {course.level}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Remove ${course.title} from this classroom? Existing learner progress will remain.`
                                      )
                                    )
                                      removeCourse.mutate({
                                        classroomId: expanded.id,
                                        courseId: course.courseId,
                                      });
                                  }}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                  title="Remove course"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {!classroomCoursesQuery.data?.length && (
                              <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
                                Assign a published course to start enrolling
                                students.
                              </p>
                            )}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Select
                              value={selectedCourseId}
                              onValueChange={setSelectedCourseId}
                            >
                              <SelectTrigger className="h-9 flex-1 text-sm">
                                <SelectValue placeholder="Choose a published course" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableCourses.map(course => (
                                  <SelectItem
                                    key={course.id}
                                    value={String(course.id)}
                                  >
                                    {course.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() =>
                                selectedCourseId &&
                                assignCourse.mutate({
                                  classroomId: expanded.id,
                                  courseId: Number(selectedCourseId),
                                })
                              }
                              disabled={
                                !selectedCourseId || assignCourse.isPending
                              }
                            >
                              {assignCourse.isPending ? "Assigning…" : "Assign"}
                            </Button>
                          </div>
                          {!availableCourses.length && (
                            <p className="mt-2 text-xs text-gray-400">
                              All published courses are already assigned, or no
                              published courses are available.
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="mb-3 flex items-start gap-3">
                            <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                              <UserPlus className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Add students by email
                              </h4>
                              <p className="text-xs leading-5 text-gray-500">
                                Paste one or more email addresses, separated by
                                commas or new lines. Students with an account
                                are enrolled now; others remain pending until
                                they sign in with that email.
                              </p>
                            </div>
                          </div>
                          <Textarea
                            value={emailInput}
                            onChange={event =>
                              setEmailInput(event.target.value)
                            }
                            placeholder={
                              "student@example.com\nlearner@example.com"
                            }
                            rows={4}
                          />
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-xs text-gray-400">
                              {splitEmails(emailInput).length} unique email
                              {splitEmails(emailInput).length === 1 ? "" : "s"}
                            </p>
                            <Button
                              size="sm"
                              onClick={() => {
                                const emails = splitEmails(emailInput);
                                if (!emails.length) {
                                  toast.error(
                                    "Enter at least one email address"
                                  );
                                  return;
                                }
                                addStudents.mutate({
                                  classroomId: expanded.id,
                                  emails,
                                });
                              }}
                              disabled={
                                !splitEmails(emailInput).length ||
                                addStudents.isPending
                              }
                              className="gap-1.5"
                            >
                              <UserPlus className="h-3.5 w-3.5" />
                              {addStudents.isPending
                                ? "Adding…"
                                : "Add Students"}
                            </Button>
                          </div>
                        </div>
                      </section>

                      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Student roster & progress
                              </h4>
                              <p className="text-xs text-gray-500">
                                Course access is assigned automatically and
                                progress remains available after removal.
                              </p>
                            </div>
                            <Badge variant="outline">
                              {rosterQuery.data?.members.length ?? 0}
                            </Badge>
                          </div>
                        </div>
                        {!rosterQuery.data?.members.length ? (
                          <div className="p-8 text-center">
                            <Users className="mx-auto h-8 w-8 text-gray-200" />
                            <p className="mt-2 text-sm text-gray-400">
                              No students have been assigned yet.
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {rosterQuery.data.members.map(member => {
                              const status = formatMemberStatus(member.status);
                              const average = member.courseProgress.length
                                ? Math.round(
                                    member.courseProgress.reduce(
                                      (total, course) =>
                                        total + course.progressPercent,
                                      0
                                    ) / member.courseProgress.length
                                  )
                                : 0;
                              return (
                                <div key={member.id} className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                      {member.name?.[0]?.toUpperCase() ??
                                        member.email[0]?.toUpperCase() ??
                                        "S"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900">
                                          {member.name ?? member.email}
                                        </p>
                                        <Badge
                                          className={`border-0 text-[10px] ${status.className}`}
                                        >
                                          {status.label}
                                        </Badge>
                                      </div>
                                      {member.name && (
                                        <p className="mt-0.5 truncate text-xs text-gray-500">
                                          {member.email}
                                        </p>
                                      )}
                                      <div className="mt-3 space-y-2">
                                        {member.courseProgress.map(course => (
                                          <div
                                            key={course.courseId}
                                            className="flex items-center gap-2"
                                          >
                                            <span
                                              className="w-28 truncate text-xs text-gray-500"
                                              title={course.title}
                                            >
                                              {course.title}
                                            </span>
                                            <Progress
                                              value={course.progressPercent}
                                              className="h-1.5 flex-1"
                                            />
                                            <span className="w-8 text-right text-xs font-medium text-gray-600">
                                              {course.enrolled
                                                ? `${course.progressPercent}%`
                                                : "—"}
                                            </span>
                                          </div>
                                        ))}
                                        {!member.courseProgress.length && (
                                          <p className="text-xs text-gray-400">
                                            Assign a course to begin tracking
                                            progress.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (
                                          confirm(
                                            `Remove ${member.email} from this classroom? Their learning history will remain.`
                                          )
                                        )
                                          removeStudent.mutate({
                                            classroomId: expanded.id,
                                            memberId: member.id,
                                          });
                                      }}
                                      disabled={member.status === "removed"}
                                      className="h-8 w-8 shrink-0 p-0 text-gray-400 hover:text-red-600"
                                      title="Remove student"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {member.status === "active" &&
                                    member.courseProgress.length > 0 && (
                                      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-gray-500">
                                        Average assigned-course progress:{" "}
                                        <span className="font-semibold text-gray-700">
                                          {average}%
                                        </span>
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-primary/25" />
          <h3 className="mt-4 font-semibold text-gray-900">
            Create your first classroom
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Use classrooms to group students and give each group access to any
            published SkillSphere course.
          </p>
          <Button className="mt-5" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Classroom
          </Button>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="classroom-name">Classroom name *</Label>
              <Input
                id="classroom-name"
                value={form.name}
                onChange={event =>
                  setForm(current => ({ ...current, name: event.target.value }))
                }
                placeholder="e.g. Fall 2026 Data Analytics Cohort"
                className="mt-1.5"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="classroom-description">Description</Label>
              <Textarea
                id="classroom-description"
                value={form.description}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Optional cohort, team, school, or department details"
                className="mt-1.5"
                rows={4}
              />
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
              After creating the classroom, assign published courses and add
              students by email. Student accounts are never created without
              their sign-in.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createClassroom.mutate(form)}
              disabled={!form.name.trim() || createClassroom.isPending}
            >
              {createClassroom.isPending ? "Creating…" : "Create Classroom"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
