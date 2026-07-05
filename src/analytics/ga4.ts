export const GA4_MEASUREMENT_ID = "G-61HX1GVR89";

const GA4_SCRIPT_ID = "podmore-ga4";
const GA4_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;

type GtagCommand = [command: string, targetOrAction: string | Date, parameters?: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: GtagCommand[];
    gtag?: (...args: GtagCommand) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let analyticsAllowed = false;
let loadPromise: Promise<void> | null = null;
let lastTrackedRoute: string | null = null;

function initialiseDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: GtagCommand) => {
    window.dataLayer!.push(args);
  });
}

export function setAnalyticsAllowed(allowed: boolean) {
  analyticsAllowed = allowed;
  window[`ga-disable-${GA4_MEASUREMENT_ID}`] = !allowed;
}

export function loadGoogleAnalytics(): Promise<void> {
  if (!analyticsAllowed) return Promise.resolve();
  if (loadPromise) return loadPromise;

  initialiseDataLayer();
  window.gtag!("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag!("js", new Date());
  window.gtag!("config", GA4_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const existingScript = document.getElementById(GA4_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GA4_SCRIPT_ID;
    script.async = true;
    script.src = GA4_SCRIPT_URL;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => {
      loadPromise = null;
      reject(new Error("Google Analytics failed to load"));
    }, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function trackCurrentPage() {
  if (!analyticsAllowed || !window.gtag) return;

  const route = window.location.pathname || "/";
  if (lastTrackedRoute === route) return;
  lastTrackedRoute = route;

  const parameters: Record<string, unknown> = {
    page_title: document.title,
    page_location: `${window.location.origin}${route}`,
  };

  if (route === "/easy-ai-marketing-for-plumbers") {
    parameters.page_type = "ebook_sales";
  }

  window.gtag("event", "page_view", parameters);
}

export function trackEbookBeginCheckout(ctaPosition: "hero" | "middle" | "final") {
  if (!analyticsAllowed || !window.gtag) return;

  window.gtag("event", "begin_checkout", {
    currency: "GBP",
    value: 19.97,
    cta_position: ctaPosition,
    items: [
      {
        item_id: "easy-ai-marketing-for-plumbers",
        item_name: "Easy AI Marketing for Plumbers",
        price: 19.97,
        quantity: 1,
      },
    ],
  });
}

export function disableGoogleAnalytics() {
  setAnalyticsAllowed(false);
  lastTrackedRoute = null;

  const cookieNames = document.cookie
    .split(";")
    .map((entry) => entry.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  const host = window.location.hostname;
  const apexDomain = host.replace(/^www\./, "");

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${host}; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${apexDomain}; SameSite=Lax; Secure`;
  }
}

