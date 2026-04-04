"use client";

import { useEffect } from "react";
import { 
  ShieldAlert, 
  RotateCcw, 
  ChevronRight, 
  AlertCircle, 
  MailWarning,
  ServerCrash
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in scale-in-95 duration-[800ms] relative overflow-hidden selection:bg-red-500/10">
      
      {/* ── High-Fidelity Background Effects ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px] animate-pulse-slow -z-10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] -z-20" />
      
      {/* Micro-Interaction Grid Overlay */}
      <div className="absolute inset-0 bg-grid-red-500/[0.01] -z-10" />

      <div className="max-w-2xl space-y-12 relative z-10">
        
        {/* ── Visual Crash Anchor ── */}
        <div className="relative group perspective-1000">
           <div className="w-40 h-40 bg-white border border-red-100 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-red-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000 relative">
              <div className="absolute inset-0 bg-red-50 rounded-[3.5rem] animate-pulse" />
              <ShieldAlert className="w-20 h-20 text-red-500 relative z-10 animate-bounce" />
           </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-50 border border-red-100 rounded-full text-red-600 uppercase tracking-widest text-[10px] font-black italic shadow-inner">
             <ServerCrash className="w-3.5 h-3.5" /> Logical Fault Detected
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-red-600 uppercase italic">
            Sistem <br /><span className="text-foreground italic decoration-red-500/20 underline underline-offset-8 decoration-8">Mengalami Gagal.</span>
          </h1>
          <p className="text-2xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed italic border-l-4 border-red-100 pl-10 ml-2">
            &quot;Terjadi kesalahan yang tidak terduga dalam mesin internal kami. Tim teknis Bapenda telah menerima paket log ini untuk diidentifikasi.&quot;
          </p>
        </div>

        {/* ── Technical Insight Canvas ── */}
        <div className="bg-white border border-red-100 p-10 lg:p-14 rounded-[4rem] text-left space-y-8 font-bold shadow-2xl shadow-red-500/5 relative group overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <AlertCircle className="w-32 h-32 text-red-600" />
           </div>
           
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-300 italic mb-4">Error Log Protocol</p>
              <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-100 w-fit px-6 py-2 rounded-2xl shadow-inner">
                 <code className="text-base font-black font-mono text-zinc-900 select-all uppercase tracking-tighter">ID: ERR-BPN-X293-{error.digest?.slice(-4).toUpperCase() ?? "SYSTEM"}</code>
              </div>
           </div>
           
           <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">Deskripsi Teknis Kesalahan</p>
              <div className="bg-red-50/50 border-l-4 border-red-200 p-6 rounded-2xl">
                 <p className="text-base text-red-800 font-bold italic leading-relaxed">&quot;{error.message || "Internal system engine failure during operation."}&quot;</p>
              </div>
           </div>
        </div>

        {/* ── Unified Recovery Center ── */}
        <div className="flex flex-col items-center justify-center gap-8 pt-6">
          <Button
            onClick={() => reset()}
            size="xl"
            className="w-full md:w-auto px-16 h-20 bg-red-600 text-white font-black rounded-full hover:bg-red-700 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] group"
          >
            <RotateCcw className="w-6 h-6 mr-4 group-hover:rotate-180 transition-transform duration-1000" /> Sinkronisasi Ulang & Coba Lagi
          </Button>
          
          <div className="flex items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-700">
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-primary transition-all flex items-center gap-3 group italic">
              Kembali ke Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
            </Link>
            <div className="h-4 w-[2px] bg-zinc-100 rounded-full" />
            <Link href="/kontak" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-red-500 transition-all flex items-center gap-3 group italic">
              Laporkan Bug Teknis <MailWarning className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Status Ledger ── */}
        <div className="pt-20 flex items-center justify-center gap-4 group cursor-wait opacity-40">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 italic">Auto-Monitoring Node Active</span>
        </div>
      </div>
    </div>
  );
}
