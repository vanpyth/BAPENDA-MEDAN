"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShieldCheck, Target, Users, Landmark, ArrowRight, Star, Activity } from "lucide-react";
import { MapVisualization } from "./MapVisualization";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface GISStats {
  total: number;
  compliant: number;
  nonCompliant: number;
  ratio: number;
}

export function GISPreview() {
  const [stats, setStats] = useState<GISStats | null>(null);

  useEffect(() => {
    fetch("/api/gis/stats")
      .then(res => res.json())
      .then(json => {
        if (json.success) setStats(json.data);
      })
      .catch(err => console.error("Stats fetch failed", err));
  }, []);

  return (
    <div className="space-y-16 pb-20 selection:bg-primary/10">
      {/* ── Geospasial Command Center ── */}
      <div className="px-4 text-left space-y-6">
         <div className="flex items-center gap-4 text-primary">
            <div className="w-12 h-1 bg-primary rounded-full shadow-glow" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic leading-none">Geospatial Intelligence</p>
         </div>
         <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">Monitoring <br /><span className="text-primary italic">Fiskal Terpadu.</span></h2>
         <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic border-l-4 border-primary/10 pl-10 ml-2">
            &quot;Visualisasi distribusi objek pajak dan tingkat kepatuhan warga Kota Medan dalam satu dashboard geospasial real-time.&quot;
         </p>
      </div>

      {/* Interactive Map Component */}
      <MapVisualization />

      {/* ── Insight Ledger Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-4 pt-10">
        <StatCard 
          icon={<Landmark className="w-7 h-7" />}
          label="Objek Fiskal Terdaftar"
          value={stats ? `${stats.total.toLocaleString()}` : "..."}
          subtext="Sinkronisasi GIS Node"
          color="blue"
        />
        <StatCard 
          icon={<ShieldCheck className="w-7 h-7" />}
          label="Tingkat Kepatuhan"
          value={stats ? `${stats.ratio.toFixed(1)}%` : "..."}
          subtext="Rasio Pembayaran Tepat Waktu"
          color="green"
        />
        <StatCard 
          icon={<Target className="w-7 h-7" />}
          label="Zona Monitoring"
          value="21"
          subtext="Kecamatan Kota Medan"
          color="purple"
        />
        <StatCard 
          icon={<Activity className="w-7 h-7" />}
          label="Sinkronisasi Data"
          value="LIVE"
          subtext="Pembaruan Log Otomatis"
          color="amber"
          animate
        />
      </div>

      {/* ── Technical Alert Footer ── */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[4rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 mx-4 group hover:bg-white transition-all duration-1000 shadow-inner">
         <div className="space-y-4 text-left relative z-10 flex-1">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:rotate-12 transition-transform">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none italic">Integritas <span className="text-primary italic">Geospasial.</span></h4>
            </div>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed italic border-l-4 border-zinc-200 pl-10 ml-2">
               &quot;Data yang tertayang merupakan representasi visual dari integritas fiskal daerah berdasarkan transaksi ledger yang tercatat secara atomik di sistem perbankan partner.&quot;
            </p>
         </div>
         <Button size="xl" className="rounded-full px-12 h-20 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all group btn-premium italic">
            Dashboard GIS Pro <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-3 transition-transform" />
         </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color, animate }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subtext: string;
  color: "blue" | "green" | "purple" | "amber";
  animate?: boolean;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5",
    purple: "bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/5",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5",
  };

  return (
    <div className="p-10 bg-white border border-zinc-100 rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-700 group text-left relative overflow-hidden">
       <div className={cn("absolute inset-0 opacity-[0.03] pointer-events-none -z-0", colors[color].split(" ")[0])} />
       <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:rotate-12 shadow-inner border relative z-10", colors[color])}>
          {icon}
       </div>
       <div className="space-y-4 relative z-10">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">{label}</p>
          <div className="flex items-center gap-4">
            <h3 className={cn("text-4xl font-black italic tracking-tighter uppercase leading-none", animate && "animate-pulse")}>{value}</h3>
            {animate && <div className="w-3 h-3 rounded-full bg-primary animate-ping" />}
          </div>
          <p className="text-xs font-bold text-muted-foreground pt-4 border-t border-zinc-50 italic opacity-60 leading-none">{subtext}</p>
       </div>
    </div>
  );
}
