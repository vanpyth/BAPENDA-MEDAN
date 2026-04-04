"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin, Info, TrendingUp, AlertCircle, CheckCircle2, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import type { MapContainerProps, TileLayerProps, MarkerProps, PopupProps, CircleProps } from "react-leaflet";

// Dynamically import Leaflet components (SSR-safe) with proper typing
const MapContainer = dynamic<MapContainerProps>(() => import("react-leaflet").then((mod) => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-50 animate-pulse rounded-[3rem] border border-zinc-100" />
});
const TileLayer = dynamic<TileLayerProps>(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic<MarkerProps>(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic<PopupProps>(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic<CircleProps>(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

interface TaxPoint {
  id: string;
  nop: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isCompliant: boolean;
  amount: number;
}

export function MapVisualization() {
  const [data, setData] = useState<TaxPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TaxPoint | null>(null);

  // Center of Medan
  const center: [number, number] = [3.595, 98.672];

  useEffect(() => {
    fetch("/api/gis")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("GIS fetch failed", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
     return (
        <div className="w-full h-[700px] bg-zinc-50 animate-pulse rounded-[4rem] border border-zinc-100 flex items-center justify-center shadow-inner">
            <div className="flex flex-col items-center gap-6">
               <TrendingUp className="w-12 h-12 text-primary/20 animate-bounce" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 italic">Sinkronisasi Geospasial...</p>
            </div>
        </div>
     );
  }

  return (
    <Card padding="none" variant="elevated" className="bg-white rounded-[4rem] border border-zinc-100 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.1)] overflow-hidden animate-in fade-in duration-1000 relative">
      {/* ── Leaflet Assets ── */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #f8fafc !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 2rem !important;
          padding: 12px !important;
          box-shadow: 0 40px 60px -15px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
          border-radius: 1rem !important;
          margin: 2rem !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background: white !important;
          color: black !important;
          border: 1px solid #f1f5f9 !important;
          width: 44px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-weight: black !important;
        }
        .leaflet-control-zoom-in { border-radius: 1rem 1rem 0 0 !important; }
        .leaflet-control-zoom-out { border-radius: 0 0 1rem 1rem !important; }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[700px]">
        {/* ── Map Side (3 columns) ── */}
        <div className="lg:col-span-3 h-[700px] relative">
          <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="z-0">
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
             />

             {/* Heatmap Layer */}
             {data.map((point) => (
               <Circle 
                  key={`circle-${point.id}`}
                  center={[point.lat, point.lng]}
                  pathOptions={{ 
                    fillColor: point.isCompliant ? "#10b981" : "#f43f5e",
                    color: point.isCompliant ? "#059669" : "#e11d48",
                    weight: 1,
                    fillOpacity: 0.25
                  }}
                  radius={400}
               />
             ))}

             {/* Markers */}
             {data.map((point) => (
                <Marker 
                  key={point.id} 
                  position={[point.lat, point.lng]}
                  eventHandlers={{
                    click: () => setSelected(point),
                  }}
                >
                  <Popup>
                    <div className="p-4 space-y-2 text-left">
                       <div className="flex items-center gap-2 mb-2">
                          <div className={cn("w-2 h-2 rounded-full", point.isCompliant ? "bg-emerald-500" : "bg-rose-500")} />
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Objek Pajak Medan</p>
                       </div>
                       <p className="font-black text-lg italic tracking-tight text-zinc-900 leading-none uppercase">{point.name}</p>
                       <p className="text-[10px] font-bold text-primary font-mono tracking-tighter">{point.nop}</p>
                    </div>
                  </Popup>
                </Marker>
             ))}
          </MapContainer>

          {/* Floating Legend */}
          <div className="absolute top-10 left-10 z-[400] space-y-4 pointer-events-none">
            <div className="flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-zinc-100 italic transition-all group pointer-events-auto cursor-default">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" /> Zone Kepatuhan Tinggi
            </div>
            <div className="flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-zinc-100 italic transition-all group pointer-events-auto cursor-default">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse" /> Zone Tunggakan Aktif
            </div>
          </div>
        </div>

        {/* ── Info Side Panel (1 column) ── */}
        <div className="p-10 border-l border-zinc-100 bg-white space-y-10 flex flex-col relative z-20 text-left">
          {selected ? (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 px-6 py-2 bg-zinc-50 border border-zinc-100 rounded-full w-fit">
                     <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">Detail Objek Fiskal</p>
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter leading-none text-foreground uppercase italic underline decoration-zinc-100 decoration-4 underline-offset-8">{selected.name}</h3>
                  <p className="text-zinc-500 font-medium text-base italic border-l-2 border-zinc-50 pl-6 leading-relaxed">&quot;{selected.address}&quot;</p>
               </div>

               <div className="space-y-6">
                  <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 shadow-inner group hover:bg-white transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                         <Info className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Identitas NOP</p>
                    </div>
                    <p className="font-mono text-xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">{selected.nop}</p>
                  </div>

                  <Card padding="lg" variant="elevated" className={cn(
                    "rounded-[2.5rem] border text-left space-y-4 shadow-xl transition-all duration-700",
                    selected.isCompliant 
                    ? "bg-emerald-50 border-emerald-100 shadow-emerald-500/5" 
                    : "bg-rose-50 border-rose-100 shadow-rose-500/5"
                  )}>
                    <div className="flex items-center justify-between">
                       <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] italic", selected.isCompliant ? "text-emerald-600" : "text-rose-600")}>Security Status</span>
                       <div className={cn("w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner", selected.isCompliant ? "text-emerald-500" : "text-rose-500")}>
                          {selected.isCompliant ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className={cn("text-3xl font-black italic tracking-tighter uppercase leading-none", selected.isCompliant ? "text-emerald-600" : "text-rose-600")}>
                         {selected.isCompliant ? "Kepatuhan OK" : "Tunggakan"}
                       </p>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60">Verified fiscal node status</p>
                    </div>
                  </Card>
               </div>

               <div className="mt-auto pt-10 border-t border-zinc-50 flex flex-col gap-4">
                  <Button 
                    onClick={() => setSelected(null)}
                    size="xl"
                    className="w-full h-16 bg-zinc-100 border border-zinc-200 text-zinc-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:border-primary/20 hover:text-primary transition-all shadow-sm italic"
                  >
                    Reset Visual Fokus
                  </Button>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-1000">
               <div className="relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-colors animate-pulse" />
                  <div className="w-24 h-24 bg-white border border-zinc-100 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10 rotate-6 group-hover:rotate-0 transition-transform">
                    <MapPin className="w-10 h-10 text-primary" />
                  </div>
               </div>
               <div className="space-y-3">
                  <p className="font-black text-2xl italic tracking-tighter uppercase leading-none italic">Telusuri <span className="text-primary">Wilayah.</span></p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic leading-relaxed px-6 italic">&quot;Klik pada titik geospasial di peta untuk memanggil detail integritas fiskal di lokasi tersebut.&quot;</p>
               </div>
               <div className="w-20 h-1 bg-zinc-100 rounded-full" />
            </div>
          )}

          {!selected && (
            <div className="mt-auto pt-8 border-t border-zinc-50">
               <div className="flex items-center gap-6 group cursor-default">
                  <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left space-y-1">
                     <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic leading-none">Global Distribution</p>
                     <p className="text-lg font-black italic tracking-tighter leading-none">{data.length} Node Sinkron</p>
                  </div>
                  <ArrowRight className="ml-auto w-5 h-5 text-zinc-200 group-hover:text-primary transition-all group-hover:translate-x-2" />
               </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
