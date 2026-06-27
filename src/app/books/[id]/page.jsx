"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiArrowLeft, FiBookOpen, FiCalendar, FiCheckCircle, 
  FiClock, FiDollarSign, FiEdit, FiGlobe, FiHash, 
  FiLayers, FiMessageCircle, FiStar, FiTrash2, FiTruck, 
  FiXCircle 
} from "react-icons/fi";
import { publicApi, serverApi, formatDate, formatMoney } from "@/lib/api";

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

  // Modals visibility states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Single input fields state for Edit Modal
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    description: "",
    deliveryFee: "",
    category: "",
    publisher: "",
    language: "",
    isbn: "",
    pages: ""
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const bookData = await publicApi(`/books/${id}`);
        const currentBook = bookData.book || null;
        setBook(currentBook);
        
        if (currentBook) {
          setEditForm({
            title: currentBook.title || "",
            author: currentBook.author || "",
            description: currentBook.description || "",
            deliveryFee: currentBook.deliveryFee !== undefined ? String(currentBook.deliveryFee) : "",
            category: currentBook.category || "",
            publisher: currentBook.publisher || "",
            language: currentBook.language || "",
            isbn: currentBook.isbn || "",
            pages: currentBook.pages !== undefined ? String(currentBook.pages) : ""
          });
        }
        
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

  // Auth & Roles evaluations
  const isLoggedIn = Boolean(currentUser?.email);
  const isLibrarian = currentUser?.role === "librarian";
  const isAdmin = currentUser?.role === "admin";

  // CRITICAL UPDATE: Only show librarian controls if user is logged in AND holds a management role
  const showLibrarianControls = isLoggedIn && (isLibrarian || isAdmin);

  const availabilityStatus = book?.availabilityStatus || "Available";
  const isUnavailable = ["Checked Out", "Unavailable", "Not Available", "Pending Delivery", "Unpublished"].includes(availabilityStatus);
  const isApproved = ["Approved", "Published"].includes(book?.approvalStatus);

  // Button disability rules based on role
  // If user is not logged in, buttons remain enabled so they can click to redirect
  const requestButtonDisabled = isLoggedIn && !isAdmin && (isLibrarian || actionLoading || isUnavailable || !isApproved);
  const wishlistButtonDisabled = isLoggedIn && !isAdmin && isLibrarian;

  // Request Book Button Action Handler
  const handleRequestDelivery = async () => {
    // If user is not logged in -> Redirect to sign in page
    if (!isLoggedIn) {
      return router.push(`/signin?redirect=/books/${id}`);
    }

    if (isLibrarian && !isAdmin) return; 

    try {
      if (currentUser?.email === book?.ownerEmail || currentUser?.email === book?.librarianEmail) {
        toast.error("আপনি নিজের আপলোড করা বই রিকোয়েস্ট করতে পারবেন না।");
        return;
      }

      if (requestButtonDisabled) return;
      
      const currentFee = Number(book?.deliveryFee || 0);
      if (currentFee < 65) {
        toast.info("Stripe পেমেন্ট পলিসির কারণে সর্বনিম্ন চার্জ ৳৬৫.০০ প্রযোজ্য হচ্ছে।", {
          position: "top-center",
          autoClose: 4000
        });
      }

      setActionLoading(true);

      const data = await serverApi("/create-checkout-session", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id }) 
      });

      if (data.success && data.url) {
        window.location.href = data.url;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Stripe checkout URL missing.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to process payment request.");
    } finally {
      setActionLoading(false);
    }
  };


  const handleWishlistClick = () => {

    if (!isLoggedIn) {
      return router.push(`/signin?redirect=/books/${id}`);
    }

    if (isLibrarian && !isAdmin) return; 

    toast.success("Added to wishlist!");
  };

  const handleTogglePublish = async () => {
    try {
      setActionLoading(true);
      const nextStatus = availabilityStatus === "Unpublished" ? "Available" : "Unpublished";
      
      const response = await serverApi(`/books/${id}/status`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityStatus: nextStatus })
      });
      
      if (response.success || response.modifiedCount > 0) {
        setBook((prev) => ({ ...prev, availabilityStatus: nextStatus }));
        toast.success(`Book status successfully changed to ${nextStatus}.`);
      } else {
        throw new Error(response.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update book.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      const response = await serverApi(`/books/${id}`, { method: "DELETE" });
      
      if (response.success || response.deletedCount > 0) {
        toast.success("Book permanently deleted from the system.");
        setIsDeleteModalOpen(false);
        setTimeout(() => {
          router.push("/books");
        }, 1500);
      } else {
        throw new Error(response.message || "Deletion failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete book.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        ...editForm,
        deliveryFee: parseFloat(editForm.deliveryFee) || 0,
        pages: parseInt(editForm.pages) || 0
      };

      const response = await serverApi(`/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.success || response.modifiedCount > 0) {
        setBook((prev) => ({ ...prev, ...payload }));
        toast.success("Book specifications updated inside database.");
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.message || "Update failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update book record.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (error || !book) return <DetailsError error={error} />;

  const bookImage = book.image || "/placeholder-book.jpg";
  const ownerPhoto = book.ownerPhoto || book.librarianPhoto || book.photo || "/placeholder-user.jpg";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-10 relative">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      
      <div className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none fixed -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[130px]" />
      
      <section className="relative z-10 mx-auto max-w-[1440px]">
        <button onClick={() => router.back()} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 hover:border-blue-400/40 hover:text-blue-300"><FiArrowLeft /> Back</button>
        
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[1.6rem] bg-slate-900 shadow-2xl">
              <Image src={bookImage} alt={book.title || "Book cover"} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" priority unoptimized />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-600/90 px-4 py-1.5 text-xs font-black uppercase text-white">{book.category || "Book"}</span>
                <span className={`rounded-full px-4 py-1.5 text-xs font-black uppercase text-white ${availabilityStatus === "Checked Out" || availabilityStatus === "Unpublished" ? "bg-red-500" : "bg-emerald-500"}`}>{availabilityStatus}</span>
              </div>
              <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-xl">
                {book.deliveryFee < 65 ? `${formatMoney(book.deliveryFee)} (Min ৳৬৫ Charge Applies)` : formatMoney(book.deliveryFee)}
              </div>
            </div>
            
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Listed By</p>
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-800"><Image src={ownerPhoto} alt="Owner" fill className="object-cover" unoptimized /></div>
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-base font-black text-white">{book.ownerName || book.librarianName || "Unknown Librarian"}</h3>
                  <p className="line-clamp-1 text-sm text-slate-400">{book.ownerEmail || book.librarianEmail || "Email not available"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300"><FiBookOpen /> {book.bookId || "Book Details"}</span>
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] ${isApproved ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20" : "bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-400/20"}`}><FiCheckCircle /> {book.approvalStatus || "Pending Approval"}</span>
            </div>
            
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">{book.title || "Untitled Book"}</h1>
            <p className="mt-3 text-lg font-semibold text-blue-300">by {book.author || "Unknown Author"}</p>
            
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Badge icon={<FiStar />} text={`${book.rating || 0} Rating`} color="yellow" />
              <Badge icon={<FiMessageCircle />} text={`${reviews.length} Reviews`} color="blue" />
              <Badge icon={<FiTruck />} text={`${book.totalDeliveries || 0} Deliveries`} color="emerald" />
            </div>
            
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-black text-white">Description</h2>
              <p className="text-sm leading-8 text-slate-300 sm:text-base">{book.description || "No description available for this book."}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <InfoCard icon={<FiLayers />} label="Category" value={book.category || "Not available"} />
              <InfoCard icon={<FiBookOpen />} label="Publisher" value={book.publisher || "Not available"} />
              <InfoCard icon={<FiGlobe />} label="Language" value={book.language || "Not available"} />
              <InfoCard icon={<FiHash />} label="ISBN" value={book.isbn || "Not available"} />
              <InfoCard icon={<FiBookOpen />} label="Pages" value={book.pages ? `${book.pages} pages` : "Not available"} />
              <InfoCard icon={<FiDollarSign />} label="Delivery Fee" value={book.deliveryFee < 65 ? `${formatMoney(book.deliveryFee)} (৳৬৫ Adjusted)` : formatMoney(book.deliveryFee)} />
              <InfoCard icon={<FiCheckCircle />} label="Availability" value={availabilityStatus} />
              <InfoCard icon={<FiCalendar />} label="Date Added" value={formatDate(book.createdAt)} />
              <InfoCard icon={<FiClock />} label="Last Updated" value={formatDate(book.updatedAt)} />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button 
                onClick={handleRequestDelivery} 
                disabled={requestButtonDisabled} 
                className={`inline-flex flex-1 items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-black transition-all ${requestButtonDisabled ? "cursor-not-allowed bg-slate-700 text-slate-400 opacity-60" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl hover:-translate-y-1"}`}
              >
                <FiTruck /> {actionLoading ? "Redirecting to Stripe..." : !isApproved ? "Not Published Yet" : isUnavailable ? "Currently Unavailable" : "Request Delivery"}
              </button>
              
              <button
                onClick={handleWishlistClick}
                disabled={wishlistButtonDisabled}
                className={`inline-flex items-center justify-center gap-3 rounded-full border px-7 py-4 text-sm font-black transition-all ${wishlistButtonDisabled ? "cursor-not-allowed border-white/5 text-slate-600 bg-slate-900/50 opacity-60" : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-red-400"}`}
              >
                <FiStar /> Wishlist
              </button>
            </div>
            
            {showLibrarianControls && (
              <div className="mt-8 rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-5">
                <h3 className="mb-4 text-lg font-black text-white">Librarian Controls</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"><FiEdit /> Edit</button>
                  <button onClick={handleTogglePublish} disabled={actionLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400">
                    <FiXCircle /> {availabilityStatus === "Unpublished" ? "Publish" : "Unpublish"}
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-500"><FiTrash2 /> Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <ReviewsSection reviews={reviews} reviewsLoading={reviewsLoading} isLoggedIn={isLoggedIn} bookId={id} />
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl">
            <FiTrash2 className="mx-auto mb-4 text-5xl text-red-500" />
            <h3 className="text-xl font-black text-white">Confirm Data Deletion</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this record permanently from the database system?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-700" disabled={actionLoading}>Cancel</button>
              <button type="button" onClick={handleConfirmDelete} disabled={actionLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-50">{actionLoading ? "Deleting..." : "Delete Permanently"}</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-black text-white">Edit System Book Records</h3>
              </div>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white"><FiXCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Book Title</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Author Name</label>
                  <input type="text" value={editForm.author} onChange={(e) => setEditForm({...editForm, author: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Description</label>
                <textarea rows={4} value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" required></textarea>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Delivery Fee (৳)</label>
                  <input type="number" min="0" step="0.01" value={editForm.deliveryFee} onChange={(e) => setEditForm({...editForm, deliveryFee: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
                  <input type="text" value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Publisher</label>
                  <input type="text" value={editForm.publisher} onChange={(e) => setEditForm({...editForm, publisher: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Language</label>
                  <input type="text" value={editForm.language} onChange={(e) => setEditForm({...editForm, language: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">ISBN Number</label>
                  <input type="text" value={editForm.isbn} onChange={(e) => setEditForm({...editForm, isbn: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Pages</label>
                  <input type="number" min="0" value={editForm.pages} onChange={(e) => setEditForm({...editForm, pages: e.target.value})} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={actionLoading} className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


function Badge({ icon, text, color }) { 
  const cls = color === "yellow" ? "bg-yellow-500/10 text-yellow-300 ring-yellow-400/20" : color === "emerald" ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" : "bg-blue-500/10 text-blue-300 ring-blue-400/20"; 
  return <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${cls}`}>{icon}{text}</div>; 
}
function InfoCard({ icon, label, value }) { 
  return <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">{icon}</div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-2 break-words text-sm font-bold text-white">{value}</p></div>; 
}
function ReviewsSection({ reviews, reviewsLoading, isLoggedIn, bookId }) { 
  return <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-white">Reader Reviews</h2></div><Link href={isLoggedIn ? `/books/${bookId}/review` : "/signin"} className="rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-bold tracking-wide text-white hover:bg-blue-500">Write a Review</Link></div>{reviewsLoading ? <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-[1.5rem] bg-slate-800" />)}</div> : reviews.length === 0 ? <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-8 text-center"><p className="text-sm text-slate-400">This book has no verified reader reviews yet.</p></div> : <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <div key={review._id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-black text-white">{review.userName || "Reader"}</h3><div className="flex items-center gap-1 text-yellow-300"><FiStar /><span>{review.rating || 0}</span></div></div><p className="text-sm text-slate-400">{review.comment}</p></div>)}</div>}</section>; 
}
function DetailsSkeleton() { return <div className="min-h-screen bg-slate-950 p-24 text-center text-white">Loading App Component View...</div>; }
function DetailsError({ error }) { return <div className="min-h-screen bg-slate-950 p-24 text-center text-white">{error || "Data load failed."}</div>; }