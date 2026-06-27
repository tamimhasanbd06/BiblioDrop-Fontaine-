"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiSliders,
  FiUser,
  FiX,
} from "react-icons/fi";
import { publicApi, serverApi, formatMoney } from "@/lib/api";


export default function BrowseBooksPage() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <BrowseBooksContent />
    </Suspense>
  );
}


function BrowseBooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    totalBooks: 0,
    currentPage: 1,
    perPage: 12,
    totalPages: 1,
  });
  const [categories, setCategories] = useState(["All"]);


  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const [loading, setLoading] = useState(true);
  const [paymentBookId, setPaymentBookId] = useState("");
  const [error, setError] = useState("");
  const booksPerPage = 12;

  useEffect(() => {
  
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

 
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(booksPerPage),
      sort: sortBy,
    });

    if (search.trim()) params.set("search", search.trim());
    if (category !== "All") params.set("category", category);
    if (availability !== "All") params.set("availability", availability);
    if (minFee !== "") params.set("minFee", minFee);
    if (maxFee !== "") params.set("maxFee", maxFee);

    return params.toString();
  }, [currentPage, booksPerPage, sortBy, search, category, availability, minFee, maxFee]);

  useEffect(() => {
  
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await publicApi(`/books?${queryString}`);
        setBooks(Array.isArray(data.books) ? data.books : []);
        setPagination(
          data.pagination || {
            totalBooks: 0,
            currentPage: 1,
            perPage: booksPerPage,
            totalPages: 1,
          }
        );
      } catch (err) {
        setError(err.message || "Failed to load books.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [queryString]);

  useEffect(() => {

    publicApi("/categories")
      .then((data) => setCategories(["All", ...(data.categories || [])]))
      .catch(() =>
        setCategories(["All", "Fiction", "Academic", "Sci-Fi", "Romance", "Classics", "Children"])
      );
  }, []);

  useEffect(() => {

    setCurrentPage(1);
  }, [search, category, availability, minFee, maxFee, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setAvailability("All");
    setSortBy("latest");
    setMinFee("");
    setMaxFee("");
    setCurrentPage(1);
    router.replace("/books");
  };


  const handleRequestDelivery = async (book) => {
    try {
      setPaymentBookId(book._id);

      const data = await serverApi("/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookId: book._id }),
      });

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Stripe checkout URL not found.");
    } catch (err) {
      const message = err.message || "Payment checkout failed.";

।
      if (message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("token")) {
        router.push(`/signin?redirect=/books`);
        return;
      }

      alert(message);
    } finally {
      setPaymentBookId("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1440px]">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
            <FiBookOpen /> Public Book Collection
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Browse <span className="text-blue-400">Books</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Search, filter and sort approved books. You can open details or request delivery through Stripe payment.
          </p>
        </div>

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
            <label className="relative block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by book name, author or ID"
                className="h-12 w-full rounded-full border border-white/10 bg-slate-900/80 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-400"
              />
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none focus:border-blue-400">
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="h-12 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none focus:border-blue-400">
              <option>All</option>
              <option>Available</option>
              <option>Unavailable</option>
              <option>Checked Out</option>
              <option>Pending Delivery</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-12 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none focus:border-blue-400">
              <option value="latest">Latest</option>
              <option value="name">Name A-Z</option>
              <option value="fee-low">Fee Low to High</option>
              <option value="fee-high">Fee High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <input value={minFee} onChange={(e) => setMinFee(e.target.value)} type="number" min="0" placeholder="Min delivery fee" className="h-12 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none focus:border-blue-400" />
            <input value={maxFee} onChange={(e) => setMaxFee(e.target.value)} type="number" min="0" placeholder="Max delivery fee" className="h-12 rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-white outline-none focus:border-blue-400" />
            <button onClick={resetFilters} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-6 text-sm font-bold text-blue-200 hover:bg-blue-600 hover:text-white"><FiX /> Reset</button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2"><FiFilter /> {pagination.totalBooks || 0} books found</span>
          <span className="inline-flex items-center gap-2"><FiSliders /> Page {pagination.currentPage} of {pagination.totalPages}</span>
        </div>

        {error && <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-center text-red-300">{error}</div>}
        {loading ? (
          <BrowseSkeleton />
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onRequestDelivery={handleRequestDelivery}
                isPaying={paymentBookId === book._id}
              />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><FiChevronLeft /> Prev</button>
            <span className="rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white">{currentPage}</span>
            <button disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Next <FiChevronRight /></button>
          </div>
        )}
      </section>
    </main>
  );
}


function BookCard({ book, onRequestDelivery, isPaying }) {
  const router = useRouter();
  const image = book.image || book.coverImage || book.imageUrl || "/placeholder-book.jpg";
  const ownerPhoto = book.ownerPhoto || book.librarianPhoto || book.authorImage || "/placeholder-user.jpg";
  const availabilityStatus = book.availabilityStatus || "Available";
  const unavailable = ["Unavailable", "Checked Out", "Not Available", "Pending Delivery"].includes(availabilityStatus);

  return (
    <article className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-blue-950/20 transition hover:-translate-y-2 hover:border-blue-400/40">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-slate-900">
        <Image
          src={image}
          alt={book.title || "Book cover"}
          fill
          unoptimized
          sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.src = "/placeholder-book.jpg";
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-black uppercase text-white">{book.category || "Book"}</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">{formatMoney(book.deliveryFee)}</span>
      </div>

      <div className="pt-4">
        <h3 className="line-clamp-1 text-base font-black text-white">{book.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-400">by {book.author}</p>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-slate-800">
            <Image
              src={ownerPhoto}
              alt={book.ownerName || "Book owner"}
              fill
              unoptimized
              sizes="36px"
              className="object-cover"
              onError={(event) => {
                event.currentTarget.src = "/placeholder-user.jpg";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-1 text-xs font-bold text-white">{book.ownerName || "Unknown Provider"}</p>
            <p className="line-clamp-1 text-[11px] text-slate-500">Provider</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${unavailable ? "bg-red-500/10 text-red-300 ring-1 ring-red-400/20" : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"}`}>
            {availabilityStatus}
          </span>
          <span className="text-xs font-bold text-yellow-300">★ {book.rating || 0}</span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button onClick={() => router.push(`/books/${book._id}`)} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-bold text-blue-200 hover:bg-blue-600 hover:text-white">
            Details <FiArrowRight />
          </button>
          <button
            onClick={() => onRequestDelivery(book)}
            disabled={unavailable || isPaying}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-bold ${unavailable || isPaying ? "cursor-not-allowed bg-slate-700 text-slate-400" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-xl hover:shadow-blue-700/25"}`}
          >
            {isPaying ? <FiRefreshCw className="animate-spin" /> : <FiCreditCard />}
            {isPaying ? "Opening..." : "Request"}
          </button>
        </div>
      </div>
    </article>
  );
}


function BrowseSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3">
          <div className="aspect-[2/3] animate-pulse rounded-[1.25rem] bg-slate-800" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
            <div className="h-10 animate-pulse rounded-full bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}


function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center">
      <FiBookOpen className="mx-auto mb-4 text-5xl text-blue-300" />
      <h2 className="text-2xl font-black text-white">No Books Found</h2>
      <p className="mt-2 text-sm text-slate-400">Try changing your search or filters.</p>
    </div>
  );
}
