"use client";

import { useEffect, useState } from "react";
import { Plus, BookOpen, Trash2, Edit, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  slug: string;
}

export default function AdminArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    isActive: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/articles");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      toast("Error", "Gagal sinkronisasi data artikel.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ArticleItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      summary: item.summary,
      content: item.content,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/cms/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Terhapus", "Artikel berhasil dihilangkan dari database.", "success");
      fetchArticles();
    } catch {
      toast("Error", "Gagal menghapus entri.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = editingItem ? `/api/cms/articles/${editingItem.id}` : "/api/cms/articles";
      const method = editingItem ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan artikel");
      
      setShowModal(false);
      setEditingItem(null);
      setForm({ title: "", summary: "", content: "", isActive: true });
      fetchArticles();
      toast("Sukses", editingItem ? "Perubahan disimpan." : "Artikel baru terbit.", "success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 selection:bg-primary/20 text-left">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 px-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
             <div className="w-10 h-1 bg-primary rounded-full shadow-glow" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Education & Guidelines</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-foreground uppercase italic underline decoration-primary/10 decoration-8 underline-offset-8">
            CMS <span className="text-primary italic">Artikel.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8 ml-2">
            &quot;Kelola modul edukasi perpajakan, panduan teknis, dan artikel literasi ekonomi untuk masyarakat Kota Medan.&quot;
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setForm({ title: "", summary: "", content: "", isActive: true }); setShowModal(true); }}
          className="btn-premium flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 group self-start lg:self-auto"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Tambah Artikel Baru
        </button>
      </div>

      {/* ── Grid Interface ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 pt-10">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="h-80 bg-zinc-50 border border-zinc-100 rounded-[4rem] animate-pulse shadow-inner" />)
        ) : articles.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[5rem] border-2 border-dashed border-zinc-100 group hover:border-primary/20 transition-all shadow-inner">
             <BookOpen className="w-20 h-20 text-zinc-100 mx-auto mb-6" />
             <p className="text-xl font-black italic tracking-tighter text-zinc-300 uppercase italic">Repository Empty — No Articles Found.</p>
          </div>
        ) : (
          articles.map((item) => (
            <div key={item.id} className="bg-white p-12 rounded-[4rem] border border-zinc-100 shadow-2xl shadow-primary/[0.03] group hover:border-primary/20 hover:scale-[1.02] transition-all duration-700 relative flex flex-col justify-between overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
               
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border italic leading-none shadow-sm ${item.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-400 border-zinc-200"}`}>
                      {item.isActive ? "Published" : "Draft"}
                    </div>
                    <div className="flex gap-3 translate-y-[-10px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                       <button onClick={() => handleEdit(item)} className="p-3 hover:bg-primary hover:text-white text-zinc-400 bg-zinc-50 rounded-xl transition-all border border-zinc-100"><Edit className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(item.id)} className="p-3 hover:bg-red-600 hover:text-white text-red-600 bg-red-50 rounded-xl transition-all border border-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-tight uppercase italic line-clamp-2">{item.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground italic line-clamp-3 leading-relaxed">{item.summary}</p>
               </div>

               <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-50 relative z-10">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               </div>
            </div>
          ))
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
           <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowModal(false)} />
           <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-zinc-100 animate-in zoom-in-95 duration-500 relative z-10 p-12 lg:p-16">
              <div className="flex items-start justify-between mb-12">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <BookOpen className="w-8 h-8" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Knowledge Desk</p>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black italic tracking-tighter uppercase italic leading-none">{editingItem ? "Update" : "Publikasi"} <span className="text-primary italic">Artikel.</span></h2>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-5 bg-zinc-50 text-zinc-400 rounded-[2rem] hover:bg-zinc-100 transition-all shadow-inner"><X className="w-6 h-6" /></button>
              </div>

              {error && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2.5rem] text-red-600 text-[10px] font-black uppercase tracking-widest italic shadow-inner">
                   Validation Alert: {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-6 leading-none">Judul Edukasi</label>
                  <input
                    type="text"
                    className="w-full px-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-black text-sm tracking-tight italic shadow-inner"
                    placeholder="Contoh: Mengenal Pajak Bumi dan Bangunan P2..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-6 leading-none">Sinopsis Konten</label>
                  <textarea
                    rows={3}
                    className="w-full px-8 py-6 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-medium italic text-sm shadow-inner resize-none"
                    placeholder="Apa yang akan dipelajari pembaca dari artikel ini?"
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic pl-6 leading-none">Naskah Literasi Lengkap</label>
                  <textarea
                    rows={12}
                    className="w-full px-8 py-8 bg-zinc-50 border border-zinc-100 rounded-[3rem] focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-medium italic text-sm shadow-inner resize-none"
                    placeholder="Tuliskan materi edukasi secara sistematis..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-20 bg-primary text-white font-black rounded-full hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 uppercase text-xs tracking-widest shadow-xl"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> {editingItem ? "Update Library" : "Terbitkan Artikel"}</>}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="h-20 px-12 bg-zinc-50 text-zinc-400 font-black rounded-full hover:bg-zinc-100 transition-all border border-zinc-100 uppercase text-[10px] tracking-widest shadow-inner transition-all"
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
