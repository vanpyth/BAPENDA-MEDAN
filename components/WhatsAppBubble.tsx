"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppBubble() {
  const WHATSAPP_NUMBER = "628116170000"; // Placeholder number for Bapenda Medan Helpdesk
  const MESSAGE = "Halo Bapenda Medan, saya ingin bertanya mengenai layanan pajak daerah.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed right-6 bottom-28 lg:bottom-10 z-[55]">
      <button
        onClick={openWhatsApp}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40 group relative overflow-hidden"
        aria-label="Hubungi WhatsApp"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <MessageCircle className="w-8 h-8 fill-current" />
        
        {/* ── Tooltip ── */}
        <div className="absolute right-20 bg-white text-zinc-800 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl shadow-2xl border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-x-4 group-hover:translate-x-0">
          Butuh Bantuan? Hubungi Kami
        </div>

        {/* ── Pulse Effect ── */}
        <span className="absolute inset-0 rounded-full border-4 border-[#25D366] animate-ping opacity-20" />
      </button>
    </div>
  );
}
