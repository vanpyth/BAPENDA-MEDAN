"use client";

import PublicLayout from "@/components/PublicLayout";
import { 
  CreditCard, ArrowRight, ShieldCheck, Zap,
  Smartphone, Monitor, HelpCircle,
  Play, Download, CheckCircle, Search
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/lib/hooks/use-toast";
import { useRouter } from "next/navigation";

const guides = [
  { id: 1, title: "Cara Pendaftaran Akun SIPADA", desc: "Langkah mudah membuat akun untuk mengakses seluruh layanan pajak daerah di Kota Medan.", steps: [
    "Kunjungi portal SIPADA Medan melalui browser Anda.",
    "Pilih menu 'Daftar Akun' di pojok kanan atas.",
    "Lengkapi data diri (NIK, Nama Sesuai KTP, Email, No. HP).",
    "Verifikasi email Anda melalui tautan yang dikirimkan.",
    "Selesaikan pengaturan kata sandi dan login perdana."
  ], icon: ShieldCheck, color: "bg-primary/5 text-primary border-primary/10" },
  { id: 2, title: "Prosedur Pembayaran PBB Online", desc: "Panduan lengkap membayar Pajak Bumi dan Bangunan menggunakan kode bayar digital.", steps: [
    "Dapatkan NOP (Nomor Objek Pajak) dari SPPT Anda.",
    "Pilih menu 'Cek Tagihan' dan masukkan NOP.",
    "Klik 'Bayar Pajak' untuk mendapatkan Virtual Account.",
    "Lakukan transfer melalui Bank Mandiri, BNI, BRI, atau e-Wallet.",
    "Unduh resi pembayaran digital dari menu riwayat."
  ], icon: CreditCard, color: "bg-primary/5 text-primary border-primary/10" },
  { id: 3, title: "Pelaporan Pajak Restoran (PB1)", desc: "Metode pelaporan omzet bulanan bagi wajib pajak badan/usaha di Kota Medan.", steps: [
    "Login sebagai Wajib Pajak di portal SIPADA.",
    "Pilih modul 'Pajak Restoran' > 'Lapor Omzet'.",
    "Input jumlah omzet harian atau total dalam satu bulan.",
    "Sistem akan mengalkulasi 10% dari omzet secara otomatis.",
    "Keluarkan kode bayar dan selesaikan transaksi."
  ], icon: Zap, color: "bg-amber-50 text-amber-600 border-amber-100" },
];

export default function PanduanPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [activeGuide, setActiveGuide] = useState(guides[0].id);
  const [search, setSearch] = useState("");

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(search.toLowerCase()) || 
    g.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSupport = () => {
    if (session) {
      router.push("/dashboard/pengaduan");
    } else {
      router.push("/login");
    }
  };

  const handleDownload = () => {
    toast("Mempersiapkan Unduhan", "Dokumen PDF sedang diproses oleh server Bapenda. Mohon tunggu sejenak...", "info");
  };

  const handleWatch = () => {
    toast("Pemutar Video", "Fitur Video Tutorial sedang dalam tahap finalisasi kualitas 4K. Cek kembali segera!", "info");
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24 space-y-24 selection:bg-primary/20">
         
         {/* ── Header Command ── */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 text-left">
           <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-3 text-primary">
                 <div className="w-12 h-1.5 bg-primary rounded-full shadow-glow" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none underline decoration-primary/20 underline-offset-4">Self-Service Module</p>
              </div>
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-foreground uppercase italic leading-[0.85]">
                 Pusat <br /><span className="text-primary italic">Panduan.</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic border-l-4 border-primary/10 pl-10 ml-2">
                 &quot;Setiap langkah dipermudah. Pelajari cara mengoptimalkan penggunaan portal SIPADA untuk kemudahan administrasi fiskal Anda secara inklusif.&quot;
              </p>
           </div>

           <div className="relative group w-full lg:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-all" />
              <input 
                 type="text" 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 placeholder="Cari topik panduan..." 
                 className="w-full pl-14 pr-8 h-18 bg-white border border-zinc-100 rounded-[2rem] font-black italic text-xs uppercase tracking-widest outline-none shadow-xl shadow-zinc-100/10 focus:ring-4 focus:ring-primary/5 transition-all text-left"
              />
           </div>
         </div>

         {/* ── Layout Grid ── */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
            {/* ── Navigation Tabs Lobby ── */}
            <div className="lg:col-span-4 space-y-8">
               <div className="space-y-4">
                  {filteredGuides.length === 0 ? (
                    <div className="p-12 text-center bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100">
                      <HelpCircle className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Topic Not Indexed.</p>
                    </div>
                  ) : (
                    filteredGuides.map((g) => (
                       <button
                          key={g.id}
                          onClick={() => setActiveGuide(g.id)}
                          className={cn(
                             "w-full flex items-center gap-6 px-10 h-28 rounded-[4rem] font-black transition-all group relative overflow-hidden text-left",
                             activeGuide === g.id 
                                ? "bg-primary text-white shadow-2xl scale-[1.02] border-0" 
                                : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-100 shadow-sm"
                          )}
                       >
                          {activeGuide === g.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-14 bg-white/20 rounded-r-full shadow-glow" />}
                          <div className={cn("w-14 h-14 rounded-[1.8rem] flex items-center justify-center shrink-0 border transition-all", activeGuide === g.id ? "bg-white/20 border-white/20 shadow-inner" : "bg-zinc-50 border-zinc-100 group-hover:text-primary group-hover:scale-110 shadow-sm")}>
                             <g.icon className="w-7 h-7" />
                          </div>
                          <span className="text-[11px] uppercase tracking-widest leading-tight italic">{g.title}</span>
                       </button>
                    ))
                  )}
               </div>
               
               {/* ── Promo Light Section ── */}
               <Card padding="none" variant="elevated" className="mt-12 bg-white border-zinc-100 rounded-[5rem] p-14 lg:p-18 space-y-12 relative overflow-hidden group shadow-2xl shadow-primary/5 cursor-default text-left">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000 -z-0">
                     <Play className="w-64 h-64" />
                  </div>
                  <div className="space-y-10 relative z-10 text-center flex flex-col items-center">
                     <div className="mx-auto w-24 h-24 bg-primary/10 rounded-[3rem] flex items-center justify-center shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all border border-primary/5">
                        <Play className="w-12 h-12 fill-primary text-primary" />
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-4xl lg:text-5xl font-black italic tracking-tighter leading-none text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">Tutorial <br /><span className="text-primary italic">Visual.</span></h4>
                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] italic border-t border-zinc-100 pt-6">&quot;High-Definition Precision Logic&quot;</p>
                     </div>
                     <Button variant="outline" onClick={handleWatch} className="w-full h-20 rounded-[2.5rem] font-black uppercase text-xs tracking-widest border-zinc-100 bg-white hover:bg-zinc-50 transition-all shadow-xl shadow-zinc-100/10">Tonton Video Tutorial <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-3 transition-transform" /></Button>
                  </div>
               </Card>
            </div>

            {/* ── Guide Steps Canvas ── */}
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000">
               {guides.map((g) => activeGuide === g.id && (
                  <Card key={g.id} padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] min-h-[700px] flex flex-col p-14 md:p-24 lg:p-28 relative overflow-hidden shadow-2xl shadow-primary/5 text-left">
                     <div className="absolute top-0 right-0 p-40 opacity-5 -z-0">
                        <g.icon className="w-[500px] h-[500px]" />
                     </div>
                     <div className="relative z-10 flex-1 space-y-24">
                        <div className="space-y-10">
                           <div className="inline-flex px-8 py-3 bg-primary/5 text-primary rounded-full text-[11px] font-black uppercase tracking-[0.3em] italic border border-primary/10 leading-none">Modul Panduan: [{g.id}]</div>
                           <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none text-foreground uppercase italic leading-[0.85]">{g.title}</h2>
                           <p className="text-2xl text-muted-foreground font-medium max-w-3xl leading-relaxed italic border-l-8 border-primary/10 pl-12 ml-4">&quot;{g.desc}&quot;</p>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                           {g.steps.map((step, i) => (
                              <div key={i} className="flex items-start gap-12 p-14 lg:p-18 bg-zinc-50/50 rounded-[4.5rem] border border-zinc-100 hover:border-primary/20 transition-all group/step shadow-inner hover:bg-white relative">
                                 <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shrink-0 font-black text-4xl italic tracking-tighter text-zinc-500 border-2 border-zinc-50 group-hover/step:bg-primary group-hover/step:text-white group-hover/step:border-primary transition-all shadow-xl group-hover/step:scale-110 group-hover/step:-rotate-6">
                                    {i + 1}
                                 </div>
                                 <div className="space-y-4 pt-2">
                                    <p className="text-2xl font-bold text-foreground leading-snug italic tracking-tight">
                                       &quot;{step}&quot;
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-500 opacity-0 group-hover/step:opacity-100 transition-all group-hover/step:translate-x-2">
                                       <CheckCircle className="w-4 h-4 fill-emerald-500/10" /> Step Validated by SIPADA-Engine
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="pt-20 flex flex-wrap gap-8 border-t border-zinc-100">
                           <Button variant="primary" size="xl" onClick={handleDownload} className="rounded-full px-16 h-24 btn-premium group font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/30">Unduh PDF Panduan <Download className="ml-5 w-7 h-7 group-hover:translate-y-3 transition-transform" /></Button>
                           <Button variant="outline" onClick={handleSupport} className="rounded-full px-14 h-24 gap-6 font-black uppercase text-xs tracking-[0.2em] border-zinc-100 bg-white hover:bg-zinc-50 transition-all shadow-xl shadow-zinc-100/10 italic text-zinc-600"><HelpCircle className="w-7 h-7 text-primary" /> Hubungi Support Sistem</Button>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         </div>

         {/* ── Platform Certification ── */}
         <div className="flex flex-col md:flex-row items-center justify-center gap-20 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 mb-20">
            <div className="flex items-center gap-6 group/badge">
               <Smartphone className="w-10 h-10 group-hover/badge:scale-125 transition-transform text-primary" />
               <div className="text-left font-black uppercase tracking-widest text-[12px] italic">Mobile Cloud Service <p className="text-zinc-500 tracking-normal opacity-50 not-italic font-medium">Bapenda Medan Optimized</p></div>
            </div>
            <div className="h-12 w-[1px] bg-zinc-200 hidden md:block" />
            <div className="flex items-center gap-6 group/badge">
               <Monitor className="w-10 h-10 group-hover/badge:scale-125 transition-transform text-primary" />
               <div className="text-left font-black uppercase tracking-widest text-[12px] italic">Expert Desktop UI/UX <p className="text-zinc-500 tracking-normal opacity-50 not-italic font-medium">Precision Browser View</p></div>
            </div>
         </div>
      </div>
    </PublicLayout>
  );
}
