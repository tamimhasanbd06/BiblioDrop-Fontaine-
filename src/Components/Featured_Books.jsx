"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiRefreshCw } from "react-icons/fi";
import Image from "next/image";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/featured-books`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch featured books");
        }

        const data = await res.json();

        const safeBooks = Array.isArray(data) ? data : data?.data || [];

        setBooks(safeBooks);
      } catch (err) {
        setError("Failed to load featured books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_URL]);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_38%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            <FiBookOpen />
            Latest Approved Books
          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Featured <span className="text-blue-400">Books</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Discover the latest published books from local libraries and
            independent book owners.
          </p>
        </div>

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto mb-10 max-w-xl rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-center">
            <p className="font-semibold text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div>
            <div className="mb-10 flex items-center justify-center gap-3 text-blue-300">
              <FiRefreshCw className="animate-spin text-xl" />
              <span className="text-sm font-semibold tracking-wide">
                Loading featured books...
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/20"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-slate-800">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800" />
                    <div className="absolute left-0 top-0 h-full w-2 bg-white/10" />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-800" />
                    <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-800" />

                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-slate-800" />
                      <div className="h-4 w-10 animate-pulse rounded-full bg-slate-800" />
                    </div>

                    <div className="h-9 w-full animate-pulse rounded-full bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : books.length === 0 && !error ? (
          /* Empty State */
          <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-blue-950/20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300">
              <FiBookOpen />
            </div>

            <h3 className="text-2xl font-black text-white">
              No Featured Books Found
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              There are no approved books available right now. Please check back
              later.
            </p>
          </div>
        ) : (
          <>
            {/* Book Grid */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
              {books.map((book, index) => {
                const bookImage =
                  book.image ||
                  book.coverImage ||
                  book.imageUrl ||
                  book.cover ||
                  book.photo ||
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=700&auto=format&fit=crop";

                const isUnavailable =
                  book.status === "Checked Out" ||
                  book.status === "Unavailable" ||
                  book.availability === "Unavailable";

                return (
                  <article
                    key={book._id || index}
                    className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-blue-400/40 hover:bg-white/[0.07] hover:shadow-blue-700/20"
                    style={{
                      animation: `bookFadeUp 0.6s ease forwards`,
                      animationDelay: `${index * 0.08}s`,
                      opacity: 0,
                    }}
                  >
                    {/* Book Cover */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-slate-900 shadow-xl">
                      <Image
                        src={bookImage}
                        alt={book.title || "Book cover"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Book Spine Effect */}
                      <div className="pointer-events-none absolute left-0 top-0 h-full w-[10px] bg-gradient-to-r from-black/45 to-transparent" />

                      {/* Glossy Effect */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Bottom Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      {/* Category Badge */}
                      <div className="absolute left-3 top-3 max-w-[85%] rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur-md">
                        {book.category || "Book"}
                      </div>

                      {/* Fee Badge */}
                      <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-blue-700 shadow-lg backdrop-blur-md">
                        ৳ {book.deliveryFee || 0}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4">
                      <h3 className="line-clamp-1 text-sm font-black text-white transition-colors duration-300 group-hover:text-blue-300">
                        {book.title || "Untitled Book"}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-400">
                        by {book.author || "Unknown Author"}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            isUnavailable
                              ? "bg-red-500/10 text-red-300 ring-1 ring-red-400/20"
                              : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"
                          }`}
                        >
                          {isUnavailable ? "Unavailable" : "Available"}
                        </span>
                      </div>

                      <Link
                        href={`/books/${book._id}`}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
                      >
                        View Details
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Browse All Button */}
            <div className="mt-14 text-center">
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-400/20 bg-white/[0.04] px-8 py-4 text-sm font-bold text-blue-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-700/25"
              >
                Browse All Books
                <FiArrowRight />
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes bookFadeUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}