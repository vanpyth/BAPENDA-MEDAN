"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  CreditCard, 
  History, 
  User, 
  LayoutDashboard 
} from "lucide-react";

const navItems = [
  {
    label: "Beranda",
    icon: Home,
    href: "/",
  },
  {
    label: "Layanan",
    icon: CreditCard,
    href: "/layanan",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Pajak",
    icon: History,
    href: "/dashboard/pajak/objek",
  },
  {
    label: "Profil",
    icon: User,
    href: "/dashboard/settings",
  },
];

export function StickyBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 group transition-all duration-300 relative",
                isActive ? "text-primary scale-110" : "text-zinc-400"
              )}
            >
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                isActive ? "bg-primary/10 shadow-inner" : "group-hover:bg-zinc-100"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px] group-hover:scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-tighter transition-all",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
