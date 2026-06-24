"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock3, DollarSign, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { serverApi, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Librarian dashboard overview dynamic stats দেখায়।
export default function LibrarianDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { serverApi("/dashboard/librarian/overview").then((d) => setStats(d.stats)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const cards = [
    { title: "Books Listed", value: stats?.totalBooksListed || 0, icon: BookOpen, color: "text-blue-400" },
    { title: "Total Earnings", value: formatMoney(stats?.totalEarnings), icon: DollarSign, color: "text-emerald-400" },
    { title: "Active Requests", value: stats?.activePendingRequests || 0, icon: Clock3, color: "text-amber-400" },
    { title: "Top Requests", value: stats?.mostRequestedBooks?.length || 0, icon: Package, color: "text-violet-400" },
  ];
  const chartData = stats?.mostRequestedBooks?.length ? stats.mostRequestedBooks.map((x) => ({ name: x.title, value: x.requests })) : [{ name: "No Requests", value: 0 }];
  return <Shell title="Librarian Dashboard" subtitle="Manage inventory, earnings, and delivery requests." error={error}>{loading ? <LoadingGrid /> : <><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{cards.map((c) => <StatCard key={c.title} {...c} />)}</div><ChartBox title="Most Requested Books" data={chartData} /></>}</Shell>;
}
function Shell({ title, subtitle, error, children }) { return <section className="space-y-10"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">{title}</h1><p className="mt-2 text-slate-400">{subtitle}</p></div>{error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300">{error}</div>}{children}</section>; }
function StatCard({ title, value, icon: Icon, color }) { return <div className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl"><div className="flex items-center justify-between"><div><p className="text-sm font-medium uppercase text-slate-400">{title}</p><h2 className="mt-2 text-3xl font-bold text-white">{value}</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10"><Icon className={color} size={22} /></div></div></div>; }
function ChartBox({ title, data }) { return <div className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl"><h2 className="mb-6 text-xl font-bold text-white">{title}</h2><div className="h-80"><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" allowDecimals={false} /><Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 12 }} /><Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>; }
function LoadingGrid() { return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#0a1941]/60" />)}</div>; }
