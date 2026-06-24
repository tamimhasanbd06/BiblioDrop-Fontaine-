"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { serverApi } from "@/lib/api";

// বাংলা মন্তব্য: Stripe success page Suspense wrapper।
export default function PaymentSuccessPage() {
  return <Suspense fallback={<PaymentView status="Processing payment..." />}><PaymentSuccessContent /></Suspense>;
}

// বাংলা মন্তব্য: Stripe session_id verify করে backend delivery request তৈরি করছে।
function PaymentSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying payment...");
  const [ok, setOk] = useState(false);
  const sessionId = params.get("session_id");

  useEffect(() => {
    const verify = async () => {
      try {
        if (!sessionId) throw new Error("Missing Stripe session id.");
        await serverApi("/payment-success", { method: "POST", body: JSON.stringify({ sessionId }) });
        setOk(true);
        setStatus("Payment verified and delivery request created.");
      } catch (err) {
        setOk(false);
        setStatus(err.message || "Payment verification failed.");
      }
    };
    verify();
  }, [sessionId]);

  return <PaymentView status={status} ok={ok} />;
}

// বাংলা মন্তব্য: Payment status UI।
function PaymentView({ status, ok }) {
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"><section className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-blue-950/30">{ok ? <FiCheckCircle className="mx-auto mb-5 text-6xl text-emerald-300" /> : <FiXCircle className="mx-auto mb-5 text-6xl text-blue-300" />}<h1 className="text-2xl font-black">BiblioDrop Payment</h1><p className="mt-3 text-sm leading-7 text-slate-400">{status}</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard/user/delivery-history" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white">Delivery History</Link><Link href="/books" className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-slate-300">Browse Books</Link></div></section></main>;
}
