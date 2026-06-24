"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Admin book approval queue page।
export default function BookApprovalPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/admin/book-approval").then((d) => setBooks(d.books || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const approve = async (id) => { try { await serverApi(`/books/${id}/approve`, { method: "PATCH" }); load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this pending book?")) return; try { await serverApi(`/dashboard/admin/books/${id}`, { method: "DELETE" }); load(); } catch (e) { alert(e.message); } };
  return <AdminTable title="Book Approval Queue" subtitle="Approve pending books or delete invalid listings." error={error} loading={loading}>{books.map((book) => <tr key={book._id} className="border-t border-slate-800"><td className="px-4 py-4"><p className="font-bold text-white">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></td><td className="px-4 py-4 text-slate-300">{book.category}</td><td className="px-4 py-4 text-slate-300">{formatMoney(book.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{book.ownerEmail || book.librarianEmail}</td><td className="px-4 py-4 text-slate-300">{formatDate(book.createdAt)}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => approve(book._id)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><CheckCircle size={14} /></button><button onClick={() => remove(book._id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></div></td></tr>)}{books.length === 0 && !loading && <tr><td colSpan="6" className="p-8 text-center text-slate-400">No pending books.</td></tr>}</AdminTable>;
}
function AdminTable({ title, subtitle, error, loading, children }) { return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">{title}</h1><p className="mt-2 text-slate-400">{subtitle}</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book", "Category", "Fee", "Owner", "Date", "Actions"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>}</section>; }
