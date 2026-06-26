"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  History,
  Star,
  PlusCircle,
  Library,
  Truck,
  Users,
  CreditCard,
  CheckCircle,
  Home,
  UserRound,
  Menu,
  X,
} from "lucide-react";

// বাংলা মন্তব্য: Dashboard sidebar role-based links দেখায় এবং mobile drawer support করে।
export default function Sidebar({ role, user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const normalizedRole = role?.toLowerCase() || "user";

  // বাংলা মন্তব্য: User dashboard-এর links।
  const userLinks = [
    { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/user/profile", icon: UserRound },
    { name: "Delivery History", href: "/dashboard/user/delivery-history", icon: History },
    { name: "Reading List", href: "/dashboard/user/reading-list", icon: BookOpen },
    { name: "My Reviews", href: "/dashboard/user/reviews", icon: Star },
  ];

  // বাংলা মন্তব্য: Librarian dashboard-এর links।
  const librarianLinks = [
    { name: "Overview", href: "/dashboard/librarian", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/librarian/profile", icon: UserRound },
    { name: "Add Book", href: "/dashboard/librarian/add-book", icon: PlusCircle },
    { name: "Manage Inventory", href: "/dashboard/librarian/inventory", icon: Library },
    { name: "Manage Deliveries", href: "/dashboard/librarian/deliveries", icon: Truck },
  ];

  // বাংলা মন্তব্য: Admin dashboard-এর links।
  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/admin/profile", icon: UserRound },
    { name: "Book Approval", href: "/dashboard/admin/book-approval", icon: CheckCircle },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Books", href: "/dashboard/admin/books", icon: Library },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ];

  const links = normalizedRole === "admin" ? adminLinks : normalizedRole === "librarian" ? librarianLinks : userLinks;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-[#06143c] text-white shadow-xl md:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu size={20} />
      </button>

      {open && <button className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} aria-label="Close dashboard overlay" />}

      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-800/80 bg-[#06143c] p-6 transition-transform duration-300 md:sticky md:top-0 md:z-auto md:min-h-screen md:translate-x-0`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="group flex items-center gap-3 px-2">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-transform duration-200 group-hover:scale-105">
                <Home size={20} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white transition-colors duration-200 group-hover:text-blue-400">BiblioDrop</span>
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 md:hidden" aria-label="Close dashboard menu"><X size={20} /></button>
          </div>

          <div className="flex flex-col space-y-1 rounded-2xl border border-slate-800/60 bg-[#0a1941]/60 p-4 shadow-inner backdrop-blur-md">
            <p className="truncate font-bold tracking-wide text-white">{user?.name || "App User"}</p>
            <span className="w-fit rounded-md border border-blue-500/10 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-400">{normalizedRole}</span>
          </div>

          <nav className="space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all duration-200 ${active ? "border border-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800/40 pt-4 text-center">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-600">v2026 Core Platform</p>
        </div>
      </aside>
    </>
  );
}
