import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import AssessmentViewer from "@/components/AssessmentViewer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Play, FileText, ClipboardList, CheckCircle, ChevronRight, MessageSquare,
  Send, BookOpen, Users, Star, ArrowLeft, Award
} from "lucide-react";
import CourseCertificate from "@/components/CourseCertificate";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";

interface Props { params: { slug: string } }

export default function LearnCourse({ params }: Props) {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [threadTitle, setThreadTitle] = useState("");
  const [threadBody, setThreadBody] = useState("");
  const [replyBody, setReplyBody] = useState<Record<number, string>>({});
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);

  const { data: course } = trpc.courses.bySlug.useQuery(params.slug);
  const { data: modules } = trpc.modules.byCourse.useQuery(course?.id ?? 0, { enabled: !!course?.id });
  const { data: progressData, refetch: refetchProgress } = trpc.progress.byCourse.useQuery(course?.id ?? 0, { enabled: !!course?.id && isAuthenticated });
  const { data: threads, refetch: refetchThreads } = trpc.discussions.threads.useQuery(course?.id ?? 0, { enabled: !!course?.id && isAuthenticated });
  const { data: replies, refetch: refetchReplies } = trpc.discussions.replies.useQuery(activeThreadId ?? 0, { enabled: !!activeThreadId });
  const { data: chatMessages, refetch: refetchChat } = trpc.chat.messages.useQuery(course?.id ?? 0, { enabled: !!course?.id && isAuthenticated });

  const activeModule = modules?.find((m) => m.id === activeModuleId) ?? modules?.[0];

  useEffect(() => {
    if (modules && modules.length > 0 && !activeModuleId) setActiveModuleId(modules[0].id);
  }, [modules]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Poll chat every 5 seconds
  useEffect(() => {
    if (!course?.id || !isAuthenticated) return;
    const interval = setInterval(() => refetchChat(), 5000);
    return () => clearInterval(interval);
  }, [course?.id, isAuthenticated]);

  const markComplete = trpc.progress.markComplete.useMutation({
    onSuccess: () => { toast.success("Module completed!"); refetchProgress(); },
  });

  const createThread = trpc.discussions.createThread.useMutation({
    onSuccess: () => { toast.success("Thread posted!"); setThreadTitle(""); setThreadBody(""); refetchThreads(); },
    onError: (e) => toast.error(e.message),
  });

  const createReply = trpc.discussions.createReply.useMutation({
    onSuccess: () => { toast.success("Reply posted!"); setReplyBody({}); refetchReplies(); },
    onError: (e) => toast.error(e.message),
  });

  const sendChat = trpc.chat.send.useMutation({
    onSuccess: () => { setChatMsg(""); refetchChat(); },
    onError: (e) => toast.error(e.message),
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => { toast.success("Review submitted!"); setReviewText(""); },
    onError: (e) => toast.error(e.message),
  });

  const isModuleCompleted = (moduleId: number) =>
    progressData?.progress.some((p) => p.moduleId === moduleId && p.isCompleted);

  const moduleTypeIcon = (type: string) => {
    if (type === "video") return <Play className="h-4 w-4" />;
    if (type === "assessment") return <ClipboardList className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const certId = course ? `SS-${course.id}-${user?.id ?? 0}-${new Date().getFullYear()}` : "";

  if (!course) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    </div>
  );

  const progressPercent = progressData?.enrollment?.progressPercent ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Top bar */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" /> Dashboard</Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{course.title}</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>{progressPercent}% complete</span>
          <Progress value={progressPercent} className="w-24 h-1.5" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
        {/* Sidebar: Module List */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border shrink-0">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Course Content</p>
            <p className="text-xs text-muted-foreground mt-1">{modules?.length ?? 0} lessons</p>
          </div>
          <ScrollArea className="flex-1">
            {modules?.map((mod, i) => {
              const completed = isModuleCompleted(mod.id);
              const isActive = mod.id === activeModule?.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border/50 transition-colors ${isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-gray-50"}`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${completed ? "bg-green-100 text-green-600" : isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                    {completed ? <CheckCircle className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>{mod.title}</p>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mt-0.5">
                      {moduleTypeIcon(mod.type)} {mod.type}
                    </p>
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <div className="bg-white border-b border-border px-4">
              <TabsList className="h-10 bg-transparent border-0 gap-0">
                <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  <BookOpen className="h-4 w-4 mr-1.5" /> Content
                </TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  <MessageSquare className="h-4 w-4 mr-1.5" /> Discussion
                </TabsTrigger>
                <TabsTrigger value="chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  <Users className="h-4 w-4 mr-1.5" /> Live Chat
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Tab */}
            <TabsContent value="content" className="flex-1 p-6 mt-0">
              {activeModule ? (
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Badge variant="outline" className="mb-2 capitalize">{activeModule.type}</Badge>
                      <h2 className="text-xl font-bold text-foreground">{activeModule.title}</h2>
                    </div>
                    {!isModuleCompleted(activeModule.id) && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                        onClick={() => markComplete.mutate({ moduleId: activeModule.id, courseId: course.id })}
                        disabled={markComplete.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Mark Complete
                      </Button>
                    )}
                    {isModuleCompleted(activeModule.id) && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>

                  {/* Video Module */}
                  {activeModule.type === "video" && activeModule.videoUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                      <video src={activeModule.videoUrl} controls className="w-full h-full" />
                    </div>
                  )}

                  {/* Text/Assessment Content */}
                  {activeModule.content && (
                    <div className="prose prose-sm max-w-none bg-white rounded-xl border border-border p-6">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">{activeModule.content}</div>
                    </div>
                  )}

                  {/* Assessment */}
                  {activeModule.type === "assessment" && activeModule.assessmentData && (
                    <AssessmentViewer
                      moduleId={activeModule.id}
                      courseId={course.id}
                      assessmentData={activeModule.assessmentData as any}
                      isCompleted={!!isModuleCompleted(activeModule.id)}
                      onComplete={(score, passed) => {
                        markComplete.mutate({ moduleId: activeModule.id, courseId: course.id, assessmentScore: score, assessmentPassed: passed });
                      }}
                    />
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    {modules && modules.findIndex((m) => m.id === activeModule.id) > 0 && (
                      <Button variant="outline" onClick={() => {
                        const idx = modules.findIndex((m) => m.id === activeModule.id);
                        setActiveModuleId(modules[idx - 1].id);
                      }}>← Previous</Button>
                    )}
                    <div className="flex-1" />
                    {modules && modules.findIndex((m) => m.id === activeModule.id) < modules.length - 1 && (
                      <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => {
                        const idx = modules.findIndex((m) => m.id === activeModule.id);
                        setActiveModuleId(modules[idx + 1].id);
                      }}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
                    )}
                  </div>

                  {/* Certificate + Review section (after completion) */}
                  {progressPercent === 100 && (
                    <div className="mt-6 bg-gradient-to-r from-[#2A63BF]/10 to-[#F5B942]/10 rounded-xl border border-[#F5B942]/30 p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="h-6 w-6 text-[#F5B942]" />
                        <h3 className="text-lg font-bold text-foreground">Congratulations! You've completed this course!</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Your certificate of completion is ready to download.</p>
                      <Button
                        className="bg-[#2A63BF] hover:bg-[#2A63BF]/90 text-white px-8 py-2.5 text-sm font-semibold shadow-lg"
                        onClick={() => setShowCertificate(true)}
                      >
                        <Award className="h-4 w-4 mr-2" /> Claim Your Certificate
                      </Button>
                    </div>
                  )}
                  {progressPercent === 100 && (
                    <div className="mt-8 bg-white rounded-xl border border-border p-6">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" /> Leave a Review
                      </h3>
                      <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map((r) => (
                          <button key={r} onClick={() => setReviewRating(r)}>
                            <Star className={`h-6 w-6 transition-colors ${r <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                      <Textarea placeholder="Share your experience..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="mb-3" rows={3} />
                      <Button size="sm" onClick={() => createReview.mutate({ courseId: course.id, rating: reviewRating, review: reviewText })} disabled={createReview.isPending}>
                        Submit Review
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Select a module to start learning</p>
                </div>
              )}
            </TabsContent>

            {/* Discussion Tab */}
            <TabsContent value="discussion" className="flex-1 p-6 mt-0">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* New Thread */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold mb-3">Start a Discussion</h3>
                  <input
                    type="text"
                    placeholder="Thread title..."
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <Textarea placeholder="Describe your question or topic..." value={threadBody} onChange={(e) => setThreadBody(e.target.value)} rows={3} className="mb-2" />
                  <Button size="sm" onClick={() => createThread.mutate({ courseId: course.id, title: threadTitle, body: threadBody })} disabled={createThread.isPending || !threadTitle || !threadBody}>
                    Post Thread
                  </Button>
                </div>

                {/* Threads */}
                {threads?.map((thread) => (
                  <div key={thread.id} className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setActiveThreadId(activeThreadId === thread.id ? null : thread.id)}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {thread.isPinned && <Badge className="mb-1 bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">📌 Pinned</Badge>}
                          <h4 className="font-semibold text-foreground">{thread.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{thread.body}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">{thread.replyCount} replies</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">by {thread.userName} · {new Date(thread.createdAt).toLocaleDateString()}</p>
                    </div>

                    {activeThreadId === thread.id && (
                      <div className="border-t border-border bg-gray-50 p-4 space-y-3">
                        {replies?.map((reply) => (
                          <div key={reply.id} className="bg-white rounded-lg border border-border p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                {reply.userName?.[0]?.toUpperCase() ?? "U"}
                              </div>
                              <span className="text-xs font-medium">{reply.userName}</span>
                              <span className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-foreground">{reply.body}</p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyBody[thread.id] ?? ""}
                            onChange={(e) => setReplyBody((prev) => ({ ...prev, [thread.id]: e.target.value }))}
                            rows={2}
                            className="flex-1 text-sm"
                          />
                          <Button size="sm" onClick={() => createReply.mutate({ threadId: thread.id, courseId: course.id, body: replyBody[thread.id] ?? "" })} disabled={!replyBody[thread.id]}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {(!threads || threads.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No discussions yet. Start the first one!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages?.map((msg) => {
                  const isMe = msg.userId === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${isMe ? "bg-primary" : "bg-gray-400"}`}>
                        {msg.userName?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs text-muted-foreground">{isMe ? "You" : msg.userName}</span>
                          {(msg.userRole === "trainer" || msg.userRole === "admin") && (
                            <Badge className="text-xs py-0 px-1 bg-primary/10 text-primary border-primary/20">{msg.userRole}</Badge>
                          )}
                        </div>
                        <div className={`rounded-2xl px-3 py-2 text-sm ${isMe ? "bg-primary text-white rounded-tr-sm" : "bg-white border border-border rounded-tl-sm"}`}>
                          {msg.message}
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  );
                })}
                {(!chatMessages || chatMessages.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No messages yet. Say hello!</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-border bg-white p-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && chatMsg.trim()) { e.preventDefault(); sendChat.mutate({ courseId: course.id, message: chatMsg.trim() }); } }}
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={() => { if (chatMsg.trim()) sendChat.mutate({ courseId: course.id, message: chatMsg.trim() }); }} disabled={sendChat.isPending || !chatMsg.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CourseCertificate
          open={showCertificate}
          onClose={() => setShowCertificate(false)}
          learnerName={user?.name ?? "Learner"}
          courseTitle={course.title}
          completionDate={new Date()}
          certificateId={certId}
        />
      )}
    </div>
  );
}
