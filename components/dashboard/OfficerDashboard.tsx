"use client";

import * as React from "react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  ArrowRight,
  Zap,
  FileQuestion,
  Megaphone,
  GraduationCap,
  Building2,
  Loader2,
  Clock,
  History
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardStats {
  ppidCount: number;
  complaintCount: number;
  researchCount: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isActive: boolean;
}

interface Activity {
  id: string;
  action: string;
  table: string;
  createdAt: string;
  user: { name: string };
}

export const OfficerDashboard = ({ session }: { session: Session }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch("/api/admin/dashboard-stats"),
          fetch("/api/announcements")
        ]);
        const sData = await sRes.json();
        const aData = await aRes.json();

        // Safe access with fallback values
        if (sData.stats) {
          setStats({
            ppidCount: Number(sData.stats.pendingPPID || 0),
            complaintCount: Number(sData.stats.pendingComplaints || 0),
            researchCount: Number(sData.stats.pendingResearch || 0),
          });
        }
        
        setActivities(sData.recentActivity || []);
        setAnnouncements(Array.isArray(aData) ? aData.filter((n: Announcement) => n.isActive).slice(0, 3) : []);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
     return (
        <div className="min-h-[60vh] flex items-center justify-center">
           <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
     );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Officer Operational Hub ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 relative bg-white border border-zinc-100 rounded-[5rem] p-12 md:p-24 overflow-hidden group shadow-2xl shadow-primary/5 min-h-[480px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-12 text-left">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner group-hover:rotate-12 transition-transform">
                     <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Petugas Lapangan Terverifikasi</p>
               </div>
               <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">Unit Reaksi <br /> <span className="text-primary italic font-black">Fiskal.</span></h1>
                  <p className="text-xl text-muted-foreground font-medium italic border-l-4 border-primary/20 pl-10 leading-relaxed max-w-2xl">
                     &quot;Halo, {session?.user?.name}. Pantau penugasan lapangan, validasi objek pajak secara real-time, dan optimalkan koordinasi operasional melalui pusat komando digital Bapenda Medan.&quot;
                  </p>
               </div>
               <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/dashboard/admin/payments" className="btn-premium px-12 h-20 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-4 group">
                     Buka Monitoring Kas <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <StatsCard label="Pending Task PPID" value={stats?.ppidCount ?? 0} icon={FileQuestion} color="blue" />
            <StatsCard label="Pending Pengaduan" value={stats?.complaintCount ?? 0} icon={Megaphone} color="amber" />
            <StatsCard label="Awaiting Research" value={stats?.researchCount ?? 0} icon={GraduationCap} color="emerald" />
         </div>
      </section>

      {/* ── Operational Intelligence ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8">
            <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] overflow-hidden shadow-2xl shadow-primary/5 p-12 md:p-20 relative min-h-[500px] text-left">
               <div className="flex items-center justify-between mb-16 border-b border-zinc-50 pb-8">
                  <div className="space-y-3">
                     <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Aktivitas <span className="text-primary">Sistem.</span></h2>
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">Audit Trail Performance Log</p>
                  </div>
                  <History className="w-10 h-10 text-primary/20" />
               </div>
               
               <div className="space-y-8">
                  {activities.length === 0 ? (
                    <div className="py-20 text-center opacity-30 italic font-black uppercase tracking-widest text-zinc-300">Belum Ada Aktivitas Sistem Terbaru.</div>
                  ) : activities.map((act) => (
                    <div key={act.id} className="flex items-center gap-8 group/act transition-all">
                       <div className="w-14 h-14 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover/act:bg-primary group-hover/act:text-white transition-all shadow-inner">
                          <Zap className="w-6 h-6" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-black uppercase text-primary italic leading-none tracking-widest">{act.action.replace(/_/g, ' ')}</p>
                          <h4 className="text-lg font-black italic tracking-tighter uppercase group-hover/act:translate-x-1 transition-transform italic leading-none">{act.table} Node Audit</h4>
                          <p className="text-xs text-muted-foreground font-medium italic">Executor: {act.user.name}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-300 uppercase italic flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-10">
            <Card padding="lg" className="bg-zinc-50 border-zinc-100 rounded-[5rem] shadow-inner p-12 space-y-10 group text-left">
               <h3 className="text-xl font-black italic tracking-tighter uppercase italic border-l-4 border-primary pl-6">Dispatch <br/> Portal.</h3>
               <div className="grid grid-cols-1 gap-4">
                  <DispatchLink href="/dashboard/ppid" label="Review PPID" icon={FileQuestion} />
                  <DispatchLink href="/dashboard/pengaduan" label="Pusat Pengaduan" icon={Megaphone} />
                  <DispatchLink href="/dashboard/admin/tax-objects" label="Validasi Aset" icon={Building2} />
                  <DispatchLink href="/dashboard/admin/research" label="Validasi Riset" icon={GraduationCap} />
               </div>
            </Card>

            <Card padding="lg" variant="elevated" className="bg-white border-zinc-50 rounded-[4rem] p-12 shadow-2xl shadow-primary/5 space-y-8 group text-left">
               <div className="flex items-center gap-4 text-primary">
                  <Megaphone className="w-6 h-6" />
                  <h3 className="text-lg font-black italic tracking-tighter uppercase italic">Bulletin.</h3>
               </div>
               <div className="space-y-6">
                  {announcements.map(ann => (
                     <div key={ann.id} className="space-y-1 border-l-2 border-zinc-100 pl-4 group-hover:border-primary transition-colors">
                        <p className="text-[9px] font-black uppercase text-zinc-400 italic">INTERNAL • {ann.category}</p>
                        <h5 className="text-sm font-black italic tracking-tight uppercase italic line-clamp-1">{ann.title}</h5>
                     </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full justify-between font-black uppercase text-[10px] tracking-widest italic group-hover:text-primary p-0">Lihat Semua →</Button>
            </Card>
         </div>
      </section>
    </div>
  );
};

function StatsCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
   const colors: Record<string, string> = {
      blue: "bg-blue-50 text-blue-500 border-blue-100",
      amber: "bg-amber-50 text-amber-500 border-amber-100",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
   };
   return (
      <Card padding="lg" className="bg-white border-zinc-50 rounded-[3rem] shadow-xl shadow-primary/[0.03] flex items-center justify-between group hover:border-primary/20 transition-all text-left">
         <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic leading-none">{label}</p>
            <h4 className="text-4xl font-black italic tracking-tighter text-foreground italic leading-none">{value}</h4>
         </div>
         <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner group-hover:rotate-12 transition-transform", colors[color])}>
            <Icon className="w-6 h-6" />
         </div>
      </Card>
   );
}

function DispatchLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
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
