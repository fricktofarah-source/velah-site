'use client';

const testimonials = [
  {
    initials: "LR",
    name: "Leena Rahman",
    role: "Executive Chef, Atelier 91",
    quote:
      "We stopped stocking plastic bottles in the kitchen. Velah’s glass lands chilled, and the mineral balance keeps our coffee program consistent.",
  },
  {
    initials: "AM",
    name: "Arjun Mehta",
    role: "Head of Wellbeing, South Ridge Offices",
    quote:
      "The weekly swap is the simplest wellness upgrade we’ve rolled out. Teams fill reusable bottles and we track less fatigue by mid-afternoon.",
  },
  {
    initials: "SA",
    name: "Sara Al Maktoum",
    role: "Founder, Mysa Studio",
    quote:
      "Clients notice the glass decanters as soon as they arrive. Velah removed the logistics headache and aligned with our sustainability targets.",
  },
];

export default function Testimonials() {
  return (
    <section
      className="section section-decor scroll-mt-24 sm:scroll-mt-32 overflow-hidden"
      data-tone="ink"
      id="voices"
    >
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              Voices
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              People building with Velah.
            </h2>
            <p className="mt-2 text-slate-600 max-w-lg">
              From Michelin kitchens to wellness studios, Velah keeps water calm, circular, and always ready for the next pour.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="card p-6 flex flex-col gap-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white text-sm font-semibold shadow-sm">
                  {item.initials}
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">{item.role}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{item.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
