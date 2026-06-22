"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSyncPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState("Securing your session...");

  const nextPath = useMemo(() => {
    return searchParams.get("next") || "/";
  }, [searchParams]);

  useEffect(() => {
    const syncJWT = async () => {
      try {
        const response = await fetch("/api/jwt", {
          method: "POST",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          setMessage("Session sync failed. Redirecting to sign in...");
          router.replace("/signin");
          return;
        }

        router.replace(nextPath);
        router.refresh();
      } catch (error) {
        setMessage("Session sync failed. Redirecting to sign in...");
        router.replace("/signin");
      }
    };

    syncJWT();
  }, [nextPath, router]);

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