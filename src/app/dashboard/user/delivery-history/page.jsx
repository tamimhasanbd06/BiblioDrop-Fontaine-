"use client";

import { useEffect, useState } from "react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: User delivery history table page, server-side pagination সহ।
export default function DeliveryHistoryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    // বাংলা মন্তব্য: Current page অনুযায়ী user delivery list আনা হচ্ছে।
    const load = async () => {
      try {
        setLoading(true);
        const data = await serverApi(`/dashboard/user/deliveries?page=${page}&limit=12`);
        if (!active) return;
        setDeliveries(data.deliveries || []);
        setPagination(data.pagination || { totalItems: 0, currentPage: page, perPage: 12, totalPages: 1 });
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page]);

  return <section className="space-y-8"><Header title="Delivery History" text="Track all requested books and their delivery status." />{error && <ErrorBox text={error} />}{loading ? <LoadingBox /> : <Table deliveries={deliveries} />}<DashboardPagination pagination={pagination} page={page} setPage={setPage} loading={loading} /></section>;
}

function Header({ title, text }) { return <div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">{title}</h1><p className="mt-2 text-slate-400">{text}</p></div>; }
function ErrorBox({ text }) { return <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{text}</div>; }
function LoadingBox() { return <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" />; }
function Table({ deliveries }) { return <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book Title", "Fee", "Request Date", "Status"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{deliveries.map((item) => <tr key={item._id} className="border-t border-slate-800"><td className="px-4 py-4 font-bold text-white">{item.bookTitle}</td><td className="px-4 py-4 text-slate-300">{formatMoney(item.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{formatDate(item.createdAt)}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">{item.status}</span></td></tr>)}</tbody></table>{deliveries.length === 0 && <p className="p-8 text-center text-slate-400">No delivery history found.</p>}</div>; }
