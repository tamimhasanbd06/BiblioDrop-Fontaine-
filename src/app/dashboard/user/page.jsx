"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, DollarSign, PackageCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { serverApi, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: User dashboard overview dynamic stats এবং chart দেখায়।
export default function UserDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // বাংলা মন্তব্য: Protected overview API থেকে user quick stats আনা হচ্ছে।
    serverApi("/dashboard/user/overview").then((data) => setStats(data.stats)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Total Books Read", value: stats?.totalBooksRead || 0, icon: BookOpen, color: "text-blue-400" },
    { title: "Pending Deliveries", value: stats?.pendingDeliveries || 0, icon: Clock, color: "text-amber-400" },
    { title: "Total Fees Spent", value: formatMoney(stats?.totalSpent), icon: DollarSign, color: "text-emerald-400" },
    { title: "Delivered Books", value: stats?.deliveredBooks || 0, icon: PackageCheck, color: "text-violet-400" },
  ];
  const chartData = stats?.chart?.length ? stats.chart : [{ name: "No Data", value: 0 }];

  return <DashboardShell title="User Dashboard" subtitle="Track your books, deliveries, reading list, and reviews." error={error}>{loading ? <LoadingGrid /> : <><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{cards.map((card) => <StatCard key={card.title} {...card} />)}</div><ChartBox title="Delivery Status Overview" data={chartData} /></>}</DashboardShell>;
}

// বাংলা মন্তব্য: Dashboard wrapper theme preserve করে।
function DashboardShell({ title, subtitle, error, children }) { return <div className="min-h-screen bg-[#041032] text-slate-100"><section className="space-y-10"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold tracking-tight text-white">{title}</h1><p className="mt-2 text-sm text-slate-400 sm:text-base">{subtitle}</p></div>{error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300">{error}</div>}{children}</section></div>; }

// বাংলা মন্তব্য: Quick stat card component।
function StatCard({ title, value, icon: Icon, color }) { return <div className="group rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:border-slate-700"><div className="flex items-center justify-between"><div><p className="text-sm font-medium uppercase tracking-wide text-slate-400">{title}</p><h2 className="mt-2 text-3xl font-bold text-white">{value}</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/50 bg-blue-500/10"><Icon className={color} size={22} /></div></div></div>; }

// বাংলা মন্তব্য: Recharts chart box।
function ChartBox({ title, data }) { return <div className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl backdrop-blur-md md:p-8"><h2 className="mb-6 text-xl font-bold text-white">{title}</h2><div className="h-80 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" allowDecimals={false} /><Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 12, color: "#fff" }} /><Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>; }

// বাংলা মন্তব্য: Dashboard loading cards।
function LoadingGrid() { return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#0a1941]/60" />)}</div>; }
