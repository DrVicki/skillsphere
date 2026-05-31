import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, ShieldCheck, User } from "lucide-react";
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
  const { data: users, isLoading } = trpc.auth.listUsers.useQuery();
  const [search, setSearch] = useState("");

  const updateRole = trpc.auth.updateRole.useMutation({
    onSuccess: () => { utils.auth.listUsers.invalidate(); toast.success("Role updated!"); },
    onError: (e) => toast.error(e.message),
  });

  const filtered = users?.filter(u =>
    !search || (u.name ?? "").toLowerCase().includes(search.toLowerCase()) || (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout title="Users">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <span className="text-sm text-gray-500">{filtered.length} users</span>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
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
    </AdminLayout>
  );
}
