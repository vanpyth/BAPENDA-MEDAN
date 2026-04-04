"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        suppressHydrationWarning
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[1.5rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:border-primary/20 flex items-center justify-center relative transition-all active:scale-95 group shadow-inner"
      >
        <Bell className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-primary text-white text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-full border-[3px] border-white shadow-2xl animate-in zoom-in-50 duration-500 italic">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-zinc-950/5 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-6 w-96 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(37,99,235,0.15)] border border-zinc-100 z-50 overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
               <div className="space-y-1 text-left">
                  <h3 className="font-black text-2xl italic tracking-tighter uppercase leading-none italic">Update <br /><span className="text-primary">Fiskal.</span></h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-2 italic shadow-glow">Anda memiliki {unreadCount} pesan baru</p>
               </div>
               <button
                  suppressHydrationWarning
                  onClick={markAllAsRead}
                  className="text-[10px] text-primary font-black uppercase tracking-widest hover:border-b-2 border-primary/20 transition-all flex items-center gap-2 italic leading-none"
               >
                  <Check className="w-4 h-4" /> Tandai Baca
               </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="p-16 text-center">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-spin mb-4">
                      <Clock className="w-6 h-6 text-primary" />
                   </div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Sinkronisasi Data...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-zinc-50/50 border border-zinc-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner opacity-40">
                    <Bell className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-400 italic">&quot;Tidak ada notifikasi sistem baru untuk periode ini.&quot;</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-8 border-b border-zinc-50 hover:bg-zinc-50 transition-all flex gap-6 group/item relative",
                      !n.isRead && "bg-primary/[0.02]"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover/item:scale-110",
                      n.type === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      n.type === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      n.type === "ERROR" ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-primary/5 text-primary border-primary/10"
                    )}>
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                       <p className={cn("text-base transition-colors leading-tight italic", !n.isRead ? "font-black text-foreground" : "text-muted-foreground font-bold")}>
                        {n.title}
                      </p>
                       <p className="text-sm text-muted-foreground font-medium line-clamp-2 mt-2 leading-relaxed opacity-60 italic">&quot;{n.message}&quot;</p>
                       <div className="flex items-center gap-2 text-[9px] text-zinc-400 mt-4 uppercase font-black tracking-widest italic leading-none border-l-2 border-zinc-100 pl-4 py-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {!n.isRead && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-4 shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-zinc-50 text-center border-t border-zinc-100 shadow-inner group-hover:bg-white transition-colors">
               <button
                  suppressHydrationWarning
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-primary transition-all underline decoration-zinc-200 hover:decoration-primary/20 underline-offset-4"
               >
                  Tutup Pusat Notifikasi
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
