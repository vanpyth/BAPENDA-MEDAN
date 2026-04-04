"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, Menu, User, Bell, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-zinc-100 py-4 shadow-2xl shadow-primary/5"
          : "bg-transparent py-8"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-5 group relative">
             <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 shadow-xl shadow-primary/5 group-hover:rotate-6 transition-transform relative z-10">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
             </div>
             <div className="relative z-10">
                <h1 className="font-black text-2xl italic tracking-tighter leading-none text-foreground uppercase italic underline decoration-primary/10 decoration-4 underline-offset-4 decoration-transparent group-hover:decoration-primary/10 transition-all">
                  SIPADA<span className="text-primary italic">.</span>MEDAN
                </h1>
                <p className="text-[9px] text-zinc-400 uppercase tracking-[0.4em] font-black italic mt-1.5 leading-none">Bapenda Information Node</p>
             </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {[
              { href: "/layanan", label: "Layanan" },
              { href: "/pajak-daerah", label: "Pajak Daerah" },
              { href: "/informasi", label: "Pusat Informasi" },
              { href: "/panduan", label: "Panduan Portal" },
            ].map((link) => (
              <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
             <button aria-label="Cari Informasi" suppressHydrationWarning className="w-12 h-12 bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-primary/20 rounded-2xl flex items-center justify-center transition-all group shadow-inner">
               <Search className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
             </button>
             <button aria-label="Notifikasi" suppressHydrationWarning className="w-12 h-12 bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-primary/20 rounded-2xl flex items-center justify-center transition-all group relative shadow-inner">
               <Bell className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white shadow-glow animate-pulse" />
             </button>
          </div>
          
          <div className="h-8 w-[1px] bg-zinc-100 mx-2 hidden sm:block" />
          
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-full hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 group relative overflow-hidden btn-premium uppercase text-[10px] tracking-widest italic"
          >
            <div className="relative z-10 flex items-center gap-3">
               <User className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               <span>Masuk Ke Portal</span>
            </div>
          </Link>

          <button aria-label="Menu Navigasi" suppressHydrationWarning className="lg:hidden w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-600 hover:bg-white transition-all shadow-inner">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-all hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/10 italic"
    >
      {children}
    </Link>
  );
}
