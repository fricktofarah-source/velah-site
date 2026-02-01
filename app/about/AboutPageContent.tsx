// app/about/AboutPageContent.tsx
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ABOUT_COPY } from "@/lib/aboutCopy";
import HeroSection from "@/components/about/HeroSection";
import ProblemSection from "@/components/about/ProblemSection";
import SparkSection from "@/components/about/SparkSection";
import FlowSection from "@/components/about/FlowSection";
import SustainabilitySection from "@/components/about/SustainabilitySection";
import DubaiSection from "@/components/about/DubaiSection";
import UseCasesSection from "@/components/about/UseCasesSection";
import PartnersMarquee from "@/components/about/PartnersMarquee";
import ClosingSection from "@/components/about/ClosingSection";

export default function AboutPageContent() {
  const { language } = useLanguage();
  const copy = ABOUT_COPY[language];

  return (
    <div className="bg-white text-slate-900">
      <HeroSection copy={copy.hero} />
      <ProblemSection copy={copy.problem} />
      <SparkSection copy={copy.spark} />
      <FlowSection copy={copy.flow} />
      <SustainabilitySection copy={copy.sustainability} />
      <DubaiSection copy={copy.dubai} />
      <UseCasesSection copy={copy.useCases} />
      <PartnersMarquee copy={copy.partners} />
      <ClosingSection copy={copy.closing} />
    </div>
  );
};