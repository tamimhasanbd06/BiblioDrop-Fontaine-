import Link from "next/link";
import {
  FiArrowLeft,
  FiBookOpen,
  FiHome,
  FiSearch,
  FiAlertTriangle,
} from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#041032] px-4 py-20 text-white sm:px-6 lg:px-10">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-600/25 blur-[110px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-[120px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,16,50,0.2),rgba(4,16,50,1))]" />

      <section className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-white/10 bg-white/[0.06] text-4xl text-blue-300 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
          <FiAlertTriangle />
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300 sm:text-xs">
          <FiBookOpen />
          Page Not Found
        </div>

        <h1 className="text-7xl font-black leading-none tracking-tight text-white sm:text-8xl md:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
          This page got lost{" "}
          <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
            between the shelves.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
          The page you are looking for does not exist, may have been moved, or
          the link might be incorrect. You can return home or explore available
          books from BiblioDrop.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-7 text-sm font-black text-white shadow-lg shadow-blue-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30"
          >
            <FiHome />
            Back to Home
          </Link>

          <Link
            href="/books"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-7 text-sm font-black text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/30 hover:bg-white/[0.1]"
          >
            <FiSearch />
            Browse Books
          </Link>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <FiArrowLeft />
            </div>

            <div>
              <h3 className="font-black text-white">Need help?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Check the navigation menu or go back to the previous page and
                try again.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}