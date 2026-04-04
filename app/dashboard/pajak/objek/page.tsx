"use client";

import { useEffect, useState } from "react";
import { 
  Building2, MapPin, Plus, Search, 
  ChevronRight, BadgeCheck, Clock, 
  Map as MapIcon, Info, Briefcase, ArrowRight, X, Loader2
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/hooks/use-toast";

interface TaxObject {
  id: string;
  nop: string;
  type: string;
  name: string;
  address: string;
  luasTanah: number | null;
  luasBangun: number | null;
  status: string;
}

export default function ObjekPajakPage() {
  const { toast } = useToast();
  const [objects, setObjects] = useState<TaxObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nop: "",
    type: "PBB",
    name: "",
    address: "",
    luasTanah: "",
    luasBangun: "",
  });

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tax/objects");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setObjects(data || []);
    } catch {
      toast("Error", "Gagal sinkronisasi data objek pajak.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/tax/objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      
      setShowModal(false);
      setForm({ nop: "", type: "PBB", name: "", address: "", luasTanah: "", luasBangun: "" });
      fetchObjects();
      toast("Sukses", "Objek pajak berhasil didaftarkan.", "success");
    } catch {
      toast("Error", "Gagal mendaftarkan objek pajak.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = objects.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.nop.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Header Hub ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <div className="w-10 h-0.5 bg-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Real Estate Ledger</p>
           </div>
           <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase italic text-foreground leading-none">
             Objek <span className="text-primary italic">Pajak Saya.</span>
           </h1>
           <p className="text-muted-foreground font-medium text-lg max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8">
              &quot;Kelola dan pantau seluruh objek pajak terdaftar Anda di Kota Medan secara transparan dan akurat dalam satu terminal.&quot;
           </p>
        </div>
        
        <Button 
          size="xl" 
          onClick={() => setShowModal(true)}
          className="btn-premium px-12 h-20 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 group"
        >
          Daftarkan Objek Baru <Plus className="ml-4 w-5 h-5 group-hover:rotate-90 transition-transform" />
        </Button>
      </div>

      {/* ── Quick Highlights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total Objek" value={objects.length.toString()} icon={<Building2 className="w-8 h-8" />} color="blue" />
        <StatCard label="Terverifikasi" value={objects.filter(o => o.status === "VERIFIED").length.toString()} icon={<BadgeCheck className="w-8 h-8" />} color="green" />
        <StatCard label="Menunggu" value={objects.filter(o => o.status === "PENDING").length.toString()} icon={<Clock className="w-8 h-8" />} color="amber" />
      </div>

      {/* ── Search Bar Interface ── */}
      <div className="relative group">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-300 group-focus-within:text-primary transition-all" />
        <input 
          type="text"
          placeholder="Cari NOP, Judul Bangunan, atau Lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-20 pr-10 py-6 bg-white border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 outline-none transition-all font-black text-xs uppercase tracking-widest shadow-inner group-hover:border-primary/20 italic"
        />
      </div>

      {/* ── Asset Registry Grid ── */}
      <div className="grid grid-cols-1 gap-10">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-56 bg-zinc-50 border border-zinc-100 rounded-[3rem] animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white border-2 border-dashed border-zinc-100 rounded-[5rem] group hover:border-primary/20 transition-all shadow-inner">
            <Info className="w-20 h-20 mx-auto mb-8 text-zinc-100 group-hover:text-primary transition-all" />
            <h3 className="text-2xl font-black italic tracking-tighter uppercase italic mb-2 tracking-widest">Repository Kosong.</h3>
            <p className="text-muted-foreground font-medium italic">Silakan mendaftarkan NOP baru untuk mulai pemantauan aset.</p>
          </div>
        ) : (
          filtered.map(obj => (
            <Card key={obj.id} padding="none" variant="elevated" className="group bg-white border-zinc-100 hover:border-primary/30 hover:scale-[1.01] transition-all duration-700 rounded-[4rem] overflow-hidden shadow-2xl shadow-primary/[0.04] p-12 relative flex flex-col md:flex-row gap-12">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="flex-1 space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="px-6 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 italic">{obj.type}</span>
                    <span className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border italic shadow-sm leading-none ${
                        obj.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {obj.status === "VERIFIED" ? "Verified" : "Syncing"}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black italic tracking-tighter group-hover:text-primary transition-colors text-foreground uppercase italic">{obj.name}</h3>
                    <div className="flex items-center gap-2 font-black text-zinc-400 text-[12px] bg-zinc-50 border border-zinc-100 w-fit px-5 py-2.5 rounded-2xl italic tracking-wider">
                       NODE: {obj.nop}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground font-medium italic border-l-4 border-zinc-50 pl-10 ml-2">
                      <MapPin className="w-6 h-6 text-primary shrink-0" />
                      <span className="text-base line-clamp-2">{obj.address}</span>
                    </div>
                  </div>
               </div>

               <div className="md:w-[450px] flex flex-wrap items-center justify-start md:justify-end gap-12 relative z-10 border-t md:border-t-0 md:border-l border-zinc-50 pt-10 md:pt-0 md:pl-16 md:text-right">
                  <div className="flex-1 min-w-[160px] space-y-2">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic leading-none">Net Surface Area</p>
                    <p className="text-4xl font-black italic tracking-tighter text-foreground italic">{obj.luasTanah} <span className="text-sm font-sans tracking-normal font-black text-primary italic">M²</span></p>
                  </div>
                  <div className="flex-1 min-w-[160px] space-y-2">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic leading-none">Structure Area</p>
                    <p className="text-4xl font-black italic tracking-tighter text-foreground italic">{obj.luasBangun} <span className="text-sm font-sans tracking-normal font-black text-primary italic">M²</span></p>
                  </div>
                  <Link href={`/dashboard/pajak/objek/${obj.id}`} className="w-full lg:w-24">
                    <Button variant="outline" className="w-full lg:w-24 h-24 rounded-full flex items-center justify-center p-0 border-zinc-100 hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/40 group/btn">
                       <ArrowRight className="w-10 h-10 group-hover/btn:translate-x-3 transition-transform" />
                    </Button>
                  </Link>
               </div>
            </Card>
          ))
        )}
      </div>

      {/* ── Add Modal Interface ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
           <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowModal(false)} />
           <div className="bg-white rounded-[5rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-zinc-100 animate-in zoom-in-95 duration-500 relative z-10 p-12 lg:p-20">
              <div className="flex items-start justify-between mb-16">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <Building2 className="w-10 h-10" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Registration Terminal</p>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase italic leading-none">Aset <span className="text-primary italic">Baru.</span></h2>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-6 bg-zinc-50 text-zinc-400 rounded-full hover:bg-zinc-100 transition-all shadow-inner"><X className="w-8 h-8" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Nomor Objek Pajak (NOP)</label>
                       <input 
                        required 
                        placeholder="Contoh: 12.71.010..." 
                        className="w-full px-10 py-6 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm italic shadow-inner tracking-[0.1em]"
                        value={form.nop}
                        onChange={e => setForm({...form, nop: e.target.value})}
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Nama Label Objek</label>
                       <input 
                        required 
                        placeholder="Contoh: Rumah Utama, Ruko Medan Mall..." 
                        className="w-full px-10 py-6 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm italic shadow-inner"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Alamat Lengkap Aset</label>
                    <textarea 
                      required rows={3} 
                      className="w-full px-10 py-8 bg-zinc-50 border border-zinc-100 rounded-[3.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-medium italic text-sm shadow-inner resize-none"
                      placeholder="Masukkan alamat persis objek pajak..." 
                      value={form.address}
                      onChange={e => setForm({...form, address: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Luas Tanah (M²)</label>
                       <input 
                        type="number" required 
                        className="w-full px-10 py-6 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm italic shadow-inner"
                        value={form.luasTanah}
                        onChange={e => setForm({...form, luasTanah: e.target.value})}
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-8 leading-none">Luas Bangunan (M²)</label>
                       <input 
                        type="number" required 
                        className="w-full px-10 py-6 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm italic shadow-inner"
                        value={form.luasBangun}
                        onChange={e => setForm({...form, luasBangun: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-8 pt-10">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="flex-1 h-24 bg-primary text-white font-black rounded-full hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-6 uppercase text-xs tracking-widest italic disabled:opacity-50"
                    >
                       {submitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Plus className="w-8 h-8" /> Finalisasi Pendaftaran</>}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="h-24 px-16 bg-zinc-50 text-zinc-400 font-black rounded-full hover:bg-zinc-100 transition-all border border-zinc-100 uppercase text-[10px] tracking-widest shadow-inner transition-all"
                    >
                      Batal
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-primary/10 text-primary border-primary/20",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-12 rounded-[4rem] border border-zinc-50 shadow-2xl shadow-primary/[0.04] flex items-center gap-10 group hover:scale-[1.02] transition-all">
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border shadow-inner group-hover:rotate-12 transition-transform ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-left space-y-1">
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic leading-none">{label}</p>
        <p className="text-5xl font-black italic tracking-tighter text-foreground italic">{value}</p>
      </div>
    </div>
  );
}
