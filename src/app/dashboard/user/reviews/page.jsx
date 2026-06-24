"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { serverApi, formatDate } from "@/lib/api";

// বাংলা মন্তব্য: User নিজের reviews edit/delete করতে পারে।
export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => serverApi("/dashboard/user/reviews").then((d) => setReviews(d.reviews || [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const edit = async (review) => { const rating = Number(prompt("Rating 1-5", review.rating)); const comment = prompt("Comment", review.comment); if (!rating || !comment) return; try { await serverApi(`/reviews/${review._id}`, { method: "PATCH", body: JSON.stringify({ rating, comment }) }); load(); } catch (e) { alert(e.message); } };
  const remove = async (id) => { if (!confirm("Delete this review?")) return; try { await serverApi(`/reviews/${id}`, { method: "DELETE" }); load(); } catch (e) { alert(e.message); } };
  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">My Reviews</h1><p className="mt-2 text-slate-400">Edit or delete your verified reviews.</p></div>{error && <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}{loading ? <div className="h-64 animate-pulse rounded-2xl bg-[#0a1941]/60" /> : reviews.length === 0 ? <p className="rounded-2xl bg-[#0a1941]/60 p-8 text-center text-slate-400">No reviews found.</p> : <div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-white">{review.bookTitle}</h3><span className="text-yellow-300">★ {review.rating}</span></div><p className="text-sm leading-7 text-slate-400">{review.comment}</p><p className="mt-3 text-xs text-slate-500">{formatDate(review.createdAt)}</p><div className="mt-4 flex gap-2"><button onClick={() => edit(review)} className="rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white"><Edit size={14} /></button><button onClick={() => remove(review._id)} className="rounded-full bg-red-600 px-3 py-2 text-xs font-bold text-white"><Trash2 size={14} /></button></div></article>)}</div>}</section>;
}
