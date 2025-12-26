"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, DropletIcon, HomeIcon, LoopIcon, UserIcon } from "./AppIcons";

const tabs = [
  { href: "/app", label: "Home", icon: HomeIcon },
  { href: "/app/hydration", label: "Hydration", icon: DropletIcon },
  { href: "/app/orders", label: "Orders", icon: BoxIcon },
  { href: "/app/loop", label: "Loop", icon: LoopIcon },
  { href: "/app/profile", label: "Profile", icon: UserIcon },
];

const hiddenRoutes = new Set(["/app/onboarding", "/app/auth"]);

export default function AppTabBar() {
  const pathname = usePathname();

  if (!pathname || hiddenRoutes.has(pathname)) return null;

  return (
    <nav
      aria-label="Velah app navigation"
      className="fixed left-1/2 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 w-[min(420px,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur px-2 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
    >
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                isActive ? "bg-[var(--velah)] text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon active={isActive} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
