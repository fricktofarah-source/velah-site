// lib/posts.ts
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  content: string;
  updated?: string; // optional last-updated ISO
};

export const posts: Post[] = [
  {
    slug: "why-glass-better-water",
    title: "Why glass makes water taste better",
    excerpt: "Ditch plastic taste. Glass is inert, recyclable, and premium.",
    date: "2025-08-01",
    content: `
Glass is chemically inert, so it never transfers taste or odor into your water.
It’s endlessly recyclable and looks gorgeous on your counter. We sanitize and
re-use our bottles, reducing waste without compromising taste.
    `.trim(),
  },
  {
    slug: "our-dubai-routes",
    title: "Our Dubai delivery routes",
    excerpt: "Where we deliver and how our weekly routes work.",
    date: "2025-08-05",
    content: `
We operate weekly routes across Dubai starting with Marina, Downtown, and JBR.
You can skip any week, change quantities, and we’ll pick up empties on your delivery day.
    `.trim(),
  },
  {
    slug: "how-deposit-works",
    title: "How the glass deposit works",
    excerpt: "A simple refundable deposit keeps bottles in circulation.",
    date: "2025-08-12",
    content: `
We charge a refundable deposit per bottle to keep them in circulation.
Return bottles anytime for a full deposit refund—no fuss.
    `.trim(),
  },
];
