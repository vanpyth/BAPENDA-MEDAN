"use client";

import React from "react";
import { 
  FileText, 
  Settings, 
  CreditCard, 
  User, 
  PlusCircle, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuditLog {
  id: string;
  action: string;
  table: string;
  recordId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    role: string;
  };
}

interface AuditTimelineProps {
  logs: AuditLog[];
}

export default function AuditTimeline({ logs }: AuditTimelineProps) {
  const getActionIcon = (action: string) => {
    if (action.includes("CREATE")) return <PlusCircle className="w-4 h-4 text-emerald-500" />;
    if (action.includes("UPDATE")) return <Edit className="w-4 h-4 text-amber-500" />;
    if (action.includes("DELETE")) return <Trash2 className="w-4 h-4 text-rose-500" />;
    if (action.includes("PAYMENT")) return <CreditCard className="w-4 h-4 text-blue-500" />;
    if (action.includes("LOGIN")) return <User className="w-4 h-4 text-indigo-500" />;
    return <Settings className="w-4 h-4 text-slate-500" />;
  };

  const formatJSON = (val: Record<string, unknown> | null) => {
    if (!val) return null;
    return JSON.stringify(val, null, 2);
  };

  return (
    <div className="space-y-6">
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-200">
          <Clock className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Belum ada log aktivitas yang ditemukan.</p>
        </div>
      ) : (
        <div className="relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pb-8">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-12 mb-8 group animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Dot Icon */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-200">
                {getActionIcon(log.action)}
              </div>

              {/* Content Card */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group-hover:shadow-md transition-shadow duration-200">
                <div className="p-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{log.action}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase",
                        log.table === "Payment" ? "bg-blue-50 text-blue-600" : 
                        log.table === "User" ? "bg-indigo-50 text-indigo-600" :
                        "bg-slate-50 text-slate-600"
                      )}>
                        {log.table}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span className="font-semibold text-slate-700">{log.user.name || "Anonim"}</span> 
                      <span className="text-slate-300">•</span>
                      <span>{log.user.email}</span>
                      <span className="text-slate-300">•</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 text-[9px] uppercase">{log.user.role}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600">
                      {format(new Date(log.createdAt), "dd MMMM yyyy", { locale: id })}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {format(new Date(log.createdAt), "HH:mm:ss")} WIB
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/30">
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                    <FileText className="w-3 h-3" />
                    <span>Detail Record ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600">{log.recordId}</code></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.oldValue && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Data Lama
                        </span>
                        <pre className="text-[10px] bg-white p-3 rounded-lg border border-slate-100 max-h-32 overflow-auto font-mono text-slate-600 leading-relaxed shadow-inner">
                          {formatJSON(log.oldValue)}
                        </pre>
                      </div>
                    )}
                    {log.newValue && (
                      <div className={cn("space-y-1.5", !log.oldValue && "col-span-2")}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Data Baru
                        </span>
                        <pre className="text-[10px] bg-white p-3 rounded-lg border border-slate-100 max-h-32 overflow-auto font-mono text-slate-600 leading-relaxed shadow-inner">
                          {formatJSON(log.newValue)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
