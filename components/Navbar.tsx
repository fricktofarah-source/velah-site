// components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { posts } from "@/lib/posts";
import Magnetic from "./Magnetic";
import { useCart } from "@/components/CartProvider";

function sumCart(items: Array<{ qty: number }> | null | undefined) {
  if (!items?.length) return 0;
  return items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function readLocalCartCount() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem("velah:order-cart");
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw);
    return sumCart(Array.isArray(parsed) ? parsed : []);
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { status: authStatus, user } = useAuth();
  // Waitlist modal
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState(t.nav.waitlistModal.areaPlaceholder);
  const [errorKey, setErrorKey] = useState<"invalid-email" | null>(null);

  // Auth
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");
  const [isAuthed, setIsAuthed] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const shopCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const displayCount = shopCartCount > 0 ? shopCartCount : cartCount;

  // Routing
  const pathname = usePathname();
  const router = useRouter();

  // Search
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);     // pill expanded
  const [openSuggest, setOpenSuggest] = useState(false);   // dropdown visible
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langWrapRef = useRef<HTMLDivElement | null>(null);

  // Refs
  const emailRef = useRef<HTMLInputElement | null>(null);

  // -------- Suggestions data --------
  const baseList = posts
    .slice()
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((post) => ({
      kind: "post" as const,
      slug: post.slug,
      label:
        language === "AR" && post.translations?.AR?.title
          ? post.translations.AR.title
          : post.title,
    }));

  const defaults = baseList.slice(0, 5);
  const filtered = baseList.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  type Suggestion = (typeof baseList)[number];

  function selectSuggestion(s: Suggestion) {
    setQuery("");
    setOpenSuggest(false);
    setSearchOpen(false);
    setActiveIdx(-1);
    if (s.kind === "post") {
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
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  }

  // -------- Effects --------

  useEffect(() => {
    setZone(t.nav.waitlistModal.areaPlaceholder);
  }, [t.nav.waitlistModal.areaPlaceholder]);

  // Auth session + listener


  const loadCartCount = useCallback(async (userId?: string | null) => {
    if (userId) {
      const { data } = await supabase.from("order_carts").select("items").eq("user_id", userId).maybeSingle();
      setCartCount(sumCart((data?.items as Array<{ qty: number }> | null) ?? []));
      return;
    }
    setCartCount(readLocalCartCount());
  }, []);

  useEffect(() => {
    if (authStatus === "loading") return;
    const emailFromSession = user?.email ?? null;
    const metadata = user?.user_metadata as { full_name?: string } | undefined;
    const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null;
    setIsAuthed(!!user);
    setDisplayName(fullName || (emailFromSession ? emailFromSession.split("@")[0] : null));
    loadCartCount(user?.id ?? null);
    setMenuOpen(false);

    const onCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as Array<{ qty: number }> | undefined;
      if (detail) {
        setCartCount(sumCart(detail));
      } else {
        loadCartCount(null);
      }
    };

    window.addEventListener("cart:updated", onCartUpdate as EventListener);

    const onStorage = () => loadCartCount(null);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", onCartUpdate as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [authStatus, user, loadCartCount]);

  // Global open-waitlist trigger (from Hero)
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setPhase("form");
      setErrorKey(null);
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

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langWrapRef.current) return;
      if (!langWrapRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    if (langMenuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [langMenuOpen]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      const menu = document.getElementById("mobile-nav-menu");
      const button = document.getElementById("mobile-nav-button");
      if (mobileMenuOpen && menu && !menu.contains(target) && button && !button.contains(target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [mobileMenuOpen]);

  // --- NEW: subtle hide-on-scroll, reveal on scroll-up (UI-only) ---
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const hiddenRef = useRef(hidden);
  useEffect(() => {
    // Keep hidden state mirror in a ref so scroll handler avoids stale closures
    hiddenRef.current = hidden;
  }, [hidden]);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastYRef.current;
        const threshold = 6;
        let nextHidden = hiddenRef.current;
        if (y < 8) {
          nextHidden = false;
        } else if (delta > threshold) {
          nextHidden = true;
        } else if (delta < -threshold) {
          nextHidden = false;
        }
        if (nextHidden !== hiddenRef.current) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
        }
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = t.nav.navLinks;
  const allNavItems: Array<
    | { key: "subscription"; label: string; type: "section"; sectionId: string }
    | { key: "about" | "sustainability" | "blog" | "hydration" | "shop"; label: string; type: "route"; href: string }
  > = [
      { key: "about", label: navLinks.about, type: "route", href: "/about" },
      { key: "sustainability", label: navLinks.sustainability, type: "route", href: "/sustainability" },
      { key: "shop", label: "Shop", type: "route", href: "/shop" },
      { key: "blog", label: navLinks.blog, type: "route", href: "/blog" },
      { key: "hydration", label: navLinks.hydration, type: "route", href: "/hydration" },
    ];
  const visibleNavItems = allNavItems;
  const waitlistCopy = t.nav.waitlistModal;
  const languageOptions = t.nav.languages;
  const currentLanguageLabel =
    languageOptions.find((option) => option.code === language)?.label ?? language;

  // -------- Waitlist form --------
  function validateEmail(v: string) { return /\S+@\S+\.\S+/.test(v.trim()); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) { setErrorKey("invalid-email"); return; }
    setErrorKey(null);
    setPhase("sending");
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
        className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        {/* Center the middle perfectly with 1fr | auto | 1fr */}
        <div
          className="w-full px-3 sm:px-4 lg:px-6 py-3 grid items-center gap-4 grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]"
        >
          {/* LEFT: Logo */}
          <div className="justify-self-start flex items-center shrink-0">
            <Link href="/" aria-label="Go to homepage" className="block focus-ring rounded-xl">
              <Image
                src="/assets/velah_ripple.png"
                alt="Velah"
                width={120}
                height={80}
                className="block h-16 sm:h-20 w-auto select-none origin-center transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.04]"
                draggable={false}
                priority
              />
            </Link>
          </div>

          {/* MIDDLE: Centered nav */}
          <div className="hidden md:flex items-center justify-center md:justify-center gap-7 whitespace-nowrap justify-self-center md:col-start-2 min-w-0">
            {visibleNavItems.map((item) =>
              item.type === "section" ? (
                <a
                  key={item.key}
                  href={`#${item.sectionId}`}
                  className="nav-link"
                  data-nav={item.key}
                  onClick={(e) => {
                    e.preventDefault();
                    goSection(item.sectionId);
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.key} href={item.href} className="nav-link" data-nav={item.key}>
                  {item.label}
                </Link>
              )
            )}
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
                  aria-label={t.nav.searchPlaceholder}
                  className="grid place-items-center h-7 w-7 shrink-0 rounded-full hover:bg-slate-100 focus-ring"
                  onClick={() => {
                    setSearchOpen(true);
                    setOpenSuggest(true);
                    setTimeout(() => searchInputRef.current?.focus(), 10);
                  }}
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-slate-600">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79L20 20.5 21.5 19l-6-5zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                  </svg>
                </button>

                {/* Input (no gap; same element) */}
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder={t.nav.searchPlaceholder}
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
                      key={`post-${s.slug}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-3 ${i === activeIdx ? "bg-slate-50" : "bg-white"
                        } hover:bg-slate-50`}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => selectSuggestion(s)}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-block h-5 w-5 rounded-full border grid place-items-center text-[10px] ${s.kind === "post" ? "border-slate-300" : "border-slate-200"
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
            <div ref={langWrapRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center text-slate-700 hover:text-slate-900 focus-ring rounded-lg"
                aria-label={`${t.nav.languageAria}: ${currentLanguageLabel}`}
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 text-slate-600">
                  <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3.9 9.5h16.2M3.9 14.5h16.2" />
                    <path d="M12 3c2.1 3 3.3 6 3.3 9s-1.2 6-3.3 9c-2.1-3-3.3-6-3.3-9s1.2-6 3.3-9Z" />
                  </g>
                </svg>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg p-1 z-[70]">
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`w-full px-3 py-2 text-left rounded-lg text-sm hover:bg-slate-50 flex items-center justify-between ${option.code === language ? "bg-slate-100 font-semibold" : ""
                        }`}
                      onClick={() => {
                        setLanguage(option.code);
                        setLangMenuOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {option.code === language ? (
                        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 text-slate-600">
                          <path
                            fill="currentColor"
                            d="M7.5 13.5l-3-3l1.4-1.4l1.6 1.58l4.6-4.6l1.4 1.42Z"
                          />
                        </svg>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>



            <button
              type="button"
              onClick={() => {
                if (shopCartCount > 0 || pathname.includes('/shop')) {
                  openCart();
                } else {
                  // Fallback to old behavior if shop is empty? 
                  // Or just always open drawer? Use openCart() as the primary interaction now.
                  openCart();
                }
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center text-slate-700 hover:text-slate-900 focus-ring rounded-lg"
              aria-label="Cart"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6">
                <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8h12l-1 11H7L6 8Z" />
                  <path d="M9 8a3 3 0 0 1 6 0" />
                </g>
              </svg>
              {displayCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-[var(--velah)] text-[10px] font-semibold text-slate-900 grid place-items-center">
                  {displayCount}
                </span>
              ) : null}
            </button>

            <button
              id="mobile-nav-button"
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:text-slate-900 focus-ring md:hidden"
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span className="relative h-5 w-5">
                <span
                  className={`absolute left-0 top-[5px] h-[2px] w-5 bg-current transition-transform duration-200 ease-out ${mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
                    }`}
                />
                <span
                  className={`absolute left-0 top-[10px] h-[2px] w-5 bg-current transition-opacity duration-200 ease-out ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`absolute left-0 top-[15px] h-[2px] w-5 bg-current transition-transform duration-200 ease-out ${mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
                    }`}
                />
              </span>
            </button>

            {/* Account / Sign in (text-only) */}
            {isAuthed ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="relative z-[60] nav-link px-0 h-auto whitespace-nowrap hidden md:inline-flex items-center gap-1 focus-ring rounded-lg"
                >
                  <span className="truncate max-w-[9rem]">
                    {displayName ?? (language === "AR" ? "الحساب" : "Account")}
                  </span>
                  <svg aria-hidden viewBox="0 0 20 20" className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}>
                    <path fill="currentColor" d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg p-1 z-[60]">
                    <Link
                      href="/profile"
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t.nav.editProfile}
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                      onClick={async () => { await supabase.auth.signOut(); setMenuOpen(false); }}
                    >
                      {t.nav.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode("signin"); setAuthOpen(true); }}
                className="relative z-[60] nav-link px-0 h-auto whitespace-nowrap hidden md:inline-flex focus-ring rounded-lg"
              >
                {t.nav.signIn}
              </button>
            )}

            {/* CTA */}
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => { setOpen(true); setPhase("form"); setErrorKey(null); }}
                className="hidden md:inline-flex btn btn-primary h-9 px-3 text-sm relative z-[60] rounded-full shrink-0 focus-ring"
                data-action="join-waitlist"
              >
                {t.nav.joinWaitlist}
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`md:hidden fixed top-[4.5rem] left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 transition-all duration-200 ease-out ${mobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="px-4 py-4 space-y-2">
          {visibleNavItems.map((item) =>
            item.type === "section" ? (
              <button
                key={item.key}
                type="button"
                className="w-full text-left py-2 text-sm font-semibold text-slate-800"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goSection(item.sectionId);
                }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="block py-2 text-sm font-semibold text-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {isAuthed ? (
              <>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {displayName ?? (language === "AR" ? "الحساب" : "Account")}
                </div>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-semibold text-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.editProfile}
                </Link>
                <button
                  type="button"
                  className="w-full text-left py-2 text-sm font-semibold text-slate-800"
                  onClick={async () => { await supabase.auth.signOut(); setMobileMenuOpen(false); }}
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode("signin"); setAuthOpen(true); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-sm font-semibold text-slate-800"
              >
                {t.nav.signIn}
              </button>
            )}
            <button
              type="button"
              onClick={() => { setOpen(true); setPhase("form"); setErrorKey(null); setMobileMenuOpen(false); }}
              className="btn btn-primary w-full justify-center h-10 mt-2"
            >
              {t.nav.joinWaitlist}
            </button>
          </div>
        </div>
      </div>

      {/* Waitlist modal */}
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4 animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="card w-full max-w-lg overflow-hidden animate-pop-in">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">{waitlistCopy.title}</div>
              <button type="button" className="btn btn-ghost btn-no-arrow h-9" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="relative min-h-[260px]">
              {/* FORM */}
              <div className={`p-4 space-y-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "form" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <form onSubmit={submit} className="space-y-3" noValidate>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label htmlFor="email" className="text-sm">{waitlistCopy.emailLabel}</label>
                    <input
                      id="email"
                      ref={emailRef}
                      type="email"
                      className={`border rounded-2xl px-3 py-2 ${errorKey ? "border-red-400 focus:outline-red-500" : ""}`}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errorKey) setErrorKey(null); }}
                      placeholder="you@company.com"
                      aria-invalid={errorKey ? true : false}
                      aria-describedby={errorKey ? "email-error" : undefined}
                    />
                    <label htmlFor="zone" className="text-sm">{waitlistCopy.areaLabel}</label>
                    <input
                      id="zone"
                      className="border rounded-2xl px-3 py-2"
                      value={zone}
                      placeholder={waitlistCopy.areaPlaceholder}
                      onChange={(e) => setZone(e.target.value)}
                    />
                  </div>

                  {errorKey && (
                    <div id="email-error" className="text-sm text-red-600 mt-1 animate-soft-shake" role="alert" aria-live="polite">
                      {waitlistCopy.invalidEmail}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn btn-primary h-10">{waitlistCopy.joinCta}</button>
                    <div className="text-xs text-slate-500">{waitlistCopy.tagline}</div>
                  </div>
                </form>
              </div>

              {/* SENDING */}
              <div className={`p-6 flex items-center justify-center gap-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "sending" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="loader" aria-hidden />
                <div className="text-sm text-slate-600">{waitlistCopy.sending}</div>
              </div>

              {/* DONE */}
              <div className={`p-6 flex flex-col items-center justify-center gap-3 absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="success-check" aria-hidden />
                <div className="text-emerald-700 text-sm">{waitlistCopy.success}</div>
                {!isAuthed ? (
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-ghost btn-no-arrow h-9" onClick={() => setOpen(false)}>{waitlistCopy.close}</button>
                    <button type="button" className="btn btn-primary h-9" onClick={() => { setOpen(false); setAuthMode("signup"); setAuthOpen(true); }}>
                      {waitlistCopy.signup}
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
