import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";
import AppTabBar from "@/components/app/AppTabBar";
import AppTransitions from "@/components/app/AppTransitions";
export const metadata: Metadata = {
  title: {
    default: "Velah App",
    template: "%s · Velah",
  },
  description: "Velah hydration app",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-surface">
      <AppTransitions>{children}</AppTransitions>
      <AppTabBar />
    </div>
  );
}
