"use client";

import { useEffect, useState } from "react";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: User delivery history table page।
export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { serverApi("/dashboard/user/deliveries").then((d) => setDeliveries(d.deliveries || [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Delivery History</h1><p className="mt-2 text-slate-400">Track all requested books and their delivery status.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book Title", "Fee", "Request Date", "Status"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{deliveries.map((item) => <tr key={item._id} className="border-t border-slate-800"><td className="px-4 py-4 font-bold text-white">{item.bookTitle}</td><td className="px-4 py-4 text-slate-300">{formatMoney(item.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{formatDate(item.createdAt)}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">{item.status}</span></td></tr>)}</tbody></table>{deliveries.length === 0 && <p className="p-8 text-center text-slate-400">No delivery history found.</p>}</div>}</section>;
}
