"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Search, 
  ArrowRight, 
  Loader2, 
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TaxObject {
  id: string;
  nop: string;
  type: string;
  name: string;
  address: string;
  status: string;
  luasTanah: number;
  luasBangun: number;
  createdAt: string;
  owner: { name: string; email: string };
}

const statusBadge: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  VERIFIED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  REJECTED: "bg-red-50 text-red-600 border-red-100",
};

export default function AdminTaxObjectsPage() {
  const { toast } = useToast();
  const [objects, setObjects] = useState<TaxObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tax-objects");
      const data = await res.json();
      setObjects(data || []);
    } catch {
      toast("Error", "Gagal memuat semua objek pajak.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/tax-objects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      
      setObjects(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast("Berhasil", "Status objek pajak diperbarui.", "success");
    } catch {
      toast("Error", "Gagal memperbarui status.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = objects.filter(o => {
    const matchSearch = 
      o.name.toLowerCase().includes(search.toLowerCase()) || 
      o.nop.includes(search) ||
      o.owner.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Global Asset Registry</p>
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
             Objek <span className="text-primary italic">Pajak.</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
              &quot;Administrasi dan validasi seluruh Objek Pajak (NOP) yang terdaftar dalam sistem Bapenda Medan untuk menjamin akurasi basis data fiskal.&quot;
           </p>
        </div>
        <div className="flex items-center gap-6">
            <Card padding="lg" variant="outline" className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] shadow-inner py-4 px-8 min-w-[200px] text-right">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] italic leading-none">Total Nodes</p>
                  <p className="text-2xl font-black italic tracking-tighter uppercase">{objects.length} <span className="text-primary tracking-normal font-sans text-xs">Aset</span></p>
               </div>
            </Card>
        </div>
      </div>

      {/* ── Quick Controls ── */}
      <div className="flex flex-col md:flex-row gap-6 pt-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-300 group-focus-within:text-primary transition-all" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NOP, Nama Objek, atau Nama Pemilik..."
            className="w-full pl-22 pr-10 h-20 bg-white border border-zinc-100 rounded-[2.5rem] outline-none shadow-2xl shadow-primary/[0.04] focus:ring-4 focus:ring-primary/10 transition-all font-black text-lg tracking-tight italic"
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-zinc-50 rounded-[2rem] border border-zinc-100 shadow-inner">
          {["ALL", "PENDING", "VERIFIED", "REJECTED"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                filterStatus === s ? "bg-white text-primary shadow-xl border border-primary/10" : "text-zinc-400 hover:text-zinc-900"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Global Registry List ── */}
      <div className="grid grid-cols-1 gap-12">
        {loading ? (
           [1, 2].map(i => <div key={i} className="h-64 bg-zinc-50 border border-zinc-100 rounded-[4rem] animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center bg-white border-2 border-dashed border-zinc-100 rounded-[5rem] group hover:border-primary/20 transition-all shadow-inner">
             <Building2 className="w-20 h-20 mx-auto text-zinc-100 mb-8" />
             <p className="text-xl font-black italic tracking-tighter text-zinc-300 uppercase italic">Ledger Empty — No Registered Asset Nodes.</p>
          </div>
        ) : (
          filtered.map(obj => (
            <div key={obj.id} className="bg-white border border-zinc-100 rounded-[4rem] p-10 lg:p-14 hover:shadow-[0_50px_100px_-20px_rgba(37,99,235,0.08)] hover:scale-[1.01] duration-700 shadow-xl shadow-primary/[0.03] group relative overflow-hidden flex flex-col gap-10">
               <div className="absolute top-0 left-0 w-2 h-full bg-primary/10" />
               
               <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                  <div className="w-24 h-24 shrink-0 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex items-center justify-center font-black text-3xl italic text-primary shadow-inner group-hover:rotate-12 transition-transform">
                     {obj.type[0]}
                  </div>

                  <div className="flex-1 space-y-8">
                     <div className="flex flex-wrap items-center gap-4">
                        <span className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border italic leading-none shadow-sm", statusBadge[obj.status])}>
                           {obj.status}
                        </span>
                        <span className="font-black text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-100 px-5 py-2.5 rounded-2xl italic tracking-wider">
                           NODE: {obj.nop}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase italic text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                           <User className="w-3.5 h-3.5" /> {obj.owner.name}
                        </span>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-3xl lg:text-4xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-tight uppercase italic">{obj.name}</h3>
                        <div className="flex items-start gap-4 text-sm font-medium text-muted-foreground italic leading-relaxed border-l-4 border-zinc-100 pl-8 ml-2">
                           <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                           <span className="text-base line-clamp-2">{obj.address}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50/50 p-10 rounded-[3rem] border border-zinc-100 shadow-inner">
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic mb-2">Net Surface Area</p>
                           <p className="text-3xl font-black italic tracking-tighter text-foreground italic">{obj.luasTanah} <span className="text-xs font-sans tracking-normal font-black text-primary italic">M²</span></p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic mb-2">Structure Area</p>
                           <p className="text-3xl font-black italic tracking-tighter text-foreground italic">{obj.luasBangun} <span className="text-xs font-sans tracking-normal font-black text-primary italic">M²</span></p>
                        </div>
                     </div>

                     <div className="mt-8 flex items-center justify-between">
                        <div className="flex gap-4">
                           {obj.status !== "VERIFIED" && (
                              <Button 
                                disabled={processing === obj.id}
                                onClick={() => handleUpdateStatus(obj.id, "VERIFIED")}
                                className="h-18 px-10 bg-emerald-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center gap-3"
                              >
                                {processing === obj.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Verifikasi Aset</>}
                              </Button>
                           )}
                           {obj.status !== "REJECTED" && (
                              <Button 
                                variant="outline"
                                disabled={processing === obj.id}
                                onClick={() => handleUpdateStatus(obj.id, "REJECTED")}
                                className="h-18 px-10 border-red-200 text-red-500 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all flex items-center gap-3"
                              >
                                {processing === obj.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><XCircle className="w-5 h-5" /> Tolak Data</>}
                              </Button>
                           )}
                        </div>
                        
                        <div className="flex items-center gap-4 opacity-50 italic">
                           <ShieldCheck className="w-5 h-5 text-zinc-400" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors italic">Authorized Audit Terminal</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-end gap-6 shrink-0 pt-4">
                     <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic text-right leading-none group-hover:text-primary transition-colors italic font-sans italic opacity-80">Logged On: <br/> {new Date(obj.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</p>
                     <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-[2rem] flex items-center justify-center text-zinc-200 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all shadow-inner">
                        <ArrowRight className="w-7 h-7" />
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
