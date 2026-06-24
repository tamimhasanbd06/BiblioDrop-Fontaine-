"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { serverApi, formatDate } from "@/lib/api";

// বাংলা মন্তব্য: Admin manage users page; role change এবং delete protected API ব্যবহার করে।
export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/admin/users").then((d) => setUsers(d.users || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const roleChange = async (id, role) => { try { await serverApi(`/dashboard/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }); load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this user?")) return; try { await serverApi(`/dashboard/admin/users/${id}`, { method: "DELETE" }); load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Manage Users</h1><p className="mt-2 text-slate-400">Change role or delete users.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Name", "Email", "Role", "Joined", "Actions"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{users.map((user) => <tr key={user._id || user.id} className="border-t border-slate-800"><td className="px-4 py-4 font-bold text-white">{user.name || "No Name"}</td><td className="px-4 py-4 text-slate-300">{user.email}</td><td className="px-4 py-4"><select value={user.role || "user"} onChange={(e) => roleChange(user._id || user.id, e.target.value)} className="rounded-xl border border-slate-700 bg-[#041032] px-3 py-2 text-white"><option value="user">user</option><option value="librarian">librarian</option><option value="admin">admin</option></select></td><td className="px-4 py-4 text-slate-300">{formatDate(user.createdAt)}</td><td className="px-4 py-4"><button onClick={() => remove(user._id || user.id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></td></tr>)}</tbody></table>{users.length === 0 && <p className="p-8 text-center text-slate-400">No users found.</p>}</div>}</section>;
}
