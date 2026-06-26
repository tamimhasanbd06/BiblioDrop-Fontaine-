"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Librarian delivery management page; status update protected API ব্যবহার করে।
export default function LibrarianDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => { try { setLoading(true); const d = await serverApi(`/dashboard/librarian/deliveries?page=${page}&limit=12`); setDeliveries(d.deliveries || []); setPagination(d.pagination || { totalItems: 0, currentPage: page, perPage: 12, totalPages: 1 }); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [page]);
  const update = async (id, status) => { try { await serverApi(`/dashboard/librarian/deliveries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Manage Deliveries</h1><p className="mt-2 text-slate-400">Update delivery flow from Pending to Dispatched to Delivered.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Client", "Book", "Fee", "Date", "Status"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{deliveries.map((item) => <tr key={item._id} className="border-t border-slate-800"><td className="px-4 py-4 text-slate-300">{item.userName || item.userEmail}</td><td className="px-4 py-4 font-bold text-white">{item.bookTitle}</td><td className="px-4 py-4 text-slate-300">{formatMoney(item.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{formatDate(item.createdAt)}</td><td className="px-4 py-4"><select value={item.status} onChange={(e) => update(item._id, e.target.value)} className="rounded-xl border border-slate-700 bg-[#041032] px-3 py-2 text-white"><option>Pending</option><option>Dispatched</option><option>Delivered</option></select></td></tr>)}</tbody></table>{deliveries.length === 0 && <p className="p-8 text-center text-slate-400"><Truck className="mx-auto mb-2" /> No delivery requests found.</p>}</div>}<DashboardPagination pagination={pagination} page={page} setPage={setPage} loading={loading} /></section>;
}
