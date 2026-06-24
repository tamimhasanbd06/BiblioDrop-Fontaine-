"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiHome,
  FiBookOpen,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;

  const dashboardPath = useMemo(() => {
    const role = user?.role || "user";

    if (role === "admin") return "/dashboard/admin";
    if (role === "librarian") return "/dashboard/librarian";

    return "/dashboard/user";
  }, [user?.role]);

  const links = useMemo(
    () => [
      { name: "Home", path: "/", icon: <FiHome /> },
      { name: "Browse Books", path: "/books", icon: <FiBookOpen /> },
      {name: "About us", path: "/about", icon: <FiGrid />, private: true, },
      {name: "Contact", path: "/contact", icon: <FiGrid />, private: true, },
      {name: "Dashboard", path: dashboardPath, icon: <FiGrid />, private: true, },
    ],
    [dashboardPath]
  );

  const visibleLinks = links.filter((link) => {
    if (link.private && !isLoggedIn) return false;
    return true;
  });

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      // বাংলা মন্তব্য: Better Auth session এবং backend JWT cookie দুটোই clear করা হচ্ছে।
      await authClient.signOut();
      await fetch("/api/jwt", { method: "DELETE", credentials: "include" });

      setIsOpen(false);
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          z-50 w-full border-b border-white/10 bg-[#041032]
          transition-all duration-300
          ${
            scrolled
              ? "sticky top-0 shadow-2xl shadow-blue-950/40 backdrop-blur-xl"
              : "relative"
          }
        `}
      >
        <div
          className={`
            mx-auto flex max-w-[1440px] items-center justify-between px-4
            transition-all duration-300 sm:px-6 lg:px-10
            ${scrolled ? "h-16" : "h-20"}
          `}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 transition duration-300 hover:scale-[1.02]"
            aria-label="BiblioDrop Home"
          >
            <Image
              src="/Images/Long logo.png"
              alt="BiblioDrop logo"
              width={155}
              height={52}
              priority
              className="h-auto w-[135px] object-contain sm:w-[155px]"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden items-center gap-9 lg:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`
                  group relative flex items-center gap-2 text-sm font-extrabold tracking-wide
                  transition-colors duration-300
                  ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-slate-200 hover:text-white"
                  }
                `}
              >
                <span
                  className={`
                    text-base transition-colors duration-300
                    ${
                      isActive(link.path)
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white"
                    }
                  `}
                >
                  {link.icon}
                </span>

                <span>{link.name}</span>

                <span
                  className={`
                    absolute -bottom-2 left-0 h-[2px] rounded-full bg-blue-300
                    transition-all duration-300
                    ${
                      isActive(link.path)
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }
                  `}
                />
              </Link>
            ))}
          </div>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden items-center gap-3 lg:flex">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-white/15" />
            ) : isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="
                  inline-flex items-center gap-2 rounded-full bg-gradient-to-r
                  from-red-500 to-rose-600 px-6 py-2.5 text-sm font-extrabold
                  text-white shadow-lg shadow-red-600/20 transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/30
                  disabled:cursor-not-allowed disabled:opacity-70
                "
              >
                <FiLogOut />
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`
                    rounded-full border px-5 py-2.5 text-sm font-extrabold
                    transition-all duration-300
                    ${
                      isActive("/signin")
                        ? "border-white bg-white text-[#041032] shadow-md"
                        : "border-white/30 bg-white/5 text-white hover:border-white hover:bg-white hover:text-[#041032]"
                    }
                  `}
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className={`
                    rounded-full px-6 py-2.5 text-sm font-extrabold transition-all duration-300
                    ${
                      isActive("/signup")
                        ? "bg-white text-[#041032] shadow-md"
                        : "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-700/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
                    }
                  `}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setIsOpen(true)}
            className="
              inline-flex h-11 w-11 items-center justify-center rounded-full
              border border-white/15 bg-white/10 text-white shadow-sm
              transition hover:bg-white hover:text-[#041032] lg:hidden
            "
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
        `}
      />

      {/* MOBILE RIGHT DRAWER */}
      <aside
        className={`
          fixed right-0 top-0 z-[80] h-full w-[84%] max-w-[370px]
          border-l border-white/10 bg-white shadow-2xl shadow-slate-950/20
          transition-transform duration-300 ease-out lg:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#041032] px-5 py-5">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/Images/Long logo.png"
                alt="BiblioDrop logo"
                width={138}
                height={45}
                className="object-contain"
              />
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="
                inline-flex h-10 w-10 items-center justify-center rounded-full
                bg-white/10 text-white transition hover:bg-white hover:text-[#041032]
              "
              aria-label="Close menu"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* DRAWER BODY */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="mb-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-blue-600">
                BiblioDrop
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                Your Local Library, Delivered
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse books, request delivery, and manage your reading journey.
              </p>

              {isLoggedIn && (
                <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-blue-100">
                  <p className="text-sm font-extrabold text-slate-900">
                    {user?.name || "BiblioDrop User"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {user?.email}
                  </p>

                  <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold capitalize text-blue-700">
                    {user?.role || "user"}
                  </p>
                </div>
              )}
            </div>

            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.25em] text-slate-400">
              Navigation
            </p>

            <div className="space-y-3">
              {visibleLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    flex w-full items-center gap-3 rounded-2xl px-4 py-3.5
                    text-sm font-extrabold transition-all duration-300
                    ${
                      isActive(link.path)
                        ? "bg-[#041032] text-white shadow-lg shadow-blue-950/20"
                        : "bg-slate-50 text-slate-800 ring-1 ring-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-100"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-xl text-lg transition
                      ${
                        isActive(link.path)
                          ? "bg-white/15 text-white"
                          : "bg-white text-blue-700 shadow-sm"
                      }
                    `}
                  >
                    {link.icon}
                  </span>

                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="my-6 h-px bg-blue-100" />

            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.25em] text-slate-400">
              Account
            </p>

            <div className="space-y-3">
              {isPending ? (
                <div className="h-12 w-full animate-pulse rounded-2xl bg-blue-100" />
              ) : isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="
                    flex w-full items-center justify-center gap-2 rounded-2xl
                    bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3.5
                    text-sm font-extrabold text-white shadow-lg shadow-red-600/20
                    transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70
                  "
                >
                  <FiLogOut />
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={`
                      flex w-full items-center justify-center gap-2 rounded-2xl
                      px-4 py-3.5 text-sm font-extrabold transition-all duration-300
                      ${
                        isActive("/signin")
                          ? "bg-[#041032] text-white shadow-lg shadow-blue-950/20"
                          : "border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    <FiLogIn />
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className={`
                      flex w-full items-center justify-center gap-2 rounded-2xl
                      px-4 py-3.5 text-sm font-extrabold text-white transition-all duration-300
                      ${
                        isActive("/signup")
                          ? "bg-[#041032]"
                          : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg shadow-blue-700/25"
                      }
                    `}
                  >
                    <FiUserPlus />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* DRAWER FOOTER */}
          <div className="border-t border-blue-100 px-5 py-5">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FiBookOpen size={22} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  Read smarter
                </p>
                <p className="text-xs text-slate-500">
                  Discover books near you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;