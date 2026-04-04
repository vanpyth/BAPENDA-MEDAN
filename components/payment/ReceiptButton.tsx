"use client";

import React, { useState } from "react";
import { 
  PDFDownloadLink, 
  PDFViewer,
} from "@react-pdf/renderer";
import { Download, Eye, FileText, X } from "lucide-react";
import { DigitalReceipt } from "./DigitalReceipt";

export interface ReceiptData {
  invoiceNumber: string;
  amount: number;
  taxPeriod: string;
  paidAt?: string | Date;
  method?: string | null;
  user: {
    name: string;
    email: string;
    nik?: string;
    phone?: string;
  };
  taxObject: {
    nop: string;
    type: string;
    name: string;
    address: string;
  };
}

interface ReceiptButtonProps {
  data: ReceiptData;
}

export const ReceiptButton: React.FC<ReceiptButtonProps> = ({ data }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Download Button */}
      <PDFDownloadLink
        document={<DigitalReceipt data={data} />}
        fileName={`Receipt-${data.invoiceNumber}.pdf`}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all"
      >
        {({ loading }: { loading: boolean }) =>
          loading ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyiapkan...
            </span>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download PDF
            </>
          )
        }
      </PDFDownloadLink>

      {/* Preview Button */}
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold text-sm transition-all"
      >
        <Eye className="w-4 h-4" /> Preview
      </button>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowPreview(false)}
          />
          <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Pratinjau Bukti Pembayaran</h3>
                  <p className="text-zinc-500 text-sm mt-1">{data.invoiceNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 bg-zinc-200 p-8 flex items-center justify-center">
              <PDFViewer className="w-full h-full border-0 rounded-2xl shadow-lg">
                <DigitalReceipt data={data} />
              </PDFViewer>
            </div>

            <div className="p-6 bg-white border-t border-zinc-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-zinc-100 hover:bg-zinc-200 transition-all"
              >
                Tutup
              </button>
              <PDFDownloadLink
                document={<DigitalReceipt data={data} />}
                fileName={`Receipt-${data.invoiceNumber}.pdf`}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Sekarang
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
