// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Velah",
  description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
  manifest: "/manifest.json",
  themeColor: "#7FCBD8",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon-192x192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="p-0 m-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
