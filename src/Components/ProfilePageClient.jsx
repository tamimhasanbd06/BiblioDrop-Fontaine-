"use client";

import Image from "next/image";
import { UserRound, Mail, ShieldCheck, MapPin, Phone, CalendarDays, KeyRound } from "lucide-react";
import { formatDate } from "@/lib/api";
import { useSession } from "@/lib/auth-client"; // আপনার auth-client ফাইলের সঠিক পাথ নিশ্চিত করুন

export default function ProfilePageClient({ roleLabel = "User" }) {
  const { data: session, isPending: authLoading } = useSession();
  const authUser = session?.user;

  if (authLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto h-[500px] animate-pulse rounded-3xl border border-slate-800 bg-[#0a1941]/40" />
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-4">
      {/* Dynamic Top Header */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {roleLabel} Personal Profile
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Verified identity system records, security clearances, and server infrastructure status.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr] items-start">
        
        {/* Left Side: Premium Avatar Card */}
        <div className="relative group overflow-hidden flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0a1941]/90 via-[#06133a]/80 to-[#041032]/90 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />
          
          {/* Futuristic Image Frame */}
          <div className="relative h-36 w-36 sm:h-40 sm:w-40 p-1.5 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 via-slate-800 to-emerald-500 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border-2 border-slate-950 bg-slate-900">
              <Image 
                src={authUser?.image || "/placeholder-user.jpg"} 
                alt={authUser?.name || "Profile Avatar"} 
                fill 
                sizes="(max-w-640px) 144px, 160px" 
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110" 
                priority
              />
            </div>
          </div>
          
          {/* Identity Indicators */}
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate max-w-full">
            {authUser?.name || "Anonymous Member"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400 break-all max-w-full px-2">
            {authUser?.email}
          </p>
          
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-blue-300 shadow-md">
            <ShieldCheck size={14} className="text-emerald-400 animate-pulse" /> 
            Security Rank: <span className="text-white ml-0.5">{authUser?.role || "user"}</span>
          </div>
        </div>

        {/* Right Side: Account Overview & Data Matrix */}
        <div className="relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0a1941]/90 via-[#06133a]/80 to-[#041032]/90 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-400 via-indigo-500 to-blue-500" />
          
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide border-b border-slate-800 pb-3 mb-6 flex items-center gap-2">
              <KeyRound size={18} className="text-blue-400" /> Account Dashboard Overview
            </h3>
            
            {/* Bio Section */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-slate-800/60 bg-[#041032]/60 backdrop-blur-sm transition-all hover:bg-[#041032]/90">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                Personal Statement / Bio
              </span>
              <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                "{authUser?.bio || "No custom authentication status biography has been broadcast for this profile gateway node."}"
              </p>
            </div>

            {/* Responsive Information Cards Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <DisplayRow icon={<Mail size={16} />} label="Email Node Address" value={authUser?.email} />
              <DisplayRow icon={<CalendarDays size={16} />} label="System Registration" value={formatDate(authUser?.createdAt)} />
              <DisplayRow icon={<Phone size={16} />} label="Network Secure Phone" value={authUser?.phone || "No terminal connected"} />
              <DisplayRow icon={<MapPin size={16} />} label="Physical Deployment" value={authUser?.address || "Remote coordinates"} />
            </div>
          </div>

          {/* Secure Verified Badge */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
              Operational Status: <span className="text-emerald-400">Online & Encrypted</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-600">
              ID: {authUser?.id || "N/A"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

{/* Beautiful Information Card Module */}
function DisplayRow({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-2xl border border-slate-800/50 bg-[#041032]/30 hover:bg-[#041032]/80 hover:border-slate-700/60 transition-all duration-300 group/row">
      <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] tracking-widest uppercase">
        <span className="text-blue-500 transition-transform duration-300 group-hover/row:scale-110">
          {icon}
        </span>
        {label}
      </div>
      <span className="text-sm font-extrabold text-white mt-1 truncate block" title={value}>
        {value || "Unknown"}
      </span>
    </div>
  );
}