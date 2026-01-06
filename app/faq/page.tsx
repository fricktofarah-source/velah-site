const FAQS = [
  {
    q: "How does delivery work?",
    a: "We deliver on set Dubai routes and share a confirmed window ahead of time. You can manage your plan in your account once subscriptions open.",
  },
  {
    q: "What sizes are available?",
    a: "Velah is delivered in reusable glass gallons and smaller bottles for daily use. Mix and match to fit your week.",
  },
  {
    q: "How do returns work?",
    a: "Rinse, cap, and leave bottles at your doorstep during your pickup window. We collect and loop them back into circulation.",
  },
  {
    q: "Is there a deposit?",
    a: "Yes. Glass is durable and reusable, so we place a refundable deposit on bottles to keep the loop closed.",
  },
  {
    q: "Where do you deliver?",
    a: "We serve Dubai today with GCC expansion planned. If your area is not listed, join the waitlist for updates.",
  },
  {
    q: "How do I contact support?",
    a: "Message us from the contact page or on WhatsApp and we will respond quickly during Dubai hours.",
  },
];

export default function FaqPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <div className="contact-reveal contact-reveal--1">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">FAQ</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Frequently asked questions</h1>
        <p className="mt-2 text-sm text-slate-600">Everything you need to know about Velah delivery, bottles, and the return loop.</p>
      </div>

      <div className="contact-reveal contact-reveal--2">
        <div className="mt-10 space-y-4">
          {FAQS.map((item) => (
            <details key={item.q} className="border-b border-slate-100 pb-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-slate-400">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="contact-reveal contact-reveal--3">
        <div className="mt-10 text-sm text-slate-500">
          Still have questions? Visit the contact page and we will get back to you quickly.
        </div>
      </div>
    </main>
  );
}
