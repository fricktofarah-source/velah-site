'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

type StandaloneView = "about" | "subscription";

export default function StandaloneHome() {
  const { t } = useLanguage();
  const router = useRouter();
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

  const navItems: Array<
    | { id: StandaloneView; type: "view"; label: string; icon: ReactElement }
    | { id: "hydration"; type: "route"; label: string; icon: ReactElement }
  > = [
    {
      id: "about",
      type: "view",
      label: aboutCopy.heading,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 4c-4.4 0-8 3.13-8 7 0 2.52 1.44 4.7 3.63 5.95L6 20l3.54-1.41c.8.22 1.64.34 2.46.34 4.4 0 8-3.13 8-7s-3.6-7-8-7zm0 2c3.3 0 6 2.24 6 5s-2.7 5-6 5c-.73 0-1.46-.11-2.17-.33l-.36-.12-.33.13-1.25.5.43-1.36.15-.48-.42-.27C7 13.32 6 12 6 11c0-2.76 2.7-5 6-5z"
          />
        </svg>
      ),
    },
    {
      id: "subscription",
      type: "view",
      label: subscription.badge || "Subscription",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M7 4h10l3 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9l3-5zm1.7 2-2 3H17.3l-2-3H8.7zM6 11v8h12v-8H6z"
          />
        </svg>
      ),
    },
    {
      id: "hydration",
      type: "route",
      label: t.nav.navLinks.hydration,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2s5 6.16 5 9.5S15.76 19 12 19s-5-4.34-5-7.5S12 2 12 2zm0 2.7c-1.44 1.95-3 4.48-3 6.8 0 2.16 1.02 4.5 3 4.5s3-2.34 3-4.5c0-2.32-1.56-4.85-3-6.8z"
          />
        </svg>
      ),
    },
  ];

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
      <nav className="standalone-bottom-nav" aria-label="Velah navigation">
        {navItems.map((item) => {
          const isActive = item.type === "view" && view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? "is-active" : undefined}
              onClick={() => {
                if (item.type === "view") {
                  setView(item.id);
                } else {
                  router.push("/hydration");
                }
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
