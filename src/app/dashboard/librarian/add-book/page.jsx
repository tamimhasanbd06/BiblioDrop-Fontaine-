"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ImagePlus, Save } from "lucide-react";
import { serverApi } from "@/lib/api";

const categories = ["Fiction", "Academic", "Sci-Fi", "Romance", "Classics", "Children", "History", "Others"];

// বাংলা মন্তব্য: Librarian নতুন বই add করতে পারে; backend status Pending Approval set করে।
export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", author: "", category: "Fiction", publisher: "", language: "English", isbn: "", pages: "", image: "", description: "", deliveryFee: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // বাংলা মন্তব্য: Form input state update করা হচ্ছে।
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // বাংলা মন্তব্য: ImgBB image upload করে URL form.image-এ রাখা হচ্ছে।
  const handleImageUpload = async (file) => {
    try {
      if (!file) return;
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY. You can paste image URL manually.");
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("Image upload failed.");
      update("image", data.data.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // বাংলা মন্তব্য: Add book protected API call করা হচ্ছে।
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      await serverApi("/books", { method: "POST", body: JSON.stringify(form) });
      alert("Book added. Waiting for admin approval.");
      router.push("/dashboard/librarian/inventory");
    } catch (err) {
      setMessage(err.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return <section className="space-y-8"><div className="border-b border-slate-800 pb-2"><h1 className="text-4xl font-extrabold text-white">Add Book</h1><p className="mt-2 text-slate-400">New books are saved as Pending Approval and need admin approval.</p></div>{message && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-300">{message}</div>}<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-6 shadow-xl"><div className="grid gap-5 md:grid-cols-2"><Input label="Title" value={form.title} onChange={(v) => update("title", v)} required /><Input label="Author" value={form.author} onChange={(v) => update("author", v)} required /><label><span className="mb-2 block text-sm font-bold text-slate-300">Category</span><select value={form.category} onChange={(e) => update("category", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-[#041032] px-4 text-white outline-none">{categories.map((c) => <option key={c}>{c}</option>)}</select></label><Input label="Delivery Fee" type="number" value={form.deliveryFee} onChange={(v) => update("deliveryFee", v)} required /><Input label="Publisher" value={form.publisher} onChange={(v) => update("publisher", v)} /><Input label="Language" value={form.language} onChange={(v) => update("language", v)} /><Input label="ISBN" value={form.isbn} onChange={(v) => update("isbn", v)} /><Input label="Pages" type="number" value={form.pages} onChange={(v) => update("pages", v)} /></div><div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto]"><Input label="Book Cover URL" value={form.image} onChange={(v) => update("image", v)} required /><label className="flex cursor-pointer items-end"><span className="inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white"><ImagePlus size={18} /> {uploading ? "Uploading..." : "Upload"}<input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e.target.files?.[0])} /></span></label></div><label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-slate-300">Description</span><textarea required value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} className="w-full rounded-2xl border border-slate-700 bg-[#041032] p-4 text-white outline-none" /></label><button disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-7 py-4 text-sm font-black text-white disabled:opacity-60"><Save size={18} /> {loading ? "Saving..." : "Save Book"}</button></form></section>;
}
function Input({ label, value, onChange, type = "text", required }) { return <label><span className="mb-2 block text-sm font-bold text-slate-300">{label}</span><input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-[#041032] px-4 text-white outline-none focus:border-blue-500" /></label>; }
