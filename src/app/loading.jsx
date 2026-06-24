// বাংলা মন্তব্য: Global loading screen সব route loading অবস্থায় দেখায়।
export default function Loading() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" /><p className="text-sm font-bold text-slate-400">Loading BiblioDrop...</p></div></main>;
}
