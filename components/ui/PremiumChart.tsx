"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

interface PremiumChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PremiumChart({ data, title, subtitle, className }: PremiumChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("space-y-10", className)}>
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-2">
            {subtitle && (
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">
                {subtitle}
              </p>
            )}
            {title && (
              <h3 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">
                {title}
              </h3>
            )}
          </div>
        </div>
      )}

      <div className="bg-zinc-50/50 rounded-[3rem] p-10 border border-zinc-100/50 shadow-inner group">
        <div className="flex items-end justify-between gap-4 h-64 px-4 overflow-x-auto no-scrollbar">
          {data.map((item, i) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-6 min-w-[60px] group/item"
              >
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  {/* ── Value Tooltip ── */}
                  <div className="absolute -top-8 px-4 py-2 bg-white rounded-xl shadow-xl border border-zinc-100 text-[10px] font-black text-primary opacity-0 group-hover/item:opacity-100 transition-all -translate-y-2 group-hover/item:translate-y-0 whitespace-nowrap z-10">
                    {item.value.toLocaleString()}
                  </div>

                  {/* ── Bar ── */}
                  <div
                    className="w-10 rounded-full transition-all duration-1000 ease-out relative overflow-hidden btn-premium shadow-2xl shadow-primary/10"
                    style={{ 
                      height: `${percentage}%`,
                      transitionDelay: `${i * 100}ms`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover/item:opacity-20 transition-opacity animate-shine" />
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover/item:text-primary transition-colors italic whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
