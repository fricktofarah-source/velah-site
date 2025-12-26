// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import StandaloneRedirect from "@/components/app/StandaloneRedirect";
import RootShell from "@/components/RootShell";

export const metadata: Metadata = {
  title: "Velah",
  description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
  manifest: "/app-manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon-192x192.png",
  },
  appleWebApp: {
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        <LanguageProvider>
          <ServiceWorkerRegister />
          <StandaloneRedirect />
          <RootShell>{children}</RootShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
