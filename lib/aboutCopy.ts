import type { Language } from "./i18n";

export type CarouselShot = {
  image: string;
  alt: string;
  aspect: number;
};

export type AboutCopy = {
  hero: {
    badge: string;
    heading: string;
    body: string;
    bullets: string[];
    scrollHint: string;
    carouselShots: CarouselShot[];
  };
  problem: {
    label: string;
    heading: string;
    body: string;
    stats: Array<{ value: number; suffix: string; label: string }>;
    collage: string[];
  };
  spark: {
    label: string;
    heading: string;
    body: string;
    note: string;
  };
  flow: {
    label: string;
    heading: string;
    body: string;
    steps: Array<{ icon: string; title: string; body: string }>;
  };
  sustainability: {
    label: string;
    heading: string;
    body: string;
    bullets: string[];
    loopPoints: Array<{ title: string; detail: string }>;
    loopTitle: string;
    loopHeading: string;
    loopBody: string;
    loopIndicatorLabel: string;
  };
  dubai: {
    label: string;
    heading: string;
    body: string;
  };
  useCases: {
    label: string;
    heading: string;
    body: string;
    cards: Array<{ title: string; caption: string; text: string }>;
  };
  partners: {
    label: string;
    items: string[];
  };
  closing: {
    brandLabel: string;
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export const ABOUT_COPY: Record<Language, AboutCopy> = {
  EN: {
    hero: {
      badge: "Velah",
      heading: "The desert has a new source.",
      body:
        "Pure mineral water. In a city built on desert. Velah delivers real mineral water in reusable glass gallons designed for Dubai’s health-focused, eco-aware residents.",
      bullets: [],
      scrollHint: "Scroll to discover the story",
      carouselShots: [
        {
          image: "/about/5G_Invisiblebg.png",
          alt: "Velah 5G glass gallon",
          aspect: 918 / 495,
        },
        {
          image: "/about/1L_invisiblebg.png",
          alt: "Velah 1L glass bottle",
          aspect: 1338 / 327,
        },
        {
          image: "/about/500mL_invisiblebg.png",
          alt: "Velah 500mL glass bottle",
          aspect: 1143 / 364,
        },
      ],
    },
    problem: {
      label: "The problem",
      heading: "Water everywhere. But not the kind we want.",
      body:
        "Dubai apartments are filled with plastic gallons, filters, and desalinated blends. The people who care most about health and the environment still compromise daily because real mineral water in reusable formats is impossible to find.",
      stats: [
        { value: 48, suffix: "+", label: "plastic gallons per household / year" },
        { value: 95, suffix: "%", label: "of Dubai water is desalinated today" },
        { value: 2, suffix: "x", label: "more microplastics than mineral sources" },
      ],
      collage: [],
    },
    spark: {
      label: "The spark",
      heading: "We wanted something that didn’t exist yet.",
      body:
        "Real mineral water, delivered in glass. Designed to look good in a Dubai home. Built to reduce plastic, not just talk about it. Velah is a founder-led obsession with better rituals, better materials, and a calmer hydration experience.",
      note: "Gentle float effect keeps the pour moment alive even when static.",
    },
    flow: {
      label: "The flow",
      heading: "Simple. Refillable. Rewarding.",
      body:
        "Understand Velah in seconds. Three calm steps communicate the entire loop to QR traffic on bottle labels or posters.",
      steps: [
        {
          icon: "1",
          title: "Choose your plan",
          body: "Reserve your refill cadence in seconds from any device.",
        },
        {
          icon: "2",
          title: "Delivery + refill",
          body: "Cold-chain delivery brings fresh mineral water to your door.",
        },
        {
          icon: "3",
          title: "Return + reward",
          body: "Swap empties for full bottles and earn rewards for staying glass.",
        },
      ],
    },
    sustainability: {
      label: "Sustainability loop",
      heading: "Refill, not landfill.",
      body:
        "Every Velah bottle is part of a loop. Mineral source → glass bottle → your home → return → clean → refill. Less plastic, less noise, more alignment with Dubai’s sustainability goals.",
      bullets: ["Loop indicator rotates with scroll", "Real-time plastic savings counter (optional)"],
      loopPoints: [
        { title: "Mineral source", detail: "Protected spring with full mineral profile." },
        { title: "Glass bottle", detail: "Reusable gallon, sanitized after each return." },
        { title: "Your home", detail: "Sits on your counter like an intentional object." },
        { title: "Return pickup", detail: "Velah team collects empties on your schedule." },
        { title: "Clean + refill", detail: "Sterilized, pressure-tested, and refilled." },
      ],
      loopTitle: "Velah Loop",
      loopHeading: "Every bottle is part of a loop.",
      loopBody: "Replace disposable plastics with a calm, permanent hydration ritual.",
      loopIndicatorLabel: "Loop",
    },
    dubai: {
      label: "The Dubai chapter",
      heading: "Made for Dubai’s future.",
      body:
        "Built in Dubai for residents who care about health, taste, aesthetics, and responsibility. Velah aligns with the UAE’s sustainability goals without feeling corporate—just calm, modern, and proudly local.",
    },
    useCases: {
      label: "The people",
      heading: "For homes, gyms, hotels.",
      body:
        "Velah’s reusable gallons live comfortably anywhere—residences, movement spaces, hospitality suites. Swap placeholder visuals for real photography, video, or CGI.",
      cards: [
        {
          title: "Residences",
          caption: "Health-forward homes & hosts",
          text: "Velah replaces dated plastic gallons with a sculptural centerpiece.",
        },
        {
          title: "Movement spaces",
          caption: "Gyms, yoga, recovery studios",
          text: "Refill stations stay calm, elevated, and aligned with members' rituals.",
        },
        {
          title: "Hospitality",
          caption: "Hotels, spas, boutique offices",
          text: "Serve mineral water that matches the aesthetic standard of your space.",
        },
      ],
    },
    partners: {
      label: "Partners & placements",
      items: ["Residences", "Wellness clubs", "Hotels & spas", "Workspaces", "Private dining", "Retail concepts"],
    },
    closing: {
      brandLabel: "Velah",
      heading: "The future of water in Dubai.",
      body: "This is just the first drop. We’re building a new way to drink water in Dubai—mineral, sustainable, beautiful.",
      primaryCta: "Join the waitlist",
      secondaryCta: "Explore subscriptions",
    },
  },
  AR: {
    hero: {
      badge: "فيلا",
      heading: "الصحراء لديها مصدر جديد.",
      body:
        "مياه معدنية نقية في مدينة بُنيت فوق الرمال. فيلا توصل مياهًا معدنية حقيقية في قوارير زجاجية قابلة لإعادة الاستخدام، صُممت لجيل دبي المهتم بالصحة والبيئة.",
      bullets: [],
      scrollHint: "تابع التمرير لاكتشاف القصة",
      carouselShots: [
        {
          image: "/about/5G_Invisiblebg.png",
          alt: "قارورة فيلا الزجاجية سعة 5 جالون",
          aspect: 918 / 495,
        },
        {
          image: "/about/1L_invisiblebg.png",
          alt: "قارورة فيلا الزجاجية سعة 1 لتر",
          aspect: 1338 / 327,
        },
        {
          image: "/about/500mL_invisiblebg.png",
          alt: "قارورة فيلا الزجاجية سعة 500 مل",
          aspect: 1143 / 364,
        },
      ],
    },
    problem: {
      label: "المشكلة",
      heading: "الماء موجود في كل مكان، لكن ليس بالمستوى الذي نريده.",
      body:
        "شقق دبي مليئة بالغالونات البلاستيكية والفلاتر والمياه المحلاة. الأشخاص الأكثر اهتماماً بالصحة والبيئة ما زالوا يساومون يومياً لأن الحصول على مياه معدنية حقيقية في عبوات قابلة لإعادة الاستخدام أمر صعب.",
      stats: [
        { value: 48, suffix: "+", label: "غالونات بلاستيكية لكل أسرة في السنة" },
        { value: 95, suffix: "%", label: "من مياه دبي محلاة اليوم" },
        { value: 2, suffix: "x", label: "أكثر من الميكروبلاستيك مقارنة بالمصادر المعدنية" },
      ],
      collage: ["غالونات بلاستيكية في كل زاوية", "فلاتر منزلية تدّعي أنها مياه معدنية", "مقيمون واعون بلا خيارات كافية"],
    },
    spark: {
      label: "الدافع",
      heading: "أردنا شيئاً لم يكن موجوداً بعد.",
      body:
        "مياه معدنية حقيقية، تُسلَّم في الزجاج. صُممت لتبدو جميلة في المنزل الدبياني. بُنيت لتقلل البلاستيك بدلاً من الاكتفاء بالحديث عنه. فيلا هي شغف المؤسسين بطقوس أفضل ومواد أرقى وتجربة شرب أكثر هدوءاً.",
      note: "تأثير طفو بسيط يبقي لحظة السكب حية حتى عندما تكون الصورة ثابتة.",
    },
    flow: {
      label: "التدفق",
      heading: "بسيط. قابل لإعادة التعبئة. مجزٍ.",
      body:
        "افهم نموذج فيلا خلال ثوانٍ. ثلاث خطوات هادئة تشرح الحلقة كاملة لزوّار رمز الاستجابة على القوارير أو الملصقات.",
      steps: [
        {
          icon: "1",
          title: "اختر خطتك",
          body: "حدد وتيرة إعادة التعبئة خلال ثوانٍ من أي جهاز.",
        },
        {
          icon: "2",
          title: "التوصيل وإعادة التعبئة",
          body: "سلسلة تبريد متصلة توصل المياه المعدنية الطازجة إلى بابك.",
        },
        {
          icon: "3",
          title: "الإرجاع والمكافأة",
          body: "استبدل القوارير الفارغة بالممتلئة واكسب نقاطاً لبقائك على الزجاج.",
        },
      ],
    },
    sustainability: {
      label: "حلقة الاستدامة",
      heading: "إعادة تعبئة، لا مطامر.",
      body:
        "كل قارورة من فيلا جزء من حلقة. مصدر معدني → قارورة زجاجية → منزلك → إرجاع → تنظيف → إعادة تعبئة. بلاستيك أقل، ضجيج أقل، وتوافق أكبر مع أهداف الاستدامة في الإمارات.",
      bullets: ["تتحرك مؤشرات الحلقة مع التمرير", "عداد لتوفير البلاستيك في الوقت الحقيقي (اختياري)"],
      loopPoints: [
        { title: "المصدر المعدني", detail: "نبع محمي ذو تركيبة معدنية كاملة." },
        { title: "القارورة الزجاجية", detail: "جالون قابل لإعادة الاستخدام يُعقم بعد كل إرجاع." },
        { title: "منزلك", detail: "يستقر على السطح كقطعة مقصودة وليست عبوة مخفية." },
        { title: "جمع القوارير", detail: "فريق فيلا يلتقط القوارير حسب جدولك." },
        { title: "تنظيف وإعادة التعبئة", detail: "تعقيم واختبار ضغط ثم تعبئة جديدة." },
      ],
      loopTitle: "حلقة فيلا",
      loopHeading: "كل قارورة جزء من حلقة.",
      loopBody: "استبدل البلاستيك أحادي الاستخدام بطقس هادئ ودائم.",
      loopIndicatorLabel: "حلقة",
    },
    dubai: {
      label: "الفصل الخاص بدبي",
      heading: "صُمم لمستقبل دبي.",
      body:
        "صنع في دبي للمقيمين الذين يهتمون بالصحة والطعم والجمال والمسؤولية. فيلا تتماشى مع أهداف الاستدامة في الإمارات دون طابع رسمي ممل—فقط هدوء وحداثة وهوية محلية فخورة.",
    },
    useCases: {
      label: "الناس",
      heading: "للمنازل والصالات والفنادق.",
      body:
        "القوارير الزجاجية القابلة لإعادة الاستخدام من فيلا تتكيف مع أي مساحة—البيوت، أماكن الحركة، أجنحة الضيافة. استبدل هذه النماذج بصور أو فيديوهات حقيقية عندما تكون جاهزاً.",
      cards: [
        {
          title: "المساكن",
          caption: "منازل ومضيفون يهتمون بالصحة",
          text: "تحل فيلا محل الغالونات البلاستيكية القديمة بقطعة فنية على طاولة المطبخ.",
        },
        {
          title: "مساحات الحركة",
          caption: "صالات رياضية، يوغا، استوديوهات تعافٍ",
          text: "تبقى محطات إعادة التعبئة هادئة وراقية ومتوافقة مع طقوس الأعضاء.",
        },
        {
          title: "الضيافة",
          caption: "فنادق، سبا، مكاتب بوتيك",
          text: "قدّم مياهًا معدنية تليق بالمعيار الجمالي لمساحتك.",
        },
      ],
    },
    partners: {
      label: "الشركاء والوجهات",
      items: ["المنازل الخاصة", "أندية العافية", "الفنادق والسبا", "أماكن العمل", "الضيافة الخاصة", "مفاهيم التجزئة"],
    },
    closing: {
      brandLabel: "فيلا",
      heading: "مستقبل الماء في دبي.",
      body: "هذه مجرد قطرة أولى. نبني طريقة جديدة لشرب الماء في دبي—معدنية، مستدامة، وجميلة.",
      primaryCta: "انضم إلى قائمة الانتظار",
      secondaryCta: "استكشف الاشتراكات",
    },
  },
};
