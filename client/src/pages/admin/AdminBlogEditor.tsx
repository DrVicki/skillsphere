import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Eye, ArrowLeft, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonContent from "@/components/LessonContent";

const CATEGORIES = ["Career Skills", "Technology", "AI & Machine Learning", "Cybersecurity", "Web3 & Blockchain", "Game Design", "Data Science", "Business", "Education", "Workforce Development", "Other"];

type PostForm = {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  category: string;
  tags: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const defaultForm: PostForm = {
  title: "",
  content: "## Introduction\n\nStart writing your post here...\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3\n\n## Conclusion\n\nWrap up your thoughts here.",
  excerpt: "",
  coverImageUrl: "",
  category: "",
  tags: "",
  isPublished: false,
  isFeatured: false,
};

export default function AdminBlogEditor() {
  const [, navigate] = useLocation();
  const [, editParams] = useRoute("/admin/blog/edit/:id");
  const postId = editParams?.id ? parseInt(editParams.id) : null;

  const [form, setForm] = useState<PostForm>(defaultForm);
  const [activeTab, setActiveTab] = useState("write");

  const utils = trpc.useUtils();

  // Load existing post if editing
  const { data: existingPosts } = trpc.blog.listAll.useQuery(undefined, { enabled: !!postId });
  useEffect(() => {
    if (postId && existingPosts) {
      const post = existingPosts.find(p => p.id === postId);
      if (post) {
        // Fetch full content via bySlug
      }
    }
  }, [postId, existingPosts]);

  // For edit mode, fetch the full post content
  const existingPost = existingPosts?.find(p => p.id === postId);
  const { data: fullPost } = trpc.blog.bySlug.useQuery(existingPost?.slug ?? "", {
    enabled: !!existingPost?.slug,
  });

  useEffect(() => {
    if (fullPost && postId) {
      setForm({
        title: fullPost.title ?? "",
        content: fullPost.content ?? "",
        excerpt: fullPost.excerpt ?? "",
        coverImageUrl: fullPost.coverImageUrl ?? "",
        category: fullPost.category ?? "",
        tags: Array.isArray(fullPost.tags) ? fullPost.tags.join(", ") : "",
        isPublished: fullPost.isPublished ?? false,
        isFeatured: fullPost.isFeatured ?? false,
      });
    }
  }, [fullPost, postId]);

  const createPost = trpc.blog.create.useMutation({
    onSuccess: (data) => {
      utils.blog.listAll.invalidate();
      toast.success("Post created!");
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.listAll.invalidate();
      toast.success("Post saved!");
      navigate("/admin/blog");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSave = (publish?: boolean) => {
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const data = {
      ...form,
      tags,
      isPublished: publish !== undefined ? publish : form.isPublished,
    };
    if (postId) {
      updatePost.mutate({ id: postId, ...data });
    } else {
      createPost.mutate(data);
    }
  };

  const isSaving = createPost.isPending || updatePost.isPending;
  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <AdminLayout title={postId ? "Edit Post" : "New Blog Post"}>
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <Button variant="ghost" onClick={() => navigate("/admin/blog")} className="gap-2 text-gray-500">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{wordCount} words · ~{readTime} min read</span>
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving} className="gap-2">
              <Globe className="h-4 w-4" /> {form.isPublished ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Post title..."
                className="text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0 placeholder:text-gray-300"
              />
            </div>

            {/* Editor / Preview tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b border-gray-100 px-4">
                  <TabsList className="h-10 bg-transparent gap-0 p-0">
                    <TabsTrigger value="write" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-sm">
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 text-sm">
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="write" className="m-0">
                  <Textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Write your post in Markdown..."
                    className="min-h-[500px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none p-5"
                  />
                  <div className="px-5 py-2 border-t border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] text-gray-400">Supports Markdown: **bold**, *italic*, ## headings, - lists, `code`, [link](url), ![image](url)</p>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="m-0 p-5 min-h-[500px]">
                  {form.content
                    ? <LessonContent content={form.content} title={form.title || "Preview"} />
                    : <p className="text-gray-400 text-sm italic">Nothing to preview yet.</p>
                  }
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar metadata */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Status</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {form.isPublished
                    ? <><Globe className="h-4 w-4 text-emerald-500" /><span className="text-sm text-emerald-600 font-medium">Published</span></>
                    : <><Lock className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-500">Draft</span></>
                  }
                </div>
                <Switch checked={form.isPublished} onCheckedChange={v => setForm(f => ({ ...f, isPublished: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Featured Post</Label>
                <Switch checked={form.isFeatured} onCheckedChange={v => setForm(f => ({ ...f, isFeatured: v }))} />
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Cover Image</h3>
              {form.coverImageUrl && (
                <img src={form.coverImageUrl} className="w-full h-32 object-cover rounded-lg" alt="Cover" />
              )}
              <Input
                value={form.coverImageUrl}
                onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="text-xs"
              />
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Categorization</h3>
              <div>
                <Label className="text-xs text-gray-500 mb-1.5 block">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1.5 block">Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="AI, Career, Skills"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Excerpt</h3>
              <Textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="Brief summary shown in post cards..."
                rows={3}
                className="text-sm resize-none"
              />
              <p className="text-[10px] text-gray-400">{form.excerpt.length}/500 characters</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
