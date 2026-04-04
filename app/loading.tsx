export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20" />
        <p className="animate-pulse text-sm font-bold tracking-widest text-primary uppercase">Memuat SIPADA...</p>
      </div>
    </div>
  );
}
