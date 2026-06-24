"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Librarian delivery management page; status update protected API ব্যবহার করে।
export default function LibrarianDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/librarian/deliveries").then((d) => setDeliveries(d.deliveries || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const updateStatus = async (id, status) => { try { await serverApi(`/dashboard/librarian/deliveries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Manage Deliveries</h1><p className="mt-2 text-slate-400">Update delivery requests from Pending to Dispatched to Delivered.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Client", "Book", "Fee", "Date", "Status", "Update"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{deliveries.map((item) => <tr key={item._id} className="border-t border-slate-800"><td className="px-4 py-4 text-white">{item.userName || item.userEmail}</td><td className="px-4 py-4 text-slate-300">{item.bookTitle}</td><td className="px-4 py-4 text-slate-300">{formatMoney(item.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{formatDate(item.createdAt)}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">{item.status}</span></td><td className="px-4 py-4"><select value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)} className="rounded-xl border border-slate-700 bg-[#041032] px-3 py-2 text-white"><option>Pending</option><option>Dispatched</option><option>Delivered</option></select></td></tr>)}</tbody></table>{deliveries.length === 0 && <div className="p-10 text-center text-slate-400"><Truck className="mx-auto mb-3" />No deliveries found.</div>}</div>}</section>;
}
