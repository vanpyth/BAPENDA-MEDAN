"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, CreditCard, 
  Search, Globe, Zap, 
  Building2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: string;
  slug: string;
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(window.location.origin + "/api/cms/news")
      .then(async r => {
        const contentType = r.headers.get("content-type");
        if (!r.ok || !contentType || !contentType.includes("application/json")) {
           return [];
        }
        return r.json();
      })
      .then(d => {
        const newsItems = Array.isArray(d) ? d : [];
        setNews(newsItems.slice(0, 3));
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    if (session) {
      router.push(`/dashboard/pajak/objek?search=${searchQuery}`);
    } else {
      toast("Pencarian NOP", "Silakan masuk ke portal untuk melakukan pencarian NOP secara detail.", "info");
      router.push("/login");
    }
  };

  const portalLink = session ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-background mesh-gradient overflow-x-hidden selection:bg-primary/20 text-left">
      
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism m-4 md:m-6 rounded-[2.5rem] px-8 md:px-12 py-5 flex items-center justify-between shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-zinc-100 group-hover:rotate-6 transition-transform">
             <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none text-foreground uppercase italic px-1">BAPENDA <span className="text-primary italic font-black">MEDAN</span></h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Sipada-Engine</p>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-12">
          {[
            { label: "Layanan", href: "/layanan" },
            { label: "Pajak Daerah", href: "/pajak-daerah" },
            { label: "Berita", href: "/informasi" },
            { label: "Panduan", href: "/panduan" }
          ].map(item => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all hover:translate-x-1"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <form onSubmit={handleSearch} className="hidden xl:flex items-center bg-zinc-100/50 rounded-2xl px-4 py-2 border border-zinc-200/50 group focus-within:bg-white focus-within:border-primary/30 transition-all">
              <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Cari NOP..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none px-3 text-xs font-bold w-32 focus:w-48 transition-all" 
              />
           </form>
           <Link href={portalLink}>
              <Button variant="primary" size="lg" className="btn-premium px-10 rounded-full text-xs font-black uppercase tracking-widest h-14">
                {session ? "Buka Dashboard" : "Masuk Portal"}
              </Button>
           </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="container mx-auto px-6 pt-52 pb-32 relative">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[100px] -z-10" />

         <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white p-2 pr-6 rounded-full shadow-lg shadow-primary/5">
               <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-shine">New Update</span>
               <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Validasi PBB-P2 2026 Kini Lebih Cepat</p>
            </div>
            
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic leading-[0.85]">
               Fiskal Digital <br />
               <span className="text-primary not-italic inline-block hover:scale-105 transition-transform duration-700 cursor-default">Kota Medan.</span>
            </h2>

            <p className="text-xl md:text-3xl text-muted-foreground font-medium max-w-3xl leading-relaxed italic underline decoration-primary/10 decoration-8 underline-offset-8">
               Integrasi pendapatan daerah dalam satu ekosistem digital yang cerdas, transparan, dan akuntabel.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10">
               <Link href={portalLink}>
                  <Button size="xl" className="btn-premium px-12 rounded-[2rem] gap-4 text-sm font-black uppercase tracking-widest h-20 shadow-2xl">
                     Mulai Pelayanan <ArrowRight className="w-5 h-5" />
                  </Button>
               </Link>
               <Link href="/informasi">
                <Button variant="outline" size="xl" className="px-12 rounded-[2rem] gap-4 text-sm font-black uppercase tracking-widest h-20 border-zinc-200 hover:bg-zinc-50 bg-white">
                    Pusat Informasi <Zap className="w-5 h-5 text-primary" />
                </Button>
               </Link>
            </div>
         </div>
      </section>

      {/* ── Latest News Section (Dynamic CMS) ── */}
      <section className="container mx-auto px-6 py-32 bg-zinc-50/50 rounded-[5rem] overflow-hidden relative">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 px-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-primary">
                  <div className="w-10 h-1 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Global Broadcast Feed</p>
               </div>
               <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none italic uppercase">Update & <span className="text-primary">Berita.</span></h2>
            </div>
            <Link href="/informasi">
               <Button variant="ghost" className="gap-2 font-black uppercase text-[10px] tracking-widest border-b-2 border-zinc-100 hover:border-primary h-14 transition-all italic">Lihat Semua Berita →</Button>
            </Link>
         </div>

         {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>
         ) : news.length === 0 ? (
            <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-widest">Belum Ada Berita Terbaru Terpublikasi.</div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
               {news.map((item) => (
                  <Card key={item.id} padding="none" variant="elevated" className="group rounded-[4rem] bg-white border-zinc-100 hover:border-primary/20 hover:scale-[1.02] transition-all overflow-hidden flex flex-col shadow-2xl shadow-primary/5 min-h-[520px] relative text-left">
                     <div className="p-12 space-y-10 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                           <div className="flex items-center gap-4">
                              <span className="px-5 py-2 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/20 italic">{item.category}</span>
                              <span className="text-[9px] font-black text-zinc-500 italic uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</span>
                           </div>
                           <h4 className="text-3xl font-black italic tracking-tighter leading-tight text-foreground uppercase group-hover:text-primary transition-all italic">{item.title}</h4>
                           <p className="text-base text-muted-foreground font-medium italic border-l-4 border-zinc-100 pl-8 leading-relaxed">&quot;{item.summary}&quot;</p>
                        </div>
                        <Link href={`/informasi`} className="w-full">
                           <Button variant="outline" className="w-full h-18 rounded-3xl font-black uppercase text-[10px] tracking-widest border-zinc-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4">
                              Baca Selengkapnya <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                           </Button>
                        </Link>
                     </div>
                  </Card>
               ))}
            </div>
         )}
      </section>

      {/* ── Services Section ── */}
      <section className="container mx-auto px-6 py-32 space-y-20">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Specialized Services</h3>
               <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none italic uppercase">Akses Layanan <br /> <span className="text-primary italic">Tanpa Batas.</span></h2>
            </div>
            <Link href="/layanan">
               <Button variant="ghost" className="gap-2 font-black uppercase text-[10px] tracking-[0.3em] h-14 px-8 border-zinc-100 border-b-2 hover:border-primary transition-all italic">Katalog Layanan →</Button>
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
               { title: "Manajemen PBB-P2", desc: "Cek tagihan, cetak SPPT digital, dan riwayat pembayaran PBB dalam satu portal identitas.", icon: Building2, href: "/dashboard/pajak/objek" },
               { title: "Sistem BPHTB Online", desc: "Validasi bea perolehan hak atas tanah dan bangunan yang terintegrasi langsung dengan BPN.", icon: CreditCard, href: "/dashboard/pajak/tagihan" },
               { title: "Monitoring Pajak Daerah", desc: "Pelaporan omzet pajak hotel, restoran, hiburan, dan reklame secara real-time dan transparan.", icon: Globe, href: "/dashboard" },
            ].map((s, i) => (
               <Card key={i} padding="xl" variant="elevated" className="group h-[420px] bg-white border-zinc-50 hover:scale-[1.03] transition-all flex flex-col justify-between shadow-2xl shadow-primary/10 rounded-[4rem] p-12 text-left">
                  <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center text-primary border border-zinc-100 group-hover:rotate-12 transition-all shadow-inner">
                     <s.icon className="w-12 h-12" />
                  </div>
                  <div className="space-y-6">
                     <h4 className="text-3xl font-black italic tracking-tight leading-none uppercase italic text-foreground group-hover:text-primary transition-colors">{s.title}</h4>
                     <p className="text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8 cursor-default">&quot;{s.desc}&quot;</p>
                  </div>
                  <Link href={session ? s.href : "/login"}>
                    <Button variant="primary" size="icon" className="w-16 h-16 rounded-full rotate-45 hover:rotate-90 transition-transform btn-premium">
                        <ArrowRight className="w-8 h-8" />
                    </Button>
                  </Link>
               </Card>
            ))}
         </div>
      </section>

      {/* ── Call to Action Section ── */}
      <section className="container mx-auto px-6 py-20">
         <div className="bg-white border border-zinc-100 rounded-[5rem] p-12 md:p-24 relative overflow-hidden group shadow-2xl shadow-primary/5 text-left">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-50 group-hover:scale-110 transition-transform">
                     <Image src="/logo.png" alt="Logo" width={64} height={64} />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-tight italic uppercase italic">Portal <br /> Keamanan <br /> <span className="text-primary underline decoration-primary/10 decoration-8 underline-offset-8">Terjamin.</span></h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-zinc-100 pl-10">
                     &quot;Protokol SSL/TLS 1.3 serta enkripsi data AES-256 memastikan seluruh data transaksi dan identitas wajib pajak terlindungi sepenuhnya secara digital.&quot;
                  </p>
                  <Link href={portalLink}>
                    <Button size="xl" className="btn-premium px-14 rounded-full h-24 text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/30">Mulai Akses Sekarang <ArrowRight className="ml-4 w-6 h-6" /></Button>
                  </Link>
               </div>
               <div className="relative flex justify-center">
                  <div className="w-80 h-80 bg-white shadow-2xl rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 animate-float">
                     <Image src="/logo.png" alt="Logo Medan" width={100} height={100} />
                     <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Auth-Check</p>
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">Encrypted</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Footer ── */}
      <footer className="container mx-auto px-6 py-20 mt-20 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 opacity-70 text-left">
         <div className="space-y-3">
            <h4 className="text-xl font-black italic tracking-tighter uppercase">Bapenda Medan<span className="text-primary">.</span></h4>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.5em]">Integrated Fiscal System</p>
         </div>
         <div className="flex flex-wrap gap-8 md:gap-12">
            {[
              { label: "Hubungi Kami", href: "/informasi" },
              { label: "Ketentuan Layanan", href: "/panduan" },
              { label: "Kebijakan Privasi", href: "/panduan" },
              { label: "PPID", href: "/dashboard/ppid" }
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors italic whitespace-nowrap">
                {l.label}
              </Link>
            ))}
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">© 2026 Kota Medan. Berkah & Berwibawa.</p>
      </footer>
    </div>
  );
}
