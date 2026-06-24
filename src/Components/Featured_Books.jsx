"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import { publicApi, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Home page-এর latest approved books section।
export default function FeaturedBooks() {
  // বাংলা মন্তব্য: Server থেকে আসা latest ৬টি approved books রাখা হচ্ছে।
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // বাংলা মন্তব্য: Featured books API call করা হচ্ছে।
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await publicApi("/featured-books");
        setBooks(Array.isArray(data.books) ? data.books : []);
      } catch (err) {
        setError(err.message || "Failed to load featured books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[130px]" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            <FiBookOpen /> Latest Approved Books
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Featured <span className="text-blue-400">Books</span></h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Discover the latest published books from local libraries and independent book owners.</p>
        </motion.div>

        {!loading && error && <div className="mx-auto mb-10 max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center font-semibold text-red-300">{error}</div>}

        {loading ? (
          <div>
            <div className="mb-10 flex items-center justify-center gap-3 text-blue-300"><FiRefreshCw className="animate-spin text-xl" /><span className="text-sm font-semibold">Loading featured books...</span></div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          </div>
        ) : books.length === 0 && !error ? (
          <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-blue-950/20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300"><FiBookOpen /></div>
            <h3 className="text-2xl font-black text-white">No Featured Books Found</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">There are no approved books available right now.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
              {books.map((book, index) => <BookCard key={book._id || book.bookId || index} book={book} index={index} />)}
            </div>
            <div className="mt-14 text-center">
              <Link href="/books" className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-400/20 bg-white/[0.04] px-8 py-4 text-sm font-bold text-blue-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-700/25">Browse All Books <FiArrowRight /></Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// বাংলা মন্তব্য: Featured book card UI।
function BookCard({ book, index }) {
  const bookImage = book.image || book.coverImage || book.imageUrl || book.cover || "/placeholder-book.jpg";
  const isUnavailable = ["Checked Out", "Unavailable", "Not Available"].includes(book.availabilityStatus || book.status || book.availability);

  return (
    <motion.article initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} viewport={{ once: true }} className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-blue-400/40 hover:bg-white/[0.07] hover:shadow-blue-700/20">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-slate-900 shadow-xl">
        <Image src={bookImage} alt={book.title || "Book cover"} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-[10px] bg-gradient-to-r from-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 max-w-[85%] rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">{book.category || "Book"}</div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-blue-700 shadow-lg">{formatMoney(book.deliveryFee)}</div>
      </div>
      <div className="pt-4">
        <h3 className="line-clamp-1 text-sm font-black text-white group-hover:text-blue-300">{book.title || "Untitled Book"}</h3>
        <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-400">by {book.author || "Unknown Author"}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${isUnavailable ? "bg-red-500/10 text-red-300 ring-1 ring-red-400/20" : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"}`}>{isUnavailable ? "Unavailable" : "Available"}</span>
          <span className="text-xs font-bold text-yellow-300">★ {book.rating || 0}</span>
        </div>
        <Link href={`/books/${book._id}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5">View Details <FiArrowRight /></Link>
      </div>
    </motion.article>
  );
}

// বাংলা মন্তব্য: Data loading হওয়ার সময় skeleton card দেখানো হচ্ছে।
function SkeletonCard() {
  return <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3"><div className="relative aspect-[2/3] animate-pulse rounded-[1.25rem] bg-slate-800" /><div className="mt-4 space-y-3"><div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-800" /><div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-800" /><div className="h-9 w-full animate-pulse rounded-full bg-slate-800" /></div></div>;
}
