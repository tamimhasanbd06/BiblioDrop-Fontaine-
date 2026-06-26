"use client";

import { useEffect, useState } from "react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Admin transactions table, server-side pagination সহ।
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; const load = async () => { try { setLoading(true); const d = await serverApi(`/dashboard/admin/transactions?page=${page}&limit=12`); if (!active) return; setTransactions(d.transactions || []); setPagination(d.pagination || { totalItems: 0, currentPage: page, perPage: 12, totalPages: 1 }); } catch (e) { if (active) setError(e.message); } finally { if (active) setLoading(false); } }; load(); return () => { active = false; }; }, [page]);
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Transactions</h1><p className="mt-2 text-slate-400">Monitor Stripe/payment transaction records.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Transaction ID", "User Email", "Librarian Email", "Amount", "Date"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{transactions.map((tx) => <tr key={tx._id || tx.transactionId} className="border-t border-slate-800"><td className="max-w-[220px] truncate px-4 py-4 text-slate-300">{tx.transactionId}</td><td className="px-4 py-4 text-slate-300">{tx.userEmail}</td><td className="px-4 py-4 text-slate-300">{tx.librarianEmail}</td><td className="px-4 py-4 font-bold text-white">{formatMoney(tx.amount)}</td><td className="px-4 py-4 text-slate-300">{formatDate(tx.createdAt)}</td></tr>)}</tbody></table>{transactions.length === 0 && <p className="p-8 text-center text-slate-400">No transactions found.</p>}</div>}<DashboardPagination pagination={pagination} page={page} setPage={setPage} loading={loading} /></section>;
}
