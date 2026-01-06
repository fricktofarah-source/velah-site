export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <div className="contact-reveal contact-reveal--1">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Privacy</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Privacy policy</h1>
        <p className="mt-2 text-sm text-slate-600">We keep data minimal and only collect what we need to run the service.</p>
      </div>

      <div className="contact-reveal contact-reveal--2">
        <div className="mt-10 space-y-6 text-sm text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">What we collect</h2>
            <p>When you create an account we store your email, name, and delivery details you provide.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">How we use it</h2>
            <p>We use your data to manage deliveries, bottle returns, hydration tracking, and support requests.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">Cookies</h2>
            <p>We do not use tracking cookies. Essential session storage may be used to keep you signed in.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">Your choices</h2>
            <p>You can request data updates or deletion by contacting founder@drinkvelah.com.</p>
          </section>
        </div>
      </div>

      <div className="contact-reveal contact-reveal--3">
        <div className="mt-10 text-sm text-slate-500">Last updated: Sep 2025</div>
      </div>
    </main>
  );
}
