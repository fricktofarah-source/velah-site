// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img src="/assets/velah_ripple.png" alt="Velah" className="h-8 w-auto" />
            <span className="font-semibold">Velah</span>
          </div>
          <p className="text-sm text-slate-600">
            Eco-luxury water in reusable glass gallons. Dubai & GCC.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li><a className="hover:text-velah" href="/about">About</a></li>
            <li><a className="hover:text-velah" href="/blog">Blog</a></li>
            <li><a className="hover:text-velah" href="/subscription">Subscription</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Support</div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li><a className="hover:text-velah" href="#">FAQs</a></li>
            <li><a className="hover:text-velah" href="#">Contact</a></li>
            <li><a className="hover:text-velah" href="#">Privacy</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Follow</div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50">IG</a>
            <a href="#" aria-label="X/Twitter" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50">X</a>
            <a href="#" aria-label="TikTok" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-slate-50">TT</a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Velah. All rights reserved.</span>
          <span>Made with glass, not plastic.</span>
        </div>
      </div>
    </footer>
  );
}
