"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ImagePlus, Save, Sparkles, User } from "lucide-react";
import { serverApi } from "@/lib/api";
import { toast } from "react-toastify";

const categories = ["Fiction", "Academic", "Sci-Fi", "Romance", "Classics", "Children", "History", "Others"];
const LOCAL_STORAGE_KEY = "librarian_add_book_full_draft";

export default function AddBookPage() {
  const router = useRouter();
  
  // সম্পূর্ণ ডাটা স্ট্রাকচারের সাথে সামঞ্জস্যপূর্ণ স্টেট ডিক্লেয়ারেশন
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Sci-Fi",
    publisher: "",
    language: "English",
    isbn: "",
    pages: "",
    image: "",        // Book Cover Image URL
    description: "",
    deliveryFee: "",
    ownerName: "",
    ownerPhoto: ""    // Owner Profile Photo URL
  });
  
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingOwner, setUploadingOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  // ১. পেজ লোড হওয়ার সময় লোকাল স্টোরেজ থেকে ড্রাফট ডাটা রিড করা
  useEffect(() => {
    const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
        toast.info("Loaded unsaved book draft from local storage.");
      } catch (err) {
        console.error("Failed to parse local storage draft", err);
      }
    }
  }, []);

  // ২. স্টেট চেঞ্জ হওয়ার সাথে সাথে লোকাল স্টোরেজে সেভ করা
  const update = (key, value) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [key]: value };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedForm));
      return updatedForm;
    });
  };

  // ৩. ডাইনামিক ইমেজ আপলোড ফাংশন (কাভার এবং ওনার ফটো উভয়ের জন্য)
  const handleImageUpload = async (file, targetField, setUploadingState) => {
    try {
      if (!file) return;
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        toast.error("ImgBB API key missing in environment variables!");
        return;
      }
      
      setUploadingState(true);
      const toastId = toast.loading(`Uploading ${targetField === "image" ? "book cover" : "owner avatar"}...`);
      
      const fd = new FormData();
      fd.append("image", file);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { 
        method: "POST", 
        body: fd 
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        toast.update(toastId, { render: "Image hosting failed!", type: "error", isLoading: false, autoClose: 3000 });
        return;
      }
      
      update(targetField, data.data.url);
      toast.update(toastId, { render: "Image uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploadingState(false);
    }
  };

  // ৪. সাবমিট হ্যান্ডলার (ভ্যালিডেশন, ওয়ান-ক্লিক টোটাল লোকাল স্টোরেজ ও স্টেট ক্লিন)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 খালি ফিল্ড ভ্যালিডেশন চেক (যেকোনো ফিল্ড খালি থাকলে টোস্ট মেসেজ দেখাবে)
    if (!form.title.trim()) return toast.error("Book Title cannot be empty!");
    if (!form.author.trim()) return toast.error("Author Name cannot be empty!");
    if (!form.category) return toast.error("Please select a Category!");
    if (!form.publisher.trim()) return toast.error("Publisher field cannot be empty!");
    if (!form.language.trim()) return toast.error("Language field cannot be empty!");
    if (!form.isbn.trim()) return toast.error("ISBN Number cannot be empty!");
    if (!form.pages) return toast.error("Total Pages cannot be empty!");
    if (!form.image.trim()) return toast.error("Book Cover Image is required!");
    if (!form.description.trim()) return toast.error("Description cannot be empty!");
    if (form.deliveryFee === "" || form.deliveryFee === undefined) return toast.error("Delivery Fee is required!");
    if (!form.ownerName.trim()) return toast.error("Owner Name cannot be empty!");
    if (!form.ownerPhoto.trim()) return toast.error("Owner Profile Photo is required!");

    const submitToastId = toast.loading("Pushing data structure payload to database...");
    try {
      setLoading(true);

      // আপনার দেওয়া সম্পূর্ণ অবজেক্ট ফরম্যাটের সাথে সামঞ্জস্যপূর্ণ পে-লোড জেনারেশন
      const payload = {
        bookId: `BK-${Date.now().toString().slice(-3)}`, // অটো জেনারেটেড bookId
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        publisher: form.publisher.trim(),
        language: form.language.trim(),
        isbn: form.isbn.trim(),
        pages: parseInt(form.pages) || 0,
        image: form.image,
        description: form.description.trim(),
        deliveryFee: parseFloat(form.deliveryFee) || 0,
        availabilityStatus: "Available", // ইনিশিয়াল এভেইলেবিলিটি স্ট্যাটাস
        approvalStatus: "Pending",       // আপনার পূর্বের রিকোয়ারমেন্ট অনুযায়ী strictly "Pending"
        rating: 0,                       // ইনিশিয়াল ডিফল্ট ভ্যালু
        totalReviews: 0,                 // ইনিশিয়াল ডিফল্ট ভ্যালু
        totalDeliveries: 0,              // ইনিশিয়াল ডিফল্ট ভ্যালু
        ownerName: form.ownerName.trim(),
        ownerEmail: "librarian.active@example.com", // ব্যাকএন্ড সেশন বা JWT থেকে অটো হ্যান্ডেল হবে
        ownerPhoto: form.ownerPhoto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // ব্যাকএন্ডে ডাটা সেভ করার রিকোয়েস্ট পাঠানো
      await serverApi("/books", { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });
      
      toast.update(submitToastId, { 
        render: "Sync successful! Book added with 'Pending' status.", 
        type: "success", 
        isLoading: false, 
        autoClose: 4000 
      });

      // ⚡ এক ক্লিকে সম্পূর্ণ লোকাল স্টোরেজ টোটালি ক্লিন করা
      localStorage.clear(); 

      // ⚡ ফর্মের ইন্টারনাল সমস্ত ফিল্ড সম্পূর্ণ খালি করা
      setForm({
        title: "",
        author: "",
        category: "Sci-Fi",
        publisher: "",
        language: "English",
        isbn: "",
        pages: "",
        image: "",
        description: "",
        deliveryFee: "",
        ownerName: "",
        ownerPhoto: ""
      });

      router.push("/dashboard/librarian/inventory");
    } catch (err) {
      toast.update(submitToastId, { 
        render: err.message || "Failed to finalize database injection.", 
        type: "error", 
        isLoading: false, 
        autoClose: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8 w-full max-w-5xl mx-auto px-1">
      {/* Header Section */}
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-3xl font-black text-white sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
          <BookOpen className="text-blue-500" size={32} /> Add Compatible Book
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
          Populating all schema fields. Submitting clears <span className="text-emerald-400 font-bold">local storage matrix</span> instantly.
        </p>
      </div>

      {/* Form Card Container */}
      <form 
        onSubmit={handleSubmit} 
        className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-[#0a1941]/90 via-[#06133a]/80 to-[#041032]/90 p-6 shadow-xl backdrop-blur-md md:p-8"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        {/* Inputs Fields Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Book Title" value={form.title} onChange={(v) => update("title", v)} />
          <Input label="Author Name" value={form.author} onChange={(v) => update("author", v)} />
          
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Category</span>
            <select 
              value={form.category} 
              onChange={(e) => update("category", e.target.value)} 
              className="h-12 w-full rounded-xl border border-slate-700/80 bg-[#041032] px-4 text-white font-semibold outline-none focus:border-blue-500 transition-all shadow-inner"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#041032]">
                  {c}
                </option>
              ))}
            </select>
          </label>

          <Input label="Delivery Fee (BDT)" type="number" value={form.deliveryFee} onChange={(v) => update("deliveryFee", v)} />
          <Input label="Publisher" value={form.publisher} onChange={(v) => update("publisher", v)} />
          <Input label="Language" value={form.language} onChange={(v) => update("language", v)} />
          <Input label="ISBN Number" value={form.isbn} onChange={(v) => update("isbn", v)} />
          <Input label="Total Pages" type="number" value={form.pages} onChange={(v) => update("pages", v)} />
          <Input label="Owner Full Name" value={form.ownerName} onChange={(v) => update("ownerName", v)} />
        </div>

        {/* 1. Book Cover Image Upload Row */}
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <Input label="Book Cover Image URL" value={form.image} onChange={(v) => update("image", v)} />
          <label className="flex cursor-pointer items-end">
            <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all px-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg active:scale-95 duration-200">
              <ImagePlus size={16} /> 
              {uploadingCover ? "Uploading..." : "Upload Cover"}
              <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e.target.files?.[0], "image", setUploadingCover)} disabled={uploadingCover} />
            </span>
          </label>
        </div>

        {/* 2. Owner Profile Photo Upload Row */}
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <Input label="Owner Profile Photo URL" value={form.ownerPhoto} onChange={(v) => update("ownerPhoto", v)} />
          <label className="flex cursor-pointer items-end">
            <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition-all px-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg active:scale-95 duration-200">
              <User size={16} /> 
              {uploadingOwner ? "Uploading..." : "Upload Avatar"}
              <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e.target.files?.[0], "ownerPhoto", setUploadingOwner)} disabled={uploadingOwner} />
            </span>
          </label>
        </div>

        {/* Description Textarea */}
        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Description / Synopsis</span>
          <textarea 
            value={form.description} 
            onChange={(e) => update("description", e.target.value)} 
            rows={4} 
            placeholder="Provide context on divergence or summary..."
            className="w-full rounded-xl border border-slate-700/80 bg-[#041032] p-4 text-white outline-none focus:border-blue-500 transition-all font-medium placeholder-slate-600 shadow-inner resize-none" 
          />
        </label>

        {/* Form Action Controls */}
        <div className="mt-8 flex justify-end">
          <button 
            disabled={loading || uploadingCover || uploadingOwner} 
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 px-8 py-4 text-sm font-black text-white hover:opacity-90 shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-[1px]"
          >
            {loading ? (
              <>
                <Sparkles size={18} className="animate-spin" /> Storing Schema Payload...
              </>
            ) : (
              <>
                <Save size={18} /> Submit & Wipe LocalStorage
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

// Reusable Custom Styled Input Component
function Input({ label, value, onChange, type = "text" }) { 
  return (
    <label className="block w-full">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="h-12 w-full rounded-xl border border-slate-700/80 bg-[#041032] px-4 text-white font-semibold outline-none focus:border-blue-500 transition-all shadow-inner" 
      />
    </label>
  ); 
}