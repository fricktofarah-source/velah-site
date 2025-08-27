// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  // Waitlist modal
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState("Dubai Marina");
  const [error, setError] = useState<string | null>(null);

  // Auth
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");
  const [isAuthed, setIsAuthed] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Routing
  const pathname = usePathname();
  const router = useRouter();

  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);     // pill expanded
  const [openSuggest, setOpenSuggest] = useState(false);   // dropdown visible
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Refs
  const emailRef = useRef<HTMLInputElement | null>(null);

  // -------- Suggestions data --------
  const baseList = [
    { kind: "section", id: "subscription", label: "Subscription plans" },
    { kind: "section", id: "about", label: "About Velah" },
    { kind: "section", id: "sustainability", label: "Sustainability" },
    { kind: "section", id: "blog", label: "From the blog" },
    { kind: "page", href: "/hydration", label: "My hydration" },
    { kind: "post", slug: "why-glass-better-water", label: "Why glass makes water taste better" },
    { kind: "post", slug: "our-dubai-routes", label: "Our Dubai delivery routes" },
    { kind: "post", slug: "how-deposit-works", label: "How the glass deposit works" },
  ] as const;

  const defaults = baseList.slice(0, 5);
  const filtered = baseList.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  function selectSuggestion(s: any) {
    setQuery("");
    setOpenSuggest(false);
    setSearchOpen(false);
    setActiveIdx(-1);
    if (s.kind === "section") {
      if (pathname === "/") {
        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/#${s.id}`);
      }
    } else if (s.kind === "page") {
      router.push(s.href);
    } else if (s.kind === "post") {
      router.push(`/blog/${s.slug}`);
    }
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const list = query.trim() ? filtered : defaults;
      setActiveIdx((i) => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const list = query.trim() ? filtered : defaults;
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const list = query.trim() ? filtered : defaults;
      if (activeIdx >= 0 && list[activeIdx]) selectSuggestion(list[activeIdx]);
      else if (list[0]) selectSuggestion(list[0]);
    } else if (e.key === "Escape") {
      setOpenSuggest(false);
      setSearchOpen(false);
      setActiveIdx(-1);
    }
  }

  function goSection(id: string) {
    setMobileOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  }

  // -------- Effects --------

  // Close mobile menu on md+
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auth session + listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setIsAuthed(!!session);
      const email = session?.user?.email ?? null;
      const fullName = (session?.user?.user_metadata as any)?.full_name ?? null;
      setDisplayName(fullName || (email ? email.split("@")[0] : null));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      const email = session?.user?.email ?? null;
      const fullName = (session?.user?.user_metadata as any)?.full_name ?? null;
      setDisplayName(fullName || (email ? email.split("@")[0] : null));
      setMenuOpen(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Global open-waitlist trigger (from Hero)
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setPhase("form");
      setError(null);
    };
    window.addEventListener("velah:open-waitlist", onOpen);
    return () => window.removeEventListener("velah:open-waitlist", onOpen);
  }, []);

  // ESC closes waitlist
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first input when opening waitlist
  useEffect(() => {
    if (open && phase === "form") setTimeout(() => emailRef.current?.focus(), 100);
  }, [open, phase]);

  // Close search if clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setOpenSuggest(false);
        setActiveIdx(-1);
      }
    }
    if (searchOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [searchOpen]);

  // --- NEW: subtle hide-on-scroll, reveal on scroll-up (UI-only) ---
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastY;
        const threshold = 6;
        if (y < 8) {
          setHidden(false);
        } else if (delta > threshold) {
          setHidden(true);
        } else if (delta < -threshold) {
          setHidden(false);
        }
        setLastY(y);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  // -------- Waitlist form --------
  function validateEmail(v: string) { return /\S+@\S+\.\S+/.test(v.trim()); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) { setError("Please enter a valid email address."); return; }
    setError(null); setPhase("sending");
    try {
      await fetch("/api/join-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), zone }),
      });
      await new Promise((r) => setTimeout(r, 350));
      setPhase("done");
      localStorage.setItem("velah:waitlist", JSON.stringify({ email: email.trim(), zone, when: Date.now() }));
    } catch {
      setPhase("done");
    }
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Center the middle perfectly with 1fr | auto | 1fr */}
        <div
          className="w-full px-3 sm:px-4 lg:px-6 py-3 grid items-center gap-4 grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]"
        >
          {/* LEFT: Logo */}
          <div className="justify-self-start flex items-center shrink-0">
            <Link href="/" aria-label="Go to homepage" className="block focus-ring rounded-xl">
              <img
                src="/assets/velah_ripple.png"
                alt="Velah"
                className="block h-16 sm:h-20 w-auto select-none origin-center transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.04]"
                draggable={false}
              />
            </Link>
          </div>

          {/* MIDDLE: Centered nav */}
          <div className="hidden md:flex items-center justify-center md:justify-center gap-7 whitespace-nowrap justify-self-center md:col-start-2 min-w-0">
            <a href="#about" className="nav-link hover:text-velah" onClick={(e) => { e.preventDefault(); goSection("about"); }}>About</a>
            <a href="#sustainability" className="nav-link hover:text-velah" onClick={(e) => { e.preventDefault(); goSection("sustainability"); }}>Sustainability</a>
            <a href="#subscription" className="nav-link hover:text-velah" onClick={(e) => { e.preventDefault(); goSection("subscription"); }}>Subscription</a>
            <a href="#blog" className="nav-link hover:text-velah" onClick={(e) => { e.preventDefault(); goSection("blog"); }}>Blog</a>
            <Link href="/hydration" className="nav-link hover:text-velah">My hydration</Link>
          </div>

          {/* RIGHT: Controls (search grows; still doesn’t move the center) */}
          <div className="relative z-[55] justify-self-end flex items-center gap-2 sm:gap-3 shrink-0">
            {/* SEARCH WRAP (relative) */}
            <div ref={searchWrapRef} className="relative hidden sm:block">
              {/* The pill itself — has overflow-hidden; dropdown is a sibling below */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const list = query.trim() ? filtered : defaults;
                  if (list[0]) selectSuggestion(list[0]);
                }}
                className={`relative z-[40] h-9 ${searchOpen ? "w-[14rem] max-w-[70vw]" : "w-9"}
                            rounded-full border border-slate-200 bg-white/90 backdrop-blur
                            px-1 flex items-center shadow-sm
                            transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                            overflow-hidden`}
                onClick={() => {
                  setSearchOpen(true);
                  setOpenSuggest(true);
                  setTimeout(() => searchInputRef.current?.focus(), 10);
                }}
              >
                {/* Icon centered */}
                <button
                  type="button"
                  aria-label="Search"
                  className="grid place-items-center h-7 w-7 shrink-0 rounded-full hover:bg-slate-100 focus-ring"
                  onClick={() => {
                    setSearchOpen(true);
                    setOpenSuggest(true);
                    setTimeout(() => searchInputRef.current?.focus(), 10);
                  }}
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-slate-600">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79L20 20.5 21.5 19l-6-5zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  </svg>
                </button>

                {/* Input (no gap; same element) */}
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search"
                  className={`ml-2 bg-transparent outline-none text-sm min-w-0 ${searchOpen ? "flex-1 w-auto" : "w-0"} transition-all duration-300`}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setOpenSuggest(true); setActiveIdx(-1); }}
                  onFocus={() => { setSearchOpen(true); setOpenSuggest(true); }}
                  onKeyDown={onSearchKeyDown}
                />
              </form>

              {/* DROPDOWN — sibling of the pill (so overflow-hidden doesn’t clip it) */}
              {(searchOpen && openSuggest) && ((query.trim() ? filtered : defaults).length > 0) && (
                <div
                  className="absolute left-0 right-0 top=[110%] z-[45]
                             rounded-2xl border bg-white shadow-lg overflow-hidden"
                  role="listbox"
                  aria-label="Search suggestions"
                  onMouseDown={(e) => e.preventDefault()} /* keep focus while clicking */
                >
                  {(query.trim() ? filtered : defaults).map((s, i) => (
                    <button
                      key={s.kind === "section" ? `sec-${s.id}` : s.kind === "page" ? `pg-${s.href}` : `post-${s.slug}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-3 ${
                        i === activeIdx ? "bg-slate-50" : "bg-white"
                      } hover:bg-slate-50`}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => selectSuggestion(s)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-block h-5 w-5 rounded-full border grid place-items-center text-[10px] ${
                            s.kind === "post" ? "border-slate-300" : "border-slate-200"
                          }`}
                          aria-hidden
                        >
                          {s.kind === "post" ? "P" : s.kind === "page" ? "↗" : "#"}
                        </span>
                        <span className="text-sm">{s.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account / Sign in (text-only) */}
            {isAuthed ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="relative z-[60] nav-link hover:text-velah px-0 h-auto whitespace-nowrap inline-flex items-center gap-1 focus-ring rounded-lg"
                >
                  <span className="truncate max-w-[9rem]">{displayName ?? "Account"}</span>
                  <svg aria-hidden viewBox="0 0 20 20" className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}>
                    <path fill="currentColor" d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg p-1 z-[60]">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                      onClick={async () => { await supabase.auth.signOut(); setMenuOpen(false); }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode("signin"); setAuthOpen(true); }}
                className="relative z-[60] nav-link hover:text-velah px-0 h-auto whitespace-nowrap focus-ring rounded-lg"
              >
                Sign in
              </button>
            )}

            {/* CTA */}
            <button
              type="button"
              onClick={() => { setOpen(true); setPhase("form"); setError(null); }}
              className="relative z-[60] h-9 px-3 text-sm rounded-full bg-[var(--velah)] text-black hover:opacity-90 transition shrink-0 focus-ring"
            >
              Join waitlist
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden btn btn-ghost h-9 px-3 rounded-full focus-ring"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative block w-5 h-5">
                <span className={`absolute left-0 top-1 block h-[2px] w-5 bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`absolute left-0 top-2.5 block h-[2px] w-5 bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-4 block h-[2px] w-5 bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[50] bg-black/0" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 right-0 top-[80px] mx-4 rounded-2xl border bg-white shadow-soft animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <nav className="p-2">
              <button type="button" className="w-full text-left nav-link block px-4 py-3 rounded-xl hover:bg-slate-50" onClick={() => goSection("about")}>About</button>
              <button type="button" className="w-full text-left nav-link block px-4 py-3 rounded-xl hover:bg-slate-50" onClick={() => goSection("sustainability")}>Sustainability</button>
              <button type="button" className="w-full text-left nav-link block px-4 py-3 rounded-xl hover:bg-slate-50" onClick={() => goSection("subscription")}>Subscription</button>
              <button type="button" className="w-full text-left nav-link block px-4 py-3 rounded-xl hover:bg-slate-50" onClick={() => goSection("blog")}>Blog</button>
              <button type="button" className="w-full text-left nav-link block px-4 py-3 rounded-xl hover:bg-slate-50" onClick={() => router.push("/hydration")}>My hydration</button>
              <div className="h-2" />
              {isAuthed ? (
                <button type="button" className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm" onClick={async () => { await supabase.auth.signOut(); setMobileOpen(false); }}>Sign out</button>
              ) : (
                <button type="button" className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm" onClick={() => { setAuthMode("signin"); setAuthOpen(true); setMobileOpen(false); }}>Sign in</button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Waitlist modal */}
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4 animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="card w-full max-w-lg overflow-hidden animate-pop-in">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Join the Velah waitlist</div>
              <button type="button" className="btn btn-ghost h-9" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="relative min-h-[210px]">
              {/* FORM */}
              <div className={`p-4 space-y-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "form" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <form onSubmit={submit} className="space-y-3" noValidate>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input
                      id="email"
                      ref={emailRef}
                      type="email"
                      className={`border rounded-2xl px-3 py-2 ${error ? "border-red-400 focus:outline-red-500" : ""}`}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                      placeholder="you@company.com"
                      aria-invalid={!!error}
                      aria-describedby={error ? "email-error" : undefined}
                    />
                    <label htmlFor="zone" className="text-sm">Area (Dubai)</label>
                    <input id="zone" className="border rounded-2xl px-3 py-2" value={zone} onChange={(e) => setZone(e.target.value)} />
                  </div>

                  {error && (
                    <div id="email-error" className="text-sm text-red-600 mt-1 animate-soft-shake" role="alert" aria-live="polite">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn btn-primary h-10">Join</button>
                    <div className="text-xs text-slate-500">Glass gallons • stainless caps • refundable deposit.</div>
                  </div>
                </form>
              </div>

              {/* SENDING */}
              <div className={`p-6 flex items-center justify-center gap-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "sending" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="loader" aria-hidden />
                <div className="text-sm text-slate-600">Adding you to the list…</div>
              </div>

              {/* DONE */}
              <div className={`p-6 flex flex-col items-center justify-center gap-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="success-check" aria-hidden />
                <div className="text-emerald-700 text-sm">You’re on the list. We’ll email you soon.</div>
                {!isAuthed ? (
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-ghost h-9" onClick={() => setOpen(false)}>Close</button>
                    <button type="button" className="btn btn-primary h-9" onClick={() => { setOpen(false); setAuthMode("signup"); setAuthOpen(true); }}>
                      Sign up
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  );
}
