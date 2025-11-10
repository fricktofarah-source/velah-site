'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

type StandaloneView = "shop" | "hydration" | "support";

export default function StandaloneHome() {
  const { t } = useLanguage();
  const router = useRouter();
  const hero = t.hero;
  const subscription = t.subscriptionPeek;
  const bundles = subscription.bundles;
  const bottles = t.bottles.items;
  const [activeBundleId, setActiveBundleId] = useState(bundles[0]?.id ?? "");
  const [view, setView] = useState<StandaloneView>("shop");

  const activeBundle = useMemo(() => {
    return bundles.find((bundle) => bundle.id === activeBundleId) ?? bundles[0] ?? null;
  }, [bundles, activeBundleId]);

  const openWaitlist = () => window.dispatchEvent(new Event("velah:open-waitlist"));

  const ensureShopView = (callback?: () => void) => {
    if (view === "shop") {
      callback?.();
      return;
    }
    setView("shop");
    if (callback) setTimeout(callback, 60);
  };

  const scrollToSubscription = () => {
    document.getElementById("standalone-subscription")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBottleSelect = (key: (typeof bottles)[number]["key"]) => {
    try {
      localStorage.setItem("velah:preselect", key);
    } catch {
      /* ignore */
    }
    ensureShopView(scrollToSubscription);
  };

  const navItems: Array<{ id: StandaloneView; label: string; icon: string }> = [
    { id: "shop", label: subscription.badge || "Shop", icon: "🛒" },
    { id: "hydration", label: t.nav.navLinks.hydration, icon: "💧" },
    { id: "support", label: t.footer.supportTitle || "Support", icon: "✉️" },
  ];

  const ShopView = (
    <>
      <section className="standalone-hero-card">
        <span className="standalone-badge">{subscription.badge}</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{hero.heading}</h1>
        <p className="mt-3 text-base text-slate-600">{subscription.body}</p>
        <div className="standalone-hero__actions">
          <button type="button" className="btn btn-primary standalone-primary-btn" onClick={openWaitlist}>
            {subscription.joinWaitlist}
          </button>
          <Link href="/hydration" className="btn btn-ghost standalone-ghost-btn">
            {t.nav.navLinks.hydration}
          </Link>
        </div>
      </section>

      <section id="standalone-subscription" className="standalone-section">
        <div className="flex flex-col gap-2 text-left">
          <span className="standalone-badge">{subscription.badge}</span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{subscription.heading}</h2>
          <p className="text-sm text-slate-600">{subscription.nextStepsBody}</p>
        </div>

        <div className="standalone-bundle-tabs">
          {bundles.map((bundle) => {
            const isActive = bundle.id === activeBundleId;
            return (
              <button key={bundle.id} type="button" className={isActive ? "is-active" : undefined} onClick={() => setActiveBundleId(bundle.id)}>
                {bundle.name}
              </button>
            );
          })}
        </div>

        {activeBundle && (
          <div className="standalone-bundle-card">
            <div className="standalone-bundle-card__mix">
              {activeBundle.mix.map((item) => (
                <div key={item.label} className="standalone-pill">
                  <div className="standalone-label">{item.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">{item.amount}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{activeBundle.servings}</span>
                <span>{subscription.priceNote}</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{activeBundle.price}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <div>
                <div className="standalone-label">{subscription.deliveryHeadline}</div>
                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                  {subscription.deliveryItems.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="standalone-label">{subscription.nextStepsHeadline}</div>
                <p className="mt-2 text-sm text-slate-600">{subscription.nextStepsBody}</p>
              </div>
              <button type="button" className="btn btn-primary standalone-primary-btn" onClick={openWaitlist}>
                {subscription.joinWaitlist}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="standalone-section">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{t.bottles.heading}</h3>
            <p className="text-sm text-slate-600 mt-1">{t.hero.sliderLabel}</p>
          </div>
          <button type="button" className="btn btn-ghost text-sm" onClick={() => ensureShopView(scrollToSubscription)}>
            {subscription.joinWaitlist}
          </button>
        </div>

        <div className="standalone-carousel" aria-label={t.bottles.heading}>
          {bottles.map((bottle) => (
            <article key={bottle.key} className="standalone-bottle-card">
              <div className="relative h-40 w-full">
                <Image src={bottle.img} alt={bottle.name} fill className="object-contain" sizes="240px" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{bottle.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{bottle.desc}</p>
              </div>
              <button type="button" className="btn btn-primary standalone-primary-btn mt-auto" onClick={() => handleBottleSelect(bottle.key)}>
                {t.bottles.addToPlan}
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const HydrationView = (
    <>
      <section className="standalone-hero-card">
        <span className="standalone-badge">{t.nav.navLinks.hydration}</span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{t.hydration.title}</h2>
        <p className="mt-3 text-base text-slate-600">{hero.body}</p>
        <div className="standalone-hero__actions">
          <button type="button" className="btn btn-primary standalone-primary-btn" onClick={() => router.push("/hydration")}>
            {t.hydration.title}
          </button>
          <button type="button" className="btn btn-ghost standalone-ghost-btn" onClick={openWaitlist}>
            {subscription.joinWaitlist}
          </button>
        </div>
      </section>

      <section className="standalone-section">
        <div className="standalone-shortcut">
          <div>
            <div className="standalone-label">{t.hydration.todayHeading}</div>
            <p className="text-sm text-slate-600 mt-1">{subscription.priceNote}</p>
          </div>
          <span aria-hidden>💧</span>
        </div>
        <button type="button" className="btn btn-primary standalone-primary-btn w-full mt-4" onClick={() => router.push("/hydration")}>
          {t.nav.navLinks.hydration}
        </button>
      </section>
    </>
  );

  const SupportView = (
    <>
      <section className="standalone-section">
        <span className="standalone-badge">{t.footer.supportTitle}</span>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">{t.footer.tagline}</h2>
        <div className="standalone-shortcuts mt-4">
          <a href="mailto:hello@velah.com" className="standalone-shortcut">
            <div>
              <div className="standalone-label">{t.footer.supportLinks[1]?.label ?? "Email"}</div>
              <p className="text-sm text-slate-600 mt-1">hello@velah.com</p>
            </div>
            <span aria-hidden>→</span>
          </a>
          <button type="button" className="standalone-shortcut text-left" onClick={openWaitlist}>
            <div>
              <div className="standalone-label">{subscription.joinWaitlist}</div>
              <p className="text-sm text-slate-600 mt-1">{subscription.nextStepsBody}</p>
            </div>
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>
    </>
  );

  return (
    <div className="standalone-home">
      <div className="standalone-home__content">
        {view === "shop" && ShopView}
        {view === "hydration" && HydrationView}
        {view === "support" && SupportView}
      </div>
      <nav className="standalone-bottom-nav" aria-label="Velah navigation">
        {navItems.map((item) => {
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? "is-active" : undefined}
              onClick={() => setView(item.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
