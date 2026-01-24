// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import RootShell from "@/components/RootShell";

export const metadata: Metadata = {
  title: "Velah",
  description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <Script
          id="sw-cleanup"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs){
                  regs.forEach(function(reg){ reg.unregister(); });
                });
              }
              if ('caches' in window) {
                caches.keys().then(function(keys){
                  keys.forEach(function(key){ caches.delete(key); });
                });
              }
            `,
          }}
        />
        <LanguageProvider>
          <AuthProvider>
            <RootShell>{children}</RootShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
