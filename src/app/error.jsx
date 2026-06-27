"use client";


export default function Error({ error, reset }) {
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"><section className="max-w-lg rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-center"><h1 className="text-2xl font-black">Something went wrong</h1><p className="mt-3 text-sm text-red-200/80">{error?.message || "Unexpected error occurred."}</p><button onClick={reset} className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white">Try Again</button></section></main>;
}
