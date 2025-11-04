"use client";

export type Language = "EN" | "AR";

export type Suggestion =
  | { kind: "section"; id: string; label: string }
  | { kind: "page"; href: string; label: string }
  | { kind: "post"; slug: string; label: string };

type NavCopy = {
  navLinks: {
    about: string;
    sustainability: string;
    subscription: string;
    blog: string;
    hydration: string;
  };
  searchPlaceholder: string;
  languageAria: string;
  languages: Array<{ code: Language; label: string }>;
  suggestions: readonly Suggestion[];
  joinWaitlist: string;
  signIn: string;
  signOut: string;
  waitlistModal: {
    title: string;
    emailLabel: string;
    areaLabel: string;
    areaPlaceholder: string;
    joinCta: string;
    tagline: string;
    invalidEmail: string;
    sending: string;
    success: string;
    close: string;
    signup: string;
  };
};

type HeroCopy = {
  badge: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  sliderLabel: string;
  slides: Array<{ src: string; alt: string; position?: string }>;
};

type MarqueeCopy = {
  ariaLabel: string;
  phrases: string[];
};

type AboutCopy = {
  heading: string;
  paragraphs: string[];
  readMore: string;
  quotes: Array<{ by: string; text: string; sub?: string }>;
};

type BottleCopy = {
  heading: string;
  items: Array<{ key: "5g" | "1l" | "500ml"; name: string; desc: string; img: string }>;
  addToPlan: string;
};

type HowItWorksCopy = {
  heading: string;
  tagline: string;
  steps: Array<{ id: number; title: string; body: string; chips: string[] }>;
  next: string;
  subscriptionCta: string;
  visuals: {
    plan: Array<{ label: string; value: string }>;
    delivery: string[];
    enjoy: string[];
    return: string[];
  };
};

type ExperienceCopy = {
  badge: string;
  heading: string;
  body: string;
  cards: Array<{ title: string; body: string }>;
  primaryCta: string;
  secondaryCta: string;
};

type SubscriptionPeekCopy = {
  badge: string;
  heading: string;
  body: string;
  bundles: Array<{
    id: string;
    name: string;
    description: string;
    mix: Array<{ label: string; amount: string }>;
    servings: string;
    price: string;
  }>;
  servingsTitle: string;
  priceNote: string;
  deliveryHeadline: string;
  deliveryItems: string[];
  nextStepsHeadline: string;
  nextStepsBody: string;
  joinWaitlist: string;
  exploreLink: string;
};

type ImpactCopy = {
  badge: string;
  heading: string;
  body: string;
  cta: string;
  stats: Array<{ value: number; suffix: string; label: string; description: string }>;
};

type TestimonialsCopy = {
  badge: string;
  heading: string;
  body: string;
  entries: Array<{ initials: string; name: string; role: string; quote: string }>;
};

type BlogCopy = {
  heading: string;
  allPosts: string;
  readMore: string;
  mobileButton: string;
};

type FooterCopy = {
  description: string;
  companyTitle: string;
  companyLinks: Array<{ label: string; href: string }>;
  supportTitle: string;
  supportLinks: Array<{ label: string; href: string }>;
  followTitle: string;
  copyright: (year: number) => string;
  tagline: string;
};

type SiteCopy = {
  nav: NavCopy;
  hero: HeroCopy;
  marquee: MarqueeCopy;
  about: AboutCopy;
  bottles: BottleCopy;
  howItWorks: HowItWorksCopy;
  experience: ExperienceCopy;
  subscriptionPeek: SubscriptionPeekCopy;
  impact: ImpactCopy;
  testimonials: TestimonialsCopy;
  blog: BlogCopy;
  footer: FooterCopy;
};

