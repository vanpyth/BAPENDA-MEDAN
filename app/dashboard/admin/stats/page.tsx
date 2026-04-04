"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, CreditCard, Download, Star, ShieldCheck, Activity, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Stats {
  stats: {
    userCount: number;
    pendingCount: number;
    paidCount: number;
    totalRevenue: number;
  };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MOCK_MONTHLY = [1200000000, 1450000000, 980000000, 1750000000, 2100000000, 1890000000, 2340000000, 1980000000, 2560000000, 2870000000, 3100000000, 2750000000];
const MAX_VAL = Math.max(...MOCK_MONTHLY);

export default function AdminStatsPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    {
      label: "Wajib Pajak Aktif",
      value: data?.stats.userCount.toLocaleString("id-ID") ?? "—",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/5",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      label: "Akumulasi PAD 2026",
      value: formatCurrency(data?.stats.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "text-primary bg-primary/5 border-primary/10 shadow-primary-500/5",
      trend: "+8.3%",
      trendUp: true,
    },
    {
      label: "Transaksi Lunas",
      value: data?.stats.paidCount.toLocaleString("id-ID") ?? "—",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
      trend: "+21.4%",
      trendUp: true,
    },
    {
      label: "Audit Tunda",
      value: data?.stats.pendingCount.toLocaleString("id-ID") ?? "—",
      icon: BarChart3,
      color: "text-amber-600 bg-amber-50 border-amber-100 shadow-amber-500/5",
      trend: "-3.2%",
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 px-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
             <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Fiscal Intelligence Analytics</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
            Performansi <span className="text-primary italic">Keuangan.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
            &quot;Monitoring real-time Pendapatan Asli Daerah (PAD) dan efektivitas pemungutan pajak melalui integrasi ledger terpusat.&quot;
          </p>
        </div>
        <Button
          size="xl"
          className="rounded-full px-10 h-20 btn-premium group font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 italic"
        >
          <Download className="w-6 h-6 mr-3 group-hover:-translate-y-2 transition-transform" /> Ekspor Audit Report
        </Button>
      </div>

      {/* ── KPI Ledger Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
        {kpiCards.map((card, i) => (
          <Card key={i} padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[3.5rem] p-10 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.05] transition-all group overflow-hidden shadow-xl shadow-primary/5 min-h-[260px] relative">
            <div className={cn("absolute inset-0 opacity-[0.03] -z-0", card.color.split(" ")[1])} />
            {loading ? (
              <div className="space-y-6 animate-pulse relative z-10 text-left">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-inner" />
                <div className="h-10 bg-zinc-50 rounded-xl w-3/4" />
                <div className="h-4 bg-zinc-50 rounded-xl w-1/2" />
              </div>
            ) : (
              <div className="space-y-10 relative z-10 text-left">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border group-hover:rotate-12 transition-transform", card.color)}>
                  <card.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                   <p className="text-3xl font-black italic tracking-tighter text-zinc-900 leading-none uppercase italic">{card.value}</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 opacity-60 leading-none italic">{card.label}</p>
                </div>
                <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic leading-none border shadow-sm", card.trendUp ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100")}>
                  <Activity className={cn("w-3.5 h-3.5", !card.trendUp && "rotate-180")} />
                  {card.trend} <span className="opacity-40 ml-1 italic">Growth Rate</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ── Revenue Trajectory Canvas ── */}
      <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] p-12 lg:p-20 shadow-2xl shadow-primary/5 relative overflow-hidden group text-left">
         <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none -z-0">
            <TrendingUp className="w-96 h-96 text-primary group-hover:scale-110 transition-transform duration-[2000ms]" />
         </div>
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8 relative z-10">
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-primary">
                <div className="w-8 h-1 bg-primary rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Flow Ledger Monitoring</p>
             </div>
             <h2 className="text-4xl font-black italic tracking-tighter uppercase italic leading-none">Grafik Pendapatan <br /><span className="text-primary italic">PAD Bulanan 2026.</span></h2>
          </div>
          <div className="flex gap-4 bg-zinc-50 p-2 rounded-[2rem] border border-zinc-100 shadow-inner">
            {["2024", "2025", "2026"].map((y) => (
              <button
                key={y}
                className={cn(
                   "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                   y === "2026" ? "bg-white text-primary shadow-xl border border-primary/10" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                {y} Fiscal
              </button>
            ))}
          </div>
        </div>

        {/* ── High-Fidelity Bar Chart ── */}
        <div className="flex items-end gap-5 h-72 relative z-10 px-4">
          {MOCK_MONTHLY.map((val, i) => {
            const heightPct = (val / MAX_VAL) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar">
                <div
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-[1.5rem] relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:scale-x-110 cursor-pointer shadow-inner"
                  style={{ height: `${heightPct}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary opacity-20 transition-all duration-1000 group-hover/bar:opacity-40"
                    style={{ height: "100%" }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-zinc-100 text-zinc-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-500 whitespace-nowrap shadow-2xl pointer-events-none group-hover/bar:-translate-y-12">
                    {(val / 1_000_000_000).toFixed(2)}M
                  </div>
                </div>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest group-hover/bar:text-primary transition-colors italic">{MONTHS[i]}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Granular Distribution Mapping ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[4rem] p-12 lg:p-16 shadow-2xl shadow-primary/5 text-left group">
          <div className="flex items-center justify-between mb-12">
             <div className="space-y-1">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Distribusi <br /><span className="text-primary italic">Sektor Pajak.</span></h3>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60 mt-4 leading-none decoration-zinc-100 underline underline-offset-4">Segmentation Analytics</p>
             </div>
             <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-inner group-hover:rotate-12 transition-transform">
                <Star className="w-6 h-6 text-primary" />
             </div>
          </div>
          <div className="space-y-10">
            {[
              { name: "Pajak Bumi & Bangunan (PBB)", pct: 42, color: "bg-primary" },
              { name: "Bea Perolehan Hak Tanah (BPHTB)", pct: 28, color: "bg-blue-400" },
              { name: "Pajak Hotel & Restoran", pct: 15, color: "bg-emerald-400" },
              { name: "Pajak Reklame & Media", pct: 9, color: "bg-amber-400" },
              { name: "Sektor Fiskal Lainnya", pct: 6, color: "bg-purple-400" },
            ].map((t, idx) => (
              <div key={idx} className="space-y-4 group/row">
                <div className="flex justify-between items-baseline px-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover/row:text-foreground transition-colors italic">{t.name}</span>
                  <span className="font-black italic text-xl tracking-tighter text-primary">{t.pct}%</span>
                </div>
                <div className="h-5 bg-zinc-50 rounded-full border border-zinc-100 p-1 shadow-inner overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-[1.5s] ease-out shadow-glow group-hover/row:scale-y-110", t.color)} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[4rem] p-12 lg:p-16 shadow-2xl shadow-primary/5 text-left group">
           <div className="flex items-center justify-between mb-12">
             <div className="space-y-1">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Peringkat <br /><span className="text-primary italic">Internal PAD.</span></h3>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60 mt-4 leading-none decoration-zinc-100 underline underline-offset-4">Top 5 Regional Productivity</p>
             </div>
             <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-inner group-hover:rotate-12 transition-transform">
                <Activity className="w-6 h-6 text-primary" />
             </div>
          </div>
          <div className="space-y-8">
            {[
              { name: "Medan Baru", val: "Rp 45.2M", pct: 85 },
              { name: "Medan Petisah", val: "Rp 38.7M", pct: 72 },
              { name: "Medan Sunggal", val: "Rp 31.5M", pct: 58 },
              { name: "Medan Polonia", val: "Rp 28.9M", pct: 53 },
              { name: "Medan Helvetia", val: "Rp 22.1M", pct: 40 },
            ].map((k, i) => (
              <div key={i} className="flex items-center gap-8 p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:scale-[1.02] transition-all group/item shadow-inner">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black italic text-zinc-300 group-hover/item:text-primary transition-all border border-zinc-100 shadow-sm relative group-hover/item:rotate-6">
                   <span className="text-lg">#{i + 1}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-black italic text-lg uppercase tracking-tight text-foreground transition-all">{k.name}</span>
                    <span className="text-primary font-black italic text-xl tracking-tighter">{k.val}</span>
                  </div>
                  <div className="h-2 bg-zinc-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full group-hover/item:shadow-glow transition-all duration-[2s]" style={{ width: `${k.pct}%` }} />
                  </div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-zinc-300 opacity-0 group-hover/item:opacity-100 group-hover/item:text-primary transition-all" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── System Audit Integrity Ledger ── */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[5rem] p-12 lg:p-24 mt-20 relative overflow-hidden group shadow-inner">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
         <div className="flex flex-col md:flex-row items-center gap-20 relative z-10">
            <div className="flex-1 space-y-10">
               <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-[0.85] uppercase italic text-foreground inline-block relative underline decoration-primary/10 decoration-8 underline-offset-8">
                 Integritas <br /><span className="text-primary italic">Sistem Audit.</span>
               </h3>
               <p className="text-xl text-muted-foreground font-medium max-w-xl italic leading-relaxed border-l-4 border-primary/20 pl-10 ml-2">
                  &quot;Log aktivitas finansial dan audit geospasial dipantau secara ketat untuk menjamin transparansi anggaran daerah Pemerintah Kota Medan.&quot;
               </p>
               <Button variant="ghost" className="rounded-full px-10 h-16 gap-3 font-black uppercase text-[10px] tracking-[0.3em] border-b-2 border-zinc-200 hover:border-primary transition-all italic">Pusat Kebijakan Fiskal Digital <ArrowUpRight className="w-5 h-5" /></Button>
            </div>
            <div className="hidden lg:flex justify-center shrink-0">
               <div className="w-72 h-72 bg-white rounded-[4rem] border border-zinc-100 flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-1000 relative">
                  <ShieldCheck className="w-40 h-40 text-primary opacity-20" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
