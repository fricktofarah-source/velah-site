// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/components/LanguageProvider";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";
import RootShell from "@/components/RootShell";

export const metadata: Metadata = {
  title: "Velah",
  description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const runtimeEnv = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Script
          id="velah-runtime-env"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__VELAH_ENV__=${JSON.stringify(runtimeEnv)};`,
          }}
        />
        <LanguageProvider>
          <ServiceWorkerCleanup />
          <RootShell>{children}</RootShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
