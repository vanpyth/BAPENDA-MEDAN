"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Settings, User, Lock, Save, Camera, ShieldCheck, Mail, Phone, MapPin, Fingerprint, History, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Load current user data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setAddress(data.address ?? "");
        }
      } catch {
        // fallback to session data
        setName(session?.user?.name ?? "");
      }
    };
    if (session?.user?.id) fetchProfile();
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      if (!res.ok) throw new Error();
      await update({ name }); // refresh session
      toast("Profil Terupdate", "Seluruh perubahan identitas Anda telah disinkronisasi.", "success");
    } catch {
      toast("Gagal", "Tidak dapat menyimpan perubahan profil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 8) {
      toast("Terlalu Pendek", "Kata sandi baru minimal 8 karakter.", "error");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Gagal");
      }
      toast("Kata Sandi Diperbarui", "Kredensial Anda telah berhasil diubah.", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast("Gagal", err instanceof Error ? err.message : "Gagal mengubah kata sandi.", "error");
    } finally {
      setPwLoading(false);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Identitas", icon: User },
    { id: "security" as const, label: "Privasi", icon: Lock },
  ];

  return (
    <div className="max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 selection:bg-primary/20">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 px-4 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary">
             <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Account Central Control</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-foreground leading-none uppercase">
            Manajemen <span className="text-primary italic">Profil.</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xl max-w-2xl leading-relaxed italic border-l-4 border-primary/10 pl-8">
            &quot;Pusat kendali untuk modifikasi identitas digital, keamanan akun, dan integritas data pengguna SIPADA.&quot;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── Left Nav ── */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white border border-zinc-100 rounded-[3rem] p-3 shadow-xl shadow-primary/5 space-y-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-8 h-20 rounded-[2.5rem] font-black transition-all group relative overflow-hidden text-left",
                    activeTab === t.id 
                     ? "bg-primary text-white shadow-2xl scale-[1.02]" 
                     : "text-zinc-500 hover:bg-zinc-50"
                  )}
                >
                   <div className="flex items-center gap-5 relative z-10">
                      <div className={cn("w-10 h-10 rounded-[1.2rem] flex items-center justify-center border transition-all", activeTab === t.id ? "bg-white/20 border-white/20" : "bg-zinc-50 border-zinc-100")}>
                         <t.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest leading-none">{t.label}</span>
                   </div>
                   {activeTab === t.id && <CheckCircle className="w-4 h-4 opacity-50" />}
                </button>
              ))}
           </div>

           <Card padding="lg" variant="outline" className="border-border/50 bg-zinc-50/50 group rounded-[3rem] shadow-inner">
              <div className="space-y-6 text-left">
                 <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.4em] italic leading-none">Security Insight</p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-foreground italic leading-tight">Sistem <br />Terlindungi</span>
                 </div>
                 <p className="text-[10px] font-medium text-muted-foreground leading-relaxed italic opacity-60 ml-2 border-l-2 border-zinc-100 pl-4">Sesi Anda dienkripsi dengan protokol AES-GCM 256-bit standar perbankan.</p>
              </div>
           </Card>
        </div>

        {/* ── Right Content ── */}
        <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-8 duration-1000">
          {activeTab === "profile" && (
            <Card padding="none" variant="elevated" className="relative group overflow-hidden border border-zinc-100 shadow-2xl shadow-primary/5 bg-white rounded-[5rem] min-h-[600px] text-left">
               <div className="absolute top-0 right-0 p-32 opacity-5 -z-0">
                  <User className="w-80 h-80 text-primary" />
               </div>
               
               <form onSubmit={handleSave} className="relative z-10 p-12 lg:p-24 space-y-20">
                  {/* Photo & Identity */}
                  <div className="flex flex-col md:flex-row items-center gap-14">
                      <div className="relative group/avatar">
                        <div className="w-48 h-48 rounded-[4rem] bg-primary text-white flex items-center justify-center font-black text-7xl shadow-2xl transition-all duration-700 group-hover/avatar:rotate-3">
                           {name?.[0]?.toUpperCase() ?? session?.user?.name?.[0] ?? "U"}
                        </div>
                        <button type="button" className="absolute -bottom-4 -right-4 w-16 h-16 bg-white text-primary rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-zinc-50 flex items-center justify-center">
                           <Camera className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 px-6 py-2 bg-zinc-50 rounded-full border border-zinc-100 w-fit">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none">{(session?.user as { role?: string })?.role ?? "User"} Verification</p>
                         </div>
                         <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground leading-none uppercase">{name || session?.user?.name}</h2>
                         <p className="text-lg text-muted-foreground font-medium italic opacity-60">ID: BPN-MEDAN-{session?.user?.id?.slice(-6).toUpperCase() ?? "---"}</p>
                      </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic leading-none">Nama Lengkap</label>
                        <div className="relative group">
                           <User className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                           <input 
                               value={name}
                               onChange={(e) => setName(e.target.value)}
                               className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all font-black text-lg tracking-tight shadow-inner"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic leading-none">Alamat Email (Permanen)</label>
                        <div className="relative opacity-60">
                           <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                           <input 
                               readOnly
                               value={session?.user?.email ?? ""}
                               className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] text-zinc-400 cursor-not-allowed font-black italic"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic leading-none">Nomor Handset</label>
                        <div className="relative group">
                           <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                           <input 
                               placeholder="08X-XXXX-XXXX"
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all font-black text-lg tracking-tight shadow-inner"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic leading-none">Alamat Domisili</label>
                        <div className="relative group">
                           <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                           <input 
                               placeholder="Jl. ..."
                               value={address}
                               onChange={(e) => setAddress(e.target.value)}
                               className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all font-black text-lg tracking-tight shadow-inner"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 flex border-t border-zinc-50">
                     <Button type="submit" size="xl" disabled={loading} className="rounded-full px-16 h-20 btn-premium group font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30">
                        {loading ? "Menyimpan..." : "Simpan Perubahan Identitas"}
                        <Save className="ml-4 w-5 h-5" />
                     </Button>
                  </div>
               </form>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-10 text-left">
               <Card padding="none" variant="elevated" className="space-y-16 shadow-2xl shadow-primary/5 border border-zinc-100 bg-white rounded-[5rem] p-12 lg:p-24 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 opacity-5 -z-0">
                     <Fingerprint className="w-80 h-80 text-primary" />
                  </div>
                  
                  <form onSubmit={handleChangePassword} className="space-y-10 relative z-10">
                     <div className="space-y-4">
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Ganti Kata Sandi <br /><span className="text-primary">Keamanan.</span></h3>
                        <p className="text-lg text-muted-foreground font-medium italic border-l-4 border-primary/10 pl-10">&quot;Pastikan kata sandi Anda memiliki minimal 8 karakter untuk proteksi maksimal.&quot;</p>
                     </div>

                     <div className="grid grid-cols-1 gap-10 max-w-xl">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic">Password Saat Ini</label>
                           <div className="relative group">
                              <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                              <input 
                                 type="password"
                                 value={currentPassword}
                                 onChange={e => setCurrentPassword(e.target.value)}
                                 className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all text-lg font-black tracking-widest shadow-inner"
                              />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-6 italic">Password Baru (min. 8 Karakter)</label>
                           <div className="relative group">
                              <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                              <input 
                                 type="password"
                                 value={newPassword}
                                 onChange={e => setNewPassword(e.target.value)}
                                 className="w-full pl-20 pr-10 h-20 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-primary/20 transition-all text-lg font-black tracking-widest shadow-inner"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 flex border-t border-zinc-50">
                        <Button type="submit" variant="primary" size="xl" disabled={pwLoading} className="rounded-full px-16 h-20 btn-premium font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30">
                          {pwLoading ? "Memperbarui..." : "Mutakhirkan Kredensial"}
                          <Settings className="ml-4 w-5 h-5" />
                        </Button>
                     </div>
                  </form>
               </Card>

               <Card padding="none" variant="elevated" className="bg-white border border-zinc-100 rounded-[4rem] p-12 group hover:border-primary/20 transition-all shadow-xl shadow-primary/5">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                     <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center border border-zinc-100 shadow-inner group-hover:rotate-6 transition-transform">
                        <History className="w-10 h-10 text-primary" />
                     </div>
                     <div className="flex-1 space-y-3">
                        <h4 className="text-2xl font-black italic tracking-tighter uppercase italic leading-none">Riwayat Sesi Aktif.</h4>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed italic border-l-2 border-zinc-100 pl-6">
                           &quot;Pantau log aktivitas login Anda di berbagai platform untuk mencegah akses tidak sah pada akun SIPADA Anda.&quot;
                        </p>
                     </div>
                     <Button variant="outline" className="rounded-full px-10 h-16 font-black uppercase text-[10px] tracking-widest bg-zinc-50 border-zinc-100 hover:bg-white transition-all shadow-xl">Lihat Log Aktivitas</Button>
                  </div>
               </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
