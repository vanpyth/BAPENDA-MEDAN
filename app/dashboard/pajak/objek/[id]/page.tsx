"use client";

import { useEffect, useState } from "react";
import { 
  Building2, MapPin, 
  ChevronLeft, BadgeCheck, Clock, 
  Map as MapIcon, Info,
  Layers, Ruler, DollarSign,
  TrendingUp, Zap,
  QrCode, Printer
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface TaxObjectDetail {
  id: string;
  nop: string;
  type: string;
  name: string;
  address: string;
  luasTanah: number;
  luasBangun: number;
  njop: number;
  njoptkp: number;
  status: string;
  payments: {
     id: string;
     invoiceNumber: string;
     taxPeriod: string;
     amount: number;
     status: string;
     paidAt?: string;
  }[];
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}

export default function TaxObjectDetailPage() {
  const params = useParams();
  const [data, setData] = useState<TaxObjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tax/objects/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-[70vh] w-full rounded-[4rem]" />
    </div>
  );
  
  if (!data) return (
    <div className="p-24 text-center">
       <Info className="w-20 h-20 mx-auto text-zinc-200 mb-6" />
       <p className="text-2xl font-black italic tracking-tighter uppercase italic text-zinc-400">Berkas Tidak Ditemukan.</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 selection:bg-primary/20">
      
      {/* ── Breadcrumb & Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
         <div className="flex items-center gap-6 group">
            <Link href="/dashboard/pajak/objek">
               <Button variant="outline" size="sm" className="rounded-2xl w-16 h-16 p-0 border-zinc-100 bg-white hover:bg-zinc-50 group-hover:border-primary/20 transition-all shadow-sm">
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
               </Button>
            </Link>
            <div className="flex flex-col text-left">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Dashboard <span className="text-zinc-200 text-xs">/</span> Objek Pajak
               </div>
               <span className="font-black text-xl text-primary italic uppercase tracking-tighter mt-1">{data.nop}</span>
            </div>
         </div>

         <div className="flex items-center gap-4 flex-wrap justify-start md:justify-end">
            <Button variant="outline" className="rounded-full gap-3 font-black uppercase text-[10px] tracking-widest h-14 px-8 border-zinc-100 bg-white hover:bg-zinc-50 transition-all shadow-sm"><Printer className="w-4 h-4" /> Cetak Salinan</Button>
            <Link href="/dashboard/pajak/tagihan">
               <Button variant="primary" className="btn-premium rounded-full gap-4 font-black uppercase text-xs tracking-widest h-16 px-10 shadow-2xl shadow-primary/30"><Zap className="w-5 h-5" /> Bayar Kewajiban</Button>
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* ── Left Content (8 Cols) ── */}
         <div className="lg:col-span-8 space-y-12">
            {/* Asset Identity Card */}
            <Card padding="none" variant="elevated" className="relative group overflow-hidden border-zinc-100 shadow-2xl shadow-primary/5 bg-white rounded-[5rem]">
               <div className="absolute top-0 right-0 p-24 opacity-5 group-hover:rotate-12 transition-transform duration-1000 -z-0">
                  <QrCode className="w-72 h-72" />
               </div>
               
               <div className="p-14 md:p-20 space-y-14 relative z-10 text-left">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                     <div className="space-y-8">
                        <div className="flex items-center gap-4">
                           <span className="px-6 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10 italic">{data.type}</span>
                           <span className={cn(
                              "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border italic",
                              data.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                           )}>
                              {data.status === "VERIFIED" ? "Verified Official" : "Audit Pending"}
                           </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-foreground uppercase italic">{data.name}</h1>
                        <div className="flex items-center gap-4 text-3xl font-black text-primary p-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] w-fit shadow-inner italic">
                           <Layers className="w-8 h-8" /> {data.nop}
                        </div>
                     </div>
                     <div className="w-32 h-32 bg-white rounded-[4rem] flex items-center justify-center shrink-0 shadow-2xl border border-zinc-100 rotate-3 group-hover:rotate-0 transition-transform duration-1000">
                        <Building2 className="w-16 h-16 text-primary" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 pt-14 border-t border-zinc-50">
                     <QuickDetail icon={<Ruler className="w-5 h-5" />} label="Luas Tanah" value={`${data.luasTanah} m²`} />
                     <QuickDetail icon={<Building2 className="w-5 h-5" />} label="Luas Bangun" value={`${data.luasBangun} m²`} />
                     <QuickDetail icon={<DollarSign className="w-5 h-5" />} label="NJOP / m²" value={formatCurrency(Number(data.njop) / data.luasTanah)} />
                     <QuickDetail icon={<TrendingUp className="w-5 h-5" />} label="Total NJOP" value={formatCurrency(Number(data.njop))} />
                  </div>
               </div>
            </Card>

            {/* Geographical Map Deck - Light Themed */}
            <Card padding="none" variant="elevated" className="h-[520px] relative group overflow-hidden border-zinc-100 rounded-[5rem] shadow-2xl shadow-primary/5 bg-zinc-50 border-b-8 border-primary/20">
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 group-hover:scale-105 transition-all duration-1000">
                  <div className="p-12 bg-white rounded-[4.5rem] shadow-2xl border border-zinc-100 group-hover:rotate-12 transition-transform">
                     <MapIcon className="w-24 h-24 text-primary animate-pulse" />
                  </div>
                  <div className="text-center space-y-4">
                     <h4 className="text-3xl font-black italic tracking-tighter uppercase italic">Spatial Visualization Hub.</h4>
                     <p className="text-zinc-400 font-black text-[10px] tracking-[0.4em] uppercase italic opacity-60">Memetakan rincian persil secara komprehensif...</p>
                  </div>
               </div>
               
               <div className="absolute bottom-12 right-12 z-10 flex gap-4">
                  <Button variant="outline" className="rounded-full gap-4 shadow-xl h-16 px-10 border-zinc-100 bg-white font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"><MapPin className="w-5 h-5 text-primary" /> Orientasi Lokasi</Button>
                  <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white border-zinc-100 shadow-xl hover:bg-primary hover:text-white transition-all"><Layers className="w-6 h-6" /></Button>
               </div>
            </Card>
         </div>

         {/* ── Right Content (4 Cols) ── */}
         <div className="lg:col-span-4 space-y-12">
            {/* Context Information Widget */}
            <Card padding="none" variant="elevated" className="bg-white border-zinc-100 relative overflow-hidden group shadow-2xl shadow-primary/5 min-h-[400px] rounded-[4rem] p-12">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent opacity-20" />
               <h3 className="text-2xl font-black italic tracking-tighter mb-12 flex items-center gap-4 relative z-10 uppercase italic text-foreground text-left">
                  Identitas Persil.
               </h3>
               <div className="space-y-10 relative z-10 text-left">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] flex items-center gap-3 italic">
                        <MapPin className="w-4 h-4" /> Alamat Lokasi Aset
                     </p>
                     <p className="font-black text-2xl leading-relaxed text-foreground italic border-l-4 border-zinc-50 pl-8">{data.address}</p>
                  </div>
                  <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex flex-col gap-4 shadow-inner">
                     <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest italic leading-none">
                        <Info className="w-6 h-6" /> Fiscal Health Check
                     </div>
                     <p className="text-xs font-medium text-muted-foreground leading-relaxed italic border-l-4 border-primary/10 pl-6">
                        &quot;Kewajiban fiskal terdeteksi sehat. Seluruh perolehan NJOP dan sinkronisasi pembayaran tahun jamak telah terverifikasi oleh server SIPADA Medan.&quot;
                     </p>
                  </div>
               </div>
            </Card>

            {/* Archive Transaction Timeline */}
            <Card padding="none" variant="elevated" className="border-zinc-100 bg-white shadow-2xl shadow-primary/5 rounded-[4rem] p-12">
               <div className="flex items-center justify-between mb-12 text-left">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase italic">Ledger Riwayat.</h3>
                  <span className="text-[10px] font-black uppercase bg-zinc-50 px-5 py-2 rounded-full border border-zinc-100 tracking-widest italic">{data.payments.length} Cycle</span>
               </div>
               
               <div className="space-y-12 relative text-left">
                  <div className="absolute left-[19px] top-4 bottom-14 w-[2px] bg-zinc-50 z-0" />
                  {data.payments.length === 0 ? (
                     <p className="text-xs text-zinc-400 italic">Belum ada riwayat transaksi.</p>
                  ) : data.payments.map((p) => (
                     <div key={p.id} className="flex gap-10 relative z-10 group/item">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 shadow-lg group-hover/item:bg-primary group-hover/item:text-white group-hover/item:rotate-12 transition-all transition-all duration-500">
                           {p.status === "PAID" ? <BadgeCheck className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center justify-between gap-4">
                              <p className="text-md font-black tracking-tighter uppercase italic">Siklus {p.taxPeriod}</p>
                              <span className="text-md font-black text-primary italic tracking-tight">{formatCurrency(p.amount)}</span>
                           </div>
                           <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">
                              {p.status === "PAID" && p.paidAt 
                                 ? `Tervalidasi: ${new Date(p.paidAt).toLocaleDateString("id-ID")}` 
                                 : "Status: Menunggu Pembayaran"}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="pt-12">
                  <Link href="/dashboard/pajak/riwayat">
                     <Button variant="outline" className="w-full rounded-[2rem] border-zinc-100 font-black text-[10px] uppercase tracking-[0.2em] h-16 bg-zinc-50 hover:bg-white hover:border-primary/20 transition-all shadow-sm">Buka Monitor Arsip</Button>
                  </Link>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function QuickDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-4 group/item text-left">
      <div className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] group-hover/item:text-primary transition-colors italic leading-none">
         {icon} {label}
      </div>
      <p className="text-2xl font-black italic tracking-tighter text-foreground italic leading-none truncate">{value}</p>
    </div>
  );
}