export const translations: Record<Language, SiteCopy> = {
  EN: {
    nav: {
      navLinks: {
        about: "About",
        sustainability: "Sustainability",
        subscription: "Subscription",
        blog: "Blog",
        hydration: "My hydration",
      },
      searchPlaceholder: "Search",
      languageAria: "Change language",
      languages: [
        { code: "EN", label: "English" },
        { code: "AR", label: "العربية" },
      ],
      suggestions: [
        { kind: "section", id: "about", label: "About Velah" },
        { kind: "section", id: "bottles", label: "Available bottles" },
        { kind: "section", id: "how", label: "How Velah works" },
        { kind: "section", id: "subscription", label: "Subscription plans" },
        { kind: "section", id: "sustainability", label: "Sustainability" },
        { kind: "section", id: "voices", label: "Testimonials" },
        { kind: "section", id: "blog", label: "From the blog" },
        { kind: "page", href: "/subscription", label: "Subscription overview" },
        { kind: "page", href: "/about", label: "Learn about Velah" },
        { kind: "page", href: "/hydration", label: "My hydration" },
        { kind: "post", slug: "why-glass-better-water", label: "Why glass makes water taste better" },
        { kind: "post", slug: "our-dubai-routes", label: "Our Dubai delivery routes" },
        { kind: "post", slug: "how-deposit-works", label: "How the glass deposit works" },
      ],
      joinWaitlist: "Join waitlist",
      signIn: "Sign in",
      signOut: "Sign out",
      waitlistModal: {
        title: "Join the Velah waitlist",
        emailLabel: "Email",
        areaLabel: "Area (Dubai)",
        areaPlaceholder: "Dubai Marina",
        joinCta: "Join",
        tagline: "Glass gallons • stainless caps • refundable deposit.",
        invalidEmail: "Please enter a valid email address.",
        sending: "Adding you to the list…",
        success: "You’re on the list. We’ll email you soon.",
        close: "Close",
        signup: "Sign up",
      },
    },
    hero: {
      badge: "Velah hydration",
      heading: "Pure glass water on calm weekly routes across Dubai.",
      body: "Chilled bottles arrive ready for your counter, empties return with every swap, and stainless caps keep every pour clean.",
      primaryCta: "Join the waitlist",
      secondaryCta: "Learn about the loop",
      sliderLabel: "Velah",
      slides: [
        {
          src: "/assets/Dubai_landscape.png",
          alt: "Velah delivery route overlooking the Dubai skyline at sunrise",
          position: "50% 18%",
        },
        {
          src: "/assets/velah-nature-1.png",
          alt: "Velah glass bottles beside fresh fruit and herbs",
        },
        {
          src: "/assets/Velah_bottle_transparent.png",
          alt: "Velah glass bottle against a light background",
        },
      ],
    },
    marquee: {
      ariaLabel: "Hydration tips from Velah",
      phrases: [
        "Drink a glass of water within 30 minutes of waking",
        "Aim for 500 mL per hour in summer heat",
        "Pair every coffee with a glass of mineral water",
        "Store 1 L bottles at 8 °C for the cleanest pour",
        "Swap plastic sports bottles for stainless refills",
        "Keep reusable bottles at eye level to prompt sips",
        "Add a pinch of sea salt after long workouts",
        "Log your afternoon glass to dodge the 3PM slump",
      ],
    },
    about: {
      heading: "About Velah",
      paragraphs: [
        "Velah is water without noise. We deliver in reusable glass, sealed with stainless, and picked up on weekly routes so bottles keep circulating.",
        "The idea is simple. Pure taste at home, less waste in the city. A service that feels as considered as the product. You confirm deliveries when you need them, and we handle the rest at your door.",
        "Velah is a small ritual in glass. Clean, calm, and made to last.",
      ],
      readMore: "Read more",
      quotes: [
        {
          by: "Founder",
          text: "We built Velah so water at home could be quiet, pure, and thoughtful. Glass keeps taste honest. The service removes friction so the ritual stays simple.",
          sub: "Fresh bottles delivered. Empties collected.",
        },
        {
          by: "Customer",
          text: "Switching to glass changed more than taste. The bottles look good on the counter and weekly swaps mean we never think about running out.",
          sub: "Consistent routes. Easy confirmations.",
        },
        {
          by: "Team",
          text: "Every bottle is sanitized and recirculated. Deposits make the loop work, and scheduling makes it feel effortless at the door.",
          sub: "Clean process from pickup to delivery.",
        },
      ],
    },
    bottles: {
      heading: "Available bottles",
      items: [
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
          img: "/assets/velah_bottle_500ml.png",
        },
      ],
      addToPlan: "Add to plan",
    },
    howItWorks: {
      heading: "How Velah works",
      tagline: "A clean refillable loop, made simple.",
      steps: [
        {
          id: 1,
          title: "Choose",
          body: "Tell us about your week. We suggest a mix of 5G + 1L + 500 mL top-ups. Edit any quantities and skip any week.",
          chips: ["AI suggestion", "Edit any week", "Skip anytime"],
        },
        {
          id: 2,
          title: "Delivery",
          body: "Weekly routes. We text before arrival; you can confirm, change, or skip.",
          chips: ["Route notifications", "Confirm or change", "Doorstep drop"],
        },
        {
          id: 3,
          title: "Enjoy",
          body: "Glass bottles on your counter, stainless caps, clean taste.",
          chips: ["Glass taste", "Stainless cap", "Counter-ready"],
        },
        {
          id: 4,
          title: "Return",
          body: "We collect empties on your next delivery. Deposits refunded when bottles come home.",
          chips: ["Easy returns", "Sanitized & reused", "Deposit refunded"],
        },
      ],
      next: "Next →",
      subscriptionCta: "See subscription",
      visuals: {
        plan: [
          { label: "5 Gallon", value: "× 1" },
          { label: "1 Litre", value: "× 4" },
          { label: "500 mL", value: "× 4" },
          { label: "Weekly total", value: "AED 56" },
        ],
        delivery: [
          "Scheduled: Wed 10–1",
          "Confirmed request: leave by door",
          "Route status: out for delivery",
        ],
        enjoy: ["1 L", "1 L", "5 G"],
        return: ["Empties collected", "Sanitised & refilled", "Deposit refunded"],
      },
    },
    experience: {
      badge: "Experience",
      heading: "Glass that feels at home on your counter.",
      body: "Velah bottles hold a balanced mineral profile, stay neutral in flavour, and arrive chilled. Stainless caps seal tight so you can move from breakfast to evening gatherings without worrying about plastic taste or condensation rings.",
      cards: [
        {
          title: "Counter ready",
          body: "Hand finished glass with a subtle frosted mark so you can track pours at a glance.",
        },
        {
          title: "Move with you",
          body: "1 L and 500 mL bottles slip into totes and gym bags; every swap includes fresh caps.",
        },
      ],
      primaryCta: "See the glass loop",
      secondaryCta: "How Velah prepares every bottle",
    },
    subscriptionPeek: {
      badge: "Subscription Preview",
      heading: "Choose a starting mix, then tailor every week.",
      body: "Pick the bundle closest to your routine. Once you’re on the waitlist you can confirm, tweak, or skip each delivery in seconds.",
      bundles: [
        {
          id: "balanced",
          name: "Balanced Home",
          description: "Family kitchen, daily hydration, weekend hosting.",
          mix: [
            { label: "5 Gallon", amount: "1×" },
            { label: "1 Litre", amount: "6×" },
            { label: "500 mL", amount: "6×" },
          ],
          servings: "20–24 glasses per day",
          price: "AED 78 + refundable deposit",
        },
        {
          id: "studio",
          name: "Studio & Office",
          description: "Creative studios, boutique gyms, meeting rooms.",
          mix: [
            { label: "5 Gallon", amount: "2×" },
            { label: "1 Litre", amount: "8×" },
            { label: "500 mL", amount: "0×" },
          ],
          servings: "30 glasses per day",
          price: "AED 96 + refundable deposit",
        },
        {
          id: "on-the-go",
          name: "On the Go",
          description: "Personal hydration, gym, and weekend adventures.",
          mix: [
            { label: "5 Gallon", amount: "0×" },
            { label: "1 Litre", amount: "4×" },
            { label: "500 mL", amount: "12×" },
          ],
          servings: "14–16 bottles per week",
          price: "AED 64 + refundable deposit",
        },
      ],
      servingsTitle: "Servings & coverage",
      priceNote: "Confirm, edit, or skip before every delivery.",
      deliveryHeadline: "In every delivery",
      deliveryItems: [
        "Chilled glass bottles sealed with stainless caps",
        "Deposit automatically refunded when glass returns",
        "Route reminder 24 hours before arrival",
      ],
      nextStepsHeadline: "Next steps",
      nextStepsBody: "Join the waitlist, pick your areas, and we’ll notify you when service opens. Swaps and extras are managed in one dashboard.",
      joinWaitlist: "Join the waitlist",
      exploreLink: "Explore full subscription →",
    },
    impact: {
      badge: "Impact",
      heading: "Designed to close the loop.",
      body: "Every bottle stays in circulation, each route is pooled, and deposits return when glass comes home. It is a calmer way to serve premium water while cutting waste.",
      cta: "Explore sustainability",
      stats: [
        {
          value: 90,
          suffix: "%",
          label: "Target bottle reuse rate",
          description: "Measured across 5G, 1L, and 500 mL formats.",
        },
        {
          value: 60,
          suffix: "%",
          label: "Less single-use plastic",
          description: "Compared with a typical household buying cases.",
        },
        {
          value: 30,
          suffix: "%",
          label: "Lower CO₂ per litre",
          description: "Optimised routing and pooled returns across districts.",
        },
        {
          value: 18,
          suffix: "×",
          label: "Glass cycles per year",
          description: "Average reuse target for bottles in circulation.",
        },
      ],
    },
    testimonials: {
      badge: "Voices",
      heading: "People building with Velah.",
      body: "From Michelin kitchens to wellness studios, Velah keeps water calm, circular, and always ready for the next pour.",
      entries: [
        {
          initials: "LR",
          name: "Leena Rahman",
          role: "Executive Chef, Atelier 91",
          quote: "We stopped stocking plastic bottles in the kitchen. Velah’s glass lands chilled, and the mineral balance keeps our coffee program consistent.",
        },
        {
          initials: "AM",
          name: "Arjun Mehta",
          role: "Head of Wellbeing, South Ridge Offices",
          quote: "The weekly swap is the simplest wellness upgrade we’ve rolled out. Teams fill reusable bottles and we track less fatigue by mid-afternoon.",
        },
        {
          initials: "SA",
          name: "Sara Al Maktoum",
          role: "Founder, Mysa Studio",
          quote: "Clients notice the glass decanters as soon as they arrive. Velah removed the logistics headache and aligned with our sustainability targets.",
        },
      ],
    },
    blog: {
      heading: "From the blog",
      allPosts: "All posts →",
      readMore: "Read more",
      mobileButton: "All posts",
    },
    footer: {
      description: "Eco-luxury water in reusable glass gallons. Dubai & GCC.",
      companyTitle: "Company",
      companyLinks: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Subscription", href: "/subscription" },
      ],
      supportTitle: "Support",
      supportLinks: [
        { label: "FAQs", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy", href: "#" },
      ],
      followTitle: "Follow",
      copyright: (year) => `© ${year} Velah. All rights reserved.`,
      tagline: "Made with glass, not plastic.",
    },
  },
  AR: {
    nav: {
      navLinks: {
        about: "عن فيلاه",
        sustainability: "الاستدامة",
        subscription: "الاشتراك",
        blog: "المدونة",
        hydration: "ترطيبي",
      },
      searchPlaceholder: "بحث",
      languageAria: "تغيير اللغة",
      languages: [
        { code: "EN", label: "English" },
        { code: "AR", label: "العربية" },
      ],
      suggestions: [
        { kind: "section", id: "about", label: "عن فيلاه" },
        { kind: "section", id: "bottles", label: "العبوات المتاحة" },
        { kind: "section", id: "how", label: "كيف تعمل فيلاه" },
        { kind: "section", id: "subscription", label: "خطط الاشتراك" },
        { kind: "section", id: "sustainability", label: "الاستدامة" },
        { kind: "section", id: "voices", label: "آراء العملاء" },
        { kind: "section", id: "blog", label: "من المدونة" },
        { kind: "page", href: "/subscription", label: "نظرة عامة على الاشتراك" },
        { kind: "page", href: "/about", label: "تعرّف على فيلاه" },
        { kind: "page", href: "/hydration", label: "ترطيبي" },
        { kind: "post", slug: "why-glass-better-water", label: "لماذا يجعل الزجاج الماء ألذ" },
        { kind: "post", slug: "our-dubai-routes", label: "مسارات التوصيل في دبي" },
        { kind: "post", slug: "how-deposit-works", label: "كيف يعمل نظام الإيداع" },
      ],
      joinWaitlist: "انضم إلى قائمة الانتظار",
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      waitlistModal: {
        title: "انضم إلى قائمة انتظار فيلاه",
        emailLabel: "البريد الإلكتروني",
        areaLabel: "المنطقة (دبي)",
        areaPlaceholder: "مرسى دبي",
        joinCta: "انضم",
        tagline: "جالونات زجاجية • أغطية من الستانلس • إيداع قابل للاسترداد.",
        invalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
        sending: "جاري إضافتك إلى القائمة…",
        success: "تمت إضافتك. سنتواصل معك قريبًا.",
        close: "إغلاق",
        signup: "أنشئ حسابًا",
      },
    },
    hero: {
      badge: "ترطيب فيلاه",
      heading: "مياه زجاجية نقية على مسارات أسبوعية هادئة في دبي.",
      body: "تصل القوارير مبردة وجاهزة لمنزلك، نعيد الفارغ في كل زيارة، وتُحكم الأغطية الستانلس كل سكب نظيف.",
      primaryCta: "انضم إلى قائمة الانتظار",
      secondaryCta: "تعرّف على الحلقة الدائرية",
      sliderLabel: "فيلا",
      slides: [
        {
          src: "/assets/Dubai_landscape_Arabic_v2.png",
          alt: "مسار توصيل فيلاه يطل على أفق دبي عند الشروق",
          position: "50% 18%",
        },
        {
          src: "/assets/velah-nature-1.png",
          alt: "قوارير فيلاه الزجاجية بجانب فاكهة وأعشاب طازجة",
        },
        {
          src: "/assets/Velah_bottle_transparent.png",
          alt: "قارورة فيلاه الزجاجية على خلفية فاتحة",
        },
      ],
    },
    marquee: {
      ariaLabel: "نصائح الترطيب من فيلاه",
      phrases: [
        "اشرب كوب ماء خلال 30 دقيقة من الاستيقاظ",
        "استهدف 500 مل في الساعة خلال حرارة الصيف",
        "رافق كل فنجان قهوة بكوب ماء معدني",
        "احفظ القوارير سعة 1 لتر على 8 درجات لأصفى طعم",
        "استبدل القوارير البلاستيكية بشربات من الستانلس",
        "ضع القوارير القابلة لإعادة التعبئة في مستوى النظر لتتذكر الشرب",
        "أضف رشة ملح بحري بعد التمارين الطويلة",
        "سجل كوب العصر لتتجنب هبوط الساعة الثالثة",
      ],
    },
    about: {
      heading: "عن فيلاه",
      paragraphs: [
        "فيلاه هي الماء بلا ضوضاء. نوصله في زجاج قابل لإعادة الاستخدام مع أغطية من الستانلس، ونجمع القوارير الفارغة أسبوعيًا لتبقى الدورة مستمرة.",
        "الفكرة بسيطة: طعم نقي في المنزل، ونفايات أقل في المدينة. خدمة مدروسة بقدر المنتج. تؤكد التسليمات عند الحاجة، ونتولى نحن الباقي عند بابك.",
        "فيلاه طقس بسيط في زجاج. نظيف، هادئ، ومصمم ليبقى.",
      ],
      readMore: "اقرأ المزيد",
      quotes: [
        {
          by: "المؤسس",
          text: "أنشأنا فيلاه ليكون الماء في المنزل هادئًا ونقيًا ومدروسًا. الزجاج يحافظ على الطعم الصادق، والخدمة تزيل العناء ليبقى الطقس بسيطًا.",
          sub: "قوارير طازجة تصل. والعائدة تُجمع.",
        },
        {
          by: "عميل",
          text: "الانتقال إلى الزجاج غيّر أكثر من الطعم. القوارير تبدو أنيقة على الطاولة، والتبديل الأسبوعي يعني أننا لا نفكر في النفاد.",
          sub: "مسارات ثابتة. تأكيدات سهلة.",
        },
        {
          by: "الفريق",
          text: "كل قارورة تُعقم وتعود للدورة. الإيداعات تجعل الحلقة تعمل، والجدولة تجعلها سلسة عند الباب.",
          sub: "عملية نظيفة من الالتقاط إلى التوصيل.",
        },
      ],
    },
    bottles: {
      heading: "العبوات المتاحة",
      items: [
        {
          key: "5g",
          name: "٥ جالون",
          desc: "زجاج قابل لإعادة التعبئة لمبردات المنازل. غطاء ستانلس وإيداع قابل للاسترداد.",
          img: "/assets/velah_bottle_5g.png",
        },
        {
          key: "1l",
          name: "١ لتر",
          desc: "زجاج مناسب للمائدة للاستخدام اليومي. قابل لغسالة الصحون بغطاء ستانلس.",
          img: "/assets/velah_bottle_1l.png",
        },
        {
          key: "500ml",
          name: "٥٠٠ مل",
          desc: "زجاج مدمج للانطلاق. قابل لغسالة الصحون بغطاء ستانلس.",
          img: "/assets/velah_bottle_500ml.png",
        },
      ],
      addToPlan: "أضف إلى خطتك",
    },
    howItWorks: {
      heading: "كيف تعمل فيلاه",
      tagline: "حلقة إعادة تعبئة نظيفة وبسيطة.",
      steps: [
        {
          id: 1,
          title: "اختر",
          body: "أخبرنا عن أسبوعك. نقترح مزيج ٥ جالون + ١ لتر + ٥٠٠ مل. عدّل الكميات وتخطَّ أي أسبوع.",
          chips: ["اقتراح ذكي", "تعديل أي أسبوع", "إمكانية الإيقاف"],
        },
        {
          id: 2,
          title: "التوصيل",
          body: "مسارات أسبوعية. نرسل تنبيهًا قبل الوصول لتؤكد، تغير أو تتخطى.",
          chips: ["تنبيهات المسار", "تأكيد أو تغيير", "توصيل عند الباب"],
        },
        {
          id: 3,
          title: "استمتع",
          body: "قوارير زجاجية على طاولتك، أغطية ستانلس، وطعم نقي.",
          chips: ["طعم الزجاج", "غطاء ستانلس", "جاهز للطاولة"],
        },
        {
          id: 4,
          title: "أعد",
          body: "نجمع القوارير الفارغة في التوصيل التالي. تُسترد الإيداعات عند عودة الزجاج.",
          chips: ["إرجاع سهل", "تعقيم وإعادة استخدام", "استرداد الإيداع"],
        },
      ],
      next: "التالي →",
      subscriptionCta: "استكشف الاشتراك",
      visuals: {
        plan: [
          { label: "٥ جالون", value: "× ١" },
          { label: "١ لتر", value: "× ٤" },
          { label: "٥٠٠ مل", value: "× ٤" },
          { label: "الإجمالي الأسبوعي", value: "٥٦ درهم" },
        ],
        delivery: [
          "موعد التوصيل: الأربعاء ١٠-١",
          "تم التأكيد: اتركها عند الباب",
          "حالة المسار: في الطريق",
        ],
        enjoy: ["١ لتر", "١ لتر", "٥ ج"],
        return: ["تم جمع القوارير الفارغة", "تعقيم وإعادة تعبئة", "استرداد الإيداع"],
      },
    },
    experience: {
      badge: "التجربة",
      heading: "زجاج يشعر بأنه جزء من منزلك.",
      body: "تحمل قوارير فيلاه توازناً معدنياً ثابتًا، تبقى بنكهة محايدة، وتصل مبردة. الأغطية الستانلس محكمة لتنتقل من الإفطار إلى السهرات بلا طعم بلاستيك ولا آثار رطوبة.",
      cards: [
        {
          title: "جاهز للطاولة",
          body: "زجاج مشطب يدويًا بعلامة صقيع خفيفة لتراقب الكميات بسهولة.",
        },
        {
          title: "يرافقك",
          body: "قوارير ١ لتر و٥٠٠ مل تنزلق في الحقائب الرياضية والعملية؛ كل تبديل يشمل أغطية جديدة.",
        },
      ],
      primaryCta: "شاهد حلقة الزجاج",
      secondaryCta: "كيف تهيئ فيلاه كل قارورة",
    },
    subscriptionPeek: {
      badge: "معاينة الاشتراك",
      heading: "اختر المزيج كبداية ثم عدّله كل أسبوع.",
      body: "انتقِ الحزمة الأقرب لروتينك. بعد الانضمام إلى قائمة الانتظار يمكنك التأكيد أو التعديل أو التخطي في ثوانٍ.",
      bundles: [
        {
          id: "balanced",
          name: "منزل متوازن",
          description: "مطبخ عائلي، ترطيب يومي، واستضافة نهاية الأسبوع.",
          mix: [
            { label: "٥ جالون", amount: "× ١" },
            { label: "١ لتر", amount: "× ٦" },
            { label: "٥٠٠ مل", amount: "× ٦" },
          ],
          servings: "20-24 كوب يوميًا",
          price: "78 درهم + إيداع مسترد",
        },
        {
          id: "studio",
          name: "استوديو ومكتب",
          description: "استوديوهات إبداعية، صالات بوتيك، وغرف اجتماعات.",
          mix: [
            { label: "٥ جالون", amount: "× ٢" },
            { label: "١ لتر", amount: "× ٨" },
            { label: "٥٠٠ مل", amount: "× ٠" },
          ],
          servings: "30 كوب يوميًا",
          price: "96 درهم + إيداع مسترد",
        },
        {
          id: "on-the-go",
          name: "على الطريق",
          description: "ترطيب شخصي، تمارين، ومغامرات نهاية الأسبوع.",
          mix: [
            { label: "٥ جالون", amount: "× ٠" },
            { label: "١ لتر", amount: "× ٤" },
            { label: "٥٠٠ مل", amount: "× ١٢" },
          ],
          servings: "14-16 قارورة أسبوعيًا",
          price: "64 درهم + إيداع مسترد",
        },
      ],
      servingsTitle: "الحصص والتغطية",
      priceNote: "يمكنك التأكيد أو التعديل أو التخطي قبل كل توصيل.",
      deliveryHeadline: "في كل توصيل",
      deliveryItems: [
        "قوارير زجاجية مبردة بأغطية ستانلس",
        "استرداد تلقائي للإيداع عند عودة الزجاج",
        "تذكير بالمسار قبل 24 ساعة",
      ],
      nextStepsHeadline: "الخطوات التالية",
      nextStepsBody: "انضم إلى قائمة الانتظار، حدد مناطق الخدمة، وسنخبرك عند فتح الاشتراك. كل التبديلات والإضافات من لوحة واحدة.",
      joinWaitlist: "انضم إلى قائمة الانتظار",
      exploreLink: "استكشف الاشتراك بالكامل →",
    },
    impact: {
      badge: "الأثر",
      heading: "مصمم لإغلاق الحلقة.",
      body: "كل قارورة تبقى في الدورة، والمسارات مجمعة، والإيداعات تعود مع عودة الزجاج. طريقة أهدأ لتقديم ماء فاخر مع تقليل الهدر.",
      cta: "استكشف الاستدامة",
      stats: [
        {
          value: 90,
          suffix: "%",
          label: "معدل إعادة استخدام القوارير المستهدف",
          description: "يشمل قوارير ٥ جالون و١ لتر و٥٠٠ مل.",
        },
        {
          value: 60,
          suffix: "%",
          label: "بلاستيك أحادي أقل",
          description: "مقارنة بأسرة تشتري عبوات تقليدية.",
        },
        {
          value: 30,
          suffix: "%",
          label: "انبعاثات CO₂ أقل لكل لتر",
          description: "مسارات محسّنة وإرجاع مجمع حسب الأحياء.",
        },
        {
          value: 18,
          suffix: "×",
          label: "دورات الزجاج السنوية",
          description: "متوسط مرات إعادة الاستخدام للقوارير المتداولة.",
        },
      ],
    },
    testimonials: {
      badge: "آراء العملاء",
      heading: "أشخاص يعتمدون على فيلاه.",
      body: "من المطابخ الراقية إلى استوديوهات العافية، تبقي فيلاه الماء هادئًا ودائريًا وجاهزًا دائمًا.",
      entries: [
        {
          initials: "LR",
          name: "لينا رحمن",
          role: "الشيف التنفيذي، أتيليه 91",
          quote: "توقفنا عن تخزين القوارير البلاستيكية في المطبخ. زجاج فيلاه يصل مبردًا، والتوازن المعدني يحافظ على برنامج القهوة لدينا ثابتًا.",
        },
        {
          initials: "AM",
          name: "أرجون ميهتا",
          role: "رئيس قسم الرفاهية، مكاتب ساوث ريدج",
          quote: "التبديل الأسبوعي أبسط ترقية صحية قمنا بها. يملأ الفريق القوارير القابلة لإعادة الاستخدام ونلاحظ تعبًا أقل بعد الظهر.",
        },
        {
          initials: "SA",
          name: "سارة المكتوم",
          role: "مؤسسة، استوديو ميسا",
          quote: "يلفت انتباه العملاء الديكور الزجاجي فور وصولهم. أزالت فيلاه صداع اللوجستيات وتوافقت مع أهداف الاستدامة لدينا.",
        },
      ],
    },
    blog: {
      heading: "من المدونة",
      allPosts: "جميع المقالات →",
      readMore: "اقرأ المزيد",
      mobileButton: "جميع المقالات",
    },
    footer: {
      description: "مياه فاخرة في زجاج قابل لإعادة الاستخدام. دبي ودول الخليج.",
      companyTitle: "الشركة",
      companyLinks: [
        { label: "عنّا", href: "/about" },
        { label: "المدونة", href: "/blog" },
        { label: "الاشتراك", href: "/subscription" },
      ],
      supportTitle: "الدعم",
      supportLinks: [
        { label: "الأسئلة الشائعة", href: "#" },
        { label: "اتصل بنا", href: "#" },
        { label: "الخصوصية", href: "#" },
      ],
      followTitle: "تابعنا",
      copyright: (year) => `© ${year} فيلاه. جميع الحقوق محفوظة.`,
      tagline: "مصنوع من الزجاج لا البلاستيك.",
    },
  },
} as const;

export type SiteCopyKey = keyof typeof translations.EN;

export const SUPPORTED_LANGUAGES: Language[] = ["EN", "AR"];
