"use client";

import Sidebar from "./sidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// বাংলা মন্তব্য: Dashboard layout session check এবং role-based redirect করে।
export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    // বাংলা মন্তব্য: Session না থাকলে signin page-এ পাঠানো হচ্ছে।
    if (!session?.user) {
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const role = session.user.role?.toLowerCase() || "user";
    const roleHome = role === "admin" ? "/dashboard/admin" : role === "librarian" ? "/dashboard/librarian" : "/dashboard/user";

    // বাংলা মন্তব্য: Dashboard root অথবা ভুল role route access করলে নিজের dashboard-এ redirect করা হচ্ছে।
    if (pathname === "/dashboard" || !pathname.startsWith(roleHome)) {
      router.replace(roleHome);
    }
  }, [isPending, session, router, pathname]);

  if (isPending) {
    return <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#041032]"><div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" /><span className="text-sm font-medium tracking-wide text-slate-400">Verifying credentials...</span></div>;
  }

  if (!session?.user) return null;

  return <div className="flex min-h-screen bg-[#041032] transition-colors duration-300"><Sidebar role={session.user.role || "user"} user={session.user} /><main className="flex-1 overflow-x-hidden p-4 pt-20 text-slate-100 sm:p-6 sm:pt-20 md:p-10 md:pt-10"><div className="mx-auto max-w-7xl">{children}</div></main></div>;
}
