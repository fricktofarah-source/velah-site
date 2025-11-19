// app/page.tsx
'use client';
import { type ReactNode } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Bottles from "@/components/Bottles";
import HowItWorks from "@/components/HowItWorks";
import MarqueeBand from "@/components/MarqueeBand";
import SubscriptionPeek from "@/components/SubscriptionPeek";
import ImpactStats from "@/components/ImpactStats";
import BlogPreview from "@/components/BlogPreview";
import { posts } from "@/lib/posts";
import SectionReveal from "@/components/SectionReveal";
import StandaloneHome from "@/components/StandaloneHome";
import { useStandaloneMode } from "@/lib/useStandaloneMode";

type SectionConfig = {
  key: string;
  render: () => ReactNode;
  fullBleed?: boolean;
  animate?: boolean;
};

const HOME_SECTIONS: SectionConfig[] = [
  { key: "hero", fullBleed: true, animate: false, render: () => <Hero /> },
  { key: "about", render: () => <About /> },
  { key: "bottles", render: () => <Bottles /> },
  { key: "marquee", fullBleed: true, render: () => <MarqueeBand /> },
  { key: "how", render: () => <HowItWorks /> },
  { key: "subscription", render: () => <SubscriptionPeek /> },
  { key: "impact", render: () => <ImpactStats /> },
  { key: "blog", render: () => <BlogPreview posts={posts} /> },
];

export default function HomePage() {
  const { isStandaloneMobile } = useStandaloneMode();

  if (isStandaloneMobile) {
    return <StandaloneHome />;
  }

  return (
    <main className="home-sections">
      {HOME_SECTIONS.map(({ key, render, fullBleed, animate }, index) => {
        const prevSection = HOME_SECTIONS[index - 1];
        const hasDivider =
          index > 1 && !fullBleed && prevSection?.key !== "marquee" && !prevSection?.fullBleed;
        return (
          <HomeSection key={key} fullBleed={fullBleed} hasDivider={hasDivider} animate={animate} index={index}>
            {render()}
          </HomeSection>
        );
      })}
    </main>
  );
}

type HomeSectionProps = {
  children: ReactNode;
  fullBleed?: boolean;
  hasDivider?: boolean;
  animate?: boolean;
  index: number;
};

function HomeSection({ children, fullBleed, hasDivider, animate = true, index }: HomeSectionProps) {
  const revealDelay = Math.min(index * 0.08, 0.4);
  const content = animate ? <SectionReveal delay={revealDelay}>{children}</SectionReveal> : children;

  if (fullBleed) {
    return <>{content}</>;
  }

  return (
    <div className={hasDivider ? "home-section-block home-section-block--with-divider" : "home-section-block"}>
      {content}
    </div>
  );
}
