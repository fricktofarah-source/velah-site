// lib/posts.ts
export type PostImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type PostSection = {
  heading?: string;
  body: string[];
  image?: PostImage;
  quote?: { text: string; by: string };
  bullets?: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  content: string;
  updated?: string; // optional last-updated ISO
  tags?: string[];
  hero?: PostImage & { eyebrow?: string };
  sections?: PostSection[];
  cta?: { label: string; href: string; description?: string };
  translations?: Partial<
    Record<
      "AR",
      {
        title?: string;
        excerpt?: string;
      }
    >
  >;
};

const joinContent = (sections: PostSection[]): string =>
  sections
    .flatMap((section) => [
      section.heading ?? "",
      ...(section.body ?? []),
      ...(section.bullets ?? []),
      section.quote?.text ?? "",
    ])
    .join(" ")
    .trim();

export const posts: Post[] = [
  {
    slug: "hydration-and-cognitive-clarity",
    title: "Hydration and Cognitive Clarity: Why Consistent Water Matters",
    excerpt:
      "Even mild dehydration slows reaction time and focus. Practical tactics for Gulf climates and how Velah removes friction from staying hydrated.",
    date: "2025-08-18",
    tags: ["Hydration", "Performance", "Wellness"],
    hero: {
      src: "/assets/narrative-waterfall.png",
      alt: "Sunlit carafe of water on a workspace",
      caption: "Hydration rituals that feel calm, not clinical.",
      eyebrow: "Hydration Science",
    },
    sections: [
      {
        body: [
          "Neurophysiology studies show that a 1–2% drop in hydration measurably slows working memory and raises fatigue. In Gulf climates we sweat outside, then spend hours in dry air-conditioned offices, so the decline sneaks up quickly.",
          "The simplest fix is rhythm: drinking small amounts every hour stabilises electrolytes and glucose delivery so the brain keeps firing cleanly.",
        ],
      },
      {
        heading: "Hydration habits that actually work",
        bullets: [
          "Keep cool water within arm’s reach because visibility drives behaviour.",
          "Start the morning with 300–400 mL before coffee to reset after sleep.",
          "Pair sips with recurring tasks (calendar reminders, meetings, breaks).",
        ],
        image: {
          src: "/assets/velah-nature-1.png",
          alt: "Velah glass bottles on a countertop with natural light",
          caption: "Velah glass keeps flavour neutral so the ritual stays enjoyable.",
        },
        body: [
          "Warm plastic bottles leach subtle flavours that discourage regular sipping. Research on habit loops shows that removing sensory friction (taste, smell, texture) is critical if you want a behaviour to stick.",
          "Velah’s reusable glass bottles and stainless caps keep water neutral and visible, which makes the habit easier to maintain across the workday.",
        ],
      },
      {
        heading: "From habit to ritual",
        body: [
          "Teams tracking intake with Velah’s 1 L and 500 mL formats report fewer afternoon energy dips after a month. Glass stays on the desk, stainless caps make refills quick, and weekly swaps keep the cadence steady.",
          "Clarity is rarely about heroic hacks; it’s about building an environment that nudges you to sip. Velah keeps that environment consistent, delivering pure mineral-balanced water without plastic taste and keeping it ready whenever you reach for it.",
        ],
        quote: {
          text: "Since we switched to Velah, headlines that used to feel foggy now flow. The 1 L bottle sits beside my keyboard: simple, beautiful, effective.",
          by: "Rami, Velah member in Dubai Media City",
        },
      },
    ],
    cta: {
      label: "Build your hydration plan",
      href: "/subscription",
      description: "Design a Velah mix that keeps glass within reach all day without plastic.",
    },
    translations: {
      AR: {
        title: "الترطيب وصفاء الذهن: لماذا الماء المنتظم ضروري",
        excerpt: "حتى الجفاف البسيط يبطئ سرعة الاستجابة والتركيز. تكتيكات عملية لمناخ الخليج وكيف تجعل فيلا الترطيب عادة بلا عناء.",
      },
    },
    content: joinContent([
      {
        body: [
          "Neurophysiology studies show that a 1–2% drop in hydration measurably slows working memory and raises fatigue.",
          "Maintaining a steady sip rhythm each hour stabilises electrolytes and keeps cognition sharp.",
        ],
      },
      {
        heading: "Hydration habits that actually work",
        body: [
          "Warm plastic bottles leach subtle flavours that discourage regular sipping. Velah’s reusable glass keeps water neutral and visible, which makes the habit easier to maintain across the workday.",
        ],
        bullets: [
          "Keep cool water within arm’s reach because visibility drives behaviour.",
          "Start the morning with 300–400 mL before coffee to reset after sleep.",
          "Pair sips with recurring tasks (calendar reminders, meetings, breaks).",
        ],
      },
      {
        heading: "From habit to ritual",
        body: [
          "Teams using Velah’s 1 L and 500 mL formats report fewer afternoon slumps and more consistent intake across the week.",
        ],
      },
    ]),
  },
  {
    slug: "microplastics-in-water",
    title: "Microplastics in Water: The Invisible Ingredient We’re All Avoiding",
    excerpt:
      "Bottled water now contains up to 240,000 plastic fragments per litre. Here’s what the science says and how glass plus a reuse loop keeps microscopic waste out.",
    date: "2025-08-11",
    tags: ["Sustainability", "Microplastics", "Health"],
    hero: {
      src: "/assets/impact-oasis.png",
      alt: "Illustration of microscopic plastic particles suspended in water",
      caption: "Single-use plastic continues to fragment long after the bottle is recycled.",
      eyebrow: "Sustainability",
    },
    sections: [
      {
        body: [
          "A 2024 Columbia University study found between 110,000 and 240,000 nanoplastic particles per litre in leading bottled water brands. These fragments are measured in billionths of a metre, small enough to bypass many filtration membranes and interact with living cells.",
          "Municipal systems remove larger debris, but the final container plays a major role. Plastic flexes during shipping, warms on loading docks, and sheds microscopic particles into the water we eventually drink.",
        ],
      },
      {
        heading: "What microplastics do inside the body",
        bullets: [
          "Mimic hormone activity by transporting endocrine-disrupting chemicals.",
          "Carry heavy metals and persistent organic pollutants as they migrate through the bloodstream.",
          "Trigger localised inflammation in gut tissue, based on early gastroenterology studies.",
        ],
        body: [
          "Human research is ongoing, but the precautionary principle suggests reducing exposure whenever possible, especially in the \"last mile\" between treatment plant and drinking glass.",
        ],
      },
      {
        heading: "Why Velah anchors on glass",
        image: {
          src: "/assets/velah_bottle_1l.png",
          alt: "Velah 1 litre reusable glass bottle with stainless cap",
          caption: "Reusable glass plus stainless caps keep plastic away from the water.",
        },
        body: [
          "Velah bottles are laboratory-rinsed, steam-sanitised, and capped with stainless steel, so water never touches plastic. After each route, bottles return to our facility, are inspected under light, and recirculated through the deposit loop.",
          "For households and offices managing microplastic exposure, swapping pallets of single-use bottles for a predictable glass delivery removes the major source of fragments right at the point of use.",
        ],
      },
    ],
    cta: {
      label: "See Velah’s refillable loop",
      href: "/sustainability",
      description: "Explore how Velah’s deposit system keeps pure water circulating in glass across Dubai.",
    },
    translations: {
      AR: {
        title: "الجزيئات البلاستيكية الدقيقة في الماء: المكوّن الخفي الذي نتجنبه",
        excerpt: "قد تحتوي المياه المعبأة اليوم على ما يصل إلى ٢٤٠ ألف جزء بلاستيكي دقيق في كل لتر. إليك ما تقوله الأبحاث وكيف يحافظ الزجاج مع نظام الإرجاع على نقاء الماء.",
      },
    },
    content: joinContent([
      {
        body: [
          "A 2024 Columbia University study found between 110,000 and 240,000 nanoplastic particles per litre in leading bottled water brands.",
        ],
      },
      {
        heading: "What microplastics do inside the body",
        bullets: [
          "Mimic hormone activity by transporting endocrine-disrupting chemicals.",
          "Carry heavy metals and persistent organic pollutants through the bloodstream.",
          "Trigger inflammatory responses in gut tissue according to early research.",
        ],
        body: [
          "Reducing plastic in the final stage of delivery is a pragmatic step for households focused on wellness.",
        ],
      },
      {
        heading: "Why Velah anchors on glass",
        body: [
          "Velah uses laboratory-rinsed, steam-sanitised glass with stainless caps, keeping plastic out of contact with water and maintaining a closed reuse loop.",
        ],
      },
    ]),
  },
  {
    slug: "minerals-taste-and-performance",
    title: "Minerals, Taste, and Performance: Building a Better Water Profile",
    excerpt:
      "Optimal water isn’t just H₂O. The mineral balance supports taste, brewing, and recovery, and Velah tunes its profile for everyday life.",
    date: "2025-08-04",
    tags: ["Nutrition", "Performance", "Water Quality"],
    hero: {
      src: "/assets/timeline-bay.png",
      alt: "Minimal graphic showing mineral gradients in water",
      caption: "Taste and function come from the right mineral balance.",
      eyebrow: "Water Quality",
    },
    sections: [
      {
        body: [
          "Water with too few minerals tastes flat; with too many, it can feel chalky. Sensory research from the Specialty Coffee Association points to 80–150 mg/L of total dissolved solids (TDS) as the sweet spot for most palates.",
          "Magnesium aids muscle recovery, calcium stabilises electrolyte balance, and bicarbonate buffers acidity. Tap water in Dubai swings batch to batch depending on routing, while many stripped bottled waters sit close to zero minerals.",
        ],
      },
      {
        heading: "Velah’s mineral blueprint",
        bullets: [
          "Magnesium: 12 mg/L to aid muscle relaxation post-training.",
          "Calcium: 18 mg/L for balanced flavour and electrolyte support.",
          "Bicarbonate: 90 mg/L to keep taste bright and digestion calm.",
        ],
        image: {
          src: "/assets/velah_bottle_5g.png",
          alt: "Velah 5 gallon glass bottle",
          caption: "5G glass keeps the mineral profile stable from plant to pour.",
        },
        body: [
          "Velah mineralises purified water to this specification every batch and lab-tests it before bottling. Because storage and delivery happen exclusively in glass with stainless caps, the profile doesn’t drift between plant and pour.",
        ],
      },
      {
        heading: "From gym bag to dinner table",
        body: [
          "Baristas rely on stable water chemistry for extraction, while cyclists and runners care about magnesium replenishment. Velah’s balanced profile keeps espresso calibration predictable and recovery shakes free from plastic notes.",
          "In short, Velah treats water as part of the toolkit with consistent minerals, zero plastic interference, and deliveries that keep you stocked without weekly supermarket runs.",
        ],
        quote: {
          text: "Switching to Velah added finesse to every coffee we serve. The mineral balance is dialled, and our customers noticed within a week.",
          by: "Lena, Head Barista at Atelier 91",
        },
      },
    ],
    cta: {
      label: "Customize your weekly mix",
      href: "/subscription",
      description: "Choose the Velah bottle formats that match your routine and mineral goals.",
    },
    translations: {
      AR: {
        title: "المعادن والطعم والأداء: صياغة ملف ماء أفضل",
        excerpt: "الماء المثالي ليس مجرد H₂O. توازن المعادن يدعم الطعم والتحضير والتعافي، وفيلا تضبط ملفها لتناسب الحياة اليومية.",
      },
    },
    content: joinContent([
      {
        body: [
          "Water with too few minerals tastes flat; with too many, it can feel chalky. Sensory research highlights 80–150 mg/L of total dissolved solids as the sweet spot for most palates.",
          "Magnesium aids recovery, calcium stabilises electrolytes, and bicarbonate buffers acidity.",
        ],
      },
      {
        heading: "Velah’s mineral blueprint",
        bullets: [
          "Magnesium: 12 mg/L to aid muscle relaxation post-training.",
          "Calcium: 18 mg/L for balanced flavour and electrolyte support.",
          "Bicarbonate: 90 mg/L to keep taste bright and digestion calm.",
        ],
        body: [
          "Velah mineralises purified water to this balanced profile so every bottle tastes consistent from plant to pour.",
        ],
      },
      {
        heading: "From gym bag to dinner table",
        body: [
          "Velah’s balanced profile keeps espresso calibration predictable and recovery shakes free from plastic notes.",
        ],
      },
    ]),
  },
];
