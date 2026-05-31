import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

// Detect if content is HTML (from Tiptap) or Markdown
function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str.trim());
}

function formatDate(ts: number | Date | null) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// CSS for styled blog HTML content
const blogHtmlStyles = `
  .blog-html-content h1 {
    font-size: 1.75rem; font-weight: 800; color: #1e3a6e;
    margin-top: 2rem; margin-bottom: 1rem;
    padding-bottom: 0.75rem; border-bottom: 3px solid #2A63BF; line-height: 1.3;
  }
  .blog-html-content h2 {
    font-size: 1.35rem; font-weight: 700; color: #1e3a6e;
    margin-top: 2.5rem; margin-bottom: 0.875rem;
    padding: 0.5rem 0.875rem;
    background: linear-gradient(135deg, #EEF4FF 0%, #F0F7FF 100%);
    border-left: 4px solid #2A63BF; border-radius: 0 8px 8px 0;
  }
  .blog-html-content h3 {
    font-size: 1.1rem; font-weight: 700; color: #2A63BF;
    margin-top: 2rem; margin-bottom: 0.625rem;
  }
  .blog-html-content h4 {
    font-size: 0.875rem; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-top: 1.5rem; margin-bottom: 0.5rem;
  }
  .blog-html-content p {
    font-size: 1rem; line-height: 1.85; color: #374151; margin-bottom: 1.25rem;
  }
  .blog-html-content ul {
    margin-bottom: 1.25rem; padding-left: 1.75rem; list-style: disc;
  }
  .blog-html-content ul li {
    font-size: 1rem; color: #374151; line-height: 1.75; margin-bottom: 0.5rem;
  }
  .blog-html-content ul li::marker { color: #2A63BF; }
  .blog-html-content ol {
    margin-bottom: 1.25rem; padding-left: 1.75rem; list-style: decimal;
  }
  .blog-html-content ol li {
    font-size: 1rem; color: #374151; line-height: 1.75; margin-bottom: 0.5rem;
  }
  .blog-html-content ol li::marker { color: #2A63BF; font-weight: 700; }
  .blog-html-content blockquote {
    margin: 1.5rem 0; padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, #FFF8E7 0%, #FFFBF0 100%);
    border-left: 4px solid #F5B942; border-radius: 0 10px 10px 0;
    color: #4b5563; font-style: italic; font-size: 1rem; line-height: 1.8;
  }
  .blog-html-content code {
    padding: 0.125rem 0.4rem; border-radius: 4px;
    background: #EEF4FF; color: #2A63BF;
    font-size: 0.875rem; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 600;
  }
  .blog-html-content pre {
    margin: 1.25rem 0; border-radius: 10px; overflow: hidden;
  }
  .blog-html-content pre code {
    display: block; background: #1e293b; color: #86efac;
    padding: 1.5rem; font-size: 0.9rem;
    font-family: ui-monospace, SFMono-Regular, monospace;
    overflow-x: auto; line-height: 1.6;
  }
  .blog-html-content table {
    width: 100%; border-collapse: collapse; font-size: 0.9rem;
    margin: 1.5rem 0; border-radius: 12px; overflow: hidden;
    border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .blog-html-content thead { background: linear-gradient(135deg, #2A63BF 0%, #1e4fa3 100%); }
  .blog-html-content th {
    padding: 0.875rem 1rem; text-align: left;
    font-size: 0.8rem; font-weight: 700; color: #ffffff;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .blog-html-content td {
    padding: 0.875rem 1rem; color: #374151; vertical-align: top;
    border-bottom: 1px solid #f3f4f6;
  }
  .blog-html-content tr:last-child td { border-bottom: none; }
  .blog-html-content hr {
    margin: 2rem 0; border: none; height: 2px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  }
  .blog-html-content a {
    color: #2A63BF; text-decoration: underline;
    text-underline-offset: 3px; font-weight: 500;
  }
  .blog-html-content strong { font-weight: 700; color: #1e3a6e; }
  .blog-html-content em { font-style: italic; color: #4b5563; }
  .blog-html-content img {
    max-width: 100%; border-radius: 12px;
    margin: 1.5rem 0; box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
`;

let blogStylesInjected = false;
function injectBlogStyles() {
  if (blogStylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = blogHtmlStyles;
  document.head.appendChild(style);
  blogStylesInjected = true;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";

  const { data: post, isLoading } = trpc.blog.bySlug.useQuery(slug, { enabled: !!slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full mb-3" />)}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Post not found</h2>
          <Link href="/blog" className="text-blue-600 underline text-sm">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  // Always convert to HTML — Markdown via marked, HTML passed through as-is
  const rawContent = post.content ?? "";
  const htmlContent = isHTML(rawContent)
    ? rawContent
    : (marked.parse(rawContent, { async: false }) as string);
  injectBlogStyles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Gradient accent if no cover */}
      {!post.coverImageUrl && (
        <div style={{ background: "linear-gradient(135deg, #1e3a6e 0%, #2A63BF 60%, #4a90d9 100%)" }} className="h-32" />
      )}

      <div className="max-w-3xl mx-auto px-4 -mt-8 pb-16">
        {/* Article card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Gradient accent bar */}
          <div style={{ height: "5px", background: "linear-gradient(90deg, #2A63BF 0%, #4a90d9 50%, #F5B942 100%)" }} />

          <div className="p-8 md:p-12">
            {/* Back link */}
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-600 transition-colors mb-6">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 border-0">
                {post.category}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
              {post.authorName && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {post.authorName}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt ?? post.createdAt)}
              </span>
              {post.content && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime(post.content)} min read
                </span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-500 italic mb-8 leading-relaxed border-l-4 border-blue-200 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            {post.content && (
              <div
                className="blog-html-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(htmlContent, {
                    ADD_TAGS: ["iframe"],
                    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
                  }),
                }}
              />
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs text-gray-500 border-gray-200">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
