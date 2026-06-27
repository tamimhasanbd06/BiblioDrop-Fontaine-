"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiMessageCircle, FiStar } from "react-icons/fi";
import { serverApi } from "@/lib/api";

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      await serverApi("/reviews", { method: "POST", body: JSON.stringify({ bookId: id, rating, comment }) });
      alert("Review submitted successfully.");
      router.push(`/books/${id}`);
    } catch (err) {
      setMessage(err.message || "Only delivered users can review this book.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-slate-950 px-4 py-24 text-white"><section className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-950/30 sm:p-8"><Link href={`/books/${id}`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-300"><FiArrowLeft /> Back to Book</Link><div className="mb-6 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300"><FiMessageCircle /></div><h1 className="text-3xl font-black">Write Verified Review</h1><p className="mt-2 text-sm text-slate-400">Only delivered readers can submit a rating and comment.</p></div>{message && <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">{message}</div>}<form onSubmit={handleSubmit} className="space-y-5"><label className="block"><span className="mb-2 block text-sm font-bold text-slate-300">Rating</span><select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 text-white outline-none focus:border-blue-400">{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Star</option>)}</select></label><label className="block"><span className="mb-2 block text-sm font-bold text-slate-300">Comment</span><textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={6} placeholder="Share your reading experience..." className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-white outline-none focus:border-blue-400" /></label><button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-sm font-black text-white disabled:opacity-60"><FiStar /> {loading ? "Submitting..." : "Submit Review"}</button></form></section></main>;
}
