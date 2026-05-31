import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function AdminBlog() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.listAll.useQuery();
  const [search, setSearch] = useState("");

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => { utils.blog.listAll.invalidate(); toast.success("Post updated!"); },
    onError: (e) => toast.error(e.message),
  });
  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: () => { utils.blog.listAll.invalidate(); toast.success("Post deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const filtered = posts?.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout title="Blog">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <span className="text-sm text-gray-500">{filtered.length} posts</span>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No blog posts yet</h3>
          <p className="text-sm text-gray-400 mb-6">Share your knowledge with the SkillSphere community.</p>
          <Link href="/admin/blog/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Write Your First Post</Button>
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            {post.coverImageUrl
              ? <img src={post.coverImageUrl} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
              : <div className="w-16 h-16 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-pink-300" />
                </div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                {post.isFeatured && <Badge className="text-[10px] bg-amber-100 text-amber-700 border-0 h-4">Featured</Badge>}
                <Badge className={`text-[10px] border-0 h-4 ${post.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {post.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">
                {post.category ?? "Uncategorized"}
                {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString()}` : ""}
                {` · ${post.viewCount ?? 0} views`}
              </p>
              {post.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm" variant="ghost"
                onClick={() => updatePost.mutate({ id: post.id, isFeatured: !post.isFeatured })}
                className="h-8 w-8 p-0"
                title={post.isFeatured ? "Unfeature" : "Feature"}
              >
                <Star className={`h-3.5 w-3.5 ${post.isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
              </Button>
              <Button
                size="sm" variant="ghost"
                onClick={() => updatePost.mutate({ id: post.id, isPublished: !post.isPublished })}
                className="h-8 w-8 p-0"
                title={post.isPublished ? "Unpublish" : "Publish"}
              >
                {post.isPublished ? <EyeOff className="h-3.5 w-3.5 text-gray-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-500" />}
              </Button>
              <Link href={`/admin/blog/edit/${post.id}`}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                size="sm" variant="ghost"
                onClick={() => { if (confirm("Delete this post?")) deletePost.mutate(post.id); }}
                className="h-8 w-8 p-0 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
