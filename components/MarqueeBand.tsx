const phrases = [
  "Drink a glass of water within 30 minutes of waking",
  "Aim for 500 mL per hour in summer heat",
  "Pair every coffee with a glass of mineral water",
  "Store 1 L bottles at 8 °C for the cleanest pour",
  "Swap plastic sports bottles for stainless refills",
  "Keep reusable bottles at eye level to prompt sips",
  "Add a pinch of sea salt after long workouts",
  "Log your afternoon glass to dodge the 3PM slump",
];

export default function MarqueeBand() {
  return (
    <section className="marquee-band" aria-label="Hydration tips from Velah">
      <div className="marquee-band__inner">
        <div
          className="marquee-band__track"
          style={{ animationDuration: "42s" }}
        >
          {phrases.map((text, idx) => (
            <MarqueeItem key={`${text}-${idx}`} text={text} />
          ))}
          {phrases.map((text, idx) => (
            <MarqueeItem key={`dup-${text}-${idx}`} text={text} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeItem({ text, ariaHidden = false }: { text: string; ariaHidden?: boolean }) {
  return (
    <span className="marquee-band__item" aria-hidden={ariaHidden || undefined}>
      <span>{text}</span>
      <span className="marquee-band__bullet" aria-hidden>
        •
      </span>
    </span>
  );
}
