import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users, BookOpen, DollarSign, TrendingUp, Shield, BarChart3,
  Award, Activity
} from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: analytics } = trpc.analytics.overview.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: revenueByMonthData } = trpc.analytics.revenueByMonth.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: users, refetch: refetchUsers } = trpc.auth.listUsers.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: allCourses } = trpc.courses.list.useQuery({ limit: 100 }, { enabled: isAuthenticated && user?.role === "admin" });

  const updateRole = trpc.auth.updateRole.useMutation({
    onSuccess: () => { toast.success("Role updated!"); refetchUsers(); },
    onError: (e: any) => toast.error(e.message),
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>
    </div>
  );

  if (!isAuthenticated || user?.role !== "admin") return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8 text-center">
        <Shield className="h-14 w-14 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold">Admin access required</h2>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        <Button asChild><Link href="/dashboard">Back to Dashboard</Link></Button>
      </div>
    </div>
  );

  const revenueData = revenueByMonthData ?? [];
  const enrollmentData: any[] = [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="brand-gradient text-white py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-white/70">Platform overview and management</p>
        </div>
      </section>

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container space-y-8">

          {/* KPI Stats */}
          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: analytics.totalUsers, icon: Users, color: "text-blue-600 bg-blue-50", change: "+12%" },
                { label: "Total Courses", value: analytics.totalCourses, icon: BookOpen, color: "text-purple-600 bg-purple-50", change: "+5%" },
                { label: "Total Revenue", value: `$${parseFloat(analytics.totalRevenue ?? "0").toLocaleString()}`, icon: DollarSign, color: "text-yellow-600 bg-yellow-50", change: "+23%" },
                { label: "Enrollments", value: analytics.totalEnrollments, icon: TrendingUp, color: "text-green-600 bg-green-50", change: "+18%" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-500" /> Monthly Revenue
              </h3>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => [`$${v}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#2A63BF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
              )}
            </div>

            {/* Enrollments Chart */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" /> Monthly Enrollments
              </h3>
              {enrollmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#F5B942" strokeWidth={2} dot={{ fill: "#F5B942", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No enrollment data yet</div>
              )}
            </div>
          </div>

          {/* Top Courses */}
          {analytics?.topCourses && analytics.topCourses.length > 0 && (
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" /> Top Performing Courses
                </h3>
              </div>
              <div className="divide-y divide-border">
                {analytics.topCourses.map((course: any, i: number) => (
                  <div key={course.id} className="p-4 flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6 text-center">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.enrollmentCount} enrollments</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">${parseFloat(course.revenue ?? "0").toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Management */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> User Management
              </h3>
            </div>
            {users && users.length > 0 ? (
              <div className="divide-y divide-border">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {u.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{u.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{u.email ?? "No email"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={u.role}
                        onValueChange={(role: any) => updateRole.mutate({ userId: (u as any).id, role })}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Learner</SelectItem>
                          <SelectItem value="trainer">Trainer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No users found</div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
