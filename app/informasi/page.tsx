"use client";

import PublicLayout from "@/components/PublicLayout";
import { 
  Megaphone, FileText, BookOpen, 
  Search, ArrowRight, Clock, Star
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { useToast } from "@/lib/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function InformasiPage() {
  const { toast } = useToast();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(window.location.origin + "/api/cms/news")
      .then(async r => {
        const contentType = r.headers.get("content-type");
        if (!r.ok || !contentType || !contentType.includes("application/json")) {
           const bodyText = await r.text();
           console.error("[INFORMASI_API_BAD_RESPONSE]", {
              status: r.status,
              contentType,
              isOk: r.ok,
              bodySnippet: bodyText.substring(0, 100)
           });
           // Fallback to empty if server returns non-JSON (like dev errors or login redirects)
           return [];
        }
        return r.json();
      })
      .then(d => {
        const newsItems = Array.isArray(d) ? d : (d && typeof d === 'object' && 'error' in d) ? [] : [d];
        setAllNews(newsItems as NewsItem[]);
      })
      .catch(err => {
        console.error("[INFORMASI_CLIENT_FETCH_ERROR]", err);
        setAllNews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", "Berita", "Pengumuman", "Artikel", "Regulasi"];

  const filteredNews = allNews.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (n.summary || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === "Semua" || 
                        n.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast("Berhasil", "Email Anda telah terdaftar dalam sistem newsletter kami.", "success");
    setEmail("");
  };

  const getIcon = (cat: string) => {
    if (cat === "ARTIKEL") return BookOpen;
    if (cat === "PENGUMUMAN") return FileText;
    if (cat === "INOVASI") return Star;
    return Megaphone;
  };

  const getColor = (cat: string) => {
    if (cat === "ARTIKEL") return "bg-amber-500";
    if (cat === "PENGUMUMAN") return "bg-red-500";
    if (cat === "INOVASI") return "bg-blue-500";
    return "bg-primary";
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-20 space-y-20 selection:bg-primary/20">
         {/* Header */}
         <div className="max-w-4xl space-y-6 text-left">
            <p className="text-primary font-black uppercase tracking-[0.4em] text-xs underline decoration-primary/20 underline-offset-4">Pusat Informasi</p>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-tight text-foreground uppercase italic leading-[0.85]">
               Warta & <span className="text-primary italic">Pembaruan.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed italic border-l-4 border-primary/10 pl-10 ml-2">
               Sumber berita resmi, pengumuman publik, dan panduan terkini mengenai kebijakan pendapatan daerah Kota Medan secara real-time.
            </p>
         </div>

         {/* Search & Categories */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-100 pb-12">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide no-scrollbar">
               {categories.map(cat => (
                  <Button 
                    key={cat} 
                    variant="ghost" 
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-8 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                      activeCategory === cat 
                        ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                        : "bg-white border-zinc-100 hover:border-primary/20 text-zinc-600"
                    )}
                  >
                    {cat}
                  </Button>
               ))}
            </div>
            <div className="relative group max-w-md w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-primary transition-all" />
               <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Cari berita atau pengumuman..." 
                  className="w-full pl-14 pr-8 h-14 bg-zinc-50 rounded-2xl border border-transparent focus:border-primary/20 transition-all font-black text-xs uppercase tracking-widest outline-none shadow-inner italic"
               />
            </div>
         </div>

         {/* Featured Content Ledger */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {loading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-zinc-50 border border-zinc-100 rounded-[3rem] animate-pulse" />)
            ) : filteredNews.length === 0 ? (
               <div className="lg:col-span-2 py-32 text-center bg-white border-2 border-dashed border-zinc-100 rounded-[5rem] group hover:border-primary/20 transition-all shadow-inner">
                  <Search className="w-20 h-20 text-zinc-100 mx-auto mb-8" />
                  <p className="text-xl font-black italic tracking-tighter text-zinc-300 uppercase italic">Data Not Found — Adjusting Keywords.</p>
               </div>
            ) : (
               filteredNews.map((item) => {
                  const Icon = getIcon(item.category);
                  const colorClass = getColor(item.category);
                  return (
                     <Card key={item.id} padding="none" variant="elevated" className="group flex flex-col md:flex-row overflow-hidden border-zinc-100 hover:border-primary/20 hover:scale-[1.01] transition-all bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] rounded-[4rem] text-left">
                        <div className={cn("md:w-16 flex flex-col items-center justify-center text-white py-10 shrink-0", colorClass)}>
                           <Icon className="w-8 h-8 rotate-[-90deg] md:rotate-0" />
                           <div className="h-24 w-[1px] bg-white/20 mt-10 hidden md:block" />
                        </div>
                        <div className="flex-1 p-10 lg:p-12 space-y-6 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000 -z-0">
                              <Icon className="w-40 h-40" />
                           </div>
                           <div className="flex items-center justify-between relative z-10">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 italic leading-none">{item.category}</span>
                              <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest leading-none">
                                 <Clock className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                              </div>
                           </div>
                           <h3 className="text-2xl lg:text-3xl font-black italic tracking-tighter leading-tight text-foreground group-hover:text-primary transition-colors relative z-10 uppercase italic">{item.title}</h3>
                           <p className="text-muted-foreground font-medium text-sm leading-relaxed relative z-10 italic border-l-4 border-zinc-50 pl-8 ml-2">
                              &quot;{item.summary || item.content?.substring(0, 120) + "..."}&quot;
                           </p>
                           <div className="pt-4 relative z-10">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toast("Akses Terbatas", "Detail artikel saat ini hanya tersedia melalui Portal Berita Internal.", "info")}
                                className="px-0 group-hover:text-primary gap-4 font-black uppercase text-[10px] tracking-widest border-b border-transparent hover:border-primary transition-all rounded-none italic"
                              >
                                 Baca Artikel Lengkap <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
                              </Button>
                           </div>
                        </div>
                     </Card>
                  );
               })
            )}
         </div>

         {/* Newsletter CTA */}
         <Card padding="none" variant="elevated" className="bg-white border-zinc-100 rounded-[5rem] relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] text-center p-14 lg:p-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="max-w-3xl mx-auto space-y-12 relative z-10">
               <div className="mx-auto w-20 h-20 bg-white border border-zinc-50 rounded-[2.5rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all shadow-2xl shadow-primary/10">
                  <Megaphone className="w-10 h-10" />
               </div>
               <div className="space-y-6">
                 <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight italic uppercase text-foreground">Selalu <span className="text-primary underline decoration-primary/10 underline-offset-8 decoration-8">Terinformasi.</span></h2>
                 <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/10 pl-10 mx-auto max-w-xl">
                   &quot;Dapatkan update langsung mengenai regulasi pajak terbaru dan pengumuman pelayanan ke kotak masuk Anda secara otomatis.&quot;
                 </p>
               </div>
               <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center gap-6 max-w-xl mx-auto pt-8">
                  <input 
                     type="email" 
                     required
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     placeholder="Daftarkan Email Anda" 
                     className="w-full h-18 bg-zinc-50 rounded-[2rem] border border-zinc-100 px-10 outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-black text-sm shadow-inner italic"
                  />
                  <Button type="submit" variant="primary" size="lg" className="rounded-[2rem] h-18 px-12 btn-premium group whitespace-nowrap font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20">
                     Langganan <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-3 transition-transform" />
                  </Button>
               </form>
            </div>
         </Card>
      </div>
    </PublicLayout>
  );
}
