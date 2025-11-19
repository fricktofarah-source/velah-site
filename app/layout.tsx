// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import StandaloneBodyClass from "@/components/StandaloneBodyClass";
import StandaloneDock from "@/components/StandaloneDock";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Velah",
  description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
  manifest: "/manifest.json",
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
          <StandaloneBodyClass />
          {/* Skip link for keyboard/screen readers */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only fixed top-2 left-2 z-[999] rounded-full bg-black text-white px-3 py-2 text-sm"
          >
            Skip to content
          </a>

          <Navbar />

          <main id="content" className="flex-1">
            {children}
          </main>

          <StandaloneDock />

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
