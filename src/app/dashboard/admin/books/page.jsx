"use client";

import { useEffect, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import { serverApi, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Admin manage all books page; force unpublish/delete।
export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/admin/books").then((d) => setBooks(d.books || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const unpublish = async (id) => { try { await serverApi(`/dashboard/admin/books/${id}/unpublish`, { method: "PATCH" }); load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this book?")) return; try { await serverApi(`/dashboard/admin/books/${id}`, { method: "DELETE" }); load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Manage All Books</h1><p className="mt-2 text-slate-400">Admin can forcibly unpublish or delete any listing.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book", "Category", "Fee", "Approval", "Owner", "Actions"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{books.map((book) => <tr key={book._id} className="border-t border-slate-800"><td className="px-4 py-4"><p className="font-bold text-white">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></td><td className="px-4 py-4 text-slate-300">{book.category}</td><td className="px-4 py-4 text-slate-300">{formatMoney(book.deliveryFee)}</td><td className="px-4 py-4 text-slate-300">{book.approvalStatus}</td><td className="px-4 py-4 text-slate-300">{book.ownerEmail || book.librarianEmail}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => unpublish(book._id)} className="rounded-full bg-yellow-500 px-3 py-2 text-xs font-bold text-slate-950"><UploadCloud size={14} /></button><button onClick={() => remove(book._id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table>{books.length === 0 && <p className="p-8 text-center text-slate-400">No books found.</p>}</div>}</section>;
}
