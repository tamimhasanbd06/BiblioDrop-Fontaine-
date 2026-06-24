"use client";

import { useEffect, useState } from "react";
import { BookOpen, Truck, Users, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { serverApi, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Admin dashboard overview dynamic stats এবং category pie chart।
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { serverApi("/dashboard/admin/overview").then((d) => setStats(d.stats)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const cards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
    { title: "Total Books", value: stats?.totalBooks || 0, icon: BookOpen, color: "text-emerald-400" },
    { title: "Total Deliveries", value: stats?.totalDeliveries || 0, icon: Truck, color: "text-amber-400" },
    { title: "Total Revenue", value: formatMoney(stats?.totalRevenue), icon: Wallet, color: "text-violet-400" },
  ];
  const data = stats?.booksByCategory?.length ? stats.booksByCategory : [{ name: "No Data", value: 1 }];
  return <section className="space-y-10"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1><p className="mt-2 text-slate-400">Monitor users, books, deliveries, revenue, approvals and transactions.</p></div>{error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <LoadingGrid /> : <><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{cards.map((c) => <StatCard key={c.title} {...c} />)}</div><div className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl"><h2 className="mb-6 text-xl font-bold text-white">Books by Category</h2><div className="h-80"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={4}>{data.map((_, i) => <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"][i % 6]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 12 }} /><Legend /></PieChart></ResponsiveContainer></div></div></>}</section>;
}
function StatCard({ title, value, icon: Icon, color }) { return <div className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl"><div className="flex items-center justify-between"><div><p className="text-sm font-medium uppercase text-slate-400">{title}</p><h2 className="mt-2 text-3xl font-bold text-white">{value}</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10"><Icon className={color} size={22} /></div></div></div>; }
function LoadingGrid() { return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-[#0a1941]/60" />)}</div>; }
