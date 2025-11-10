'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type StandaloneView = "about" | "subscription";

export default function StandaloneHome() {
  const { t } = useLanguage();
  const hero = t.hero;
  const aboutCopy = t.about;
  const subscription = t.subscriptionPeek;
  const bundles = subscription.bundles;
  const bottles = t.bottles.items;

  const [activeBundleId, setActiveBundleId] = useState(bundles[0]?.id ?? "");
  const [view, setView] = useState<StandaloneView>("about");

  const activeBundle = useMemo(() => {
    return bundles.find((bundle) => bundle.id === activeBundleId) ?? bundles[0] ?? null;
  }, [bundles, activeBundleId]);

  const openWaitlist = () => window.dispatchEvent(new Event("velah:open-waitlist"));

  const scrollToSubscription = () => {
    document.getElementById("standalone-subscription")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBottleSelect = (key: (typeof bottles)[number]["key"]) => {
    try {
      localStorage.setItem("velah:preselect", key);
    } catch {
      /* ignore */
    }
    if (view !== "subscription") {
      setView("subscription");
      setTimeout(scrollToSubscription, 60);
    } else {
      scrollToSubscription();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = window.sessionStorage.getItem("standalone:target-view");
    if (target === "subscription" || target === "about") {
      setView(target);
      window.sessionStorage.removeItem("standalone:target-view");
    } else {
      const stored = window.sessionStorage.getItem("standalone:last-view");
      if (stored === "subscription" || stored === "about") setView(stored);
    }

    const onSetView = (event: Event) => {
      const detail = (event as CustomEvent<StandaloneView>).detail;
      if (detail === "subscription" || detail === "about") {
        setView(detail);
      }
    };

    window.addEventListener("standalone:set-view", onSetView as EventListener);
    return () => window.removeEventListener("standalone:set-view", onSetView as EventListener);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("standalone:last-view", view);
    window.dispatchEvent(new CustomEvent<StandaloneView>("standalone:view-change", { detail: view }));
  }, [view]);

  const AboutView = (
    <>
      <section className="standalone-hero-card">
        <span className="standalone-badge">{aboutCopy.heading}</span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{hero.heading}</h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{hero.body}</p>
        <div className="standalone-hero__actions">
          <button type="button" className="btn btn-primary standalone-primary-btn" onClick={openWaitlist}>
            {subscription.joinWaitlist}
          </button>
          <button type="button" className="btn btn-ghost standalone-ghost-btn" onClick={() => handleBottleSelect("1l")}>
            {t.bottles.addToPlan}
          </button>
        </div>
      </section>

      <section className="standalone-section">
        <h2 className="text-lg font-semibold text-slate-900">{aboutCopy.heading}</h2>
        <p className="mt-3 text-sm text-slate-600">{aboutCopy.paragraphs[0]}</p>
        <p className="mt-2 text-sm text-slate-600">{aboutCopy.paragraphs[1]}</p>
        <div className="standalone-shortcuts mt-4">
          {aboutCopy.quotes.slice(0, 2).map((quote) => (
            <div key={quote.by} className="standalone-shortcut">
              <div>
                <div className="standalone-label">{quote.by}</div>
                <p className="text-sm text-slate-600 mt-1">{quote.text}</p>
              </div>
              <span aria-hidden>→</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  const SubscriptionView = (
    <>
      <section className="standalone-hero-card">
        <span className="standalone-badge">{subscription.badge}</span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{subscription.heading}</h1>
        <p className="mt-2 text-sm text-slate-600">{subscription.body}</p>
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
        <div className="flex flex-col gap-1 text-left">
          <span className="standalone-badge">{subscription.badge}</span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{subscription.heading}</h2>
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

            <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{activeBundle.servings}</span>
                <span>{subscription.priceNote}</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{activeBundle.price}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 space-y-3 text-sm text-slate-600">
              <div>
                <div className="standalone-label">{subscription.deliveryHeadline}</div>
                <ul className="mt-2 space-y-1">
                  {subscription.deliveryItems.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="standalone-label">{subscription.nextStepsHeadline}</div>
                <p className="mt-2">{subscription.nextStepsBody}</p>
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
            <h3 className="text-xl font-semibold text-slate-900">{t.bottles.heading}</h3>
            <p className="text-sm text-slate-600 mt-1">{t.hero.sliderLabel}</p>
          </div>
          <button type="button" className="btn btn-ghost text-sm" onClick={() => handleBottleSelect("1l")}>
            {subscription.joinWaitlist}
          </button>
        </div>

        <div className="standalone-carousel" aria-label={t.bottles.heading}>
          {bottles.map((bottle) => (
            <article key={bottle.key} className="standalone-bottle-card">
              <div className="relative h-36 w-full">
                <Image src={bottle.img} alt={bottle.name} fill className="object-contain" sizes="220px" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">{bottle.name}</h4>
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

  return (
    <div className="standalone-home">
      <div className="standalone-home__content">
        {view === "about" && AboutView}
        {view === "subscription" && SubscriptionView}
      </div>
    </div>
  );
}
