"use client";

import * as React from "react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import {
   GraduationCap,
   ShieldCheck,
   FileText,
   PlayCircle,
   Star,
   ArrowRight,
   Megaphone,
   Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ResearchApplication {
   id: string;
   title: string;
   status: string;
   createdAt: string;
   institution: string;
}

interface Announcement {
   id: string;
   title: string;
   content: string;
   category: string;
   createdAt: string;
   isActive: boolean;
}

export const MahasiswaDashboard = ({ session }: { session: Session }) => {
   const [applications, setApplications] = useState<ResearchApplication[]>([]);
   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [rRes, aRes] = await Promise.all([
               fetch("/api/research"),
               fetch("/api/announcements")
            ]);
            const rData = await rRes.json();
            const aData = await aRes.json();
            setApplications(rData.requests || []);
            setAnnouncements((aData as Announcement[]).filter((n) => n.isActive).slice(0, 3) || []);
         } catch (e) {
            console.error("Dashboard fetch error", e);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   const statusMap: Record<string, { label: string; color: string }> = {
      PENDING: { label: "Menunggu", color: "bg-amber-50 text-amber-600 border-amber-100" },
      APPROVED: { label: "Disetujui", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      REJECTED: { label: "Ditolak", color: "bg-red-50 text-red-600 border-red-100" },
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

         {/* ── Student Command Header ── */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-primary">
                  <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Academic Research Portal</p>
               </div>
               <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
                  Halo, <span className="text-primary italic">{session.user?.name?.split(" ")[0]}!</span>
               </h1>
               <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
                  &quot;Pusat layanan riset dan magang untuk pengembangan kompetensi akademik di Bapenda Medan.&quot;
               </p>
            </div>
            <Link href="/dashboard/mahasiswa/pengajuan">
               <Button size="xl" className="rounded-full px-10 h-20 btn-premium group font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30">
                  <PlayCircle className="w-6 h-6 mr-3" /> Mulai Pengajuan Baru
               </Button>
            </Link>
         </div>

         {/* ── Progress Ledger Grid ── */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[3.5rem] p-10 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative shadow-xl shadow-primary/5 min-h-[240px] text-left">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <GraduationCap className="w-40 h-40 text-primary" />
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-3 px-6 py-2 bg-zinc-50 rounded-full border border-zinc-100 w-fit">
                     <Star className="w-3 h-3 text-primary animate-pulse" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Status Akademis</p>
                  </div>
                  <div className="flex items-center gap-6 group/item">
                     <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner group-hover/item:rotate-12 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-3xl font-black italic tracking-tighter text-foreground uppercase italic leading-none">Terverifikasi</p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60">Verified Gateway Student</p>
                     </div>
                  </div>
               </div>
            </Card>

            <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[3.5rem] p-10 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative shadow-xl shadow-primary/5 min-h-[240px] text-left text-left">
               <div className="space-y-10 relative z-10">
                  <div className="flex items-center gap-3 px-6 py-2 bg-zinc-50 rounded-full border border-zinc-100 w-fit">
                     <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Pengajuan</p>
                  </div>
                  <div className="flex items-baseline gap-4">
                     <p className="text-7xl font-black italic tracking-tighter text-foreground underline decoration-primary/10 decoration-8 underline-offset-4">{applications.length}</p>
                     <p className="text-xl font-black italic tracking-tighter text-zinc-300 uppercase italic leading-none">Proyek Riset</p>
                  </div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none pl-2 border-l-2 border-zinc-50 opacity-60">Research & Data Analytics Track</p>
               </div>
            </Card>

            {/* Latest Announcement Mini Card */}
            <Card padding="none" variant="elevated" className="bg-primary text-white border-zinc-100 rounded-[3.5rem] p-10 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative shadow-xl shadow-primary/5 min-h-[240px] text-left">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Megaphone className="w-40 h-40" />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/20 w-fit">
                     <Megaphone className="w-3 h-3" />
                     <p className="text-[10px] font-black uppercase tracking-widest leading-none">Info Terkini</p>
                  </div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase italic line-clamp-2 leading-tight">
                     {announcements[0]?.title ?? "SIPADA Academic Terminal."}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-60 leading-none">Published: {announcements[0] ? new Date(announcements[0].createdAt).toLocaleDateString() : "Just Now"}</p>
               </div>
            </Card>
         </div>

         {/* ── Status Registry ── */}
         <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 group">
               <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] overflow-hidden shadow-2xl shadow-primary/5 p-12 md:p-20 relative min-h-[500px]">
                  <div className="flex items-center justify-between mb-16 border-b border-zinc-50 pb-8 text-left">
                     <div className="space-y-3">
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Status <span className="text-primary">Riset Saya.</span></h2>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Application Lifecycle Monitoring</p>
                     </div>
                     <Link href="/dashboard/mahasiswa/pengajuan">
                        <Button variant="ghost" className="gap-3 font-black uppercase text-[10px] tracking-widest border-b-2 border-zinc-100 hover:border-primary h-14 px-8 transition-all">Riwayat Lengkap <ArrowRight className="w-4 h-4" /></Button>
                     </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-8 text-left">
                     {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="relative pl-14 pb-8 border-b border-zinc-50 last:border-0 last:pb-0 group/row">
                           <div className="absolute left-0 top-1 w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover/row:rotate-12 transition-transform">
                              <FileText className="w-6 h-6" />
                           </div>
                           <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                 <span className={cn("px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border italic leading-none", statusMap[app.status]?.color ?? "bg-zinc-50 text-zinc-400 border-zinc-100")}>
                                    {statusMap[app.status]?.label ?? app.status}
                                 </span>
                                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">{app.institution}</span>
                              </div>
                              <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover/row:text-primary transition-colors italic leading-tight">{app.title}</h3>
                           </div>
                        </div>
                     ))}
                     {applications.length === 0 && (
                        <div className="py-20 text-center text-zinc-300 italic uppercase font-black tracking-widest">Belum Ada Pengajuan Riset Terdaftar.</div>
                     )}
                  </div>
               </Card>
            </div>
         </section>
      </div>
   );
};
