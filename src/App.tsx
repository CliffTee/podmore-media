import { Fragment, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { blogArticles, type BlogArticle } from "./blogArticles";
import { LegalDocument } from "./LegalDocument";
import privacyPolicy from "./legal/privacy-policy.md?raw";
import termsAndConditions from "./legal/terms-and-conditions.md?raw";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronUp,
  Clock3,
  ClipboardCheck,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  Mail,
  Menu,
  MapPinned,
  Megaphone,
  MessageSquareText,
  Phone,
  Search,
  X,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

const phoneNumber = "07711 888 419";
const emailAddress = "hello@podmoremedia.com";
const reviewUrl = `mailto:${emailAddress}?subject=Free%20Marketing%20Review%20Request`;
const guideUrl = "/assets/plumber-cover.png";
const ebookCheckoutUrl = "https://buy.stripe.com/28E9ATb9t4wFaCF6VGcs800";
const starterCheckoutUrl =
  "https://buy.stripe.com/aFa00ja5p0gp269cg0cs801";
const growthCheckoutUrl =
  "https://buy.stripe.com/9B67sL2CX8MV3addk4cs802";
const proCheckoutUrl =
  "https://buy.stripe.com/00wbJ16Tdgfn5il7ZKcs803";
const guideDownloadUrl = "https://www.podmoremedia.com/d1707/easy-ai-marketing-for-plumbers-FINAL.pdf";
const brandQuestionnaireUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdNn7mpYkXjtNY6o5LulGNIlCfwAeQuZWNFQNEnVfS0nwURfA/viewform?usp=sharing&ouid=103953435540146859973";
const starterBrevoFormUrl = "https://da9ddc19.sibforms.com/serve/MUIFADXfNOAV7o1aYU4WLhKjvAWkxq8WeG1AD4nPCduGW4Eji7uGf5biKKfoEDCaPJ8gty5AsYUDP8ZgNwCLRng4OlkNDiYslV-w8dGxZk7xTmUgt51vpImT9g-i211EnVg2EGvzozxgLcarlmiVLh__dfdm8StPzjGz_Gy_I8h0rqmJ8UX-99nzrChoVdN0tjslMkaHa5h-ScFpQg==";
const growthBrevoFormUrl = "https://da9ddc19.sibforms.com/serve/MUIFACzpKCzMt087tRJGmOLVux-JiVFK4bB1fM854xPRBmRklx5CuNGotyusv0WsZMTgtDd4eoRz_T3-dx2j7RmovnhP4WXHA3dgD-hGSUubSgRstDZVt6h_nVBUbVY3mDpfiHzstsiDR3EdljJqrH5zG1TayM1X12m_M23I4shVmG6cacQvajhfRtP57b7UrZBerUM6NrlRSKP36g==";
const proBrevoFormUrl = "https://da9ddc19.sibforms.com/serve/MUIFAIPa5cT8zIp11_zfjBzt4X0Bc5ZSGWbqo7kGKK3KRldRKNCaWyeu-WmI301t4x9lghGENE_1JJAfkXgNHmn95SM5rFP2BuBsQvAB-1_izASaTkAW3fdPLgvUtottvEXaQsjwsxn1s4Ynr-LUi4cFxFUdZAA2wAQ9ePMRJmM-m0mA4avdeDQlO8sZ3U5RB5xmNGyaAVqzrInW9g==";

const navItems = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
];

const problemBullets = [
  "Your website does not clearly explain why customers should choose you.",
  "Your Google presence is not updated often enough.",
  "You know you should post online, but you do not have time.",
  "You don't have enough customer reviews, and don't know how to get them.",
  "Your competitors show up more often, even if you do better work.",
];

const services = [
  {
    icon: FileText,
    title: "Website Content & Conversion",
    body: "Clear homepage, service page, FAQ, and call-to-action copy that helps visitors understand what you do and contact you.",
  },
  {
    icon: MapPinned,
    title: "Local SEO Content Planning",
    body: "Service-focused and location-focused content ideas designed to help your business become more relevant locally.",
  },
  {
    icon: MessageSquareText,
    title: "Blog & Helpful Content",
    body: "Useful articles based on real customer questions, service problems, seasonal issues, and homeowner concerns.",
  },
  {
    icon: Megaphone,
    title: "Social Media Content",
    body: "Simple posts that keep your business active, helpful, and visible without turning you into a full-time content creator.",
  },
  {
    icon: Star,
    title: "Review & Reputation Content",
    body: "Review requests, review responses, testimonial posts, website proof sections, and referral messages.",
  },
  {
    icon: Sparkles,
    title: "AI Marketing Systems",
    body: "Prompt libraries, content plans, and repeatable routines that make your marketing easier to maintain.",
  },
];

const packages = [
  {
    name: "Starter",
    subtitle: "Local Visibility Starter",
    price: "99",
    setup: "0",
    bestFor: "Plumbers just getting started with online marketing.",
    promise: "A simple monthly content system to help your business look active, helpful, and trustworthy online.",
    includes: [
      "4 social media posts per month (copy-paste ready)",
      "2 Google Business Profile posts per month (copy-paste ready)",
      "1 monthly content game plan (4 weeks of post ideas)",
      "FREE setup: Brand voice questionnaire, Brand voice document, review request template",
      "FREE setup: Getting Started Guide (Facebook, GBP & email marketing setup)",
    ],
    cta: "Start with Starter",
    checkoutUrl: starterCheckoutUrl,
  },
  {
    name: "Growth",
    subtitle: "Local Lead Builder",
    price: "249",
    setup: "0",
    badge: "Most Popular",
    bestFor: "Established plumbers who want consistent leads and stronger online presence.",
    promise: "A monthly marketing system designed to help your business get found, build trust, and win more enquiries.",
    includes: [
      "8 social media posts per month (copy-paste ready)",
      "4 Google Business Profile posts per month (copy-paste ready)",
      "2 SEO blog posts per month (1000 words, ready to publish)",
      "1 website copy improvement per month (revised copy, FAQs, page outline or CTAs)",
      "2 email/newsletter drafts per month (for your customer database)",
      "1 monthly content game plan (4 weeks of post ideas)",
      "FREE setup: Brand voice questionnaire, Brand voice document, review request template",
      "FREE setup: Getting Started Guide (Facebook, GBP & email marketing setup)",
    ],
    cta: "Choose Growth",
    checkoutUrl: growthCheckoutUrl,
  },
  {
    name: "Pro",
    subtitle: "Contractor Growth System",
    price: "499",
    setup: "0",
    bestFor: "Busy contractors who want a complete done-for-you visibility and content system.",
    promise: "A full monthly content, local SEO, social, and reputation support system designed to make your business look active, trusted, and easier to choose.",
    includes: [
      "16 social media posts per month (copy-paste ready)",
      "8 Google Business Profile posts per month (copy-paste ready)",
      "4 SEO blog posts per month (1000 words each, ready to publish)",
      "2 website copy improvements per month (revised copy, FAQs, page outlines or CTAs)",
      "4 email/newsletter drafts per month (for your customer database)",
      "1 monthly review campaign (request templates + response drafts)",
      "1 monthly reporting summary (what was done, what's next)",
      "1 monthly content game plan (4 weeks of post ideas)",
      "FREE setup: Brand voice questionnaire, Brand voice document, review request template",
      "FREE setup: Getting Started Guide (Facebook, GBP & email marketing setup)",
    ],
    cta: "Go Pro",
    checkoutUrl: proCheckoutUrl,
  },
];

