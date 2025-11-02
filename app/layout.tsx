import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/app/store/Providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convert Cart Service | Task",
  description:
    "A microservice-based product and segment management platform built with Node.js, Express.js, and Next.js 16. Fetches WooCommerce products, syncs data with MongoDB Atlas, and provides real-time filtering with Redux Toolkit integration.",
    icons: {
    icon: "/favicon.ico", // or "/favicon.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>{children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
