"use client";

import Link from "next/link";
import { BookOpen, ShieldCheck, Truck, Users } from "lucide-react";

const coreValues = [
  {
    icon: BookOpen,
    title: "Democratizing Literature",
    description: "Bridging the gap between isolated bookshelves and passionate readers, ensuring knowledge is never out of reach.",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
    bgGlow: "from-blue-500/10 to-transparent"
  },
  {
    icon: Truck,
    title: "Eco-Friendly Logistics",
    description: "Optimizing neighborhood distribution loops to keep carbon footprints low while delivering physical books right to your doorstep.",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    bgGlow: "from-amber-500/10 to-transparent"
  },
  {
    icon: ShieldCheck,
    title: "Audited Transparency",
    description: "Utilizing strict admin quality queues, tokenized Stripe gateways, and 100% verified review loops for complete ecosystem trust.",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    bgGlow: "from-emerald-500/10 to-transparent"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#041032] text-slate-100 p-6 md:p-12 transition-colors duration-300 overflow-hidden relative">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <section className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Hero Identity Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            The Marketplace for Shared Knowledge
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            BiblioDrop is a decentralized digital platform connecting avid readers, academic students, local libraries, and independent book providers into a single, cohesive circular economy.
          </p>
        </div>

        {/* The Problem & The Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a1941]/40 backdrop-blur-md rounded-2xl p-8 border border-slate-800/80 space-y-3">
            <h3 className="text-xl font-bold text-slate-200">The Modern Barrier</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional municipal libraries require physical commuting, fixed hours, and geographical proximity—creating invisible barriers for busy professionals, working parents, and remote students. Meanwhile, millions of valuable books sit stagnant on private residential shelves.
            </p>
          </div>

          <div className="bg-[#0a1941]/60 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 shadow-lg shadow-blue-950/20 space-y-3">
            <h3 className="text-xl font-bold text-white">The BiblioDrop Solution</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We democratize physical media. By enabling local librarians and independent owners to host their digital inventories securely, readers can browse verified community catalogs and request tracked, direct doorstep delivery via transparent micro-fees.
            </p>
          </div>
        </div>

        {/* Core Values / Platform Architecture Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Ecosystem Architecture</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Engineered for trust, safety, and scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div 
                  key={idx}
                  className={`bg-[#0a1941]/50 backdrop-blur-md rounded-2xl p-6 border ${value.borderColor} bg-gradient-to-b ${value.bgGlow} transition-transform duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center mb-4 border border-slate-700/40`}>
                    <Icon size={20} className={value.iconColor} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{value.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Driven Call-To-Action (CTA) */}
        <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md rounded-2xl p-8 text-center space-y-6 border border-blue-500/30 shadow-2xl shadow-indigo-950/40 max-w-4xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white">Ready to explore the community shelves?</h2>
            <p className="text-sm text-indigo-100 max-w-xl mx-auto">
              Create an account today to either set up your digital library inventory provider node, or secure doorstep deliveries of your next favorite read.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/browse" 
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#041032] bg-white rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-md"
            >
              Browse Books
            </Link>
            <Link 
              href="/signin" 
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-transparent border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Access Platform
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}