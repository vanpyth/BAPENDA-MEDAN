"use client";

import PublicLayout from "@/components/PublicLayout";
import { 
  Building2, Map, CreditCard, LayoutGrid, 
  Car, Droplets, Tv, ArrowRight, Star
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const taxTypes = [
  { id: "pbb", title: "Pajak Bumi & Bangunan", icon: Building2, desc: "Pajak atas tanah dan/atau bangunan yang dimiliki, dikuasai, dan/atau dimanfaatkan oleh orang pribadi atau badan.", rate: "0.1% - 0.2%", period: "Tahunan", canSimulate: true },
  { id: "bphtb", title: "BPHTB", icon: Map, desc: "Bea perolehan hak atas tanah dan bangunan karena adanya perbuatan atau peristiwa hukum.", rate: "5% (NPOP-NPOPTKP)", period: "Per Transaksi", canSimulate: true },
  { id: "reklame", title: "Pajak Reklame", icon: LayoutGrid, desc: "Pajak atas penyelenggaraan reklame baik permanen maupun temporer di wilayah Kota Medan.", rate: "Bervariasi (Luas & Lokasi)", period: "Tahunan", canSimulate: false },
  { id: "restoran", title: "Pajak Restoran", icon: CreditCard, desc: "Pajak atas pelayanan yang disediakan oleh restoran (makanan/minuman) kepada konsumen.", rate: "10% dari Omzet", period: "Bulanan", canSimulate: true },
  { id: "parkir", title: "Pajak Parkir", icon: Car, desc: "Pajak atas penyelenggaraan tempat parkir di luar badan jalan.", rate: "20% - 30% dari Omzet", period: "Bulanan", canSimulate: false },
  { id: "air-tanah", title: "Pajak Air Tanah", icon: Droplets, desc: "Pajak atas pengambilan dan/atau pemanfaatan air tanah sesuai volume.", rate: "20% dari NPA", period: "Bulanan", canSimulate: false },
  { id: "hiburan", title: "Pajak Hiburan", icon: Tv, desc: "Pajak atas penyelenggaraan hiburan termasuk tontonan film, sirkus, bioskop, dll.", rate: "15% - 35% dari Omzet", period: "Bulanan", canSimulate: false },
];

export default function PajakDaerah() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(taxTypes[0].id);

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-20 space-y-20 selection:bg-primary/20">
         {/* Header */}
         <div className="max-w-4xl space-y-6 text-left">
            <p className="text-primary font-black uppercase tracking-[0.4em] text-xs underline decoration-primary/20 underline-offset-4">Informasi Fiskal</p>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-tight text-foreground uppercase italic">
               Jenis <span className="text-primary italic">Pajak Daerah.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed italic border-l-4 border-primary/10 pl-8">
               Memahami struktur perpajakan daerah Kota Medan. Kami menghadirkan transparansi mengenai tarif, periode pelaporan, dan penggunaan dana pajak Anda.
            </p>
         </div>

         {/* Interactive Explorer */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-4 space-y-3">
               {taxTypes.map((t) => (
                  <button
                     key={t.id}
                     onClick={() => setActiveTab(t.id)}
                     className={cn(
                        "w-full flex items-center gap-6 px-10 h-24 rounded-[3rem] font-bold transition-all group relative overflow-hidden text-left",
                        activeTab === t.id 
                           ? "bg-primary text-white shadow-2xl scale-[1.02] border-0" 
                           : "text-zinc-500 hover:bg-zinc-50 shadow-sm border border-zinc-100 bg-white"
                     )}
                  >
                     {activeTab === t.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-12 bg-white/20 rounded-r-full shadow-glow" />}
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all", activeTab === t.id ? "bg-white/20 border-white/20 shadow-inner" : "bg-zinc-50 border-zinc-100 group-hover:text-primary")}>
                        <t.icon className={cn("w-6 h-6", activeTab === t.id ? "text-white scale-110" : "text-zinc-600 group-hover:text-primary")} />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest leading-none truncate">{t.title}</span>
                  </button>
               ))}
            </div>

            {/* Content View */}
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-1000">
               {taxTypes.map((t) => activeTab === t.id && (
                  <Card key={t.id} padding="none" variant="elevated" className="relative group overflow-hidden border-zinc-100 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.06)] bg-white min-h-[560px] flex flex-col rounded-[5rem] p-12 lg:p-20 text-left">
                     <div className="absolute top-0 right-0 p-32 opacity-5 -z-0">
                        <t.icon className="w-96 h-96" />
                     </div>
                     <div className="space-y-14 relative z-10 flex-1">
                        <div className="space-y-8">
                           <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-zinc-50 flex items-center justify-center text-primary rotate-3 group-hover:rotate-0 transition-transform shadow-2xl shadow-primary/10">
                              <t.icon className="w-12 h-12" />
                           </div>
                           <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-foreground uppercase italic underline decoration-primary/10 underline-offset-8 decoration-8">{t.title}</h2>
                        </div>
                        
                        <p className="text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic border-l-4 border-zinc-100 pl-10 ml-2">
                           &quot;{t.desc}&quot;
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Tarif Pajak Berjalan</p>
                              <div className="px-6 py-4 bg-primary/5 border border-primary/10 rounded-3xl w-fit">
                                 <p className="text-3xl font-black text-primary italic tracking-tighter">{t.rate}</p>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Periode Pelaporan</p>
                              <div className="px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-3xl w-fit">
                                 <p className="text-3xl font-black text-foreground italic tracking-tighter uppercase">{t.period}</p>
                              </div>
                           </div>
                        </div>

                        <div className="pt-10 flex flex-wrap gap-6 border-t border-zinc-50">
                           <Link href={session ? "/dashboard/pajak/objek" : "/login"}>
                              <Button variant="primary" size="xl" className="rounded-full px-14 btn-premium group h-20 shadow-2xl shadow-primary/30 font-black uppercase text-xs tracking-widest">{session ? "Bayar Sekarang" : "Masuk Portal"} <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" /></Button>
                           </Link>
                           {t.canSimulate && (
                              <Link href={session ? "/dashboard/pajak/hitung" : "/login"}>
                                 <Button variant="outline" size="xl" className="rounded-full px-12 gap-4 h-20 font-black uppercase text-xs tracking-widest border-zinc-100 bg-white hover:bg-zinc-50 transition-all shadow-xl shadow-zinc-100/10">Simulasi Pajak <Star className="w-5 h-5 text-amber-500 fill-amber-500" /></Button>
                              </Link>
                           )}
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         </div>

         {/* Public Insight Section */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <Card padding="lg" variant="outline" className="border-border/50 text-center space-y-6 bg-white shadow-2xl shadow-primary/5 rounded-[2.5rem] group border-zinc-100">
               <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 overflow-hidden shadow-inner">
                  <Star className="w-8 h-8 group-hover:scale-125 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic tracking-tighter uppercase leading-none">Dana Pembangunan.</h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-blue-500/20 pl-4">Dana pajak daerah dikembalikan dalam bentuk perbaikan infrastruktur jalan dan fasilitas umum Kota Medan.</p>
               </div>
            </Card>
            <Card padding="lg" variant="outline" className="border-border/50 text-center space-y-6 bg-white shadow-2xl shadow-primary/5 rounded-[2.5rem] group border-zinc-100">
               <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary overflow-hidden shadow-inner">
                  <Star className="w-8 h-8 group-hover:scale-125 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic tracking-tighter uppercase leading-none">Layanan Sosial.</h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">Kontribusi Anda mendanai program kesehatan, pendidikan gratis, dan jaring pengaman sosial warga.</p>
               </div>
            </Card>
            <Card padding="lg" variant="outline" className="border-border/50 text-center space-y-6 bg-white shadow-2xl shadow-primary/5 rounded-[2.5rem] group border-zinc-100">
               <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 overflow-hidden shadow-inner">
                  <Star className="w-8 h-8 group-hover:scale-125 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black italic tracking-tighter uppercase leading-none">Medan Berkah.</h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">Mari wujudkan Kota Medan yang lebih mandiri dan berdaya saing melalui kepatuhan pajak yang tinggi.</p>
               </div>
            </Card>
         </div>
      </div>
    </PublicLayout>
  );
}
