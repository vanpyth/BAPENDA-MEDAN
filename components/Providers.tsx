"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import { ToastProvider } from "@/lib/hooks/use-toast";
import { Toaster } from "@/components/ui/Toaster";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ToastProvider>
        {mounted ? (
          <>
            {children}
            <Toaster />
          </>
        ) : null}
      </ToastProvider>
    </SessionProvider>
  );
}
