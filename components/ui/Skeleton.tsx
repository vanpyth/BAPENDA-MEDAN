import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-zinc-50 border border-zinc-100/50 shadow-inner", className)}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end gap-10 mb-16">
        <div className="space-y-6 w-full max-w-sm">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-16 w-full rounded-[1.5rem]" />
          <Skeleton className="h-6 w-3/4 rounded-full" />
        </div>
        <Skeleton className="h-20 w-56 rounded-full hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[240px] rounded-[3rem] shadow-xl shadow-primary/[0.02]" />
        ))}
      </div>

      <div className="space-y-10 pt-16">
        <div className="flex items-center justify-between gap-6 px-4">
           <Skeleton className="h-12 w-64 rounded-full" />
           <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-8">
           {[1, 2, 3, 4].map(i => (
             <Skeleton key={i} className="h-48 w-full rounded-[4rem] shadow-xl shadow-primary/[0.02]" />
           ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-20 animate-in fade-in duration-1000">
      <div className="space-y-6 text-center">
        <Skeleton className="h-4 w-24 mx-auto rounded-full" />
        <Skeleton className="h-20 w-3/4 mx-auto rounded-[2rem]" />
        <Skeleton className="h-8 w-1/2 mx-auto rounded-full" />
      </div>
      
      <div className="space-y-10">
        <Skeleton className="h-[400px] w-full rounded-[5rem] shadow-2xl shadow-primary/[0.02]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="h-64 rounded-[3.5rem] shadow-xl shadow-primary/[0.02]" />
          <Skeleton className="h-64 rounded-[3.5rem] shadow-xl shadow-primary/[0.02]" />
        </div>
        <Skeleton className="h-40 w-full rounded-[3rem] shadow-xl shadow-primary/[0.02]" />
      </div>

      <div className="pt-20">
         <Skeleton className="h-[300px] w-full rounded-[5rem] shadow-inner opacity-40" />
      </div>
    </div>
  );
}
