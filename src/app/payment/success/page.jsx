"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiClock, FiTruck, FiXCircle } from "react-icons/fi";
import { formatMoney, serverApi } from "@/lib/api";

// বাংলা মন্তব্য: Stripe success page Suspense wrapper।
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentView status="Processing payment..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

// বাংলা মন্তব্য: Stripe session_id verify করে backend delivery request তৈরি করছে এবং paid book info UI-তে দেখাচ্ছে।
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const [ok, setOk] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const [book, setBook] = useState(null);
  
  // সেফটি চেক: session_id রিড করা হচ্ছে
  const sessionId = searchParams ? searchParams.get("session_id") : null;

  useEffect(() => {
    let ignore = false;

    // বাংলা মন্তব্য: একই session verify request একবারই চালানো হচ্ছে যাতে infinite loop না হয়।
    const verify = async () => {
      try {
        if (!sessionId) {
          throw new Error("Missing Stripe session id or invalid checkout route.");
        }

        const data = await serverApi("/payment-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (ignore) return;
        
        if (data.success) {
          setOk(true);
          setStatus(data.message || "Payment verified and delivery request created.");
          setDelivery(data.delivery || null);
          setBook(data.book || null);
        } else {
          throw new Error(data.message || "Payment verification failed on server.");
        }
      } catch (err) {
        if (ignore) return;
        setOk(false);
        setStatus(err.message || "Payment verification failed.");
      }
    };

    verify();

    return () => {
      ignore = true;
    };
  }, [sessionId]);

  return <PaymentView status={status} ok={ok} delivery={delivery} book={book} />;
}

// বাংলা মন্তব্য: Payment status UI যেখানে user কোন বই request করেছে তা দেখানো হচ্ছে।
function PaymentView({ status, ok, delivery, book }) {
  const paidBook = book || delivery || null;
  const image = paidBook?.image || paidBook?.bookImage || "/placeholder-book.jpg";
  const title = paidBook?.title || paidBook?.bookTitle || "Requested Book";
  const fee = paidBook?.deliveryFee || delivery?.deliveryFee || 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-20 text-white relative">
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-blue-950/30 backdrop-blur-md">
        {ok ? (
          <FiCheckCircle className="mx-auto mb-5 text-6xl text-emerald-300 animate-bounce" />
        ) : (
          <FiXCircle className="mx-auto mb-5 text-6xl text-red-400" />
        )}

        <h1 className="text-2xl font-black tracking-tight">BiblioDrop Stripe Payment</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400 max-w-md mx-auto">{status}</p>

        {ok && paidBook ? (
          <div className="mx-auto mt-7 grid max-w-xl gap-5 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 text-left sm:grid-cols-[120px_1fr] transition-all hover:border-white/20">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-800 shadow-lg border border-white/5">
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                sizes="120px"
                className="object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/placeholder-book.jpg";
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                <FiClock /> Pending Delivery
              </p>
              <h2 className="text-xl font-black leading-snug text-white">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">Delivery fee paid: <span className="text-emerald-400 font-bold">{formatMoney(fee)}</span></p>
              
              <div className="mt-4 flex items-start gap-2 text-sm font-medium text-blue-300 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                <FiTruck className="mt-0.5 flex-shrink-0 text-base" />
                <span>Librarian will review your request and dispatch this book next.</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/user/delivery-history" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
            Delivery History
          </Link>
          <Link href="/books" className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 hover:border-blue-400/40 hover:text-blue-300 transition-all bg-white/[0.02]">
            Browse Books
          </Link>
        </div>
      </section>
    </main>
  );
}