"use client";

import { useEffect, useState } from "react";
import { 
  History, Search, Download, 
  CheckCircle, Calendar, CreditCard,
  Clock, Receipt, AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PaymentHistory {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  taxPeriod: string;
  method?: string;
  paidAt?: string;
  createdAt: string;
  taxObject: {
    nop: string;
    name: string;
    address: string;
    type: string;
  }
}

export default function RiwayatPajakPage() {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetch("/api/tax/pay")
      .then(r => r.json())
      .then(d => setHistory(d.payments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  const formatDate = (val: string) => new Date(val).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' });

  const filtered = history.filter(h => {
    const matchSearch =
      h.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (h.taxObject?.nop || "").includes(searchTerm) ||
      (h.taxObject?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || h.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid = history.filter(h => h.status === "PAID").reduce((sum, h) => sum + Number(h.amount), 0);

  const statusConfig: Record<string, { label: string; color: string }> = {
    PAID: { label: "Lunas", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    PENDING: { label: "Belum Bayar", color: "bg-amber-50 text-amber-600 border-amber-100" },
    EXPIRED: { label: "Kadaluarsa", color: "bg-red-50 text-red-500 border-red-100" },
    CANCELLED: { label: "Dibatalkan", color: "bg-zinc-50 text-zinc-500 border-zinc-100" },
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 selection:bg-primary/20">
      
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 text-left">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <div className="w-10 h-0.5 bg-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Electronic Archive System</p>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground leading-none">
             Arsip <span className="text-primary italic">Pembayaran.</span>
           </h1>
           <p className="text-muted-foreground font-medium text-lg max-w-xl leading-relaxed italic border-l-4 border-primary/10 pl-8">
              &quot;Akses lembar bukti pembayaran sah (e-receipt) dan pantau rekam jejak kontribusi perpajakan Anda sepanjang masa.&quot;
           </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 uppercase italic tracking-widest">Total Terbayar</p>
            <p className="text-3xl font-black italic tracking-tighter text-primary">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Semua", count: history.length, status: "ALL", color: "zinc" },
          { label: "Lunas", count: history.filter(h => h.status === "PAID").length, status: "PAID", color: "emerald" },
          { label: "Pending", count: history.filter(h => h.status === "PENDING").length, status: "PENDING", color: "amber" },
          { label: "Kadaluarsa", count: history.filter(h => h.status === "EXPIRED").length, status: "EXPIRED", color: "red" },
        ].map(stat => (
          <button
            key={stat.status}
            onClick={() => setFilterStatus(stat.status)}
            className={cn(
              "p-6 rounded-[2rem] border text-left transition-all font-black",
              filterStatus === stat.status ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-[1.02]" : "bg-white border-zinc-100 hover:border-primary/20"
            )}
          >
            <p className={cn("text-4xl italic tracking-tighter", filterStatus === stat.status ? "text-white" : "text-foreground")}>{stat.count}</p>
            <p className={cn("text-[9px] uppercase tracking-widest mt-1", filterStatus === stat.status ? "text-white/70" : "text-zinc-400")}>{stat.label}</p>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-all" />
         <input 
           type="text"
           placeholder="Cari No. Invoice, NOP, atau nama objek..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full pl-16 pr-8 py-5 bg-white border border-zinc-100 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 outline-none transition-all font-black text-xs uppercase tracking-widest shadow-sm hover:border-primary/20"
         />
      </div>

      {/* ── History Ledger ── */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-50 border border-zinc-100 rounded-[3rem] animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white border-2 border-dashed border-zinc-100 rounded-[5rem] group hover:border-primary/20 transition-all">
            <History className="w-20 h-20 mx-auto mb-8 text-zinc-200" />
            <h3 className="text-2xl font-black italic tracking-tighter uppercase italic mb-2">Belum Ada Riwayat.</h3>
            <p className="text-muted-foreground font-medium italic mb-8">Data transaksi akan muncul setelah Anda menyelesaikan pembayaran.</p>
            <Link href="/dashboard/pajak/tagihan">
              <Button className="btn-premium px-10 h-16 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20">Lihat Tagihan Aktif</Button>
            </Link>
          </div>
        ) : (
          filtered.map(h => {
            const sc = statusConfig[h.status] ?? statusConfig.PAID;
            return (
              <Card key={h.id} padding="none" variant="elevated" className="group bg-white border-zinc-100 hover:border-primary/20 hover:scale-[1.005] transition-all duration-500 rounded-[3rem] shadow-xl shadow-primary/[0.03] p-10 relative flex flex-col md:flex-row gap-8">
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex-1 space-y-6 relative z-10 text-left">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border italic leading-none", sc.color)}>{sc.label}</span>
                      <span className="text-[10px] font-black text-zinc-400 font-mono italic bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-xl">#{h.invoiceNumber}</span>
                      <span className="px-4 py-2 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-full border border-primary/10 italic">Tahun {h.taxPeriod}</span>
                    </div>
                    
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors uppercase italic">{h.taxObject?.name ?? "—"}</h3>
                       <p className="text-[11px] font-black text-zinc-400 font-mono italic">NOP: {h.taxObject?.nop ?? "—"}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium italic">
                       {h.status === "PAID" && h.paidAt ? (
                         <span className="flex items-center gap-2 text-emerald-600"><CheckCircle className="w-4 h-4" /> Dibayar: {formatDate(h.paidAt)}</span>
                       ) : (
                         <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Dibuat: {formatDate(h.createdAt)}</span>
                       )}
                       {h.method && <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> {h.method}</span>}
                    </div>
                 </div>

                 <div className="md:w-[280px] flex flex-col justify-between items-start md:items-end gap-6 relative z-10 border-t md:border-t-0 md:border-l border-zinc-50 pt-6 md:pt-0 md:pl-8 text-left md:text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase italic">Nominal</p>
                      <p className="text-3xl font-black italic tracking-tighter text-primary">{formatCurrency(Number(h.amount))}</p>
                    </div>

                    <div className="flex gap-3 w-full">
                      {h.status === "PENDING" ? (
                        <Link href="/dashboard/pajak/tagihan" className="flex-1">
                          <Button className="w-full h-14 rounded-2xl btn-premium font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Bayar Sekarang
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-zinc-100 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 flex items-center justify-center gap-2 shadow-sm">
                          <Download className="w-4 h-4" /> Unduh Receipt
                        </Button>
                      )}
                    </div>
                 </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ── Compliance Info ── */}
      <div className="bg-white border border-zinc-100 p-10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-primary/5 group">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/10 shadow-inner group-hover:rotate-12 transition-transform">
          <Receipt className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="text-2xl font-black italic tracking-tighter uppercase italic leading-none mb-2">Keabsahan Dokumen Digital.</h4>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed italic border-l-4 border-primary/20 pl-6 max-w-xl">
             &quot;E-Receipt SIPADA Medan merupakan bukti pembayaran pajak yang sah sesuai regulasi pemerintah dan dapat digunakan untuk keperluan administratif perpajakan.&quot;
          </p>
        </div>
        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-100 px-8 py-4 rounded-2xl">
          <Clock className="w-5 h-5" />
          <span className="font-black uppercase text-[10px] tracking-widest italic">Arsip 5 Tahun</span>
        </div>
      </div>
    </div>
  );
}
