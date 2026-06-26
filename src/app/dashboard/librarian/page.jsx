"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock3, DollarSign, Package, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { serverApi, formatMoney } from "@/lib/api";

export default function LibrarianDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    serverApi("/dashboard/librarian/overview")
      .then((d) => {
        if (d?.success && d?.stats) {
          setStats(d.stats);
        } else {
          setError("Failed to load librarian metrics data.");
        }
      })
      .catch((e) => setError(e.message || "An unexpected error occurred."))
      .finally(() => setLoading(false));
  }, []);

  // selling_books এর ভেতর থাকা সমস্ত amountPaid এর যোগফল (Total Earnings)
  const totalEarningsCalculated = stats?.selling_books?.reduce((acc, curr) => {
    return acc + (Number(curr?.amountPaid) || 0);
  }, 0) || 0;

  // selling_books এর মোট সংখ্যা (Total Requests)
  const totalRequestsCount = stats?.selling_books?.length || 0;

  const cards = [
    { 
      title: "Books Listed", 
      value: stats?.totalBooksListed || 0, 
      icon: BookOpen, 
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-transparent"
    },
    { 
      title: "Total Earnings", 
      value: formatMoney(totalEarningsCalculated), 
      icon: DollarSign, 
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-transparent"
    },
    { 
      title: "Active Requests", 
      value: stats?.activePendingRequests || 0, 
      icon: Clock3, 
      color: "text-amber-400",
      gradient: "from-amber-500/20 to-transparent"
    },
    { 
      title: "Total Requests", 
      value: totalRequestsCount, 
      icon: Package, 
      color: "text-violet-400",
      gradient: "from-violet-500/20 to-transparent"
    },
  ];

  // চার্টের জন্য ডাটা ম্যাপিং
  const chartData = stats?.selling_books?.length 
    ? stats.selling_books.map((x) => ({ name: x.title || "Book", value: Number(x.amountPaid) || 0 })) 
    : [{ name: "No Sales", value: 0 }];

  return (
    <Shell 
      title="Librarian Dashboard" 
      subtitle="Monitor your listed inventory, total accumulated book delivery earnings, and user requests." 
      error={error}
    >
      {loading ? (
        <LoadingGrid />
      ) : (
        <div className="space-y-8">
          {/* ৪টি কার্ডের গ্রিড লেআউট */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <StatCard key={c.title} {...c} />
            ))}
          </div>
          
          <ChartBox title="Earnings Distribution Matrix" data={chartData} />
        </div>
      )}
    </Shell>
  );
}

function Shell({ title, subtitle, error, children }) { 
  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto px-1">
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-3xl font-black text-white sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">{subtitle}</p>
      </div>
      
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {children}
    </section>
  ); 
}

function StatCard({ title, value, icon: Icon, color, gradient }) { 
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0a1941]/90 to-[#041032]/80 p-6 shadow-xl backdrop-blur-md group transition-all duration-300 hover:border-slate-700">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 blur-2xl rounded-full pointer-events-none`} />
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-2 max-w-[70%]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
          <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl truncate">{value}</h2>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#041032]/80 group-hover:scale-105 transition-transform duration-300 shadow-inner">
          <Icon className={color} size={22} />
        </div>
      </div>
    </div>
  ); 
}

function ChartBox({ title, data }) { 
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0a1941]/90 via-[#06133a]/80 to-[#041032]/90 p-6 shadow-xl backdrop-blur-md md:p-8">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
      
      <h2 className="mb-6 text-lg font-bold text-white tracking-wide flex items-center gap-2">
        <TrendingUp size={18} className="text-blue-400" /> {title}
      </h2>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} className="font-semibold" />
            <YAxis stroke="#64748b" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} className="font-semibold" />
            
            <Tooltip 
              cursor={{ fill: "transparent" }}
              contentStyle={{ backgroundColor: "#041032", borderColor: "#1e293b", borderRadius: 16, color: "#fff", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }} 
              itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
              labelStyle={{ color: "#94a3b8", fontSize: 11, fontWeight: "bold", textTransform: "uppercase" }}
            />
            
            <Bar dataKey="value" fill="url(#librarianBarGrad)" radius={[8, 8, 0, 0]} barSize={40}>
              <defs>
                <linearGradient id="librarianBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  ); 
}

function LoadingGrid() { 
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#0a1941]/40 border border-slate-800/50" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-[#0a1941]/40 border border-slate-800/50" />
    </div>
  ); 
}