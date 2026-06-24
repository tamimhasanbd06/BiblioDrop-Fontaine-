"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiEdit, FiGlobe, FiHash, FiLayers, FiMessageCircle, FiStar, FiTrash2, FiTruck, FiUser, FiXCircle } from "react-icons/fi";
import { publicApi, serverApi, formatDate, formatMoney } from "@/lib/api";

// বাংলা মন্তব্য: Book Details page সম্পূর্ণ dynamic server data ব্যবহার করে।
export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // বাংলা মন্তব্য: owner/admin permission calculate করা হচ্ছে।
  const isLoggedIn = Boolean(currentUser?.email);
  const isOwner = Boolean(currentUser?.email && (currentUser.email === book?.ownerEmail || currentUser.email === book?.librarianEmail));
  const isAdmin = currentUser?.role === "admin";
  const availabilityStatus = book?.availabilityStatus || "Available";
  const isUnavailable = ["Checked Out", "Unavailable", "Not Available"].includes(availabilityStatus);
  const isApproved = ["Approved", "Published"].includes(book?.approvalStatus);
  const requestButtonDisabled = actionLoading || isUnavailable || isOwner || !isApproved;

  useEffect(() => {
    if (!id) return;
    // বাংলা মন্তব্য: Book details এবং logged-in user একসাথে load করা হচ্ছে।
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const bookData = await publicApi(`/books/${id}`);
        setBook(bookData.book || null);
        try {
          const me = await serverApi("/me");
          setCurrentUser(me.user || null);
        } catch {
          setCurrentUser(null);
        }
      } catch (err) {
        setError(err.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // বাংলা মন্তব্য: Book reviews server থেকে load করা হচ্ছে।
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await publicApi(`/books/${id}/reviews`);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // বাংলা মন্তব্য: Request delivery button Stripe checkout session তৈরি করে।
  const handleRequestDelivery = async () => {
    try {
      if (!isLoggedIn) return router.push("/signin");
      if (requestButtonDisabled) return;
      setActionLoading(true);
      const data = await serverApi("/create-checkout-session", { method: "POST", body: JSON.stringify({ bookId: book._id }) });
      if (data.url) window.location.href = data.url;
      else throw new Error("Stripe checkout URL missing.");
    } catch (err) {
      alert(err.message || "Failed to request delivery.");
    } finally {
      setActionLoading(false);
    }
  };

  // বাংলা মন্তব্য: Librarian/Admin book publish status toggle করতে পারে।
  const handleTogglePublish = async () => {
    try {
      if (!isOwner && !isAdmin) return;
      if (!confirm("Are you sure you want to change publish status?")) return;
      setActionLoading(true);
      const endpoint = isAdmin ? `/dashboard/admin/books/${book._id}/unpublish` : `/dashboard/librarian/books/${book._id}/toggle-publish`;
      const data = await serverApi(endpoint, { method: "PATCH" });
      setBook((prev) => ({ ...prev, approvalStatus: data.approvalStatus || "Unpublished" }));
      alert("Book status updated.");
    } catch (err) {
      alert(err.message || "Failed to update book.");
    } finally {
      setActionLoading(false);
    }
  };

  // বাংলা মন্তব্য: Librarian/Admin book delete করতে পারে।
  const handleDeleteBook = async () => {
    try {
      if (!isOwner && !isAdmin) return;
      if (!confirm("Are you sure you want to delete this book?")) return;
      setActionLoading(true);
      const endpoint = isAdmin ? `/dashboard/admin/books/${book._id}` : `/dashboard/librarian/books/${book._id}`;
      await serverApi(endpoint, { method: "DELETE" });
      alert("Book deleted successfully.");
      router.push("/books");
    } catch (err) {
      alert(err.message || "Failed to delete book.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (error || !book) return <DetailsError error={error} />;

  const bookImage = book.image || "/placeholder-book.jpg";
  const ownerPhoto = book.ownerPhoto || book.librarianPhoto || book.photo || "/placeholder-user.jpg";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none fixed -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[130px]" />
      <section className="relative z-10 mx-auto max-w-[1440px]">
        <button onClick={() => router.back()} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 hover:border-blue-400/40 hover:text-blue-300"><FiArrowLeft /> Back</button>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[1.6rem] bg-slate-900 shadow-2xl">
              <Image src={bookImage} alt={book.title || "Book cover"} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" priority />
              <div className="pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2"><span className="rounded-full bg-blue-600/90 px-4 py-1.5 text-xs font-black uppercase text-white">{book.category || "Book"}</span><span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase text-white ${isUnavailable ? "bg-red-500" : "bg-emerald-500"}`}>{isUnavailable ? "Unavailable" : "Available"}</span></div>
              <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-xl">{formatMoney(book.deliveryFee)}</div>
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Listed By</p>
              <div className="flex items-center gap-4"><div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-800"><Image src={ownerPhoto} alt={book.ownerName || "Owner"} fill sizes="56px" className="object-cover" /></div><div className="min-w-0"><h3 className="line-clamp-1 text-base font-black text-white">{book.ownerName || book.librarianName || "Unknown Librarian"}</h3><p className="line-clamp-1 text-sm text-slate-400">{book.ownerEmail || book.librarianEmail || "Email not available"}</p></div></div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300"><FiBookOpen /> {book.bookId || "Book Details"}</span><span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${isApproved ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20" : "bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-400/20"}`}><FiCheckCircle /> {book.approvalStatus || "Pending Approval"}</span></div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">{book.title || "Untitled Book"}</h1>
            <p className="mt-3 text-lg font-semibold text-blue-300">by {book.author || "Unknown Author"}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4"><Badge icon={<FiStar />} text={`${book.rating || 0} Rating`} color="yellow" /><Badge icon={<FiMessageCircle />} text={`${book.totalReviews || reviews.length || 0} Reviews`} color="blue" /><Badge icon={<FiTruck />} text={`${book.totalDeliveries || 0} Deliveries`} color="emerald" /></div>
            <div className="mt-8"><h2 className="mb-3 text-xl font-black text-white">Description</h2><p className="text-sm leading-8 text-slate-300 sm:text-base">{book.description || "No description available for this book."}</p></div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"><InfoCard icon={<FiLayers />} label="Category" value={book.category || "Not available"} /><InfoCard icon={<FiBookOpen />} label="Publisher" value={book.publisher || "Not available"} /><InfoCard icon={<FiGlobe />} label="Language" value={book.language || "Not available"} /><InfoCard icon={<FiHash />} label="ISBN" value={book.isbn || "Not available"} /><InfoCard icon={<FiBookOpen />} label="Pages" value={book.pages ? `${book.pages} pages` : "Not available"} /><InfoCard icon={<FiDollarSign />} label="Delivery Fee" value={formatMoney(book.deliveryFee)} /><InfoCard icon={<FiCheckCircle />} label="Availability" value={availabilityStatus} /><InfoCard icon={<FiCalendar />} label="Date Added" value={formatDate(book.createdAt)} /><InfoCard icon={<FiClock />} label="Last Updated" value={formatDate(book.updatedAt)} /></div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row"><button onClick={handleRequestDelivery} disabled={requestButtonDisabled} className={`inline-flex flex-1 items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-black transition-all ${requestButtonDisabled ? "cursor-not-allowed bg-slate-700 text-slate-400" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-700/25 hover:-translate-y-1"}`}><FiTruck /> {actionLoading ? "Processing..." : !isApproved ? "Not Published Yet" : isUnavailable ? "Currently Unavailable" : isOwner ? "You Own This Book" : "Request Delivery"}</button><Link href="/books" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-black text-slate-300 hover:border-blue-400/40 hover:text-blue-300">Browse More <FiArrowLeft /></Link></div>
            {!isLoggedIn && !isUnavailable && <p className="mt-4 text-sm text-slate-400">You need to login before requesting delivery or leaving a review.</p>}
            {(isOwner || isAdmin) && <div className="mt-8 rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-5"><h3 className="mb-4 text-lg font-black text-white">Librarian Controls</h3><div className="flex flex-col gap-3 sm:flex-row"><Link href={`/dashboard/librarian/inventory?edit=${book._id}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"><FiEdit /> Edit</Link><button onClick={handleTogglePublish} disabled={actionLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-60"><FiXCircle /> Unpublish</button><button onClick={handleDeleteBook} disabled={actionLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"><FiTrash2 /> Delete</button></div></div>}
          </div>
        </div>
        <ReviewsSection reviews={reviews} reviewsLoading={reviewsLoading} isLoggedIn={isLoggedIn} bookId={book._id} />
      </section>
    </main>
  );
}

// বাংলা মন্তব্য: ছোট statistic badge।
function Badge({ icon, text, color }) { const cls = color === "yellow" ? "bg-yellow-500/10 text-yellow-300 ring-yellow-400/20" : color === "emerald" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" : "bg-blue-500/10 text-blue-300 ring-blue-400/20"; return <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${cls}`}>{icon}{text}</div>; }

// বাংলা মন্তব্য: Details information card।
function InfoCard({ icon, label, value }) { return <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">{icon}</div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-2 break-words text-sm font-bold text-white">{value}</p></div>; }

// বাংলা মন্তব্য: Reviews section যেখানে verified review list দেখানো হচ্ছে।
function ReviewsSection({ reviews, reviewsLoading, isLoggedIn, bookId }) { return <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl sm:p-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-white">Reader Reviews</h2><p className="mt-2 text-sm text-slate-400">Only readers with delivered status can leave verified reviews.</p></div><Link href={isLoggedIn ? `/books/${bookId}/review` : "/signin"} className={`rounded-full px-6 py-3 text-center text-sm font-bold transition ${isLoggedIn ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>Write a Review</Link></div>{reviewsLoading ? <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-[1.5rem] border border-white/10 bg-slate-900/70" />)}</div> : reviews.length === 0 ? <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-8 text-center"><FiMessageCircle className="mx-auto mb-4 text-4xl text-blue-300" /><h3 className="text-xl font-black text-white">No Reviews Yet</h3><p className="mt-2 text-sm text-slate-400">This book has no verified reader reviews yet.</p></div> : <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <div key={review._id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5"><div className="mb-3 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300"><FiUser /></div><div><h3 className="font-black text-white">{review.userName || "Reader"}</h3><p className="text-xs text-emerald-300">Verified reader</p></div></div><div className="flex items-center gap-1 text-yellow-300"><FiStar /><span className="text-sm font-bold">{review.rating || 0}</span></div></div><p className="text-sm leading-7 text-slate-400">{review.comment || "No comment provided."}</p><p className="mt-3 text-xs text-slate-500">{formatDate(review.createdAt)}</p></div>)}</div>}</section>; }

// বাংলা মন্তব্য: Details page loading skeleton।
function DetailsSkeleton() { return <main className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-10"><section className="mx-auto max-w-[1440px]"><div className="mb-8 h-11 w-36 animate-pulse rounded-full bg-slate-800" /><div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4"><div className="aspect-[2/3] animate-pulse rounded-[1.5rem] bg-slate-800" /></div><div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8"><div className="mb-5 h-8 w-40 animate-pulse rounded-full bg-slate-800" /><div className="mb-4 h-14 w-4/5 animate-pulse rounded-full bg-slate-800" /><div className="space-y-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-5 animate-pulse rounded-full bg-slate-800" />)}</div></div></div></section></main>; }

// বাংলা মন্তব্য: Details page error state।
function DetailsError({ error }) { return <main className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-10"><section className="mx-auto max-w-2xl rounded-[2rem] border border-red-400/20 bg-red-500/10 p-10 text-center"><FiXCircle className="mx-auto mb-5 text-5xl text-red-300" /><h1 className="text-2xl font-black text-white">Book Details Not Found</h1><p className="mt-3 text-sm leading-7 text-red-200/80">{error || "The requested book could not be found."}</p><Link href="/books" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white"><FiArrowLeft /> Back to Browse Books</Link></section></main>; }
