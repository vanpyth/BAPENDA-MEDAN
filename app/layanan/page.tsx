"use client";

import PublicLayout from "@/components/PublicLayout";
import { 
  Building2, Map, CreditCard, Search, 
  ClipboardCheck, GraduationCap, Megaphone, 
  FileQuestion, LayoutGrid, ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";

const services = [
  { 
    id: "pbb", 
    title: "Pajak Bumi & Bangunan", 
    desc: "Manajemen SPPT, cek tagihan, dan pembayaran PBB-P2 online secara mandiri.", 
    icon: Building2, 
    color: "bg-primary/5 text-primary border-primary/10",
    href: "/dashboard/pajak/objek"
  },
  { 
    id: "bphtb", 
    title: "BPHTB", 
    desc: "Pelaporan dan pembayaran Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB).", 
    icon: Map, 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    href: "/dashboard/pajak/objek"
  },
  { 
    id: "reklame", 
    title: "Pajak Reklame", 
    desc: "Pendaftaran, perpanjangan, dan monitoring pajak iklan/reklame di wilayah Kota Medan.", 
    icon: LayoutGrid, 
    color: "bg-amber-50 text-amber-600 border-amber-100",
    href: "/dashboard/pajak/objek"
  },
  { 
    id: "restoran", 
    title: "Pajak Restoran", 
    desc: "Pelaporan omzet bulanan dan pembayaran pajak restoran/PB1 secara real-time.", 
    icon: CreditCard, 
    color: "bg-primary/5 text-primary border-primary/10",
    href: "/dashboard/pajak/objek"
  },
  { 
    id: "verifikasi", 
    title: "Verifikasi Data", 
    desc: "Layanan validasi dokumen dan status pembayaran pajak daerah resmi Bapenda.", 
    icon: ClipboardCheck, 
    color: "bg-zinc-50 text-zinc-600 border-border/50",
    href: "/dashboard"
  },
  { 
    id: "riset", 
    title: "Izin Riset", 
    desc: "Permohonan pengambilan data untuk keperluan penelitian dan tugas akhir akademik.", 
    icon: GraduationCap, 
    color: "bg-zinc-50 text-zinc-600 border-border/50",
    href: "/dashboard/mahasiswa/pengajuan"
  },
  { 
    id: "ppid", 
    title: "PPID / Informasi", 
    desc: "Permohonan informasi publik dan keterbukaan data pemerintah daerah.", 
    icon: FileQuestion, 
    color: "bg-zinc-50 text-zinc-600 border-border/50",
    href: "/dashboard/ppid"
  },
  { 
    id: "pengaduan", 
    title: "Aduan Publik", 
    desc: "Salurkan aspirasi dan pengaduan terkait layanan Bapenda Medan melalui kanal resmi.", 
    icon: Megaphone, 
    color: "bg-red-50 text-red-600 border-red-100",
    href: "/dashboard/pengaduan"
  },
];

export default function LayananPage() {
  const { data: session } = useSession();

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24 space-y-24 selection:bg-primary/20">
         
         {/* ── Header Command ── */}
         <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-left">
            <div className="flex items-center gap-3 text-primary">
               <div className="w-12 h-0.5 bg-primary" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none text-zinc-500">Institutional Menu</p>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
               Katalog <br /><span className="text-primary italic">Layanan.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic border-l-4 border-primary/10 pl-10 ml-2">
               &quot;Pilih layanan digital terintegrasi yang Anda butuhkan. Kami berkomitmen memberikan kemudahan akses data fiskal secara presisi, cepat, dan transparan.&quot;
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {services.map((s) => (
               <Card key={s.id} padding="none" variant="elevated" className="group rounded-[4rem] bg-white border-zinc-100 hover:border-primary/20 hover:scale-[1.02] transition-all duration-500 overflow-hidden flex flex-col shadow-2xl shadow-primary/5 min-h-[460px]">
                  <div className="p-12 space-y-10 flex-1 flex flex-col justify-between text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000 -z-0">
                        <s.icon className="w-32 h-32" />
                     </div>
                     
                     <div className={cn("w-20 h-20 rounded-[2.5rem] flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12 leading-none relative z-10", s.color)}>
                        <s.icon className="w-10 h-10" />
                     </div>
                     
                     <div className="space-y-4 relative z-10">
                        <h3 className="text-3xl font-black italic tracking-tighter text-foreground uppercase italic group-hover:text-primary transition-colors leading-tight underline decoration-transparent group-hover:decoration-primary/10 underline-offset-8 transition-all">{s.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed italic border-l-2 border-zinc-200 pl-6 ml-1">&quot;{s.desc}&quot;</p>
                     </div>
                     
                     <div className="pt-6 relative z-10">
                        <Link href={session ? s.href : "/login"}>
                           <Button variant="ghost" size="sm" className="px-0 group-hover:text-primary gap-4 font-black uppercase text-[10px] tracking-widest hover:border-b border-primary/20 transition-all">
                              {session ? "Buka Layanan" : "Akses Portal"} <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
                           </Button>
                        </Link>
                     </div>
                  </div>
               </Card>
            ))}
         </div>

         {/* ── Help Desk Overlay ── */}
         <div className="bg-zinc-50 border border-zinc-100 rounded-[5rem] p-12 md:p-24 text-foreground relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 space-y-10 text-left">
                  <div className="space-y-4">
                     <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight italic uppercase text-foreground">Butuh Bantuan <br /><span className="text-primary italic">Teknis?</span></h2>
                     <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/20 pl-10 max-w-xl">
                        &quot;Tim dukungan kami siap membantu Anda memahami prosedur dan persyaratan setiap layanan pajak daerah di Kota Medan secara real-time.&quot;
                     </p>
                  </div>
                  <Link href="/panduan">
                     <Button variant="primary" size="lg" className="rounded-full px-12 h-20 btn-premium group shadow-2xl shadow-primary/30 font-black uppercase text-xs tracking-widest font-mono">
                        Pusat Bantuan Digital <Search className="ml-4 w-5 h-5 group-hover:scale-125 transition-transform" />
                     </Button>
                  </Link>
               </div>
               <div className="hidden lg:flex justify-center shrink-0">
                  <div className="w-80 h-80 bg-white rounded-[5rem] border border-zinc-100 flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-1000 relative">
                     <div className="absolute inset-0 bg-primary/5 rounded-[5rem] animate-pulse" />
                     <FileQuestion className="w-40 h-40 text-primary opacity-80 relative z-10" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </PublicLayout>
  );
}
