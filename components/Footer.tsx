// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer aria-label="Footer" className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {/* keep img to match how you use it in Navbar */}
            <Image
              src="/assets/velah_ripple.png"
              alt="Velah"
              width={64}
              height={32}
              className="h-8 w-auto"
              draggable={false}
              priority={false}
            />
            <span className="font-semibold tracking-tight">Velah</span>
          </div>
          <p className="text-sm text-slate-600">
            Eco-luxury water in reusable glass gallons. Dubai & GCC.
          </p>
        </div>

        {/* Company */}
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <Link className="link-underline focus-ring rounded-md px-1 -mx-1" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="link-underline focus-ring rounded-md px-1 -mx-1" href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className="link-underline focus-ring rounded-md px-1 -mx-1" href="/subscription">
                Subscription
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <div className="font-semibold mb-3">Support</div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <a className="link-underline focus-ring rounded-md px-1 -mx-1" href="#">
                FAQs
              </a>
            </li>
            <li>
              <a className="link-underline focus-ring rounded-md px-1 -mx-1" href="#">
                Contact
              </a>
            </li>
            <li>
              <a className="link-underline focus-ring rounded-md px-1 -mx-1" href="#">
                Privacy
              </a>
            </li>
          </ul>
        </div>

        {/* Follow */}
        <div>
          <div className="font-semibold mb-3">Follow</div>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50 focus-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm6.5-.75a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5ZM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="X / Twitter"
              className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50 focus-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M3 3h3.7l5.1 7.3L17.6 3H21l-7.3 9.9L21 21h-3.7l-5.5-7.8L6.4 21H3l7.7-10.5L3 3Z"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50 focus-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M14 3h2.1c.2 1.4 1.1 2.8 2.3 3.6c.8.6 1.8.9 2.6 1V10c-1.5-.1-3-.7-4.2-1.6v5.2A5.6 5.6 0 1 1 9.1 8.3V10a3.6 3.6 0 1 0 3.6 3.6V3Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {year} Velah. All rights reserved.</span>
          <span>Made with glass, not plastic.</span>
        </div>
      </div>
    </footer>
  );
}
