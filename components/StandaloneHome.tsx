'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function StandaloneHome() {
  const { t } = useLanguage();
  const hero = t.hero;
  const subscription = t.subscriptionPeek;
  const bundles = subscription.bundles;
  const bottles = t.bottles.items;
  const [activeId, setActiveId] = useState(bundles[0]?.id ?? "");

  const activeBundle = useMemo(() => {
    return bundles.find((bundle) => bundle.id === activeId) ?? bundles[0] ?? null;
  }, [bundles, activeId]);

  const openWaitlist = () => {
    window.dispatchEvent(new Event("velah:open-waitlist"));
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
    scrollToSubscription();
  };

  return (
    <div className="standalone-home">
      <section className="standalone-hero-card">
        <span className="standalone-badge">{subscription.badge}</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{hero.heading}</h1>
        <p className="mt-3 text-base text-slate-600">{subscription.body}</p>

        <div className="standalone-hero__actions">
          <button type="button" className="btn btn-primary standalone-primary-btn" onClick={openWaitlist}>
            {subscription.joinWaitlist}
          </button>
          <Link href="/hydration" className="btn btn-ghost btn-no-arrow standalone-ghost-btn">
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
            const isActive = bundle.id === activeId;
            return (
              <button
                key={bundle.id}
                type="button"
                className={isActive ? "is-active" : undefined}
                onClick={() => setActiveId(bundle.id)}
              >
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
          <button type="button" className="btn btn-ghost btn-no-arrow text-sm" onClick={scrollToSubscription}>
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
              <button
                type="button"
                className="btn btn-primary standalone-primary-btn mt-auto"
                onClick={() => handleBottleSelect(bottle.key)}
              >
                {t.bottles.addToPlan}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="standalone-section standalone-shortcuts">
        <Link href="/hydration" className="standalone-shortcut">
          <div>
            <div className="standalone-label">{t.nav.navLinks.hydration}</div>
            <p className="text-sm text-slate-600 mt-1">{hero.body}</p>
          </div>
          <span aria-hidden>→</span>
        </Link>
        <a href="mailto:hello@velah.com" className="standalone-shortcut">
          <div>
            <div className="standalone-label">{t.footer.supportLinks[1]?.label ?? "Contact"}</div>
            <p className="text-sm text-slate-600 mt-1">hello@velah.com</p>
          </div>
          <span aria-hidden>→</span>
        </a>
      </section>
    </div>
  );
}
