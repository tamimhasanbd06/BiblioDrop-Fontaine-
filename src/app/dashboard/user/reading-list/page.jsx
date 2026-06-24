"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: User delivered books gallery reading list।
export default function ReadingListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { serverApi("/dashboard/user/reading-list").then((d) => setBooks(d.books || [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">My Reading List</h1><p className="mt-2 text-slate-400">Gallery of successfully delivered books.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-[#0a1941]/60" />)}</div> : books.length === 0 ? <p className="rounded-2xl bg-[#0a1941]/60 p-8 text-center text-slate-400">No delivered books yet.</p> : <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">{books.map((book) => <article key={book._id} className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-3"><div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-900"><Image src={book.bookImage || "/placeholder-book.jpg"} alt={book.bookTitle || "Book"} fill sizes="25vw" className="object-cover" /></div><h3 className="mt-4 line-clamp-1 font-bold text-white">{book.bookTitle}</h3><p className="mt-1 text-sm text-slate-400">{formatMoney(book.deliveryFee)} • {formatDate(book.updatedAt || book.createdAt)}</p></article>)}</div>}</section>;
}
