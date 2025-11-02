"use client";

import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/app/store/Providers";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
        <Toaster />
      </ReduxProvider>
    </SessionProvider>
  );
}
