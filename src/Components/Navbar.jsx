"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiGrid } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(false);

  const lastScrollY = useRef(0);

  const isActive = (path) => pathname === path;

  const links = [
    { name: "Home", path: "/" },
    { name: "Browse Books", path: "/books" },
    { name: "Dashboard", path: "/dashboard/user", icon: <FiGrid /> },
  ];

  // 🔥 Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      setScrolled(current > 10);

      if (current > lastScrollY.current && current > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🚀 Route transition loader
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {/* 🚀 Page Loader */}
      {loading && (
        <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center animate-fade-in">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* NAVBAR */}
      <nav
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300
          backdrop-blur-xl border-b border-white/20
          ${
            scrolled
              ? "bg-white/80 shadow-lg h-16"
              : "bg-white/60 h-20"
          }
          ${hidden ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:scale-105 transition"
          >
            <Image
              src="/Images/Long logo.png"
              alt="logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="relative group text-sm font-medium transition"
              >
                <span
                  className={`flex items-center gap-2 transition duration-300 ${
                    isActive(link.path)
                      ? "text-indigo-600"
                      : "text-gray-600 group-hover:text-indigo-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </span>

                {/* 🔥 Animated Underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[3px] rounded-full transition-all duration-300
                  ${
                    isActive(link.path)
                      ? "w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "w-0 bg-indigo-500 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-4">

            <Link
              href="/signin"
              className="px-5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 hover:shadow-xl transition"
            >
              Sign Up
            </Link>
          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-indigo-600 transition"
          >
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition
                ${
                  isActive(link.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="border-t my-2" />

            <Link
              href="/signin"
              className="block text-center py-3 rounded-xl border"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="block text-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;