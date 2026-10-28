import { useMemo, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Download, FilterX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  trainer: "bg-violet-100 text-violet-700",
  user: "bg-blue-100 text-blue-700",
  learner: "bg-gray-100 text-gray-600",
};

export default function AdminUsers() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [lastLogin, setLastLogin] = useState("all");
  const [enrollmentStatus, setEnrollmentStatus] = useState("all");
  const [page, setPage] = useState(0);
  const queryInput = useMemo(
    () => ({
      search: search.trim() || undefined,
      role: role === "all" ? undefined : role as "admin" | "trainer" | "learner" | "user",
      lastLogin: lastLogin === "all" ? undefined : lastLogin as "last7" | "last30" | "never",
      enrollmentStatus: enrollmentStatus === "all" ? undefined : enrollmentStatus as "enrolled" | "not-enrolled",
      limit: 50,
      offset: page * 50,
    }),
    [enrollmentStatus, lastLogin, page, role, search]
  );
  const { data, isLoading, isError, error } = trpc.auth.listUsersPage.useQuery(queryInput);
  const exportQuery = trpc.auth.exportUsersCsv.useQuery({
    search: queryInput.search,
    role: queryInput.role,
    lastLogin: queryInput.lastLogin,
    enrollmentStatus: queryInput.enrollmentStatus,
  }, { enabled: false });
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 50));

  const updateRole = trpc.auth.updateRole.useMutation({
    onSuccess: () => { utils.auth.listUsers.invalidate(); utils.auth.listUsersPage.invalidate(); toast.success("Role updated!"); },
    onError: (e) => toast.error(e.message),
  });

  const filtered = users?.filter(u =>
    !search || (u.name ?? "").toLowerCase().includes(search.toLowerCase()) || (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setLastLogin("all");
    setEnrollmentStatus("all");
    setPage(0);
  };

  const downloadCsv = async () => {
    const result = await exportQuery.refetch();
    if (!result.data) {
      toast.error("The user export could not be generated.");
      return;
    }
    const blob = new Blob([result.data], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "skillsphere-users.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded.");
  };

  return (
    <AdminLayout title="Users">
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-64"
          />
          <span className="text-sm text-gray-500">{total.toLocaleString()} users</span>
          <Button type="button" size="sm" variant="outline" onClick={downloadCsv} disabled={exportQuery.isFetching} className="ml-auto gap-1.5">
            <Download className="h-4 w-4" /> {exportQuery.isFetching ? "Preparing…" : "Export CSV"}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={role} onValueChange={value => { setRole(value); setPage(0); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="trainer">Trainer</SelectItem>
              <SelectItem value="learner">Learner</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={lastLogin} onValueChange={value => { setLastLogin(value); setPage(0); }}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Any last login" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any last login</SelectItem>
              <SelectItem value="last7">Active in 7 days</SelectItem>
              <SelectItem value="last30">Active in 30 days</SelectItem>
              <SelectItem value="never">Never signed in</SelectItem>
            </SelectContent>
          </Select>
          <Select value={enrollmentStatus} onValueChange={value => { setEnrollmentStatus(value); setPage(0); }}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Any enrollment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any enrollment</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="not-enrolled">Not enrolled</SelectItem>
            </SelectContent>
          </Select>
          {(search || role !== "all" || lastLogin !== "all" || enrollmentStatus !== "all") && (
            <Button type="button" size="sm" variant="ghost" onClick={clearFilters} className="gap-1.5 text-gray-500">
              <FilterX className="h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400">CSV export uses the active filters and includes up to 10,000 matching users.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load users right now. {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last login</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrollment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="font-medium text-gray-900">{user.name ?? "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{user.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge className={`text-[10px] border-0 ${ROLE_COLORS[user.role ?? "user"] ?? ROLE_COLORS.user}`}>
                    {user.role ?? "user"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3 text-xs">
                  <Badge variant="outline" className={Number(user.enrollmentStatus) ? "border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-500"}>
                    {Number(user.enrollmentStatus) ? "Enrolled" : "Not enrolled"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role ?? "user"}
                    onValueChange={v => updateRole.mutate({ userId: user.id, role: v as any })}
                  >
                    <SelectTrigger className="h-7 text-xs w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-8 w-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No users found.</p>
          </div>
        )}
      </div>
      {!isLoading && total > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Showing {page * 50 + 1}–{Math.min((page + 1) * 50, total)} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPage(current => Math.max(0, current - 1))} disabled={page === 0}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <span className="text-xs text-gray-500">Page {page + 1} of {totalPages}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => setPage(current => Math.min(totalPages - 1, current + 1))} disabled={page >= totalPages - 1}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
