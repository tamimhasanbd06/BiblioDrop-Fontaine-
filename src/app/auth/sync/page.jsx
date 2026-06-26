"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// বাংলা মন্তব্য: useSearchParams Suspense boundary ছাড়া build error দিতে পারে, তাই wrapper ব্যবহার করা হচ্ছে।
export default function AuthSyncPage() {
  return (
    <Suspense fallback={<SyncLoading message="Securing your session..." />}>
      <AuthSyncContent />
    </Suspense>
  );
}

// বাংলা মন্তব্য: Better Auth session থেকে JWT cookie তৈরি করার client page।
function AuthSyncContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Securing your session...");

  const nextPath = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  useEffect(() => {
    let active = true;

    // বাংলা মন্তব্য: Session sync একবার করা হচ্ছে; cleanup flag infinite loop/state update prevent করে।
    const syncJWT = async () => {
      try {
        const response = await fetch("/api/jwt", { method: "POST", credentials: "include" });
        const result = await response.json();
        if (!active) return;

        if (!response.ok || !result.success) {
          setMessage("Session sync failed. Redirecting to sign in...");
          router.replace("/signin");
          return;
        }

        router.replace(nextPath);
        router.refresh();
      } catch {
        if (!active) return;
        setMessage("Session sync failed. Redirecting to sign in...");
        router.replace("/signin");
      }
    };

    syncJWT();
    return () => { active = false; };
  }, [nextPath, router]);

  return <SyncLoading message={message} />;
}

// বাংলা মন্তব্য: Auth sync loading UI existing dark theme অনুযায়ী রাখা হয়েছে।
function SyncLoading({ message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
        <h1 className="text-xl font-black">BiblioDrop</h1>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
      </div>
    </main>
  );
}
