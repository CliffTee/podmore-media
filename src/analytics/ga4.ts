export const GA4_MEASUREMENT_ID = "G-61HX1GVR89";

const GA4_SCRIPT_ID = "podmore-ga4";
const GA4_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;

type Gtag = {
  (command: "consent", action: "default" | "update", parameters: Record<string, unknown>): void;
  (command: "js", date: Date): void;
  (command: "config", target: string, parameters?: Record<string, unknown>): void;
  (command: "event", eventName: string, parameters?: Record<string, unknown>): void;
  (
    command: "get",
    target: string,
    fieldName: "client_id",
    callback: (clientId: string | undefined) => void,
  ): void;
};

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let analyticsAllowed = false;
let loadPromise: Promise<void> | null = null;
let tagConfigured = false;
let lastTrackedRoute: string | null = null;

function initialiseDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || (function gtag() {
    window.dataLayer!.push(arguments);
  } as Gtag);
}

function configureGoogleTag() {
  if (tagConfigured) return;
  tagConfigured = true;

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
}

function waitForGoogleTagReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Google Analytics did not become ready"));
    }, 5000);

    window.gtag!("get", GA4_MEASUREMENT_ID, "client_id", () => {
      window.clearTimeout(timeout);
      resolve();
    });
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
  configureGoogleTag();

  const existingScript = document.getElementById(GA4_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    loadPromise = waitForGoogleTagReady();
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GA4_SCRIPT_ID;
    script.async = true;
    script.src = GA4_SCRIPT_URL;
    script.addEventListener("load", () => {
      void waitForGoogleTagReady().then(resolve, reject);
    }, { once: true });
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
