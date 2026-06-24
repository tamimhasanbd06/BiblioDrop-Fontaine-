import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiUsers } from "react-icons/fi";
import Banner from "@/Components/Banner";
import FeaturedBooks from "@/Components/Featured_Books";

// বাংলা মন্তব্য: Home page existing theme রেখে hero, featured, librarians এবং categories দেখায়।
export default function HomePage() {
  return <div className="bg-slate-950"><Banner /><FeaturedBooks /><TopLibrarians /><PopularCategories /></div>;
}

// বাংলা মন্তব্য: Requirement অনুযায়ী static top librarians/provider section।
function TopLibrarians() {
  const librarians = [
    { name: "Gwen Stacy", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", deliveries: 68 },
    { name: "Peter Parker", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6", deliveries: 50 },
    { name: "Clark Kent", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", deliveries: 41 },
  ];
  return <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-[1440px]"><div className="mb-12 text-center"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300"><FiUsers /> Top Providers</div><h2 className="text-4xl font-black">Top <span className="text-blue-400">Librarians</span></h2><p className="mt-4 text-slate-400">Popular local providers with completed deliveries.</p></div><div className="grid gap-6 md:grid-cols-3">{librarians.map((l) => <div key={l.name} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-blue-950/20"><img src={l.image} alt={l.name} className="mx-auto h-24 w-24 rounded-3xl object-cover" /><h3 className="mt-5 text-xl font-black">{l.name}</h3><p className="mt-2 text-sm text-slate-400">{l.deliveries} completed deliveries</p></div>)}</div></div></section>;
}

// বাংলা মন্তব্য: Popular categories links browse page filter query পাঠায়।
function PopularCategories() {
  const categories = ["Fiction", "Academic", "Sci-Fi", "Romance", "Classics", "Children", "Others"];
  return <section className="bg-slate-950 px-4 pb-24 text-white sm:px-6 lg:px-10"><div className="mx-auto max-w-[1440px]"><div className="mb-12 text-center"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300"><FiBookOpen /> Popular Categories</div><h2 className="text-4xl font-black">Explore by <span className="text-blue-400">Category</span></h2></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">{categories.map((cat) => <Link key={cat} href={`/books?category=${encodeURIComponent(cat)}`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center font-black text-white transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-600"><span>{cat}</span><FiArrowRight className="mx-auto mt-3 opacity-60 transition group-hover:translate-x-1" /></Link>)}</div></div></section>;
}
