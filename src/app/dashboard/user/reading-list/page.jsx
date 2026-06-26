"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, BookmarkDays } from "lucide-react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: User-এর শুধুমাত্র "Delivered" স্ট্যাটাসের বইগুলোর গ্যালারি ভিউ (সার্ভার পেজিনেশন সহ)।
export default function ReadingListPage() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    
    // বাংলা মন্তব্য: এপিআই থেকে শুধুমাত্র Delivered বইগুলো পেজ অনুসারে ফেচ করা হচ্ছে।
    const load = async () => {
      try {
        setLoading(true);
        const data = await serverApi(`/dashboard/user/reading-list?page=${page}&limit=12`);
        if (!active) return;
        setBooks(data.books || []);
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

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto px-1">
      {/* Header Profile Info */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          My Reading List
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Personal gallery of your successfully delivered books and literature records.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Content Rendering Block */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3.2] animate-pulse rounded-2xl bg-[#0a1941]/40 border border-slate-800/60" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800/60 bg-[#0a1941]/30 p-12 text-center">
          <div className="p-4 rounded-full bg-slate-800/40 text-slate-500 mb-4">
            {/* Lucide icon as replacement */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-tabs"><path d="M2 6h4v12H2z"/><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6"/><path d="M20 8h2"/><path d="M20 12h2"/><path d="M20 16h2"/></svg>
          </div>
          <p className="text-slate-400 font-medium max-w-md">
            No successfully delivered books found in your library portal node yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 sm:gap-6">
          {books.map((book) => (
            <article 
              key={book._id} 
              className="relative group overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0a1941]/80 to-[#041032]/60 p-3 shadow-xl transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1"
            >
              {/* Premium Delivered Status Badge */}
              <div className="absolute top-5 right-5 z-10 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
                <CheckCircle2 size={11} /> Delivered
              </div>

              {/* Book Cover Container */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                <Image 
                  src={book.bookImage || "/placeholder-book.jpg"} 
                  alt={book.bookTitle || "Book Cover"} 
                  fill 
                  sizes="(max-w-640px) 50vw, (max-w-1024px) 33vw, 25vw" 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>

              {/* Meta details */}
              <div className="mt-4 space-y-1 px-1">
                <h3 className="line-clamp-1 text-sm sm:text-base font-bold text-white tracking-wide group-hover:text-blue-400 transition duration-300" title={book.bookTitle}>
                  {book.bookTitle}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-semibold text-slate-400">
                  <span className="text-blue-400 font-extrabold">{formatMoney(book.deliveryFee)}</span>
                  <span className="text-slate-500 truncate">
                    {formatDate(book.updatedAt || book.createdAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Server side pagination footer component */}
      <div className="pt-4">
        <DashboardPagination 
          pagination={pagination} 
          page={page} 
          setPage={setPage} 
          loading={loading} 
        />
      </div>
    </section>
  );
}