// components/Bottles.tsx
"use client";

import Image from "next/image";

type Bottle = {
  key: "5g" | "1l" | "500ml";
  name: string;
  desc: string;
  img: string;
};

const BOTTLES: Bottle[] = [
  {
    key: "5g",
    name: "5 Gallon",
    desc: "Refillable glass for home coolers. Stainless cap, refundable deposit.",
    img: "/assets/velah_bottle_5g.png",
  },
  {
    key: "1l",
    name: "1 Litre",
    desc: "Table-ready glass for daily use. Dishwasher-safe, stainless cap.",
    img: "/assets/velah_bottle_1l.png",
  },
  {
    key: "500ml",
    name: "500 mL",
    desc: "Compact glass for on-the-go. Dishwasher-safe, stainless cap.",
    img: "/assets/velah_bottle_500ml.png", // update path if your asset name differs
  },
];

export default function Bottles() {
  function addToPlan(key: Bottle["key"]) {
    // Optional: preselect bottle for Subscription section to read
    try {
      localStorage.setItem("velah:preselect", key);
    } catch {}
    // Smooth scroll to subscription
    document.getElementById("subscription")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="bottles" className="scroll-mt-28">
      {/* subtle distinct band so this block feels different */}
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(127,203,216,0.06),rgba(127,203,216,0.04))]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Available bottles</h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BOTTLES.map((b) => (
              <article
                key={b.key}
                className="group rounded-3xl border bg-white/70 backdrop-blur p-6 sm:p-8 transition hover:shadow-soft"
              >
                <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
                  {/* Image column */}
                  <div className="relative h-48 w-40 sm:h-56 sm:w-48">
                    <Image
                      src={b.img}
                      alt={b.name}
                      fill
                      sizes="(min-width: 1024px) 12rem, (min-width: 768px) 12rem, 10rem"
                      className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Text column */}
                  <div>
                    <h3 className="text-xl font-semibold">{b.name}</h3>
                    <p className="mt-2 text-slate-600">{b.desc}</p>

                    <div className="mt-5">
                      <button
                        onClick={() => addToPlan(b.key)}
                        className="btn btn-primary h-10 px-4 rounded-full"
                      >
                        Add to plan
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
