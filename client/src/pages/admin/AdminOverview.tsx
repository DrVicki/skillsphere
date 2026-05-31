import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { BookOpen, Users, DollarSign, TrendingUp, FileText, Eye } from "lucide-react";
import { Link } from "wouter";

export default function AdminOverview() {
  const { data: analytics } = trpc.analytics.overview.useQuery();
  const { data: courses } = trpc.courses.listAll.useQuery();
  const { data: users } = trpc.auth.listUsers.useQuery();
  const { data: blogPosts } = trpc.blog.listAll.useQuery();

  const stats = [
    { label: "Total Courses", value: courses?.length ?? 0, icon: BookOpen, color: "bg-blue-500", href: "/admin/courses" },
    { label: "Total Users", value: users?.length ?? 0, icon: Users, color: "bg-violet-500", href: "/admin/users" },
    { label: "Total Revenue", value: `$${Number(analytics?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: "bg-emerald-500", href: "/admin/analytics" },
    { label: "Enrollments", value: analytics?.totalEnrollments ?? 0, icon: TrendingUp, color: "bg-amber-500", href: "/admin/analytics" },
    { label: "Blog Posts", value: blogPosts?.length ?? 0, icon: FileText, color: "bg-pink-500", href: "/admin/blog" },
    { label: "Published Courses", value: courses?.filter(c => c.isPublished).length ?? 0, icon: Eye, color: "bg-teal-500", href: "/admin/courses" },
  ];

  const recentCourses = courses?.slice(0, 5) ?? [];
  const recentPosts = blogPosts?.slice(0, 5) ?? [];

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <a className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${color} p-2.5 rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Courses</h2>
            <Link href="/admin/courses">
              <a className="text-xs text-primary hover:underline">View all</a>
            </Link>
          </div>
          <div className="space-y-3">
            {recentCourses.length === 0 && <p className="text-sm text-gray-400">No courses yet.</p>}
            {recentCourses.map(course => (
              <div key={course.id} className="flex items-center gap-3">
                {course.thumbnailUrl
                  ? <img src={course.thumbnailUrl} className="w-10 h-10 rounded-lg object-cover shrink-0" alt="" />
                  : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><BookOpen className="h-4 w-4 text-gray-400" /></div>
                }
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-400">{course.enrollmentCount ?? 0} enrollments</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {course.isPublished ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Blog Posts</h2>
            <Link href="/admin/blog">
              <a className="text-xs text-primary hover:underline">View all</a>
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length === 0 && (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No blog posts yet.</p>
                <Link href="/admin/blog/new">
                  <a className="text-xs text-primary hover:underline mt-1 inline-block">Write your first post →</a>
                </Link>
              </div>
            )}
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-pink-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400">{post.category ?? "Uncategorized"}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${post.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {post.isPublished ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
