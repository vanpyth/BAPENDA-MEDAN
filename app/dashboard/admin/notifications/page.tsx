"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Send, Users, Bell, AlertTriangle, 
  CheckCircle2, Info, Loader2, X,
  Search, ShieldAlert, ArrowRight, UserPlus
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "INFO" as "INFO" | "SUCCESS" | "WARNING" | "ERROR",
    broadcast: false,
  });

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
      })
      .catch((e) => console.error("Error fetching users", e));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.broadcast && !selectedUser) {
      toast("Error", "Pilih penerima atau aktifkan mode broadcast.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: selectedUser?.id,
        }),
      });
      
      if (!res.ok) throw new Error();
      
      toast("Berhasil", "Notifikasi telah dipancarkan ke jaringan.", "success");
      setForm({ title: "", message: "", type: "INFO", broadcast: false });
      setSelectedUser(null);
    } catch {
      toast("Gagal", "Sistem gagal mengirimkan transmisi notifikasi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Global Broadcast Terminal</p>
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
             System <span className="text-primary italic">Broadcast.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
             &quot;Kirimkan notifikasi langsung, peringatan sistem, atau pengumuman mendesak kepada seluruh atau spesifik pengguna portal SIPADA Medan.&quot;
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* ── Transmission Form ── */}
         <Card padding="none" variant="elevated" className="lg:col-span-7 bg-white border-zinc-100 rounded-[5rem] overflow-hidden shadow-2xl shadow-primary/5 p-12 lg:p-20 relative text-left">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-0" />
            
            <form onSubmit={handleSend} className="space-y-10 relative z-10 font-left text-left">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8">Metode Transmisi</label>
                  <div className="flex gap-4">
                     <button 
                        type="button"
                        onClick={() => { setForm({...form, broadcast: true}); setSelectedUser(null); }}
                        className={cn(
                          "flex-1 h-20 rounded-[2.5rem] border-2 font-black uppercase text-[10px] tracking-widest italic transition-all flex items-center justify-center gap-4",
                          form.broadcast ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-zinc-50 text-zinc-400 border-zinc-100"
                        )}
                     >
                        <ShieldAlert className="w-5 h-5" /> All Users (Broadcast)
                     </button>
                     <button 
                        type="button"
                        onClick={() => setForm({...form, broadcast: false})}
                        className={cn(
                          "flex-1 h-20 rounded-[2.5rem] border-2 font-black uppercase text-[10px] tracking-widest italic transition-all flex items-center justify-center gap-4",
                          !form.broadcast ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-zinc-50 text-zinc-400 border-zinc-100"
                        )}
                     >
                        <UserPlus className="w-5 h-5" /> Specific Node
                     </button>
                  </div>
               </div>

               {!form.broadcast && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                     <div className="relative group">
                        <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-300 group-focus-within:text-primary transition-all" />
                        <input 
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Cari user berdasarkan nama atau email..."
                          className="w-full pl-22 pr-8 h-22 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm italic shadow-inner"
                        />
                     </div>
                     
                     {search && filteredUsers.length > 0 && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-[3rem] p-4 space-y-2 overflow-hidden shadow-inner font-left text-left">
                           {filteredUsers.map(u => (
                              <button 
                                key={u.id}
                                type="button"
                                onClick={() => { setSelectedUser(u); setSearch(""); }}
                                className={cn(
                                   "w-full flex items-center justify-between p-6 rounded-[2rem] transition-all text-left",
                                   selectedUser?.id === u.id ? "bg-primary text-white" : "hover:bg-white"
                                )}
                              >
                                 <div className="text-left font-left">
                                    <p className="text-xs font-black uppercase italic leading-none">{u.name}</p>
                                    <p className="text-[10px] opacity-60 mt-2 font-medium">{u.email}</p>
                                 </div>
                                 <CheckCircle2 className={cn("w-6 h-6 transition-all", selectedUser?.id === u.id ? "opacity-100" : "opacity-0")} />
                              </button>
                           ))}
                        </div>
                     )}

                     {selectedUser && (
                        <div className="p-8 bg-blue-50 border border-blue-100 rounded-[3rem] flex items-center justify-between shadow-glow shadow-blue-500/5">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner font-black text-blue-500 italic uppercase leading-none">U</div>
                              <div className="text-left">
                                 <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none italic mb-1">Target Node Locked</p>
                                 <p className="text-lg font-black italic tracking-tighter uppercase italic shadow-glow"> {selectedUser.name} </p>
                              </div>
                           </div>
                           <button type="button" onClick={() => setSelectedUser(null)} className="p-4 rounded-xl hover:bg-red-50 text-red-500 transition-all"><X className="w-6 h-6" /></button>
                        </div>
                     )}
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8">Alert Severity</label>
                     <div className="flex gap-4">
                        {(["INFO", "SUCCESS", "WARNING", "ERROR"] as const).map(t => (
                           <button 
                             key={t}
                             type="button"
                             onClick={() => setForm({...form, type: t})}
                             className={cn(
                               "flex-1 h-16 rounded-2xl border-2 transition-all flex items-center justify-center",
                               form.type === t ? "border-primary bg-primary/5 text-primary scale-110 shadow-lg" : "border-zinc-50 grayscale opacity-40 hover:opacity-100"
                             )}
                           >
                              {t === "SUCCESS" && <CheckCircle2 className="w-6 h-6" />}
                              {t === "INFO" && <Info className="w-6 h-6" />}
                              {t === "WARNING" && <AlertTriangle className="w-6 h-6" />}
                              {t === "ERROR" && <X className="w-6 h-6 outline outline-2 outline-offset-2 rounded-full" />}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8">Transmisi Head</label>
                     <input 
                       required 
                       placeholder="Headline Notifikasi..."
                       value={form.title}
                       onChange={e => setForm({...form, title: e.target.value})}
                       className="w-full px-10 h-22 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 transition-all font-black text-sm uppercase tracking-widest italic shadow-inner"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8">Pesan Transmisi</label>
                  <textarea 
                    required rows={6}
                    placeholder="Tuliskan pesan transmisi yang akan dikirimkan..."
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full px-10 py-10 bg-zinc-50 border border-zinc-100 rounded-[4rem] focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm italic shadow-inner resize-none"
                  />
               </div>

               <Button 
                 disabled={loading}
                 type="submit" 
                 size="xl" 
                 className="w-full h-24 bg-primary text-white rounded-full font-black uppercase text-xs tracking-[0.3em] italic shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all"
               >
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Send className="mr-6 w-6 h-6" /> Beam Transmission</>}
               </Button>
            </form>
         </Card>

         {/* ── Sidebar Stats ── */}
         <div className="lg:col-span-5 flex flex-col gap-10">
            <Card padding="lg" className="bg-zinc-50 border-zinc-100 rounded-[5rem] p-16 shadow-inner space-y-12 text-left">
               <div className="space-y-4">
                  <h3 className="text-xl font-black italic tracking-tighter uppercase italic border-l-4 border-primary pl-8">Broadcast <br/> Statistics.</h3>
                  <p className="text-xs text-zinc-400 font-medium italic italic">Metrik transmisi data SIPADA Medan</p>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  <Metric label="Hub Nodes Active" val={users.length.toString()} icon={Users} color="blue" />
                  <Metric label="Transmission Fail Rate" val="0.02%" icon={ShieldAlert} color="emerald" />
                  <Metric label="Global Reachability" val="99.9%" icon={Bell} color="amber" />
               </div>

               <div className="p-10 bg-white border border-zinc-100 rounded-[3rem] shadow-xl shadow-primary/[0.03] space-y-6">
                  <div className="flex items-center gap-4 text-primary">
                     <AlertTriangle className="w-6 h-6" />
                     <p className="text-[10px] font-black uppercase tracking-widest italic">Communication Protocol</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                     &quot;Tipe transmisi Broadcast akan melalukan pengiriman data secara paralel ke seluruh node identitas aktif dalam hitungan milidetik.&quot;
                  </p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function Metric({ label, val, icon: Icon, color }: { label: string; val: string; icon: React.ElementType; color: string }) {
   const colors: Record<string, string> = {
      blue: "text-blue-500 bg-blue-50",
      emerald: "text-emerald-500 bg-emerald-50",
      amber: "text-amber-500 bg-amber-50",
   };
   return (
      <div className="flex items-center justify-between group">
         <div className="flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12", colors[color])}>
               <Icon className="w-6 h-6" />
            </div>
            <div className="text-left font-left">
               <p className="text-xs font-black italic tracking-tight uppercase italic tabular-nums leading-none mb-1">{val}</p>
               <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">{label}</p>
            </div>
         </div>
         <ArrowRight className="w-4 h-4 text-zinc-200 group-hover:translate-x-2 transition-transform" />
      </div>
   );
}
