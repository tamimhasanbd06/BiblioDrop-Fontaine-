"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// বাংলা মন্তব্য: Dashboard table/gallery pagination reuse করার component, যাতে সব page-এ same design থাকে।
export default function DashboardPagination({ pagination, page, setPage, loading }) {
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems ?? pagination?.totalBooks ?? 0;

  // বাংলা মন্তব্য: এক page হলে pagination hidden রাখা হচ্ছে।
  if (totalPages <= 1) return null;

  // বাংলা মন্তব্য: বড় list-এ nearby page buttons দেখানো হচ্ছে।
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1
  );

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0a1941]/60 p-4 sm:flex-row">
      <p className="text-sm text-slate-400">
        Total <span className="font-bold text-white">{totalItems}</span> items • Page{" "}
        <span className="font-bold text-white">{page}</span> of{" "}
        <span className="font-bold text-white">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          disabled={loading || page <= 1}
          onClick={() => setPage((current) => Math.max(current - 1, 1))}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {pages.map((item, index) => {
          const previous = pages[index - 1];
          const showDots = previous && item - previous > 1;

          return (
            <span key={item} className="flex items-center gap-2">
              {showDots && <span className="text-slate-500">...</span>}
              <button
                disabled={loading}
                onClick={() => setPage(item)}
                className={`h-10 min-w-10 rounded-full px-3 text-sm font-black transition ${
                  page === item
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                    : "border border-slate-700 text-slate-300 hover:border-blue-400 hover:text-blue-300"
                }`}
              >
                {item}
              </button>
            </span>
          );
        })}

        <button
          disabled={loading || page >= totalPages}
          onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
