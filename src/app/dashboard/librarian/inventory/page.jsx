"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, PlusCircle, Trash2, Globe, EyeOff } from "lucide-react";
import DashboardPagination from "@/Components/DashboardPagination";
import { serverApi } from "@/lib/api";
import { toast } from "react-toastify";

export default function InventoryPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, perPage: 12, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ১. ড্যাশবোর্ড ইনভেন্টরি ডাটা ফেচ করা
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const d = await serverApi(`/dashboard/librarian/books?page=${page}&limit=12`);
      setBooks(d.books || []);
      setPagination(d.pagination || { totalItems: 0, currentPage: page, perPage: 12, totalPages: 1 });
    } catch (e) {
      setError(e.message);
      toast.error(e.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  // ২. পাবলিশ/আনপাবলিশ টগল লজিক (Strict Condition)
  const handleTogglePublish = async (book) => {
    // 🚨 রিকোয়ারমেন্ট: "Pending Approval" বা "Pending" বই লাইব্রেরিয়ান নিজে পাবলিশ করতে পারবেন না
    if (book.approvalStatus === "Pending" || book.approvalStatus === "Pending Approval") {
      toast.error("You cannot publish or toggle a pending book. Waiting for Admin approval!");
      return;
    }

    const toastId = toast.loading("Updating publishing status...");
    try {
      // ব্যাকএন্ডের ডাইনামিক এন্ডপয়েন্টে PATCH রিকোয়েস্ট
      await serverApi(`/dashboard/librarian/books/${book._id}/toggle-publish`, { 
        method: "PATCH" 
      });
      
      toast.update(toastId, { 
        render: "Publishing status updated successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      await load();
    } catch (e) {
      toast.update(toastId, { 
        render: e.message || "Action failed.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  // ৩. ডিলিট হ্যান্ডলার (React Toastify এলার্টসহ)
  const handleRemove = async (id) => {
    if (!confirm("Are you absolutely sure you want to permanently delete this book listing?")) return;
    
    const toastId = toast.loading("Removing book from repository...");
    try {
      await serverApi(`/books/${id}`, { 
        method: "DELETE" 
      });
      
      toast.update(toastId, { 
        render: "Book permanently removed from server.", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      await load();
    } catch (e) {
      toast.update(toastId, { 
        render: e.message || "Failed to delete item.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-white sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Manage Inventory
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
            Monitor and control your personal listings. Initial entries are set to <span className="text-amber-400 font-bold">Pending</span>.
          </p>
        </div>
        <Link 
          href="/dashboard/librarian/add-book" 
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-900/40 hover:opacity-90 active:scale-95 transition-all duration-200"
        >
          <PlusCircle size={18} /> Add Book
        </Link>
      </div>

      {/* Database Error Handling Banner */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading Skeleton Loader */}
      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-[#0a1941]/40" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0a1941]/80 to-[#041032]/90 backdrop-blur-md shadow-xl">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#041032] border-b border-slate-800/80">
              <tr>
                {["Book Details", "Category", "Approval Status", "Availability", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-slate-800/20 transition-colors">
                  {/* Book Metadata */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    {book.image && (
                      <img 
                        src={book.image} 
                        alt={book.title} 
                        className="h-10 w-8 rounded object-cover border border-slate-700/60"
                      />
                    )}
                    <div>
                      <p className="font-bold text-white text-sm line-clamp-1">{book.title}</p>
                      <p className="text-xs text-slate-400 font-medium">By {book.author}</p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-slate-300 font-semibold">{book.category}</td>

                  {/* Approval Badges */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                      book.approvalStatus === "Approved" || book.approvalStatus === "Published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : book.approvalStatus === "Unpublished"
                        ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {book.approvalStatus || "Pending"}
                    </span>
                  </td>

                  {/* Availability Badge */}
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-medium text-xs">
                      {book.availabilityStatus || "Available"}
                    </span>
                  </td>

                  {/* Controls Actions Row */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Edit Button Navigation */}
                      <button 
                        onClick={() => router.push(`/dashboard/librarian/edit/${book._id}`)} 
                        title="Edit Book Details"
                        className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-md active:scale-90"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Publish / Unpublish Toggle Action */}
                      <button 
                        onClick={() => handleTogglePublish(book)} 
                        title={book.approvalStatus === "Unpublished" ? "Publish Book" : "Unpublish Book"}
                        className={`p-2 rounded-xl border transition-all shadow-md active:scale-90 ${
                          book.approvalStatus === "Unpublished"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950"
                        }`}
                      >
                        {book.approvalStatus === "Unpublished" ? <Globe size={14} /> : <EyeOff size={14} />}
                      </button>

                      {/* Delete Trigger Action */}
                      <button 
                        onClick={() => handleRemove(book._id)} 
                        title="Delete Permanently"
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-90"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State Fallback */}
          {books.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm font-medium text-slate-400">No books found inside your repository archive.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <DashboardPagination 
        pagination={pagination} 
        page={page} 
        setPage={setPage} 
        loading={loading} 
      />
    </section>
  );
}