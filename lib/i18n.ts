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
  editProfile: string;
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
};

type HowItWorksCopy = {
  heading: string;
  tagline: string;
  steps: Array<{ id: number; title: string; body: string; chips: string[] }>;
  next: string;
  subscriptionCta: string;
  aiPlanCta: string;
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
  aiBody?: string;
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

type HydrationCopy = {
  title: string;
  statusSignedIn: string;
  statusSignedInAs: (email: string) => string;
  statusGuest: string;
  todayHeading: string;
  dailyGoalLabel: string;
  dailyGoalPlaceholder: string;
  saveGoal: string;
  quickAdd: string;
  customAmountLabel: string;
  customAmountPlaceholder: string;
  customAmountCta: string;
  adjustTotalLabel: string;
  setTotalLabel: string;
  setTotalPlaceholder: string;
  setTotalCta: string;
  resetToday: string;
  historyHeading: string;
  unitMl: string;
  streakLabel: string;
  streakValue: (days: number) => string;
  streakKeepGoing: string;
  streakStart: string;
};

type OrderPageCopy = {
  title: string;
  description: string;
};

type OrderBuilderCopy = {
  aiTitle: string;
  aiBadge: string;
  aiIntro: string;
  householdLabel: string;
  glassesLabel: string;
  cookingLabel: string;
  preferenceLabel: string;
  preferenceOptions: {
    fiveG: string;
    oneL: string;
    fiveHund: string;
  };
  pricingNote: string;
  suggestedTitle: string;
  suggestionHigh: string;
  suggestionMid: string;
  suggestionLow: string;
  weeklyTotalLabel: string;
  addPlanCta: string;
  toastTitle: string;
  toastContinue: string;
  toastViewCart: string;
  individualTitle: string;
  individualBadge: string;
  singleNote: string;
  packNote: string;
  selectedLabel: string;
  addBottlesCta: string;
  syncingLabel: string;
};

type CartCopy = {
  label: string;
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  itemsLabel: string;
  pricingNote: string;
  checkoutCta: string;
  clearCta: string;
  buildPlanCta: string;
  removeCta: string;
  bottleLabels: {
    fiveG: string;
    oneL: string;
    fiveHund: string;
    singleNote: string;
    packNote: string;
  };
};

type ContactCopy = {
  label: string;
  title: string;
  subtitle: string;
  whatsappLabel: string;
  whatsappCta: string;
  formTitle: string;
  availability: string;
};

type ContactFormCopy = {
  sendingAs: (name: string, email: string) => string;
  memberFallback: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  sending: string;
  send: string;
  success: string;
  error: string;
};

type FaqCopy = {
  label: string;
  title: string;
  subtitle: string;
  items: Array<{ q: string; a: string }>;
  closing: string;
};

type PrivacyCopy = {
  label: string;
  title: string;
  subtitle: string;
  sections: Array<{ title: string; body: string }>;
  updatedLabel: string;
};

type AppCopy = {
  loading: {
    label: string;
  };
  nav: {
    home: string;
    orders: string;
    loop: string;
    profile: string;
  };
  auth: {
    title: string;
    helperSignIn: string;
    helperSignUp: string;
    helperMagic: string;
    tabSignIn: string;
    tabSignUp: string;
    tabMagic: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    submitSignIn: string;
    submitSignUp: string;
    submitMagic: string;
    submitLoading: string;
    statusWelcome: string;
    statusMagic: string;
    statusConfirm: string;
    statusError: string;
    termsPrefix: string;
    termsLink: string;
  };
  home: {
    title: string;
    statusRefreshFail: string;
    statusLoadFail: string;
    statusOfflineOnly: string;
    statusOfflineQueued: string;
    statusOfflineSaved: string;
    statusSupabaseQueued: string;
    statusUpdateFail: string;
    statusStillOffline: string;
    statusSynced: string;
    statusSyncQueued: string;
    hydrationLabel: string;
    goalLabel: string;
    unitMl: string;
    customPlaceholder: string;
    addCta: string;
    adjustLabel: string;
    setPlaceholder: string;
    setCta: string;
    resetCta: string;
    streakLabel: (days: number) => string;
    weeklyLabel: string;
    upcomingLabel: string;
    upcomingSlot: string;
    upcomingNote: string;
    loopLabel: string;
    loopOut: string;
    loopReturned: string;
    nextRouteLabel: string;
    nextRouteName: string;
    nextRouteSlot: string;
    recentLabel: string;
    queuedSuffix: string;
    emptyLog: string;
  };
  orders: {
    title: string;
    subtitle: string;
    cardLabel: string;
    cardTitle: string;
    cardNote: string;
    addToCart: string;
    upcomingLabel: string;
    pastLabel: string;
    pastEmpty: string;
    statusScheduled: string;
    statusPlanned: string;
  };
  loop: {
    title: string;
    subtitle: string;
    bottlesOut: string;
    returned: string;
    instructionsLabel: string;
    instructions: string[];
    pickupLabel: string;
    pickupNote: string;
  };
  profile: {
    title: string;
    subtitle: string;
    loadingLabel: string;
    signedOut: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    addressLine1: string;
    addressLine2: string;
    cityLabel: string;
    notificationsLabel: string;
    hydrationReminders: string;
    deliveryReminders: string;
    saveCta: string;
    statusSaving: string;
    statusSaved: string;
    statusLoadFail: string;
    statusSaveFail: string;
    statusDelete: string;
    statusDeleteFail: string;
    logout: string;
    delete: string;
    deleteConfirm: string;
  };
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
  hydration: HydrationCopy;
  orderPage: OrderPageCopy;
  orderBuilder: OrderBuilderCopy;
  cart: CartCopy;
  contact: ContactCopy;
  contactForm: ContactFormCopy;
  faq: FaqCopy;
  privacy: PrivacyCopy;
  app: AppCopy;
};

export const translations: Record<Language, SiteCopy> = {
  EN: {
    nav: {
      navLinks: {
        about: "About",
        sustainability: "Sustainability",
        subscription: "AI plan",
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
        { kind: "section", id: "subscription", label: "AI plan" },
        { kind: "section", id: "sustainability", label: "Sustainability" },
        { kind: "section", id: "blog", label: "From the blog" },
        { kind: "page", href: "/subscription", label: "AI plan overview" },
        { kind: "page", href: "/about", label: "Learn about Velah" },
        { kind: "page", href: "/hydration", label: "My hydration" },
        { kind: "post", slug: "why-glass-better-water", label: "Why glass makes water taste better" },
        { kind: "post", slug: "our-dubai-routes", label: "Our Dubai delivery routes" },
        { kind: "post", slug: "how-deposit-works", label: "How the glass deposit works" },
      ],
      joinWaitlist: "Join waitlist",
      signIn: "Sign in",
      signOut: "Sign out",
      editProfile: "Edit profile",
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
      aiPlanCta: "Build your AI plan",
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
      badge: "AI Plan Preview",
      heading: "Your AI weekly plan, built for one-time orders.",
      body: "Tell us about your week and start with an AI plan. You can adjust bottles and add the mix to your cart.",
      aiBody: "Our AI looks at your answers and suggests a weekly mix to keep glass in circulation.",
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
          price: "Pricing coming soon",
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
          price: "Pricing coming soon",
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
          price: "Pricing coming soon",
        },
      ],
      servingsTitle: "Weekly coverage",
      priceNote: "Pricing will appear once orders open.",
      deliveryHeadline: "In every order",
      deliveryItems: [
        "Chilled glass bottles sealed with stainless caps",
        "Deposit automatically refunded when glass returns",
        "Route reminder 24 hours before arrival",
      ],
      nextStepsHeadline: "Next steps",
      nextStepsBody: "Pick your area and we’ll notify you when ordering opens. You can build your cart in the meantime.",
      joinWaitlist: "Join the waitlist",
      exploreLink: "Build your AI plan",
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
      ],
      supportTitle: "Support",
      supportLinks: [
        { label: "FAQs", href: "/faq" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
      ],
      followTitle: "Follow",
      copyright: (year) => `© ${year} Velah. All rights reserved.`,
      tagline: "Made with glass, not plastic.",
    },
    hydration: {
      title: "My hydration",
      statusSignedIn: "Signed in",
      statusSignedInAs: (email) => `Signed in as ${email}`,
      statusGuest: "Guest mode",
      todayHeading: "Today",
      dailyGoalLabel: "Daily goal (ml)",
      dailyGoalPlaceholder: "e.g., 2000",
      saveGoal: "Save goal",
      quickAdd: "Quick add",
      customAmountLabel: "Custom amount",
      customAmountPlaceholder: "Custom",
      customAmountCta: "Add",
      adjustTotalLabel: "Adjust total",
      setTotalLabel: "Set total",
      setTotalPlaceholder: "Set total",
      setTotalCta: "Set total",
      resetToday: "Reset today",
      historyHeading: "Last 7 days",
      unitMl: "ml",
      streakLabel: "Hydration streak",
      streakValue: (days) => `${days} day${days === 1 ? "" : "s"}`,
      streakKeepGoing: "Keep meeting your goal to extend it.",
      streakStart: "Hit today's goal to start a streak.",
    },
    orderPage: {
      title: "Order Velah",
      description:
        "Build a one-time order with our AI weekly recommendation. Adjust quantities or add individual bottles, then add to cart.",
    },
    orderBuilder: {
      aiTitle: "AI weekly recommendation",
      aiBadge: "Weekly",
      aiIntro: "Tell us about your routine and we’ll suggest a weekly order.",
      householdLabel: "Household size",
      glassesLabel: "Glasses per person per day",
      cookingLabel: "Cooking or tea",
      preferenceLabel: "Bottle preference",
      preferenceOptions: {
        fiveG: "5G bottles",
        oneL: "1L bottles",
        fiveHund: "500 mL (6-packs)",
      },
      pricingNote: "Pricing is coming soon. You can still build your cart today.",
      suggestedTitle: "Suggested weekly mix",
      suggestionHigh: "High usage household. Mostly 5G with top-ups.",
      suggestionMid: "Balanced usage. One 5G plus smaller bottles.",
      suggestionLow: "Light usage. Smaller bottles keep it flexible.",
      weeklyTotalLabel: "Weekly total",
      addPlanCta: "Add AI plan to cart",
      toastTitle: "Added to cart",
      toastContinue: "Continue",
      toastViewCart: "View cart →",
      individualTitle: "Individual bottles",
      individualBadge: "Order based",
      singleNote: "Single bottle",
      packNote: "Sold in packs of 6",
      selectedLabel: "Selected",
      addBottlesCta: "Add bottles to cart",
      syncingLabel: "Syncing cart…",
    },
    cart: {
      label: "Cart",
      title: "Your cart",
      subtitle: "Pricing is coming soon. You can build your order now.",
      loading: "Loading cart…",
      empty: "Your cart is empty. Build an AI plan or add bottles.",
      itemsLabel: "Items",
      pricingNote: "Pricing will appear once orders open.",
      checkoutCta: "Checkout (coming soon)",
      clearCta: "Clear cart",
      buildPlanCta: "Build AI plan →",
      removeCta: "Remove",
      bottleLabels: {
        fiveG: "5G bottle",
        oneL: "1L bottle",
        fiveHund: "500 mL (6-pack)",
        singleNote: "Single bottle",
        packNote: "Sold in packs of 6",
      },
    },
    contact: {
      label: "Contact",
      title: "Talk to Velah",
      subtitle: "Send a message or WhatsApp us and we will reply quickly.",
      whatsappLabel: "WhatsApp",
      whatsappCta: "Message on WhatsApp",
      formTitle: "Send a message",
      availability: "Available Monday to Friday, 9am to 6pm Dubai time.",
    },
    contactForm: {
      sendingAs: (name, email) => `Sending as ${name} · ${email}`,
      memberFallback: "Velah member",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Your message",
      sending: "Sending...",
      send: "Send",
      success: "Message received. We will reply shortly.",
      error: "Could not send. Please try again.",
    },
    faq: {
      label: "FAQ",
      title: "Frequently asked questions",
      subtitle: "Everything you need to know about Velah delivery, bottles, and the return loop.",
      items: [
        {
          q: "How does delivery work?",
          a: "We deliver on set Dubai routes and share a confirmed window ahead of time. You can manage your plan in your account once subscriptions open.",
        },
        {
          q: "What sizes are available?",
          a: "Velah is delivered in reusable glass gallons and smaller bottles for daily use. Mix and match to fit your week.",
        },
        {
          q: "How do returns work?",
          a: "Rinse, cap, and leave bottles at your doorstep during your pickup window. We collect and loop them back into circulation.",
        },
        {
          q: "Is there a deposit?",
          a: "Yes. Glass is durable and reusable, so we place a refundable deposit on bottles to keep the loop closed.",
        },
        {
          q: "Where do you deliver?",
          a: "We serve Dubai today with GCC expansion planned. If your area is not listed, join the waitlist for updates.",
        },
        {
          q: "How do I contact support?",
          a: "Message us from the contact page or on WhatsApp and we will respond quickly during Dubai hours.",
        },
      ],
      closing: "Still have questions? Visit the contact page and we will get back to you quickly.",
    },
    privacy: {
      label: "Privacy",
      title: "Privacy policy",
      subtitle: "We keep data minimal and only collect what we need to run the service.",
      sections: [
        {
          title: "What we collect",
          body: "When you create an account we store your email, name, and delivery details you provide.",
        },
        {
          title: "How we use it",
          body: "We use your data to manage deliveries, bottle returns, hydration tracking, and support requests.",
        },
        {
          title: "Cookies",
          body: "We do not use tracking cookies. Essential session storage may be used to keep you signed in.",
        },
        {
          title: "Your choices",
          body: "You can request data updates or deletion by contacting founder@drinkvelah.com.",
        },
      ],
      updatedLabel: "Last updated: Sep 2025",
    },
    app: {
      loading: {
        label: "Preparing your ritual",
      },
      nav: {
        home: "Home",
        orders: "Orders",
        loop: "Loop",
        profile: "Profile",
      },
      auth: {
        title: "Sign in",
        helperSignIn: "Sign in to your Velah account.",
        helperSignUp: "Create a Velah account in seconds.",
        helperMagic: "We will email you a secure sign-in link.",
        tabSignIn: "Sign in",
        tabSignUp: "Create",
        tabMagic: "Magic",
        nameLabel: "Name",
        emailLabel: "Email",
        passwordLabel: "Password",
        submitSignIn: "Sign in",
        submitSignUp: "Create account",
        submitMagic: "Send link",
        submitLoading: "Please wait",
        statusWelcome: "Welcome back.",
        statusMagic: "Check your inbox for the sign-in link.",
        statusConfirm: "Check your email to confirm your account.",
        statusError: "Something went wrong.",
        termsPrefix: "By continuing you agree to Velah’s",
        termsLink: "Terms",
      },
      home: {
        title: "Today",
        statusRefreshFail: "Could not refresh hydration. Pull to retry.",
        statusLoadFail: "Could not load hydration right now.",
        statusOfflineOnly: "Offline — showing queued entries only.",
        statusOfflineQueued: "Offline — added to queue. We will sync once you are back online.",
        statusOfflineSaved: "Offline — total saved to queue. We will sync once you are back online.",
        statusSupabaseQueued: "Could not reach Supabase. Entry queued for sync.",
        statusUpdateFail: "Could not update total. Try again.",
        statusStillOffline: "Still offline. Entries will sync automatically.",
        statusSynced: "Queued hydration synced.",
        statusSyncQueued: "Queued hydration will sync once online.",
        hydrationLabel: "Hydration",
        goalLabel: "Goal",
        unitMl: "ml",
        customPlaceholder: "Custom",
        addCta: "Add",
        adjustLabel: "Adjust total",
        setPlaceholder: "Set ml",
        setCta: "Set total",
        resetCta: "Reset",
        streakLabel: (days) => `Streak: ${days} day${days === 1 ? "" : "s"}`,
        weeklyLabel: "Weekly rhythm",
        upcomingLabel: "Upcoming delivery",
        upcomingSlot: "Thursday · 9–11am",
        upcomingNote: "We will message you when your driver is en route.",
        loopLabel: "Loop status",
        loopOut: "8 out",
        loopReturned: "5 returned",
        nextRouteLabel: "Next route",
        nextRouteName: "Marina",
        nextRouteSlot: "Thu · 9–11am",
        recentLabel: "Recent log",
        queuedSuffix: " · queued",
        emptyLog: "No entries yet.",
      },
      orders: {
        title: "Orders",
        subtitle: "Your deliveries and past orders.",
        cardLabel: "Orders",
        cardTitle: "Build your next order",
        cardNote: "Pricing and checkout are coming soon.",
        addToCart: "Add to cart",
        upcomingLabel: "Upcoming",
        pastLabel: "Past orders",
        pastEmpty: "No orders yet. Your history will appear here.",
        statusScheduled: "Scheduled",
        statusPlanned: "Planned",
      },
      loop: {
        title: "Loop",
        subtitle: "Track returns and keep glass in circulation.",
        bottlesOut: "Bottles out",
        returned: "Returned",
        instructionsLabel: "Return instructions",
        instructions: [
          "Rinse bottles and cap them firmly.",
          "Place them by your entryway before the pickup window.",
          "We will confirm pickup completion in the Orders tab.",
        ],
        pickupLabel: "Pickup scheduling",
        pickupNote: "QR check-in and scheduling are coming soon.",
      },
      profile: {
        title: "Profile",
        subtitle: "Keep your details up to date.",
        loadingLabel: "Loading profile",
        signedOut: "Sign in to manage your profile.",
        nameLabel: "Name",
        emailLabel: "Email",
        phoneLabel: "Phone",
        addressLabel: "Address",
        addressLine1: "Street, building",
        addressLine2: "Apartment, floor",
        cityLabel: "City",
        notificationsLabel: "Notifications",
        hydrationReminders: "Hydration reminders",
        deliveryReminders: "Delivery reminders",
        saveCta: "Save changes",
        statusSaving: "Saving…",
        statusSaved: "Profile updated.",
        statusLoadFail: "Could not load profile.",
        statusSaveFail: "Could not save profile.",
        statusDelete: "Deleting account…",
        statusDeleteFail: "Could not delete account.",
        logout: "Log out",
        delete: "Delete account",
        deleteConfirm: "Delete your account? This cannot be undone.",
      },
    },
  },
  AR: {
    nav: {
      navLinks: {
        about: "عن فيلا",
        sustainability: "الاستدامة",
        subscription: "خطة الذكاء",
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
        { kind: "section", id: "about", label: "عن فيلا" },
        { kind: "section", id: "bottles", label: "العبوات المتاحة" },
        { kind: "section", id: "how", label: "كيف تعمل فيلا" },
        { kind: "section", id: "subscription", label: "خطة الذكاء" },
        { kind: "section", id: "sustainability", label: "الاستدامة" },
        { kind: "section", id: "blog", label: "من المدونة" },
        { kind: "page", href: "/subscription", label: "نظرة عامة على خطة الذكاء" },
        { kind: "page", href: "/about", label: "تعرّف على فيلا" },
        { kind: "page", href: "/hydration", label: "ترطيبي" },
        { kind: "post", slug: "why-glass-better-water", label: "لماذا يجعل الزجاج الماء ألذ" },
        { kind: "post", slug: "our-dubai-routes", label: "مسارات التوصيل في دبي" },
        { kind: "post", slug: "how-deposit-works", label: "كيف يعمل نظام الإيداع" },
      ],
      joinWaitlist: "انضم إلى قائمة الانتظار",
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      editProfile: "تعديل الملف الشخصي",
      waitlistModal: {
        title: "انضم إلى قائمة انتظار فيلا",
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
      badge: "ترطيب فيلا",
      heading: "مياه زجاجية نقية على مسارات أسبوعية هادئة في دبي.",
      body: "تصل القوارير مبردة وجاهزة لمنزلك، نعيد الفارغ في كل زيارة، وتُحكم الأغطية الستانلس كل سكب نظيف.",
      primaryCta: "انضم إلى قائمة الانتظار",
      secondaryCta: "تعرّف على الحلقة الدائرية",
      sliderLabel: "فيلا",
      slides: [
        {
          src: "/assets/Dubai_landscape_Arabic_v2.png",
          alt: "مسار توصيل فيلا يطل على أفق دبي عند الشروق",
          position: "50% 18%",
        },
        {
          src: "/assets/velah-nature-1.png",
          alt: "قوارير فيلا الزجاجية بجانب فاكهة وأعشاب طازجة",
        },
        {
          src: "/assets/Velah_bottle_transparent.png",
          alt: "قارورة فيلا الزجاجية على خلفية فاتحة",
        },
      ],
    },
    marquee: {
      ariaLabel: "نصائح الترطيب من فيلا",
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
      heading: "عن فيلا",
      paragraphs: [
        "فيلا هي الماء بلا ضوضاء. نوصله في زجاج قابل لإعادة الاستخدام مع أغطية من الستانلس، ونجمع القوارير الفارغة أسبوعيًا لتبقى الدورة مستمرة.",
        "الفكرة بسيطة: طعم نقي في المنزل، ونفايات أقل في المدينة. خدمة مدروسة بقدر المنتج. تؤكد التسليمات عند الحاجة، ونتولى نحن الباقي عند بابك.",
        "فيلا طقس بسيط في زجاج. نظيف، هادئ، ومصمم ليبقى.",
      ],
      readMore: "اقرأ المزيد",
      quotes: [
        {
          by: "المؤسس",
          text: "أنشأنا فيلا ليكون الماء في المنزل هادئًا ونقيًا ومدروسًا. الزجاج يحافظ على الطعم الصادق، والخدمة تزيل العناء ليبقى الطقس بسيطًا.",
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
    },
    howItWorks: {
      heading: "كيف تعمل فيلا",
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
      aiPlanCta: "ابنِ خطة الذكاء",
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
      body: "تحمل قوارير فيلا توازناً معدنياً ثابتًا، تبقى بنكهة محايدة، وتصل مبردة. الأغطية الستانلس محكمة لتنتقل من الإفطار إلى السهرات بلا طعم بلاستيك ولا آثار رطوبة.",
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
      secondaryCta: "كيف تهيئ فيلا كل قارورة",
    },
    subscriptionPeek: {
      badge: "معاينة خطة الذكاء",
      heading: "خطة أسبوعية بالذكاء للطلبات الفردية.",
      body: "أخبرنا عن أسبوعك وابدأ بخطة ذكية. يمكنك تعديل القوارير وإضافتها إلى السلة.",
      aiBody: "يقترح الذكاء الاصطناعي مزيجًا أسبوعيًا يناسب عاداتك للحفاظ على دورة الزجاج.",
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
          price: "الأسعار قريبًا",
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
          price: "الأسعار قريبًا",
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
          price: "الأسعار قريبًا",
        },
      ],
      servingsTitle: "التغطية الأسبوعية",
      priceNote: "ستظهر الأسعار عند فتح الطلبات.",
      deliveryHeadline: "في كل طلب",
      deliveryItems: [
        "قوارير زجاجية مبردة بأغطية ستانلس",
        "استرداد تلقائي للإيداع عند عودة الزجاج",
        "تذكير بالمسار قبل 24 ساعة",
      ],
      nextStepsHeadline: "الخطوات التالية",
      nextStepsBody: "اختر منطقتك وسنخبرك عند فتح الطلبات. يمكنك بناء السلة مسبقًا.",
      joinWaitlist: "انضم إلى قائمة الانتظار",
      exploreLink: "أنشئ خطة الذكاء",
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
      heading: "أشخاص يعتمدون على فيلا.",
      body: "من المطابخ الراقية إلى استوديوهات العافية، تبقي فيلا الماء هادئًا ودائريًا وجاهزًا دائمًا.",
      entries: [
        {
          initials: "LR",
          name: "لينا رحمن",
          role: "الشيف التنفيذي، أتيليه 91",
          quote: "توقفنا عن تخزين القوارير البلاستيكية في المطبخ. زجاج فيلا يصل مبردًا، والتوازن المعدني يحافظ على برنامج القهوة لدينا ثابتًا.",
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
          quote: "يلفت انتباه العملاء الديكور الزجاجي فور وصولهم. أزالت فيلا صداع اللوجستيات وتوافقت مع أهداف الاستدامة لدينا.",
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
        { label: "خطة الذكاء", href: "/subscription" },
      ],
      supportTitle: "الدعم",
      supportLinks: [
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "اتصل بنا", href: "/contact" },
        { label: "الخصوصية", href: "/privacy" },
      ],
      followTitle: "تابعنا",
      copyright: (year) => `© ${year} فيلا. جميع الحقوق محفوظة.`,
      tagline: "مصنوع من الزجاج لا البلاستيك.",
    },
    hydration: {
      title: "ترطيبي",
      statusSignedIn: "تم تسجيل الدخول",
      statusSignedInAs: (email) => `تم تسجيل الدخول كـ ${email}`,
      statusGuest: "وضع الضيف",
      todayHeading: "اليوم",
      dailyGoalLabel: "الهدف اليومي (مل)",
      dailyGoalPlaceholder: "مثال: ٢٠٠٠",
      saveGoal: "احفظ الهدف",
      quickAdd: "إضافة سريعة",
      customAmountLabel: "كمية مخصصة",
      customAmountPlaceholder: "مخصص",
      customAmountCta: "أضف",
      adjustTotalLabel: "ضبط الإجمالي",
      setTotalLabel: "تعيين الإجمالي",
      setTotalPlaceholder: "أدخل الإجمالي",
      setTotalCta: "تعيين",
      resetToday: "إعادة تعيين اليوم",
      historyHeading: "آخر ٧ أيام",
      unitMl: "مل",
      streakLabel: "سلسلة الترطيب",
      streakValue: (days) => `${days} يوم`,
      streakKeepGoing: "واصل تحقيق هدفك لتحافظ على السلسلة.",
      streakStart: "حقق هدف اليوم لبدء السلسلة.",
    },
    orderPage: {
      title: "اطلب فيلا",
      description:
        "أنشئ طلبًا لمرة واحدة مع توصية أسبوعية من الذكاء الاصطناعي. عدّل الكميات أو أضف عبوات منفردة، ثم أضف إلى السلة.",
    },
    orderBuilder: {
      aiTitle: "توصية أسبوعية بالذكاء الاصطناعي",
      aiBadge: "أسبوعي",
      aiIntro: "أخبرنا عن روتينك وسنقترح طلبًا أسبوعيًا.",
      householdLabel: "عدد أفراد المنزل",
      glassesLabel: "أكواب لكل شخص يوميًا",
      cookingLabel: "الطبخ أو الشاي",
      preferenceLabel: "تفضيل العبوات",
      preferenceOptions: {
        fiveG: "قوارير ٥ جالون",
        oneL: "قوارير ١ لتر",
        fiveHund: "٥٠٠ مل (باك ٦)",
      },
      pricingNote: "الأسعار قريبًا. يمكنك بناء سلتك الآن.",
      suggestedTitle: "المزيج الأسبوعي المقترح",
      suggestionHigh: "استهلاك مرتفع. معظمها ٥ جالون مع إضافات.",
      suggestionMid: "استهلاك متوازن. ٥ جالون مع عبوات أصغر.",
      suggestionLow: "استهلاك خفيف. عبوات أصغر لمرونة أكبر.",
      weeklyTotalLabel: "الإجمالي الأسبوعي",
      addPlanCta: "أضف خطة الذكاء إلى السلة",
      toastTitle: "تمت الإضافة إلى السلة",
      toastContinue: "متابعة",
      toastViewCart: "عرض السلة →",
      individualTitle: "عبوات منفردة",
      individualBadge: "حسب الطلب",
      singleNote: "عبوة واحدة",
      packNote: "تباع في باك ٦",
      selectedLabel: "المحدد",
      addBottlesCta: "أضف العبوات إلى السلة",
      syncingLabel: "جارٍ مزامنة السلة…",
    },
    cart: {
      label: "السلة",
      title: "سلتك",
      subtitle: "الأسعار قريبًا. يمكنك بناء طلبك الآن.",
      loading: "جارٍ تحميل السلة…",
      empty: "سلتك فارغة. أنشئ خطة ذكاء أو أضف عبوات.",
      itemsLabel: "العناصر",
      pricingNote: "ستظهر الأسعار عند فتح الطلبات.",
      checkoutCta: "الدفع (قريبًا)",
      clearCta: "تفريغ السلة",
      buildPlanCta: "أنشئ خطة الذكاء →",
      removeCta: "إزالة",
      bottleLabels: {
        fiveG: "قارورة ٥ جالون",
        oneL: "قارورة ١ لتر",
        fiveHund: "٥٠٠ مل (باك ٦)",
        singleNote: "عبوة واحدة",
        packNote: "تباع في باك ٦",
      },
    },
    contact: {
      label: "تواصل",
      title: "تحدث مع فيلا",
      subtitle: "أرسل رسالة أو راسلنا عبر واتساب وسنرد سريعًا.",
      whatsappLabel: "واتساب",
      whatsappCta: "راسلنا على واتساب",
      formTitle: "أرسل رسالة",
      availability: "متاح من الاثنين إلى الجمعة، ٩ صباحًا إلى ٦ مساءً بتوقيت دبي.",
    },
    contactForm: {
      sendingAs: (name, email) => `جارٍ الإرسال باسم ${name} · ${email}`,
      memberFallback: "عضو فيلا",
      nameLabel: "الاسم",
      emailLabel: "البريد الإلكتروني",
      messageLabel: "رسالتك",
      sending: "جارٍ الإرسال...",
      send: "إرسال",
      success: "تم استلام الرسالة. سنرد قريبًا.",
      error: "تعذر الإرسال. حاول مرة أخرى.",
    },
    faq: {
      label: "الأسئلة الشائعة",
      title: "الأسئلة الشائعة",
      subtitle: "كل ما تحتاج معرفته عن توصيل فيلا والعبوات وحلقة الإرجاع.",
      items: [
        {
          q: "كيف يعمل التوصيل؟",
          a: "نوصّل ضمن مسارات دبي المحددة ونشارك نافذة مؤكدة مسبقًا. يمكنك إدارة خطتك من حسابك عندما تفتح الاشتراكات.",
        },
        {
          q: "ما الأحجام المتاحة؟",
          a: "تصل فيلا في جالونات زجاج قابلة لإعادة الاستخدام وعبوات أصغر للاستخدام اليومي. امزج بينها بما يناسب أسبوعك.",
        },
        {
          q: "كيف تتم الإرجاعات؟",
          a: "اشطف القوارير وأغلقها ثم اتركها عند بابك خلال نافذة الاستلام. نجمعها ونعيدها للدورة.",
        },
        {
          q: "هل يوجد إيداع؟",
          a: "نعم. الزجاج متين وقابل لإعادة الاستخدام لذلك نضع إيداعًا قابلًا للاسترداد للحفاظ على الحلقة.",
        },
        {
          q: "أين توصلون؟",
          a: "نخدم دبي حاليًا مع خطط توسع في الخليج. إذا لم تكن منطقتك ضمن القائمة، انضم لقائمة الانتظار.",
        },
        {
          q: "كيف أتواصل مع الدعم؟",
          a: "راسلنا من صفحة التواصل أو عبر واتساب وسنرد سريعًا خلال ساعات دبي.",
        },
      ],
      closing: "لديك أسئلة أخرى؟ زر صفحة التواصل وسنعود إليك بسرعة.",
    },
    privacy: {
      label: "الخصوصية",
      title: "سياسة الخصوصية",
      subtitle: "نحافظ على البيانات في الحد الأدنى ونجمع ما نحتاجه فقط لتشغيل الخدمة.",
      sections: [
        {
          title: "ما نجمعه",
          body: "عند إنشاء الحساب نخزّن بريدك الإلكتروني واسمك وتفاصيل التوصيل التي تقدمها.",
        },
        {
          title: "كيف نستخدمها",
          body: "نستخدم بياناتك لإدارة التوصيل وإرجاع القوارير وتتبع الترطيب وطلبات الدعم.",
        },
        {
          title: "الكوكيز",
          body: "لا نستخدم كوكيز تتبع. قد نستخدم تخزينًا أساسيًا للجلسة لإبقائك مسجّلًا.",
        },
        {
          title: "خياراتك",
          body: "يمكنك طلب تحديث بياناتك أو حذفها عبر التواصل على founder@drinkvelah.com.",
        },
      ],
      updatedLabel: "آخر تحديث: سبتمبر 2025",
    },
    app: {
      loading: {
        label: "نحضّر طقسك",
      },
      nav: {
        home: "الرئيسية",
        orders: "الطلبات",
        loop: "الحلقة",
        profile: "الملف الشخصي",
      },
      auth: {
        title: "تسجيل الدخول",
        helperSignIn: "سجّل الدخول إلى حساب فيلا.",
        helperSignUp: "أنشئ حساب فيلا خلال ثوانٍ.",
        helperMagic: "سنرسل لك رابط دخول آمن عبر البريد.",
        tabSignIn: "دخول",
        tabSignUp: "إنشاء",
        tabMagic: "رابط",
        nameLabel: "الاسم",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        submitSignIn: "دخول",
        submitSignUp: "إنشاء حساب",
        submitMagic: "إرسال الرابط",
        submitLoading: "يرجى الانتظار",
        statusWelcome: "مرحبًا بعودتك.",
        statusMagic: "تحقق من بريدك لرابط الدخول.",
        statusConfirm: "تحقق من بريدك لتأكيد الحساب.",
        statusError: "حدث خطأ ما.",
        termsPrefix: "بالمتابعة فإنك توافق على",
        termsLink: "الشروط",
      },
      home: {
        title: "اليوم",
        statusRefreshFail: "تعذر تحديث الترطيب. اسحب لإعادة المحاولة.",
        statusLoadFail: "تعذر تحميل الترطيب الآن.",
        statusOfflineOnly: "غير متصل — عرض الإدخالات المعلقة فقط.",
        statusOfflineQueued: "غير متصل — تمت الإضافة للطابور. سنزامن عند الاتصال.",
        statusOfflineSaved: "غير متصل — تم حفظ الإجمالي في الطابور. سنزامن عند الاتصال.",
        statusSupabaseQueued: "تعذر الاتصال بسوبابيز. تمت إضافة الإدخال للطابور.",
        statusUpdateFail: "تعذر تحديث الإجمالي. حاول مرة أخرى.",
        statusStillOffline: "لا تزال غير متصل. ستتم المزامنة تلقائيًا.",
        statusSynced: "تمت مزامنة الترطيب المعلّق.",
        statusSyncQueued: "سيتم مزامنة الترطيب المعلّق عند الاتصال.",
        hydrationLabel: "الترطيب",
        goalLabel: "الهدف",
        unitMl: "مل",
        customPlaceholder: "مخصص",
        addCta: "أضف",
        adjustLabel: "ضبط الإجمالي",
        setPlaceholder: "أدخل مل",
        setCta: "تعيين الإجمالي",
        resetCta: "إعادة تعيين",
        streakLabel: (days) => `السلسلة: ${days} يوم`,
        weeklyLabel: "الإيقاع الأسبوعي",
        upcomingLabel: "التوصيل القادم",
        upcomingSlot: "الخميس · ٩–١١ صباحًا",
        upcomingNote: "سنرسل رسالة عند انطلاق السائق.",
        loopLabel: "حالة الحلقة",
        loopOut: "٨ خارج",
        loopReturned: "٥ عادت",
        nextRouteLabel: "المسار التالي",
        nextRouteName: "مارينا",
        nextRouteSlot: "الخميس · ٩–١١ صباحًا",
        recentLabel: "السجل الأخير",
        queuedSuffix: " · معلق",
        emptyLog: "لا توجد إدخالات بعد.",
      },
      orders: {
        title: "الطلبات",
        subtitle: "توصيلاتك وطلباتك السابقة.",
        cardLabel: "الطلبات",
        cardTitle: "ابنِ طلبك القادم",
        cardNote: "الأسعار والدفع قريبًا.",
        addToCart: "أضف إلى السلة",
        upcomingLabel: "القادمة",
        pastLabel: "الطلبات السابقة",
        pastEmpty: "لا توجد طلبات بعد. سيظهر السجل هنا.",
        statusScheduled: "مجدول",
        statusPlanned: "مخطط",
      },
      loop: {
        title: "الحلقة",
        subtitle: "تتبع الإرجاع وأبقِ الزجاج في الدورة.",
        bottlesOut: "عبوات خارج",
        returned: "مرتجعة",
        instructionsLabel: "تعليمات الإرجاع",
        instructions: [
          "اشطف القوارير وأغلقها بإحكام.",
          "ضعها عند المدخل قبل نافذة الاستلام.",
          "سنؤكد اكتمال الاستلام في تبويب الطلبات.",
        ],
        pickupLabel: "جدولة الاستلام",
        pickupNote: "رمز QR والجدولة قريبًا.",
      },
      profile: {
        title: "الملف الشخصي",
        subtitle: "حدّث معلوماتك أولاً بأول.",
        loadingLabel: "جارٍ تحميل الملف",
        signedOut: "سجّل الدخول لإدارة ملفك.",
        nameLabel: "الاسم",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "الهاتف",
        addressLabel: "العنوان",
        addressLine1: "الشارع، المبنى",
        addressLine2: "الشقة، الطابق",
        cityLabel: "المدينة",
        notificationsLabel: "الإشعارات",
        hydrationReminders: "تذكيرات الترطيب",
        deliveryReminders: "تذكيرات التوصيل",
        saveCta: "حفظ التغييرات",
        statusSaving: "جارٍ الحفظ…",
        statusSaved: "تم تحديث الملف.",
        statusLoadFail: "تعذر تحميل الملف.",
        statusSaveFail: "تعذر حفظ الملف.",
        statusDelete: "جارٍ حذف الحساب…",
        statusDeleteFail: "تعذر حذف الحساب.",
        logout: "تسجيل الخروج",
        delete: "حذف الحساب",
        deleteConfirm: "حذف حسابك؟ لا يمكن التراجع.",
      },
    },
  },
} as const;

export type SiteCopyKey = keyof typeof translations.EN;

export const SUPPORTED_LANGUAGES: Language[] = ["EN", "AR"];
