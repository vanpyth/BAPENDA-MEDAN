"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Users, Search, MoreVertical, ShieldAlert, Star, 
  Activity, ArrowRight, Filter, ShieldCheck, 
  Trash2, Plus, X, Loader2, Eye, EyeOff, Key, Mail, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nik?: string;
  phone?: string;
  createdAt: string;
  _count: { taxObjects: number; payments: number };
}

const ROLES = ["USER", "OFFICER", "ADMIN", "MAHASISWA"] as const;
type UserRole = (typeof ROLES)[number];

const roleBadge: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-600 border-purple-100 shadow-purple-500/5",
  OFFICER: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5",
  USER: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5",
  MAHASISWA: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5",
  DEVELOPER: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5",
};

const roleLabel: Record<string, string> = {
  ADMIN: "Super Admin",
  OFFICER: "Field Officer",
  USER: "Wajib Pajak",
  MAHASISWA: "Civitas Research",
  DEVELOPER: "System Dev",
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "", email: "", password: "", role: "USER" as UserRole
  });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .catch(() => toast("Gagal Sinkronisasi", "Sistem tidak dapat memanggil data identitas dari database pusat.", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      if (!res.ok) throw new Error();
      
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast("Role Diperbarui", `Otoritas digital telah disinkronisasi ke ${roleLabel[role]}`, "success");
    } catch {
      toast("Kesalahan Sistem", "Gagal memperbarui otoritas akun.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
     if (!confirm("Hapus identitas ini secara permanen dari sistem?")) return;
     setUpdatingId(id);
     try {
       const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
       if (!res.ok) throw new Error();
       setUsers(prev => prev.filter(u => u.id !== id));
       toast("Terhapus", "Akun telah dimusnahkan dari database.", "success");
     } catch {
       toast("Gagal", "Sistem menolak perintah penghapusan.", "error");
     } finally {
       setUpdatingId(null);
     }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
       const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
       });
       if (!res.ok) throw new Error();
       setShowCreateModal(false);
       setNewUser({ name: "", email: "", password: "", role: "USER" });
       fetchUsers();
       toast("Berhasil", "Node identitas baru telah didaftarkan dalam sistem.", "success");
    } catch {
       toast("Error", "Gagal registrasi identitas baru.", "error");
    } finally {
       setCreateLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.nik?.includes(search);
    const matchRole = filterRole === "ALL" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
             <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Security Identity Hub</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
            Identity <span className="text-primary italic">Control.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
            &quot;Sistem manajemen otoritas pusat (IAM) untuk mengelola data wajib pajak, petugas lapangan, dan akses administratif Bapenda Medan.&quot;
          </p>
        </div>
        <div className="flex items-center gap-6">
            <Button 
               size="xl" 
               onClick={() => setShowCreateModal(true)}
               className="btn-premium px-10 h-20 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 group"
            >
               Registrasi User <Plus className="ml-4 w-5 h-5 group-hover:rotate-90 transition-transform" />
            </Button>
            <Card padding="lg" variant="outline" className="hidden xl:flex bg-zinc-50 border border-zinc-100 rounded-[2.5rem] shadow-inner py-4 px-8 min-w-[200px] text-right">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] italic leading-none">Global Nodes</p>
                  <p className="text-2xl font-black italic tracking-tighter uppercase">{users.length} <span className="text-primary tracking-normal font-sans text-xs">Identities</span></p>
               </div>
            </Card>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-300 group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Identitas, Email, atau NIK Pengguna..."
            className="w-full pl-22 pr-10 h-22 bg-white border border-zinc-100 rounded-[2.5rem] outline-none shadow-2xl shadow-primary/[0.04] focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-black text-lg tracking-tight italic"
          />
        </div>
        <div className="relative group">
           <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
           <select
             value={filterRole}
             onChange={(e) => setFilterRole(e.target.value)}
             className="w-full pl-16 pr-6 h-22 bg-white border border-zinc-100 rounded-[2.5rem] outline-none shadow-2xl shadow-primary/[0.04] focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-black text-xs uppercase tracking-widest appearance-none cursor-pointer italic"
           >
             <option value="ALL">Semua Unit</option>
             {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
           </select>
        </div>
      </div>

      {/* ── Users Grid ── */}
      <div className="grid grid-cols-1 gap-10">
         {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-44 w-full rounded-[4rem]" />)
         ) : filtered.length === 0 ? (
            <div className="py-32 text-center bg-white border-2 border-dashed border-zinc-100 rounded-[5rem] group hover:border-primary/20 transition-all shadow-inner">
               <ShieldAlert className="w-20 h-20 mx-auto text-zinc-100 mb-8" />
               <p className="text-xl font-black italic tracking-tighter text-zinc-300 uppercase italic">Ledger Null — No Identities Found.</p>
            </div>
         ) : (
            filtered.map((u) => (
               <div key={u.id} className="bg-white border border-zinc-100 rounded-[4rem] p-10 lg:p-14 hover:shadow-[0_50px_100px_-20px_rgba(37,99,235,0.08)] hover:scale-[1.01] transition-all duration-700 shadow-xl shadow-primary/[0.02] group relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/10" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 flex-1 w-full text-center md:text-left">
                     <div className="w-24 h-24 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex items-center justify-center font-black text-4xl italic text-zinc-400 shadow-inner group-hover:rotate-6 transition-transform">
                        {u.name?.[0] ?? "U"}
                     </div>
                     <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                           <span className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border italic leading-none shadow-sm", roleBadge[u.role])}>
                              {roleLabel[u.role] ?? u.role}
                           </span>
                           <span className="text-[10px] font-black text-zinc-300 uppercase italic">NODE: {u.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-3xl font-black italic tracking-tighter group-hover:text-primary transition-colors leading-tight uppercase italic">{u.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-8 opacity-60">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic flex items-center gap-2"><Mail className="w-4 h-4" /> {u.email}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic flex items-center gap-2"><Activity className="w-4 h-4" /> {new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-5 shrink-0">
                      <div className="flex gap-2">
                        {ROLES.filter(r => r !== u.role).map(r => (
                           <button 
                             key={r}
                             onClick={() => handleRoleChange(u.id, r)}
                             disabled={updatingId === u.id}
                             className="h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-[8px] font-black uppercase tracking-widest hover:bg-primary shadow-inner opacity-40 hover:opacity-100 hover:text-white transition-all uppercase"
                           >
                              To {r}
                           </button>
                        ))}
                      </div>
                      <div className="h-10 w-[1px] bg-zinc-50" />
                      <button 
                        onClick={() => handleDelete(u.id)}
                        disabled={updatingId === u.id}
                        className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10"
                      >
                         <Trash2 className="w-6 h-6" />
                      </button>
                  </div>
               </div>
            ))
         )}
      </div>

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md p-6 text-left animate-in fade-in duration-500">
           <Card padding="none" className="bg-white rounded-[5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-zinc-100 animate-in zoom-in-95 duration-500 relative p-12 lg:p-20">
              <div className="flex items-start justify-between mb-16">
                 <div className="space-y-3">
                    <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none italic">New <span className="text-primary">Node.</span></h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-2 italic shadow-glow">Identity Creation Terminal</p>
                 </div>
                 <button onClick={() => setShowCreateModal(false)} className="p-5 bg-zinc-50 text-zinc-400 rounded-full hover:bg-zinc-100 shadow-inner transition-all"><X className="w-8 h-8" /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Full Legal Name</label>
                    <div className="relative group">
                       <UserIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-all" />
                       <input 
                         required 
                         className="w-full pl-20 pr-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-xs uppercase tracking-widest italic shadow-inner"
                         placeholder="Nama Lengkap..." 
                         value={newUser.name}
                         onChange={e => setNewUser({...newUser, name: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-all" />
                       <input 
                         required type="email"
                         className="w-full pl-20 pr-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-xs uppercase tracking-widest italic shadow-inner"
                         placeholder="email@bapenda.go.id" 
                         value={newUser.email}
                         onChange={e => setNewUser({...newUser, email: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">System Password</label>
                    <div className="relative group">
                       <Key className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-all" />
                       <input 
                         required type="password"
                         className="w-full pl-20 pr-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-xs uppercase tracking-widest italic shadow-inner"
                         placeholder="••••••••" 
                         value={newUser.password}
                         onChange={e => setNewUser({...newUser, password: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Authority Level</label>
                    <select
                      className="w-full px-12 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 transition-all font-black text-xs uppercase tracking-widest italic appearance-none cursor-pointer shadow-inner"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
                    </select>
                 </div>

                 <Button 
                    disabled={createLoading}
                    type="submit" 
                    className="w-full h-24 bg-primary text-white font-black rounded-full shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest uppercase italic"
                 >
                    {createLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Deploy Identity Node"}
                 </Button>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
}
