"use client";

import * as React from "react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Calculator,
  Megaphone,
  Bell,
  Loader2,
  Clock,
  History
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Asset {
  id: string;
  name: string;
  nop: string;
  address: string;
  status: string;
  payments: any[];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isActive: boolean;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  taxObject: { name: string; nop: string };
  createdAt: string;
}

export const UserDashboard = ({ session }: { session: Session }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, nRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/announcements")
        ]);
        const dData = await dRes.json();
        const nData = await nRes.json();
        
        setAssets(dData.taxObjects || []);
        setPayments(dData.payments || []);
        setAnnouncements((nData as Announcement[]).filter((n) => n.isActive).slice(0, 3) || []);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPending = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
       <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
       </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── User Welcome Hub ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 relative bg-white border border-zinc-100 rounded-[5rem] p-12 md:p-20 overflow-hidden group shadow-2xl shadow-primary/5 flex flex-col justify-center min-h-[440px]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 space-y-8 max-w-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner group-hover:rotate-12 transition-transform">
                     <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Official Fiscal Identity</p>
               </div>
               <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none uppercase underline decoration-primary/10 decoration-8 underline-offset-8 text-foreground">
                    Selamat Datang, <br /> 
                    <span className="text-primary italic font-black">{session?.user?.name?.split(" ")[0] ?? "Wajib Pajak"}.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium italic border-l-4 border-primary/20 pl-8 leading-relaxed">
                     &quot;Pantau rincian aset, riwayat transaksi, dan penuhi kewajiban perpajakan Anda dengan presisi melalui portal satu pintu.&quot;
                  </p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <Card padding="lg" variant="elevated" className="bg-primary text-white rounded-[3.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group flex flex-col justify-center min-h-[210px]">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <CreditCard className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-60">Tagihan Aktif</p>
                  <h4 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">{formatCurrency(totalPending)}</h4>
                  <Link href="/dashboard/pajak/tagihan">
                    <Button variant="ghost" className="h-12 rounded-full border border-white/20 hover:bg-white hover:text-primary transition-all font-black uppercase text-[10px] px-8 tracking-widest mt-4">Penuhi Kewajiban</Button>
                  </Link>
               </div>
            </Card>
            <Card padding="lg" className="bg-white border-zinc-100 rounded-[3.5rem] shadow-2xl shadow-primary/[0.03] flex items-center justify-between group hover:border-primary/20 transition-all min-h-[210px]">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">Aset Terdata</p>
                  <h4 className="text-5xl font-black italic tracking-tighter text-foreground italic leading-none">{assets.length} <span className="text-primary font-sans tracking-normal font-black text-xs">NODES</span></h4>
                  <Link href="/dashboard/pajak/objek" className="inline-block text-[10px] font-black text-primary uppercase border-b border-primary/20 hover:border-primary transition-all italic">Kelola Objek Pajak →</Link>
               </div>
               <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:rotate-12 group-hover:text-primary transition-all">
                  <Building2 className="w-8 h-8" />
               </div>
            </Card>
         </div>
      </section>

      {/* ── Transaction Intelligence ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8">
            <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] overflow-hidden shadow-2xl shadow-primary/5 p-12 md:p-20 relative min-h-[500px]">
               <div className="flex items-center justify-between mb-16 border-b border-zinc-50 pb-8">
                  <div className="space-y-3">
                     <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Riwayat <span className="text-primary">Transaksi.</span></h2>
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Immutable Payment Ledger</p>
                  </div>
                  <History className="w-10 h-10 text-primary/20" />
               </div>
               
               <div className="space-y-8">
                  {payments.length === 0 ? (
                    <div className="py-20 text-center opacity-30 italic font-black uppercase tracking-widest text-zinc-300">Belum Ada Catatan Transaksi.</div>
                  ) : payments.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between group/pay hover:bg-zinc-50/50 p-6 rounded-[2.5rem] transition-all border border-transparent hover:border-zinc-50">
                       <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-all",
                            pay.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                             <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic mb-1">{pay.taxObject.name || "Pajak Daerah"}</p>
                             <h4 className="text-lg font-black italic tracking-tighter uppercase leading-none">{formatCurrency(pay.amount)}</h4>
                          </div>
                       </div>
                       <div className="text-right flex flex-col items-end gap-2">
                          <span className={cn(
                            "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            pay.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>{pay.status}</span>
                          <p className="text-[10px] font-black text-zinc-300 uppercase italic opacity-60"><Clock className="w-3 h-3 inline mr-1" /> {new Date(pay.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-10">
            <Card padding="lg" className="bg-zinc-50 border-zinc-100 rounded-[5rem] shadow-inner p-12 space-y-10 group">
               <h3 className="text-xl font-black italic tracking-tighter uppercase italic border-l-4 border-primary pl-6">Quick <br/> Terminal.</h3>
               <div className="grid grid-cols-1 gap-4">
                  <QuickLink href="/dashboard/pajak/hitung" label="Kalkulator Pajak" icon={Calculator} />
                  <QuickLink href="/dashboard/ppid" label="Layanan PPID" icon={Bell} />
                  <QuickLink href="/dashboard/pengaduan" label="E-Pengaduan" icon={Megaphone} />
                  <QuickLink href="/dashboard/pajak/riwayat" label="Arsip Transaksi" icon={Clock} />
               </div>
            </Card>

            <Card padding="lg" variant="elevated" className="bg-white border-zinc-50 rounded-[4rem] p-12 shadow-2xl shadow-primary/5 space-y-8 group">
               <div className="flex items-center gap-4 text-primary">
                  <Megaphone className="w-6 h-6 rotate-[-10deg]" />
                  <h3 className="text-lg font-black italic tracking-tighter uppercase italic">Bulletin.</h3>
               </div>
               <div className="space-y-6">
                  {announcements.length > 0 ? announcements.map(ann => (
                     <div key={ann.id} className="space-y-1 border-l-2 border-zinc-100 pl-4 hover:border-primary transition-colors">
                        <p className="text-[9px] font-black uppercase text-zinc-400 italic">{ann.category}</p>
                        <h5 className="text-sm font-black italic tracking-tight uppercase italic line-clamp-1">{ann.title}</h5>
                     </div>
                  )) : (
                    <p className="text-xs text-zinc-400 italic font-medium">Belum ada pengumuman terbaru.</p>
                  )}
               </div>
            </Card>
         </div>
      </section>
    </div>
  );
};

function QuickLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
   return (
      <Link href={href} className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-[2rem] hover:bg-primary group/link transition-all hover:shadow-2xl hover:shadow-primary/20 shadow-sm">
         <div className="flex items-center gap-4">
            <Icon className="w-5 h-5 text-zinc-400 group-hover/link:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest group-hover/link:text-white transition-colors italic">{label}</span>
         </div>
         <ArrowRight className="w-4 h-4 text-zinc-200 group-hover/link:text-white group-hover/link:translate-x-1 transition-all" />
      </Link>
   );
}
