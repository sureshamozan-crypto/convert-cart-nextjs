"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "10px",
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
        },
      }}
    />
  );
}