const trades = [
  "Plumbers",
  "Electricians",
  "Roofers",
  "General builders",
  "Landscapers",
  "Decorators",
  "HVAC companies",
  "Handyman services",
  "Driveway and patio companies",
  "Pest control companies",
  "Cleaning companies",
  "Other local trades",
];

const howSteps = [
  {
    title: "We Understand Your Trade, Services & Local Area",
    body: "We start by learning what you do, where you work, which services matter most, and what makes your business different. This gives us the raw material for stronger local marketing.",
    cta: "Choose Your Package",
  },
  {
    title: "You Choose the Right Marketing Package",
    body: "Whether you need a simple visibility boost, a review and reputation system, or ongoing contractor marketing support, we have the package that fits your business right now.",
    cta: "Choose Your Package",
  },
  {
    title: "We Build the Core Marketing Assets",
    body: "Depending on your package, we improve the foundations: website copy, service content, Google Business Profile content, review requests, local SEO assets, follow-up messages, and simple AI-assisted marketing systems.",
    cta: "Choose Your Package",
  },
  {
    title: "You Get Clear Marketing You Can Use",
    body: "You receive practical marketing assets designed to make your business easier to find, easier to trust, and easier to contact - without complicated marketing theory or extra admin.",
    cta: "Choose Your Package",
  },
];

const trustCards = [
  ["No Marketing Overwhelm", "We keep the system simple, practical, and focused on useful assets."],
  ["Built Around Your Services", "Your content is based on what you actually do, who you help, and where you work."],
  ["Designed for Busy Business Owners", "You do not need to become a marketer or content creator."],
  ["Helps Build Trust", "We help you use reviews, FAQs, service explanations, and helpful content to make prospects feel more confident."],
  ["Consistent Visibility", "Your business gets a repeatable content rhythm instead of random bursts of marketing."],
  ["Clear Monthly Deliverables", "You know what you are getting each month."],
];
const faqs = [
  {
    question: "Do I need to understand AI to work with you?",
    answer: "No. Podmore Media uses AI as part of the planning and content creation process, but you do not need to be technical.",
  },
  {
    question: "Is this only for plumbers?",
    answer: "No. The system started with plumber-focused marketing prompts, but it can be adapted for electricians, roofers, builders, landscapers, decorators, HVAC companies, and other home service contractors.",
  },
  {
    question: "Will you publish content for me?",
    answer: "This depends on the package and the agreed setup. Some clients want content supplied for approval, while others need more support with publishing and routine.",
  },
  {
    question: "Is this SEO?",
    answer: "It supports local SEO through better service content, blog planning, Google Business Profile updates, FAQs, and locally relevant content. It is not positioned as technical SEO-only support.",
  },
  {
    question: "Do I have to sign a long contract?",
    answer: "No long-term contract is required after setup. Monthly support can continue as long as it is useful.",
  },
  {
    question: "Which package should I choose?",
    answer: "Starter is best for getting started. Growth is best for most contractors who want consistent lead-building assets. Pro is best if you want a more complete growth system.",
  },
];

const serviceThankYouPages = {
  starter: {
    path: "/thank-you-starter-2503",
    packageName: "Starter Package",
    price: "£99 per month",
    intro: "Your Starter subscription is now active.",
    gratitude: "We’re genuinely grateful for your custom and looking forward to creating practical, professional content that reflects your business.",
    questionnaireIntro: "To get the most from your Starter Package, please complete the questionnaire now.",
    questionnaireRequirement: "We cannot begin preparing your personalised content until we receive it.",
    afterItems: [
      "your brand voice document",
      "your customised review request template",
      "your first Monthly Content Game Plan",
      "your Starter Package content",
    ],
  },
  growth: {
    path: "/thank-you-growth-1004",
    packageName: "Growth Package",
    price: "£249 per month",
    intro: "Your Growth subscription is now active.",
    gratitude: "We’re genuinely grateful for your custom and looking forward to creating content and marketing assets that reflect your business and support your online visibility.",
    questionnaireIntro: "To get the most from your Growth Package, please complete the questionnaire now.",
    questionnaireRequirement: "We cannot begin preparing your personalised content and marketing assets until we receive it.",
    afterItems: [
      "your brand voice document",
      "your customised review request template",
      "your first Monthly Content Game Plan",
      "your Growth Package content and marketing assets",
    ],
  },
  pro: {
    path: "/thank-you-pro-2211",
    packageName: "Pro Package",
    price: "£499 per month",
    intro: "Your Pro subscription is now active.",
    gratitude: "We’re genuinely grateful for your custom and looking forward to creating a strong, consistent collection of content, local SEO and reputation-support assets for your business.",
    questionnaireIntro: "To get the most from your Pro Package, please complete the questionnaire now.",
    questionnaireRequirement: "We cannot begin preparing your personalised content and assets until we receive it.",
    afterItems: [
      "your brand voice document",
      "your customised review request template",
      "your first Monthly Content Game Plan",
      "your Pro Package content, local SEO and reputation-support assets",
    ],
  },
} as const;

function PrimaryCta({ href = reviewUrl, children = "Book a Free Marketing Review" }: { href?: string; children?: string }) {
  return (
    <a className="button button-primary" href={href}>
      <span>{children}</span>
      <ArrowRight size={18} />
    </a>
  );
}

function SecondaryCta({ href = "#pricing", children = "See Packages" }: { href?: string; children?: string }) {
  return (
    <a className="button button-secondary" href={href}>
      <span>{children}</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announcement">
        <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>
          <Phone size={15} />
          Need more local leads? Call Podmore Media today: {phoneNumber}
        </a>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Podmore Media home">
          <img src="/assets/podmore-media-logo-flat.png" alt="Podmore Media" />
        </a>
        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "is-open" : ""} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
        </nav>
        <PrimaryCta href="tel:+4407711888419" children="Call Us Now" />
      </header>
    </>
  );
}

