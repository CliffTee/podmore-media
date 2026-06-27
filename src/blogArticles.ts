export type BlogArticle = {
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  description: string;
  category: string;
  author: string;
  published: string;
  publishedIso: string;
  readTime: string;
  image: string;
  imageAlt: string;
  contentUrl: string;
  relatedSlugs: string[];
  contextualLinks: { slug: string; label: string }[];
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "how-to-ask-customers-for-google-reviews",
    title: "How Tradespeople Can Ask Customers for Google Reviews Without Sounding Pushy",
    seoTitle: "How Tradespeople Can Ask for Google Reviews",
    metaDescription: "Learn when and how to ask customers for honest Google reviews, with practical message templates and a simple follow-up process for UK tradespeople.",
    description: "Asking for a Google review does not need to feel awkward. Learn when to ask, what to say and how to make review requests part of your normal customer follow-up.",
    category: "Google Reviews",
    author: "Cliff Hawkins",
    published: "27 June 2026",
    publishedIso: "2026-06-27",
    readTime: "9 min read",
    image: "/assets/blog/how-to-ask-customers-for-google-reviews.png",
    imageAlt: "UK tradesperson asking a satisfied customer for an honest Google review after completing a job",
    contentUrl: "/blog-content/how-to-ask-customers-for-google-reviews.md",
    relatedSlugs: ["google-business-profile-not-working", "get-found-on-google-tradespeople"],
    contextualLinks: [
      { slug: "google-business-profile-not-working", label: "improve an underperforming Google Business Profile" },
      { slug: "get-found-on-google-tradespeople", label: "help more local customers find your trade business on Google" },
    ],
  },
  {
    slug: "get-found-on-google-tradespeople",
    title: "How Tradespeople Can Get Found on Google Without Wasting Time",
    description: "Practical steps UK tradespeople can take to improve local visibility on Google without spending hours on marketing.",
    category: "Local SEO",
    author: "Cliff Hawkins",
    published: "10 June 2026",
    publishedIso: "2026-06-10",
    readTime: "7 min read",
    image: "/assets/blog/get-found-on-google-tradespeople.png",
    imageAlt: "UK electrician checking his local Google visibility beside his work van",
    contentUrl: "/blog-content/get-found-on-google-tradespeople.md",
    relatedSlugs: ["google-business-profile-not-working", "tradesmen-website-what-matters"],
    contextualLinks: [
      { slug: "google-business-profile-not-working", label: "fix a Google Business Profile that is not bringing in work" },
      { slug: "tradesmen-website-what-matters", label: "learn what actually matters on a tradesman website" },
    ],
  },
  {
    slug: "google-business-profile-not-working",
    title: "Why Your Google Business Profile Isn't Bringing In Work (And How to Fix It)",
    description: "The common profile problems that reduce visibility and trust, with a practical 30-minute diagnostic checklist.",
    category: "Google Business Profile",
    author: "Cliff Hawkins",
    published: "3 June 2026",
    publishedIso: "2026-06-03",
    readTime: "7 min read",
    image: "/assets/blog/google-business-profile-not-working.png",
    imageAlt: "UK heating engineer reviewing his Google Business Profile on a laptop",
    contentUrl: "/blog-content/google-business-profile-not-working.md",
    relatedSlugs: ["get-found-on-google-tradespeople", "emergency-call-outs-ai-plumbers"],
    contextualLinks: [
      { slug: "get-found-on-google-tradespeople", label: "get your trade business found on Google without wasting time" },
      { slug: "emergency-call-outs-ai-plumbers", label: "use AI to win more emergency plumbing call-outs" },
    ],
  },
  {
    slug: "emergency-call-outs-ai-plumbers",
    title: "How Plumbers Can Get More Emergency Call-Outs Using AI",
    description: "Practical AI-assisted systems that can help plumbing businesses respond faster, improve local visibility, and capture urgent enquiries.",
    category: "AI Marketing",
    author: "Cliff Hawkins",
    published: "27 May 2026",
    publishedIso: "2026-05-27",
    readTime: "9 min read",
    image: "/assets/blog/emergency-call-outs-ai.png",
    imageAlt: "UK emergency plumber responding to an urgent evening call-out",
    contentUrl: "/blog-content/emergency-call-outs-ai.md",
    relatedSlugs: ["get-found-on-google-tradespeople", "ai-vs-traditional-marketing-local-trades-2026"],
    contextualLinks: [
      { slug: "get-found-on-google-tradespeople", label: "improve your trade business visibility on Google" },
      { slug: "ai-vs-traditional-marketing-local-trades-2026", label: "compare AI and traditional marketing for local trades" },
    ],
  },
  {
    slug: "ai-vs-traditional-marketing-local-trades-2026",
    title: "AI vs. Traditional Marketing: What Works for Local Trades in 2026",
    description: "A practical comparison of traditional and AI-assisted marketing for plumbers, electricians, roofers, builders, and other local trades.",
    category: "Marketing Strategy",
    author: "Cliff Hawkins",
    published: "20 May 2026",
    publishedIso: "2026-05-20",
    readTime: "10 min read",
    image: "/assets/blog/ai-vs-traditional-marketing-2026.png",
    imageAlt: "UK trades business owner comparing leaflets with digital marketing analytics",
    contentUrl: "/blog-content/ai-vs-traditional-marketing-2026.md",
    relatedSlugs: ["emergency-call-outs-ai-plumbers", "tradesmen-website-what-matters"],
    contextualLinks: [
      { slug: "emergency-call-outs-ai-plumbers", label: "see how plumbers can use AI for emergency call-outs" },
      { slug: "tradesmen-website-what-matters", label: "build a tradesman website that turns searches into enquiries" },
    ],
  },
  {
    slug: "tradesmen-website-what-matters",
    title: "From Van to Website: What Actually Matters for Tradesmen Online",
    description: "The essential website elements that help a trades business look credible, load quickly, and turn local searches into enquiries.",
    category: "Websites",
    author: "Cliff Hawkins",
    published: "13 May 2026",
    publishedIso: "2026-05-13",
    readTime: "11 min read",
    image: "/assets/blog/van-to-website-tradesmen.png",
    imageAlt: "UK carpenter reviewing his trade website on a tablet beside his van",
    contentUrl: "/blog-content/van-to-website-tradesmen.md",
    relatedSlugs: ["get-found-on-google-tradespeople", "google-business-profile-not-working"],
    contextualLinks: [
      { slug: "get-found-on-google-tradespeople", label: "help more local customers find your trade business on Google" },
      { slug: "google-business-profile-not-working", label: "diagnose why your Google Business Profile is not generating work" },
    ],
  },
];
