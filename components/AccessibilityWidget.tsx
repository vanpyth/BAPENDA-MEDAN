"use client";

import React, { useState, useEffect } from "react";
import { Settings, Type, Eye, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  const reset = () => {
    setFontSize(100);
    setIsHighContrast(false);
  };

  return (
    <div className="fixed left-6 bottom-28 lg:bottom-10 z-50">
      {/* ── Toggle Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-2xl bg-white shadow-2xl border border-zinc-100 flex items-center justify-center transition-all duration-500 hover:rotate-90 group",
          isOpen ? "bg-primary text-white" : "text-primary"
        )}
        aria-label="Aksesibilitas"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6 animate-spin-slow" />}
      </button>

      {/* ── Menu Panel ── */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] border border-zinc-100 shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 italic">Fitur Aksesibilitas</h3>
          
          <div className="space-y-8">
            {/* ── Font Size Control ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-2"><Type className="w-3.5 h-3.5" /> Ukuran Teks</span>
                <span>{fontSize}%</span>
              </div>
              <div className="flex gap-2">
                {[80, 100, 120, 140].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      "flex-1 py-3 text-xs font-black rounded-xl border transition-all",
                      fontSize === size ? "bg-primary text-white border-primary" : "bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-primary/30"
                    )}
                  >
                    {size === 100 ? "A" : size > 100 ? "A+" : "A-"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Contrast Toggle ── */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Eye className="w-3.5 h-3.5" /> Kontras Tinggi
              </span>
              <button
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-all duration-300",
                  isHighContrast ? "bg-primary" : "bg-zinc-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all",
                  isHighContrast ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full py-4 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors border-t border-zinc-50 pt-6"
            >
              <RefreshCw className="w-3 h-3" /> Reset Pengaturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
