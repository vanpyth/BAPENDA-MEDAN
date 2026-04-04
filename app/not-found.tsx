"use client";

import Link from "next/link";
import { ArrowLeft, Search, HelpCircle, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-[1500ms] relative overflow-hidden selection:bg-primary/20">
      
      {/* ── Premium High-Fidelity Background Effects ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] animate-pulse-slow -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px] animate-float -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-20" />
      
      {/* Micro-Interaction Grid Overlay */}
      <div className="absolute inset-0 bg-grid-zinc-950/[0.02] -z-10" />

      <div className="space-y-12 max-w-4xl relative z-10">
        
        {/* ── Visual 404 Anchor ── */}
        <div className="relative group perspective-1000">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-[150px] h-32 scale-150 animate-pulse" />
          <h1 className="text-[15rem] md:text-[22rem] font-black tracking-tighter leading-none text-zinc-900 relative transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1 italic">
            404
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
               <span className="text-primary text-[8rem] md:text-[14rem] animate-float drop-shadow-[0_0_50px_rgba(37,99,235,0.3)] italic group-hover:scale-110 transition-transform font-black">?</span>
            </div>
          </h1>
          {/* Decorative Glitch lines */}
          <div className="absolute top-[45%] left-0 w-full h-[1px] bg-primary/10 -rotate-1 animate-pulse" />
          <div className="absolute top-[55%] left-0 w-full h-[2px] bg-primary/5 rotate-2 animate-pulse" />
        </div>

        {/* ── Contextual Messaging ── */}
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-400 uppercase tracking-widest text-[10px] font-black italic shadow-inner">
             <AlertCircle className="w-3.5 h-3.5" /> Out of Range Logic
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-foreground leading-[0.9] uppercase italic">
            Halaman <span className="text-primary italic underline decoration-primary/10 decoration-8 underline-offset-8">Tersesat.</span>
          </h2>
          <p className="text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed italic border-l-4 border-primary/10 pl-10 ml-2">
            &quot;Sepertinya Anda berada di luar cakupan protokol penjemputan data. Halaman yang Anda cari sedang dalam peninjauan internal atau telah dinonaktifkan.&quot;
          </p>
        </div>

        {/* ── Unified Action Center ── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10">
          <Link href="/dashboard" className="w-full md:w-auto">
            <Button size="xl" className="w-full md:w-auto rounded-full px-16 h-20 btn-premium group font-bold font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/40 text-white italic">
               <ArrowLeft className="w-6 h-6 mr-4 group-hover:-translate-x-3 transition-transform" /> Kembali Ke Pusat Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full md:w-auto">
             <Button variant="outline" size="xl" className="w-full md:w-auto rounded-full px-16 h-20 bg-zinc-50 border-zinc-100 font-bold font-black uppercase text-xs tracking-widest hover:bg-white hover:border-primary/20 transition-all shadow-xl shadow-primary/5 italic text-zinc-600">
                <HelpCircle className="w-6 h-6 mr-4" /> Hubungi Command Center
             </Button>
          </Link>
        </div>

        {/* ── Search Suggestion Logic ── */}
        <div className="pt-24 space-y-8">
           <div className="flex items-center justify-center gap-4 text-zinc-300">
              <div className="h-[1px] w-20 bg-zinc-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Atau Lakukan Pencarian</p>
              <div className="h-[1px] w-20 bg-zinc-100" />
           </div>
           
           <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] group-focus-within:bg-primary/10 transition-colors -z-10 blur-xl opacity-0 group-focus-within:opacity-100" />
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-300 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Cari modul fiskal yang Anda butuhkan..." 
                className="w-full pl-24 pr-10 h-24 bg-zinc-50 border border-zinc-100 rounded-[5rem] outline-none shadow-inner focus:bg-white focus:border-primary/20 transition-all font-black text-xl tracking-tight italic"
              />
              <button className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:rotate-6 active:scale-90">
                 <Sparkles className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* ── System Footer ── */}
        <div className="pt-32 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
           <div className="flex items-center justify-center gap-12 font-black italic uppercase tracking-[0.3em] text-[10px] text-zinc-400">
              <div className="flex items-center gap-3 decoration-primary/20 underline underline-offset-4">
                 <ShieldAlert className="w-5 h-5 text-primary" />
                 <span>SIPADA Node SEC-V3</span>
              </div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="hover:text-primary transition-colors">Medan Bapenda Portal</div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div>Trace: 404-NP-MEDAN</div>
           </div>
        </div>
      </div>
    </div>
  );
}
