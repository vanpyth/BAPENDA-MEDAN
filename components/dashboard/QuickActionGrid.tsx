"use client";

import { 
  Search, ArrowRight, Wallet, 
  GraduationCap, FileQuestion 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { 
    title: "Cek Tagihan", 
    desc: "Cek status PBB & BPHTB Anda secara real-time.", 
    icon: Search, 
    href: "/dashboard/pajak/tagihan",
    color: "bg-primary",
    light: "bg-primary/5 text-primary border-primary/10"
  },
  { 
    title: "Bayar Pajak", 
    desc: "Lakukan pembayaran online melalui gateway aman.", 
    icon: Wallet, 
    href: "/dashboard/pajak/tagihan", 
    color: "bg-emerald-500",
    light: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  { 
    title: "Layanan Riset", 
    desc: "Pengajuan izin penelitian dan pengambilan data.", 
    icon: GraduationCap, 
    href: "/dashboard/mahasiswa/pengajuan",
    color: "bg-blue-500",
    light: "bg-blue-50 text-blue-600 border-blue-100"
  },
  { 
    title: "Permohonan PPID", 
    desc: "Akses informasi publik dan keterbukaan data.", 
    icon: FileQuestion, 
    href: "/dashboard/ppid",
    color: "bg-amber-500",
    light: "bg-amber-50 text-amber-600 border-amber-100"
  },
];

export function QuickActionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {ACTIONS.map((action) => (
        <Link 
          key={action.title} 
          href={action.href}
          className="group relative bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden flex flex-col justify-between h-[320px]"
        >
          {/* Background Gradient Glow */}
          <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000", action.color)} />
          
          <div className="relative z-10 space-y-8 flex flex-col items-start h-full justify-between text-left">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-12 border shadow-inner", action.light)}>
              <action.icon className="w-8 h-8" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors uppercase italic underline decoration-transparent group-hover:decoration-primary/10 underline-offset-8 transition-all">{action.title}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed italic border-l-2 border-zinc-50 pl-4">{action.desc}</p>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 italic border-b border-primary/20 pb-1">
               Akses Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
