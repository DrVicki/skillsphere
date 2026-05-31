import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Search, BookOpen } from "lucide-react";

function formatDate(ts: number | Date | null) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ limit: 50 });

  const filtered = posts?.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a6e 0%, #2A63BF 60%, #4a90d9 100%)" }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">SkillSphere Blog</h1>
          <p className="text-blue-100 text-lg mb-8">Insights, tutorials, and workforce development resources</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="pl-9 bg-white border-0 shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <Skeleton className="h-44 w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">No posts found</h3>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new content.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                {post.coverImageUrl ? (
                  <img src={post.coverImageUrl} alt={post.title} className="h-44 w-full object-cover" />
                ) : (
                  <div style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #dbeafe 100%)" }} className="h-44 w-full flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-blue-300" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  {post.category && (
                    <Badge variant="secondary" className="w-fit mb-2 text-xs bg-blue-50 text-blue-700 border-0">
                      {post.category}
                    </Badge>
                  )}
                  <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </span>
                    {post.excerpt && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {readTime(post.excerpt)} min read
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
