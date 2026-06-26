"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi } from "@/lib/api";

// বাংলা মন্তব্য: Admin pending approval books queue, pagination সহ।
export default function BookApprovalPage() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => { try { setLoading(true); const d = await serverApi(`/dashboard/admin/book-approval?page=${page}&limit=12`); setBooks(d.books || []); setPagination(d.pagination || { totalItems: 0, currentPage: page, perPage: 12, totalPages: 1 }); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [page]);
  const approve = async (id) => { try { await serverApi(`/books/${id}/approve`, { method: "PATCH" }); await load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this book?")) return; try { await serverApi(`/dashboard/admin/books/${id}`, { method: "DELETE" }); await load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Book Approval Queue</h1><p className="mt-2 text-slate-400">Approve and publish librarian submitted books.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book", "Owner", "Category", "Fee", "Actions"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{books.map((book) => <tr key={book._id} className="border-t border-slate-800"><td className="px-4 py-4"><p className="font-bold text-white">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></td><td className="px-4 py-4 text-slate-300">{book.ownerEmail || book.librarianEmail}</td><td className="px-4 py-4 text-slate-300">{book.category}</td><td className="px-4 py-4 text-slate-300">৳ {book.deliveryFee || 0}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => approve(book._id)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><CheckCircle size={14} /></button><button onClick={() => remove(book._id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table>{books.length === 0 && <p className="p-8 text-center text-slate-400">No pending books found.</p>}</div>}<DashboardPagination pagination={pagination} page={page} setPage={setPage} loading={loading} /></section>;
}
