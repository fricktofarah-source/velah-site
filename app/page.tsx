// app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Bottles from "@/components/Bottles";
import HowItWorks from "@/components/HowItWorks";
import MarqueeBand from "@/components/MarqueeBand";
import Experience from "@/components/Experience";
import SubscriptionPeek from "@/components/SubscriptionPeek";
import ImpactStats from "@/components/ImpactStats";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import { posts } from "@/lib/posts";

export default function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <Bottles />

      <MarqueeBand />

      <HowItWorks />

      <Experience />

      <SubscriptionPeek />

      <ImpactStats />

      <Testimonials />

      <BlogPreview posts={posts} />
    </>
  );
}
