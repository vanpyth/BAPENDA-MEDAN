"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, CheckCircle, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";

const ReceiptButton = dynamic(
  () => import("@/components/payment/ReceiptButton").then((mod) => mod.ReceiptButton),
  { ssr: false }
);

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  taxPeriod: string;
  method?: string;
  paidAt?: string;
  createdAt: string;
  expiredAt: string;
  notes?: string;
  taxObject: {
    nop: string; type: string; name: string; address: string;
    luasTanah?: number; luasBangun?: number; njop?: number;
  };
  user: { name: string; email: string; nik?: string; phone?: string; address?: string };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

const METHOD_LABELS: Record<string, string> = {
  VA_BRI: "Virtual Account BRI", VA_BNI: "Virtual Account BNI",
  VA_MANDIRI: "Virtual Account Mandiri", QRIS: "QRIS", BANK_TRANSFER: "Transfer Bank",
};

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tax/invoice/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d.payment);
      })
      .catch(() => setError("Gagal memuat invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <p className="text-xl font-bold text-destructive">{error || "Invoice tidak ditemukan"}</p>
        <button onClick={() => window.close()} className="mt-4 px-6 py-2 bg-muted rounded-xl font-bold">Tutup</button>
      </div>
    </div>
  );

  const isPaid = data.status === "PAID";

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white">
      {/* Print Controls - hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-800 text-white px-6 py-3 flex items-center justify-between">
        <p className="font-bold text-sm">Bukti Pembayaran Pajak — SIPADA Medan</p>
        <div className="flex items-center gap-3">
          {isPaid && <ReceiptButton data={data} />}
          
          <button
            suppressHydrationWarning
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 bg-zinc-700/60 text-white rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all border border-zinc-600"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          
          <button
            suppressHydrationWarning
            onClick={() => window.close()}
            className="flex items-center gap-2 px-5 py-2 bg-zinc-600/30 text-white rounded-xl font-bold text-sm hover:bg-zinc-600 transition-all font-mono"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-2xl mx-auto bg-white shadow-2xl print:shadow-none mt-16 print:mt-0 mb-8 print:mb-0">
        {/* Header */}
        <div className="bg-primary p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-black text-xl tracking-tight">BAPENDA KOTA MEDAN</p>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Sistem Informasi Pendapatan Daerah</p>
              </div>
            </div>
            {isPaid && (
              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-2xl font-bold text-sm">
                  <CheckCircle className="w-4 h-4" /> LUNAS
                </div>
              </div>
            )}
          </div>
          <div className="mt-8">
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">BUKTI PEMBAYARAN PAJAK</p>
            <p className="text-3xl font-black tracking-tight">{data.invoiceNumber}</p>
            {data.paidAt && (
              <p className="text-white/70 text-sm mt-1">Dibayar pada {formatDate(data.paidAt)}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Wajib Pajak Info */}
          <section>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">Data Wajib Pajak</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Nama", data.user.name],
                ["NIK", data.user.nik || "—"],
                ["Email", data.user.email],
                ["No. HP", data.user.phone || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-bold text-sm mt-0.5">{v}</p>
                </div>
              ))}
              {data.user.address && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="font-bold text-sm mt-0.5">{data.user.address}</p>
                </div>
              )}
            </div>
          </section>

          {/* Objek Pajak Info */}
          <section>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">Data Objek Pajak</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["NOP", data.taxObject.nop],
                ["Jenis Pajak", data.taxObject.type],
                ["Nama Objek", data.taxObject.name],
                ["Periode", data.taxPeriod],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-bold text-sm mt-0.5">{v}</p>
                </div>
              ))}
              {data.taxObject.address && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Alamat Objek</p>
                  <p className="font-bold text-sm mt-0.5">{data.taxObject.address}</p>
                </div>
              )}
            </div>
          </section>

          {/* Payment Details */}
          <section>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 pb-2 border-b border-border">Rincian Pembayaran</p>
            <div className="space-y-3">
              {[
                ["Nomor Invoice", data.invoiceNumber],
                ["Metode Pembayaran", data.method ? (METHOD_LABELS[data.method] ?? data.method) : "—"],
                ["Tanggal Transaksi", data.paidAt ? formatDate(data.paidAt) : "Belum Dibayar"],
                ["Status", isPaid ? "Lunas ✓" : data.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className={`font-bold ${k === "Status" && isPaid ? "text-green-600" : ""}`}>{v}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-base">Total Dibayar</span>
                <span className="font-extrabold text-2xl text-primary">{formatCurrency(data.amount)}</span>
              </div>
            </div>
          </section>

          {/* QR Code Placeholder */}
          {isPaid && (
            <section className="flex gap-6 items-start">
              <div className="w-24 h-24 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl flex items-center justify-center text-xs text-zinc-400 text-center font-medium">
                QR<br />Verifikasi
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Verifikasi Keaslian Dokumen</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Dokumen ini diterbitkan secara elektronik oleh Sistem SIPADA Bapenda Kota Medan. 
                  Scan QR code untuk memverifikasi keaslian dokumen.
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Ref: {data.id}
                </p>
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Dokumen ini merupakan bukti pembayaran yang sah dan diterbitkan secara resmi oleh<br />
              <strong>Badan Pendapatan Daerah (Bapenda) Kota Medan</strong><br />
              Jl. Jend. Ahmad Yani No. 1, Medan · Telp. 061-4567890 · bapenda.pemkomedan.go.id
            </p>
            <p className="text-xs text-muted-foreground text-center mt-3 font-mono">
              Dicetak: {new Date().toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