function Homepage() {
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const scrollToCurrentHash = (behavior: ScrollBehavior = "smooth") => {
      if (!window.location.hash) return;

      let targetId: string;
      try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({ behavior, block: "start" });
    };

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToCurrentHash("instant"));
    });

    const handleHashChange = () => scrollToCurrentHash("smooth");
    const handleLoad = () => scrollToCurrentHash("instant");

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("load", handleLoad);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xzdwlzjj", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      setContactStatus("success");
    } catch {
      setContactStatus("error");
    }
  }

  return (
    <main id="home">
      <Header />

      <section className="hero-section section-dark">
        <div className="section-inner hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Marketing systems for local trades</p>
            <h1>Stop Being Invisible Online</h1>
            <p className="hero-lead">
              Consistent marketing that gets you noticed and brings in enquiries. So you can run your business without worrying about marketing ever again.
            </p>
            <div className="hero-actions">
              <PrimaryCta href="#pricing" children="See Our Monthly Packages" />
            </div>
            <p className="trust-line">Built for busy trades who'd rather be working than marketing.</p>
          </div>

          <form className="hero-contact-form" onSubmit={handleContactSubmit}>
            <h2>Get in Touch</h2>
            <input type="hidden" name="_subject" value="New Podmore Media website enquiry" />
            <label>
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>Phone (optional)</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={4} required />
            </label>
            <button className="button button-primary" type="submit" disabled={contactStatus === "submitting"}>
              <span>{contactStatus === "submitting" ? "Sending..." : "Get in Touch"}</span>
              <ArrowRight size={18} />
            </button>
            {contactStatus === "success" && <p className="form-status success">Thanks, your message has been sent. We will be in touch soon.</p>}
            {contactStatus === "error" && <p className="form-status error">Sorry, something went wrong. Please try again or call us directly.</p>}
          </form>
        </div>
      </section>

      <section className="problem-section section-light">
        <div className="section-inner split-grid">
          <div>
            <p className="eyebrow">The problem</p>
            <h2>Great Contractors Shouldn't Be Invisible Online</h2>
            <p>
              Many home service businesses rely on referrals, word of mouth, and occasional posts, but they do not have a consistent system for visibility. That makes it easier for less capable competitors to look more active and easier to contact.
            </p>
            <PrimaryCta href="#pricing" children="See Our Monthly Packages" />
          </div>
          <div className="check-list">
            {problemBullets.map((item) => (
              <div key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="services-section section-white">
        <div className="section-inner">
          <div className="section-heading">
            <p className="eyebrow">What we do</p>
            <h2>Simple Marketing Systems for Local Trades</h2>
            <p>Podmore Media is not selling random marketing. It is a repeatable online visibility system built around the things your customers already need to see before they contact you.</p>
          </div>
          <div className="card-grid services-grid">
            {services.map(({ icon: Icon, title, body }) => (
              <article className="service-card" key={title}>
                <Icon size={28} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="center-actions">
            <PrimaryCta href="#pricing" children="See Our Monthly Packages" />
          </div>

        </div>
      </section>

      <section id="how-it-works" className="how-section section-dark">
        <div className="section-inner">
          <div className="section-heading centered light">
            <p className="eyebrow">How it works</p>
            <h2>How Podmore Media Builds Simple Marketing Systems for Local Trades</h2>
          </div>
          <div className="steps-grid">
            {howSteps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <a href="#pricing">{step.cta}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section section-white">
        <div className="section-inner split-grid">
          <div>
            <p className="eyebrow">Why this works</p>
            <h2>Your Customers Need to Find You, Trust You, and Contact You</h2>
            <p>
              Most home service customers are not looking for complicated marketing. They just want to know who can solve their problem, whether they can trust you, and how to get in touch.
            </p>
          </div>
          <div className="pillar-stack">
            <article><Search size={24} /><h3>Get Found</h3><p>Service pages, local content, Google updates, and helpful articles make it easier for customers to discover your business.</p></article>
            <article><BadgeCheck size={24} /><h3>Build Trust</h3><p>Clear website copy, reviews, FAQs, helpful posts, and proof-based content make you feel safer to contact.</p></article>
            <article><Send size={24} /><h3>Get Contacted</h3><p>Strong calls to action, clear service explanations, and easy contact points help turn visitors into enquiries.</p></article>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-section section-light">
        <div className="section-inner">
          <div className="section-heading centered">
            <p className="eyebrow">Packages</p>
            <h2>Simple Monthly Packages. Clear Deliverables. No Marketing Confusion.</h2>
            <p>Whether you need a simple starting point or a full monthly visibility system, Podmore Media gives home service contractors practical marketing support without confusing retainers or vague deliverables.</p>
          </div>
          <div className="pricing-grid">
            {packages.map((plan) => (
              <article className={`pricing-card ${plan.badge ? "featured" : ""}`} key={plan.name}>
                {plan.badge && <span className="popular-badge">{plan.badge}</span>}
                <h3>{plan.name}: {plan.subtitle}</h3>
                <p className="package-best">{plan.bestFor}</p>
                <div className="price"><span>&pound;</span>{plan.price}<small>/month</small></div>
                <p className="setup">{plan.setup === "0" ? "FREE" : "£" + plan.setup} setup</p>
                <p>{plan.promise}</p>
                <ul>
                  {plan.includes.map((item) => (
                    <li key={item}><CheckCircle2 size={17} />{item}</li>
                  ))}
                </ul>
                <PrimaryCta href={plan.checkoutUrl} children={plan.cta} />
              </article>
            ))}
          </div>
          <p className="pricing-note">
            All packages are built around practical marketing assets your business can actually use: website content, local SEO ideas, social posts, review content, and monthly visibility planning.
          </p>
        </div>
      </section>

      <section className="lead-magnet section-red">
        <div className="section-inner lead-grid">
          <div>
            <p className="eyebrow">Get the book</p>
            <h2>Easy AI Marketing for Plumbers</h2>
            <p>
              Get 25 practical ChatGPT prompts to help you create better website copy, local SEO content, social posts, and review messages in minutes instead of hours.
            </p>
            <a className="button button-dark" href="/easy-ai-marketing-for-plumbers">
              <span>Get the Book</span>
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="book-cover-card">
            <img src="/assets/plumber-cover-3d-tilt-right-25-prompts.png" alt="Easy AI Marketing for Plumbers book cover" />
          </div>
        </div>
      </section>

      <section className="who-help section-white">
        <div className="section-inner split-grid">
          <div>
            <p className="eyebrow">Who we help</p>
            <h2>Built for Home Service Contractors</h2>
            <p>We mainly help local service businesses that rely on trust, visibility, and local enquiries.</p>
          </div>
          <div className="trade-cloud">
            {trades.map((trade) => <span key={trade}>{trade}</span>)}
          </div>
        </div>
      </section>

      <section id="about" className="about-section section-light">
        <div className="section-inner about-grid">
          <div className="logo-panel">
            <img src="/assets/podmore-media-logo-flat.png" alt="Podmore Media" />
          </div>
          <div>
            <p className="eyebrow">About Podmore Media</p>
            <h2>Clearer Marketing for Busy Local Businesses</h2>
            <p>
              Podmore Media helps small businesses and home service contractors build clearer, more consistent online marketing systems.
            </p>
            <p>
              We understand that most contractors are busy running jobs, answering calls, managing customers, and keeping the business moving. You may know your website, Google profile, blog, social media, and reviews need attention, but knowing what needs doing is not the same as having time to do it.
            </p>
            <p>
              Our role is to help turn your expertise into useful marketing assets that support visibility, trust, and enquiries.
            </p>
          </div>
        </div>
      </section>

      <section className="trust-section section-dark">
        <div className="section-inner">
          <div className="section-heading centered light">
            <p className="eyebrow">Why contractors choose us</p>
            <h2>Practical Support Without the Marketing Fog</h2>
          </div>
          <div className="card-grid trust-grid">
            {trustCards.map(([title, body]) => (
              <article className="trust-card" key={title}>
                <ClipboardCheck size={25} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="center-actions">
            <a className="button button-primary" href="#home">Contact Us</a>
          </div>
        </div>
      </section>

      <section className="faq-section section-white">
        <div className="section-inner narrow">
          <div className="section-heading centered">
            <p className="eyebrow">FAQ</p>
            <h2>Questions Contractors Usually Ask</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary><HelpCircle size={18} /><span>{faq.question}</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="center-actions">
          </div>
        </div>
      </section>

      <section className="final-cta section-red" id="final-cta">
        <div className="section-inner centered">
          <h2>Ready to Make Your Business More Visible Online?</h2>
          <p>If your website, Google profile, social media, content, and reviews are not working together, Podmore Media can help you build a simple marketing system that supports more trust and more enquiries.</p>
          <div className="hero-actions">
            <a className="button button-secondary" href="#home">Contact Us</a>
            <SecondaryCta href="#pricing" children="See Our Monthly Packages" />
          </div>
        </div>
      </section>

      <Footer />
      <a className="back-to-top" href="#home" aria-label="Back to top"><ChevronUp size={22} /></a>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        <div>
          <img src="/assets/podmore-media-logo-flat.png" alt="Podmore Media" />
          <p>Practical marketing systems for home service contractors who want clearer visibility, stronger trust, and more local enquiries.</p>
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}><Phone size={16} />{phoneNumber}</a>
          <a href={`mailto:${emailAddress}`}><Mail size={16} />{emailAddress}</a>
          <p style={{marginTop: "10px", fontSize: "0.9rem"}}>Podmore Media<br/>Morland Rd<br/>London<br/>CR0 6HF</p>
        </div>
        <div>
          <h3>Social</h3>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube</a>
        </div>
        <div>
          <h3>Menu</h3>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">&copy; 2026 Podmore Media. All rights reserved.</div>
    </footer>
  );
}

function LegalPage({ title, markdown }: { title: string; markdown: string }) {
  useEffect(() => {
    setPageMetadata(title, `${title} for Podmore Media.`, window.location.pathname);
  }, [title]);

  return (
    <main className="legal-page">
      <header className="legal-header">
        <a href="/" aria-label="Podmore Media home">
          <img src="/assets/podmore-media-logo-flat.png" alt="Podmore Media" />
        </a>
        <p>Podmore Media</p>
      </header>

      <article className="legal-document">
        <p className="eyebrow">Podmore Media</p>
        <h1>{title}</h1>
        <LegalDocument markdown={markdown} />
      </article>
      <Footer />
    </main>
  );
}

function setPageMetadata(title: string, description: string, path = "/", image = "/assets/podmore-media-logo-flat.png") {
  const siteUrl = "https://podmoremedia.com";
  const canonicalUrl = `${siteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;
  document.title = `${title} | Podmore Media`;
  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", description);

  const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", description);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
}

function BlogCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  return (
    <article className={`blog-card ${featured ? "featured" : ""}`}>
      <a className="blog-card-image" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
        <img src={article.image} alt={article.imageAlt} />
      </a>
      <div className="blog-card-copy">
        <div className="blog-meta">
          <span>{article.category}</span>
          <span>By {article.author}</span>
          <time dateTime={article.publishedIso}>{article.published}</time>
          <span>{article.readTime}</span>
        </div>
        <h2><a href={`/blog/${article.slug}`}>{article.title}</a></h2>
        <p>{article.description}</p>
        <a className="blog-read-link" href={`/blog/${article.slug}`}>
          Read article <ArrowRight size={17} />
        </a>
      </div>
    </article>
  );
}

function BlogPage() {
  useEffect(() => {
    setPageMetadata(
      "Marketing Advice for UK Trades",
      "Practical local SEO, website, Google Business Profile, and AI marketing advice for UK trades and local service businesses.",
      "/blog",
    );
  }, []);

  const [featured, ...articles] = blogArticles;

  return (
    <main className="blog-page">
      <Header />
      <section className="blog-hero section-dark">
        <div className="section-inner">
          <p className="eyebrow">Podmore Media Blog</p>
          <h1>Practical Marketing Ideas for Trades and Local Service Businesses</h1>
          <p>Clear, useful advice on local visibility, websites, Google Business Profile, AI-assisted marketing, and building trust online.</p>
        </div>
      </section>
      <section className="blog-index section-light">
        <div className="section-inner">
          <BlogCard article={featured} featured />
          <div className="blog-grid">
            {articles.map((article) => <BlogCard article={article} key={article.slug} />)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function cleanArticleMarkdown(markdown: string) {
  const replacements: Array<[string, string]> = [
    ["â€”", "-"],
    ["â€“", "-"],
    ["â€™", "'"],
    ["â€œ", "\""],
    ["â€", "\""],
    ["Â£", "£"],
    ["Â°C", "°C"],
  ];

  let cleaned = markdown;
  replacements.forEach(([from, to]) => {
    cleaned = cleaned.split(from).join(to);
  });

  cleaned = cleaned
    .replace(/^# .+\n+/, "")
    .replace(/^\*Published:.*\n?/gm, "")
    .replace(/^\*\*Meta Title:\*\*.*\n?/gm, "")
    .replace(/^\*\*Meta Description:\*\*.*\n?/gm, "")
    .replace(/^\*\*Suggested URL Slug:\*\*.*\n?/gm, "")
    .replace(/^---\s*$/gm, "")
    .replace(/\n## BVD Compliance Check[\s\S]*$/m, "")
    .replace(/\n\*Word count:[\s\S]*$/m, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2] === "/ebook" ? "/easy-ai-marketing-for-plumbers" : link[2];
      return <a href={href} key={`${part}-${index}`}>{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function ArticleMarkdown({ markdown }: { markdown: string }) {
  const blocks = cleanArticleMarkdown(markdown).split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        let renderedBlock: ReactNode;
        if (block.startsWith("### ")) renderedBlock = <h3>{renderInlineMarkdown(block.slice(4))}</h3>;
        else if (block.startsWith("## ")) renderedBlock = <h2>{renderInlineMarkdown(block.slice(3))}</h2>;
        else if (lines.length > 1 && lines.slice(1).every((line) => /^[-*] /.test(line))) {
          renderedBlock = (
            <div className="blog-content-group">
              <p>{renderInlineMarkdown(lines[0])}</p>
              <ul>{lines.slice(1).map((line) => <li key={line}>{renderInlineMarkdown(line.slice(2))}</li>)}</ul>
            </div>
          );
        } else if (lines.length > 1 && lines.slice(1).every((line) => /^> /.test(line))) {
          renderedBlock = (
            <div className="blog-content-group">
              <p>{renderInlineMarkdown(lines[0])}</p>
              <blockquote>{renderInlineMarkdown(lines.slice(1).map((line) => line.replace(/^>\s?/, "")).join(" "))}</blockquote>
            </div>
          );
        } else if (lines.every((line) => /^[-*] /.test(line))) {
          renderedBlock = <ul>{lines.map((line) => <li key={line}>{renderInlineMarkdown(line.slice(2))}</li>)}</ul>;
        } else if (lines.every((line) => /^\d+\. /.test(line))) {
          renderedBlock = <ol>{lines.map((line) => <li key={line}>{renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</li>)}</ol>;
        } else if (block.startsWith("> ")) {
          renderedBlock = <blockquote>{renderInlineMarkdown(lines.map((line) => line.replace(/^>\s?/, "")).join(" "))}</blockquote>;
        } else {
          renderedBlock = <p>{renderInlineMarkdown(lines.join(" "))}</p>;
        }

        return (
          <Fragment key={index}>
            {renderedBlock}
          </Fragment>
        );
      })}
    </>
  );
}

function BlogArticlePage({ article }: { article: BlogArticle }) {
  const [markdown, setMarkdown] = useState("");
  const [loadError, setLoadError] = useState(false);
  const relatedArticles = article.relatedSlugs
    .map((slug) => blogArticles.find((item) => item.slug === slug))
    .filter((item): item is BlogArticle => Boolean(item));

  useEffect(() => {
    setPageMetadata(article.title, article.description, `/blog/${article.slug}`, article.image);
    fetch(article.contentUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Article content failed to load");
        return response.text();
      })
      .then(setMarkdown)
      .catch(() => setLoadError(true));
  }, [article]);

  return (
    <main className="blog-page">
      <Header />
      <article className="blog-article">
        <header className="blog-article-header section-dark">
          <div className="section-inner blog-article-container">
            <a className="blog-back-link" href="/blog">Back to the blog</a>
            <div className="blog-meta">
              <span>{article.category}</span>
              <span>By {article.author}</span>
              <time dateTime={article.publishedIso}>{article.published}</time>
              <span>{article.readTime}</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </div>
        </header>
        <div className="blog-article-layout section-light">
          <div className="section-inner blog-article-container">
            <img className="blog-article-image" src={article.image} alt={article.imageAlt} />
            <div className="blog-article-body">
              {loadError && <p>Sorry, this article could not be loaded. Please return to the <a href="/blog">blog page</a>.</p>}
              {!loadError && !markdown && <p>Loading article...</p>}
              {markdown && <ArticleMarkdown markdown={markdown} />}
              <aside className="blog-related">
                <p className="eyebrow">Related reading</p>
                <h2>Keep improving your local visibility</h2>
                <div>
                  {relatedArticles.map((related) => (
                    <a href={`/blog/${related.slug}`} key={related.slug}>
                      <span>{related.category}</span>
                      <strong>{related.title}</strong>
                      <ArrowRight size={18} />
                    </a>
                  ))}
                </div>
              </aside>
              <aside className="blog-article-cta">
                <h2>Need a simpler way to stay visible online?</h2>
                <p>Podmore Media creates practical monthly marketing content for UK trades and local service businesses.</p>
                <a className="button button-primary" href="/#pricing">See monthly packages <ArrowRight size={18} /></a>
              </aside>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function BridgePage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Checking your Stripe purchase...");
  const [showSupportLink, setShowSupportLink] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setShowSupportLink(true);
      setMessage("Please enter your name and email in the form, or");
      return;
    }

    const checkedSessionId = sessionId;

    async function loadStripeEmail() {
      try {
        const response = await fetch(`/api/stripe-session?session_id=${encodeURIComponent(checkedSessionId)}`);
        const data = await response.json();

        if (!response.ok || !data.email) {
          throw new Error(data.error || "Unable to retrieve checkout email");
        }

        setEmail(data.email);
        setStatus("ready");
        setShowSupportLink(false);
        setMessage("Add your first name in the form and we will send everything straight to you.");
      } catch {
        setStatus("error");
        setShowSupportLink(true);
        setMessage("Please enter your name and email in the form, or");
      }
    }

    loadStripeEmail();
  }, []);

  return (
    <main className="ebook-page bridge-page">
      <section className="bridge-hero-section">
        <div className="ebook-inner bridge-hero-inner">
          <div className="bridge-copy">
            <p className="ebook-preheadline">One last step</p>
            <h1>We need your email to know where to send your ebook and unannounced bonus</h1>
            <p className="ebook-subheadline">
              Confirm the best email address and add your first name so we can send your guide, bonus resource, and follow-up course to the right inbox.
            </p>
            <div className={`bridge-status ${status === "error" ? "error" : ""}`} role="status">
              {status === "loading" ? <Clock3 size={18} /> : status === "error" ? <HelpCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>
                {message}
                {showSupportLink && (
                  <>
                    {" "}
                    <a href={`mailto:${emailAddress}`}>contact us if you need help</a>.
                  </>
                )}
              </span>
            </div>
          </div>

          <form className="bridge-form" action="https://www.aweber.com/scripts/addlead.pl" method="post" acceptCharset="UTF-8">
            <p className="ebook-eyebrow">Send my eBook</p>
            <h2>Where should we send it?</h2>
            <input type="hidden" name="meta_web_form_id" value="153299009" />
            <input type="hidden" name="meta_split_id" value="" />
            <input type="hidden" name="listname" value="awlist6960127" />
            <input type="hidden" name="redirect" value="https://www.podmoremedia.com/thank-you-1909" />
            <input type="hidden" name="meta_adtracking" value="pmcom-ty-2512" />
            <input type="hidden" name="meta_message" value="1" />
            <input type="hidden" name="meta_required" value="name,email" />
            <input type="hidden" name="meta_tooltip" value="" />
            <label>
              <span>First name</span>
              <input
                name="name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Email address</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <small className="bridge-field-note">Use the email address you check personally. Shared inboxes like info@ or admin@ may require an extra confirmation step.</small>
            </label>
            <button className="ebook-buy-button" type="submit" disabled={status === "loading" || !email || !firstName}>
              <Send size={18} />
              <span>Send me my eBook</span>
              <ArrowRight size={18} />
            </button>
            <p className="bridge-privacy-note">We will never share your details with anyone.</p>
            <img className="bridge-aweber-pixel" src="https://forms.aweber.com/form/displays.htm?id=jKzMTJycDAyc" alt="" />
          </form>
        </div>
      </section>
      <EbookFooter />
    </main>
  );
}

function ServicePackageThankYouPage({ page }: { page: (typeof serviceThankYouPages)[keyof typeof serviceThankYouPages] }) {
  return (
    <main className="service-thanks-page">
      <section className="service-thanks-hero section-dark">
        <div className="section-inner service-thanks-hero-inner">
          <div>
            <p className="eyebrow">Subscription active</p>
            <h1 className="service-thanks-title">
              <span>Thank You for</span>
              <span>Choosing</span>
              <span>Podmore Media</span>
            </h1>
            <p className="hero-lead">{page.intro}</p>
            <p className="service-thanks-intro">{page.gratitude}</p>
          </div>
          <aside className="service-thanks-summary service-thanks-hero-action" aria-label="Brand Voice Questionnaire action required">
            <BadgeCheck size={34} />
            <span>Important — Action Required</span>
            <strong>Complete Your Brand Voice Questionnaire</strong>
            <p>{page.questionnaireIntro}</p>
            <p>{page.questionnaireRequirement}</p>
            <a className="button button-primary" href={brandQuestionnaireUrl} target="_blank" rel="noreferrer">
              <span>Complete Questionnaire</span>
              <ArrowRight size={18} />
            </a>
          </aside>
        </div>
      </section>

      <section className="service-thanks-after section-light">
        <div className="section-inner service-thanks-after-grid">
          <div>
            <h2>What Happens Next</h2>
            <p>Once we receive your completed questionnaire, we’ll use your answers to understand your business, customers, services and preferred tone of voice.</p>
            <p>That information will guide the content we create for you and help us make sure everything feels relevant, consistent and appropriate for your business.</p>
            <p>We’ll then begin preparing your first package deliverables.</p>
          </div>
          <div className="service-thanks-list">
            {page.afterItems.map((item) => (
              <div key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
            <aside className="service-thanks-delivery-note">
              <Mail size={20} aria-hidden="true" />
              <p><strong>Your Getting Started Guide is already on its way.</strong></p>
              <p>We have just emailed you the download link. Your remaining content will be prepared for your business and delivered ready for you to review and use.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="service-thanks-contact section-red">
        <div className="section-inner centered">
          <h2>Need Help?</h2>
          <p>Email us at <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PackageBridgePage({
  packageName,
  packageLabel,
  price,
  brevoFormUrl,
}: {
  packageName: string;
  packageLabel: string;
  price: string;
  brevoFormUrl: string;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Checking your Stripe purchase...");
  const [showSupportLink, setShowSupportLink] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setShowSupportLink(true);
      setMessage("Please enter your name and email in the form, or");
      return;
    }

    const checkedSessionId = sessionId;

    async function loadStripeEmail() {
      try {
        const response = await fetch(`/api/stripe-session?session_id=${encodeURIComponent(checkedSessionId)}`);
        const data = await response.json();

        if (!response.ok || !data.email) {
          throw new Error(data.error || "Unable to retrieve checkout email");
        }

        setEmail(data.email);
        setStatus("ready");
        setShowSupportLink(false);
        setMessage(`Add your first name in the form and we will send your ${packageName} onboarding details straight to you.`);
      } catch {
        setStatus("error");
        setShowSupportLink(true);
        setMessage("Please enter your name and email in the form, or");
      }
    }

    loadStripeEmail();
  }, []);

  return (
    <main className="service-bridge-page">
      <section className="service-bridge-hero section-dark">
        <div className="section-inner service-bridge-hero-inner">
          <div className="service-bridge-copy">
            <p className="eyebrow">{packageLabel} onboarding</p>
            <h1>One Quick Step Before We Get Started</h1>
            <p className="hero-lead">
              Thanks for purchasing Podmore Media {packageName}. Your {price} payment was successful.
            </p>
            <p className="service-bridge-intro">Please confirm your details so we can send your welcome email and get started.</p>
            <div className={`service-bridge-status ${status === "error" ? "error" : ""}`} role="status">
              {status === "loading" ? <Clock3 size={18} /> : status === "error" ? <HelpCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>
                {message}
                {showSupportLink && (
                  <>
                    {" "}
                    <a href={`mailto:${emailAddress}`}>contact us if you need help</a>.
                  </>
                )}
              </span>
            </div>
          </div>

          <form className="service-bridge-form" action={brevoFormUrl} method="post">
            <p className="eyebrow">{packageLabel}</p>
            <h2>Confirm your details</h2>
            <label>
              <span>First name</span>
              <input
                name="FIRSTNAME"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Email address</span>
              <input
                name="EMAIL"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <input className="service-bridge-honeypot" type="text" name="email_address_check" value="" tabIndex={-1} autoComplete="off" readOnly />
            <input type="hidden" name="locale" value="en" />
            <input type="hidden" name="html_type" value="simple" />
            <button className="button button-primary" type="submit" disabled={status === "loading" || !email || !firstName}>
              <Send size={18} />
              <span>Continue to Next Step</span>
              <ArrowRight size={18} />
            </button>
            <p className="service-bridge-privacy">We will never share your details with anyone.</p>
          </form>
        </div>
      </section>
    </main>
  );
}

function ThankYouPage() {
  const guideSections = [
    ["Get Found", "Local SEO prompts for better visibility"],
    ["Build Trust", "Website copy prompts that convert visitors"],
    ["Stay Visible", "Social media prompts for consistent posting"],
    ["Get Reviews", "Reputation prompts for more Google reviews"],
    ["Keep Customers", "Email prompts for repeat business"],
  ];

  return (
    <main className="ebook-page thank-you-page">
      <section className="thank-you-hero">
        <div className="ebook-inner thank-you-hero-inner">
          <div className="thank-you-copy">
            <p className="ebook-preheadline">Purchase complete - your guide is ready</p>
            <h1>Thank You - Your Guide Is Ready</h1>
            <p className="ebook-subheadline">Your Easy AI Marketing for Plumbers guide is ready to download now.</p>
            <div className="ebook-hero-actions">
              <a className="ebook-buy-button thank-you-download-button" href={guideDownloadUrl} target="_blank" rel="noreferrer">
                <Download size={18} />
                <span>Download Your Guide Now</span>
                <ArrowRight size={18} />
              </a>
            </div>
            <div className="thank-you-hero-notes" aria-label="What happens next">
              <div>
                <CheckCircle2 size={18} />
                <span>Main guide opens instantly as a PDF.</span>
              </div>
              <div>
                <Mail size={18} />
                <span>Your bonus eBook and 7-day email course are being sent separately by email.</span>
              </div>
              <div>
                <HelpCircle size={18} />
                <span>Need help? Email <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</span>
              </div>
            </div>
          </div>

          <div className="thank-you-download-panel">
            <img src="/assets/plumber-cover.png" alt="Easy AI Marketing for Plumbers guide cover" />
            <div>
              <BadgeCheck size={28} />
              <p>Instant PDF access</p>
            </div>
          </div>
        </div>
      </section>

      <section className="thank-you-email-section">
        <div className="ebook-inner thank-you-grid">
          <div className="thank-you-panel thank-you-bonus-panel">
            <p className="ebook-eyebrow">Bonus delivery</p>
            <h2>Your Unannounced Bonus is on Its Way</h2>
            <h3>What's happening now:</h3>
            <p>Your unannounced bonus eBook and 7-day email course are being delivered to the email address you just confirmed.</p>
            <h3>What to expect:</h3>
            <div className="thank-you-bonus-list">
              <div>
                <CheckCircle2 size={20} />
                <span><strong>Immediate:</strong> Your bonus eBook (25 AI prompts only, condensed edition)</span>
              </div>
              <div>
                <CheckCircle2 size={20} />
                <span><strong>Over the next 7 days:</strong> Daily emails packed with actionable AI marketing strategies for your plumbing business</span>
              </div>
            </div>
            <h3>Can't find the email?</h3>
            <ol className="thank-you-help-steps">
              <li>Check your spam or junk folder</li>
              <li>Search for "Podmore Media" in your inbox</li>
              <li>Still nothing? Email <a href={`mailto:${emailAddress}`}>{emailAddress}</a> and we'll sort it out</li>
            </ol>
          </div>

          <div className="thank-you-panel">
            <p className="ebook-eyebrow">What you bought</p>
            <h2>What's Inside the Main Guide?</h2>
            <p>25 practical ChatGPT prompts organised into 5 sections:</p>
            <div className="thank-you-section-list">
              {guideSections.map(([title, body]) => (
                <div key={title}>
                  <Sparkles size={20} />
                  <p><strong>{title}</strong> - {body}</p>
                </div>
              ))}
            </div>
            <p className="thank-you-save-note">
              Each prompt takes about 2 minutes to run. Each output saves you 30+ minutes of staring at a blank screen.
            </p>
          </div>
        </div>
      </section>

      <EbookFooter />
    </main>
  );
}

const ebookChapters = [
  {
    title: "Get Found - Local SEO Prompts",
    body: "Use these when your business isn't showing up in local searches. Create service pages, city pages, and content that helps homeowners find you.",
  },
  {
    title: "Build Trust - Website Copy Prompts",
    body: "Use these when your website isn't converting visitors into calls. Write headlines, service descriptions, and About pages that actually sell.",
  },
  {
    title: "Stay Visible - Social Media Prompts",
    body: "Use these when you never know what to post. Create Facebook posts, seasonal reminders, and content that keeps you top of mind.",
  },
  {
    title: "Get Reviews - Reputation Prompts",
    body: "Use these when you need more Google reviews. Request reviews politely, respond to feedback, and build your online reputation.",
  },
  {
    title: "Keep Customers - Email & Follow-up Prompts",
    body: "Use these when you want repeat business and referrals. Send value-first emails, request referrals, and stay connected with past customers.",
  },
];

const ebookBenefits = [
  "25 practical ChatGPT prompts you can copy, paste, and reuse.",
  "Practical help for your website, local SEO, social media, reviews, and referrals.",
  "A beginner-friendly system for turning your trade knowledge into useful online content.",
  "Organised into 5 clear sections for easy implementation.",
];

const ebookFaqs = [
  ["Do I need to be good with technology to use this book?", "No. The book is written for plumbing business owners who want a simple, practical way to use ChatGPT. You copy a prompt, replace the placeholders with your business details, review the output, and use it where appropriate."],
  ["Is this book only for plumbers?", "Yes. The examples, prompts, and marketing topics are built specifically around plumbing businesses, including service pages, local SEO, homeowner questions, Google Business Profile content, reviews, referrals, and social media."],
  ["What exactly do I get inside the book?", "You get a practical guide to using ChatGPT for plumbing marketing, including 25 copy-and-paste prompts organised into 5 sections: Local SEO, Website Copy, Social Media, Reviews, and Email Follow-ups."],
  ["Will ChatGPT do all of my marketing for me?", "No. ChatGPT is a tool, not a complete strategy or replacement for your judgment. The book shows you how to add your business details, review the content, check accuracy, and make sure the output fits your company."],
  ["Can this help if my website needs work?", "Yes. The Website Copy section focuses on prompts that can help you improve your homepage, service pages, FAQs, calls to action, contact page, and trust-building content."],
  ["Can this help with local SEO?", "Yes. The Local SEO section shows how ChatGPT can help with local SEO planning, keyword ideas, service pages, city pages, Google Business Profile updates, reviews, and content clusters."],
  ["What if I never know what to post on social media?", "The Social Media section gives you prompts for creating practical social media content, including homeowner tips, service reminders, weekly posts, and simple posting checklists."],
  ["Does the book include a step-by-step plan?", "The book is organised into 5 sections you can work through at your own pace. While there's no rigid 30-day schedule, you can work through one section per week and see real progress."],
  ["Can I use these prompts more than once?", "Yes. The prompts are designed to be reused by replacing placeholders with your services, towns, customer questions, and business details. Over time, they can become part of your regular marketing system."],
  ["What should I do if I want help implementing everything?", "The book recommends visiting Podmore Media for help applying the prompts, building an AI marketing system, and turning the ideas inside the book into real marketing assets for your plumbing business."],
];

function EbookBuyButton() {
  return (
    <a className="ebook-buy-button" href={ebookCheckoutUrl} target="_blank" rel="noreferrer" aria-label="Buy the Book Now for GBP 19.97">
      <CreditCard size={19} />
      <span>Buy the Book Now</span>
      <ArrowRight size={18} />
    </a>
  );
}

function EbookCheckoutCta({ badge = false, stacked = false }: { badge?: boolean; stacked?: boolean }) {
  if (badge) {
    return (
      <div className="ebook-checkout-cta with-badge">
        <div className="ebook-button-stack">
          <EbookBuyButton />
          <div className="ebook-secure-note">
            <ShieldCheck size={18} />
            Secure checkout via Stripe
          </div>
        </div>
        <img className="ebook-price-starburst" src="/assets/price-starburst.png" alt="£19.97 Instant digital access" />
      </div>
    );
  }

  return (
    <div className={`ebook-checkout-cta ${stacked ? "stacked" : ""}`}>
      <EbookBuyButton />
      <div className="ebook-secure-note">
        <ShieldCheck size={18} />
        Secure checkout via Stripe
      </div>
    </div>
  );
}

function EbookFooter() {
  return (
    <footer className="ebook-footer">
      <span>&copy; 2026 <a href="https://podmoremedia.com" target="_blank" rel="noreferrer">Podmore Media</a></span>
      <span>Easy AI Marketing for Plumbers</span>
      <a href="/terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a>
      <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>
    </footer>
  );
}

function EbookLandingPage() {
  return (
    <main className="ebook-page">
      <section className="ebook-hero-section">
        <div className="ebook-inner ebook-hero-inner">
          <div className="ebook-showcase" aria-label="Easy AI Marketing for Plumbers book cover">
            <img src="/assets/plumber-cover.png" alt="Easy AI Marketing for Plumbers eBook cover" />
          </div>
          <div className="ebook-hero-copy">
            <p className="ebook-preheadline">For busy plumbing business owners who need better marketing but do not have time to figure it all out.</p>
            <h1>Use ChatGPT to create better plumbing marketing in less time</h1>
            <p className="ebook-subheadline">
              Get 25 copy-and-paste prompts for your website, local SEO, social media, reviews, and referrals — organised into 5 practical sections.
            </p>
            <div className="ebook-hero-actions">
              <EbookCheckoutCta />
            </div>
            <div className="ebook-trust-strip" aria-label="Book highlights">
              <span><Wrench size={16} />Built for busy owners</span>
              <span><Sparkles size={16} />25 practical prompts</span>
              <span><Clock3 size={16} />5 clear sections</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ebook-author-section">
        <div className="ebook-inner ebook-author-grid">
          <div>
            <p className="ebook-eyebrow">Meet the author</p>
            <h2>Meet the author, Cliff Hawkins</h2>
            <p>
              Cliff Hawkins is the creator of <a className="ebook-text-link" href="https://podmoremedia.com" target="_blank" rel="noreferrer">Podmore Media</a> and the author of <em>Easy AI Marketing for Plumbers</em>. Through Podmore Media, Cliff helps small businesses use AI to create practical online marketing assets faster, including website prompts, SEO plans, blog content plans, social media content, and social media plans.
            </p>
            <p>
              This guide was created specifically for plumbing business owners who want a simpler way to turn real-world expertise into useful marketing content without becoming full-time content creators.
            </p>
          </div>
          <div className="ebook-author-photo">
            <img src="/assets/cliff-hawkins-author.png" alt="Cliff Hawkins, author of Easy AI Marketing for Plumbers" />
          </div>
        </div>
      </section>

      <section className="ebook-who-section">
        <div className="ebook-inner ebook-narrow">
          <div className="ebook-section-heading centered">
            <Wrench size={30} />
            <p className="ebook-eyebrow">Who this book is for</p>
            <h2>For plumbers who are great at the job, but stuck when it comes to online marketing.</h2>
          </div>
          <p className="ebook-lead">
            If your website could be clearer, your Google visibility could be stronger, your blog needs content, your social media feels inconsistent, or your reviews are not working hard enough, this book gives you a practical place to start.
          </p>
          <div className="ebook-benefit-list">
            {ebookBenefits.map((benefit) => (
              <div className="ebook-benefit-item" key={benefit}>
                <CheckCircle2 size={20} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ebook-inside-section">
        <div className="ebook-inner">
          <div className="ebook-section-heading centered light">
            <Search size={30} />
            <p className="ebook-eyebrow">What you will learn inside</p>
            <h2>25 practical prompts organised into 5 sections to help your plumbing business get found, build trust, and win more enquiries.</h2>
          </div>
          <div className="ebook-chapter-grid">
            {ebookChapters.map((chapter, index) => (
              <article className="ebook-chapter-card" key={chapter.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ebook-cta-section">
        <div className="ebook-inner ebook-cta-grid">
          <div className="ebook-cta-book">
            <img src="/assets/plumber-cover.png" alt="" />
          </div>
          <div>
            <p className="ebook-eyebrow">Get access now</p>
            <h2>Stop starting from a blank page every time your business needs marketing content.</h2>
            <p>Use the prompts to create clearer pages, stronger local content, useful social posts, better review requests, and a simple monthly marketing routine.</p>
            <div className="ebook-cta-actions">
              <EbookCheckoutCta badge />
            </div>
          </div>
        </div>
      </section>

      <section className="ebook-guarantee-section">
        <div className="ebook-inner ebook-guarantee-wrap">
          <div className="ebook-guarantee-heading">
            <ShieldCheck size={34} />
            <p className="ebook-eyebrow">Our 30-Day Money-Back Guarantee</p>
            <h2>I want you to feel completely confident grabbing this eBook today.</h2>
          </div>
          <div className="ebook-guarantee-copy">
            <p>Because this isn't just another generic guide about AI.</p>
            <p>This is a practical, plumber-focused marketing system that shows you how to use ChatGPT to improve your online presence, attract more local customers, and turn your website, local SEO, social media, and reputation into real business assets.</p>
            <p>Inside, you'll get 25 carefully chosen prompts organised into 5 clear sections, so you know exactly what to work on first.</p>
            <p>That's why I'm making you a simple promise.</p>
            <p>Try the prompts. Use them for your website, social media, and reviews.</p>
            <p>If you don't find them useful, email us within 30 days for a full refund.</p>
            <p className="ebook-guarantee-standout">No questions asked.</p>
            <h3>Why offer this guarantee?</h3>
            <p>Because I know how powerful these prompts can be for plumbing businesses that actually use them.</p>
            <p>Most plumbers don't need more complicated marketing theory. They need simple, practical tools that help them get found online, build trust, create content faster, and bring in more enquiries without wasting hours staring at a blank screen.</p>
            <p>That's exactly what this ebook is designed to help you do.</p>
            <p>So go ahead and put it to the test.</p>
            <p>Use the prompts. Work through the sections. Improve your online presence one step at a time.</p>
            <p>And if you're not genuinely impressed by the value you receive, you get your money back.</p>
            <p className="ebook-guarantee-standout">Simple as that.</p>
            <p>That's my promise to you.</p>
          </div>
        </div>
      </section>

      <section className="ebook-faq-section">
        <div className="ebook-inner ebook-narrow">
          <div className="ebook-section-heading centered">
            <HelpCircle size={30} />
            <p className="ebook-eyebrow">Frequently asked questions</p>
            <h2>Questions plumbers usually ask before buying</h2>
          </div>
          <div className="ebook-faq-list">
            {ebookFaqs.map(([question, answer]) => (
              <details key={question}>
                <summary><MessageSquareText size={18} /><span>{question}</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <div className="ebook-faq-cta">
            <EbookCheckoutCta stacked />
          </div>
        </div>
      </section>
      <EbookFooter />
    </main>
  );
}

export default function App() {
  const path = window.location.pathname;

  if (path === "/terms-of-service") {
    return <LegalPage title="Terms and Conditions" markdown={termsAndConditions} />;
  }

  if (path === "/privacy-policy") {
    return <LegalPage title="Privacy Policy" markdown={privacyPolicy} />;
  }

  if (path === "/blog") {
    return <BlogPage />;
  }

  if (path.startsWith("/blog/")) {
    const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "");
    const article = blogArticles.find((item) => item.slug === slug);
    if (article) return <BlogArticlePage article={article} />;
  }

  if (path === "/ty-2512") {
    return <BridgePage />;
  }

  if (path === "/ty-starter-3110") {
    return <PackageBridgePage packageName="Starter" packageLabel="Starter Package" price="£99" brevoFormUrl={starterBrevoFormUrl} />;
  }

  if (path === "/ty-growth-1004") {
    return <PackageBridgePage packageName="Growth" packageLabel="Growth Package" price="£249" brevoFormUrl={growthBrevoFormUrl} />;
  }

  if (path === "/ty-pro-2211") {
    return <PackageBridgePage packageName="Pro" packageLabel="Pro Package" price="£499" brevoFormUrl={proBrevoFormUrl} />;
  }

  if (path === serviceThankYouPages.starter.path) {
    return <ServicePackageThankYouPage page={serviceThankYouPages.starter} />;
  }

  if (path === serviceThankYouPages.growth.path) {
    return <ServicePackageThankYouPage page={serviceThankYouPages.growth} />;
  }

  if (path === serviceThankYouPages.pro.path) {
    return <ServicePackageThankYouPage page={serviceThankYouPages.pro} />;
  }

  if (path === "/easy-ai-marketing-for-plumbers") {
    return <EbookLandingPage />;
  }

  if (path === "/thank-you-1909") {
    return <ThankYouPage />;
  }

  return <Homepage />;
}
