"use client";

import { useLanguage } from "./LanguageProvider";

export default function MarqueeBand() {
  const { t } = useLanguage();
  const phrases = t.marquee.phrases;

  return (
    <section className="marquee-band" aria-label={t.marquee.ariaLabel}>
      <div className="marquee-band__inner">
        <div className="marquee-band__track" style={{ animationDuration: "42s" }}>
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
