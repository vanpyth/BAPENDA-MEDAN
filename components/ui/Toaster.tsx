"use client";

import { useToast } from "@/lib/hooks/use-toast";
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: { id: string; type: string; title: string; message?: string }; onRemove: () => void }) {
  const typeStyles = {
    success: "bg-green-600 shadow-green-600/20",
    error: "bg-red-600 shadow-red-600/20",
    warning: "bg-amber-600 shadow-amber-600/20",
    info: "bg-zinc-900 shadow-zinc-950/40",
  };

  const icons = {
    success: <CheckCircle2 className="w-6 h-6" />,
    error: <ShieldAlert className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };

  return (
    <div className={cn(
      "w-96 p-6 rounded-[2rem] text-white shadow-2xl flex items-start gap-5 pointer-events-auto animate-in slide-in-from-right-10 duration-500 overflow-hidden relative group",
      typeStyles[toast.type as keyof typeof typeStyles]
    )}>
       {/* Background Glow */}
       <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
       
       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 transition-transform group-hover:scale-110">
          {icons[toast.type as keyof typeof icons]}
       </div>
       
       <div className="flex-1 pr-4">
          <p className="font-black tracking-tight text-lg mb-1 leading-none">{toast.title}</p>
          <p className="text-sm font-medium opacity-80 leading-relaxed line-clamp-2">{toast.message}</p>
       </div>

       <button 
          onClick={onRemove}
          className="p-1 hover:bg-white/20 transition-all rounded-lg opacity-40 group-hover:opacity-100"
       >
          <X className="w-4 h-4" />
       </button>
       
       {/* Progress line */}
       <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div className="h-full bg-white/40 animate-shrink origin-left" style={{ animationDuration: '5000ms' }} />
       </div>
    </div>
  );
}
