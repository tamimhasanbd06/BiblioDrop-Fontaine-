"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, PlusCircle, Trash2, UploadCloud } from "lucide-react";
import { serverApi } from "@/lib/api";

// বাংলা মন্তব্য: Librarian inventory table dynamic server data ব্যবহার করে।
export default function InventoryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/librarian/books").then((d) => setBooks(d.books || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const toggle = async (id) => { try { await serverApi(`/dashboard/librarian/books/${id}/toggle-publish`, { method: "PATCH" }); load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this book?")) return; try { await serverApi(`/dashboard/librarian/books/${id}`, { method: "DELETE" }); load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-extrabold text-white">Manage Inventory</h1><p className="mt-2 text-slate-400">Pending, published and unpublished books.</p></div><Link href="/dashboard/librarian/add-book" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white"><PlusCircle size={18} /> Add Book</Link></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0a1941]/60"><table className="min-w-full text-sm"><thead className="bg-[#041032]"><tr>{["Book", "Category", "Approval", "Availability", "Actions"].map((h) => <th key={h} className="px-4 py-4 text-left font-bold text-slate-300">{h}</th>)}</tr></thead><tbody>{books.map((book) => <tr key={book._id} className="border-t border-slate-800"><td className="px-4 py-4"><p className="font-bold text-white">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></td><td className="px-4 py-4 text-slate-300">{book.category}</td><td className="px-4 py-4 text-slate-300">{book.approvalStatus}</td><td className="px-4 py-4 text-slate-300">{book.availabilityStatus}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><button onClick={() => alert("Edit form can be connected from this row using PATCH endpoint.")} className="rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white"><Edit size={14} /></button><button onClick={() => toggle(book._id)} className="rounded-full bg-yellow-500 px-3 py-2 text-xs font-bold text-slate-950"><UploadCloud size={14} /></button><button onClick={() => remove(book._id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table>{books.length === 0 && <p className="p-8 text-center text-slate-400">No books found.</p>}</div>}</section>;
}
