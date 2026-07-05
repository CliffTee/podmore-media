export const META_PIXEL_ID = "1512324313721969";

const META_SCRIPT_ID = "podmore-meta-pixel";
const META_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";

type MetaEventParameters = Record<string, unknown>;
export type MetaPageType =
  | "homepage"
  | "blog_index"
  | "blog_article"
  | "ebook_sales"
  | "service_package"
  | "legal"
  | "thank_you"
  | "other";

type MetaFbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: MetaFbq;
};

declare global {
  interface Window {
    fbq?: MetaFbq;
    _fbq?: MetaFbq;
  }
}

let marketingAllowed = false;
let loadPromise: Promise<void> | null = null;
let pixelInitialised = false;
let lastTrackedRoute: string | null = null;

function initialiseFbq() {
  if (window.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  }) as MetaFbq;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
}

function sanitiseCurrentUrl() {
  if (!window.location.search) return;
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.hash}`,
  );
}

export function setMarketingAllowed(allowed: boolean) {
  marketingAllowed = allowed;
}

export function loadMetaPixel(): Promise<void> {
  if (!marketingAllowed) return Promise.resolve();
  if (loadPromise) return loadPromise;

  sanitiseCurrentUrl();
  initialiseFbq();

  if (!pixelInitialised) {
    window.fbq!("init", META_PIXEL_ID);
    pixelInitialised = true;
  }

  const existingScript = document.getElementById(META_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = META_SCRIPT_ID;
    script.async = true;
    script.src = META_SCRIPT_URL;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => {
      loadPromise = null;
      reject(new Error("Meta Pixel failed to load"));
    }, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function trackMetaEvent(eventName: string, parameters?: MetaEventParameters) {
  if (!marketingAllowed || !window.fbq) return;
  window.fbq("track", eventName, parameters || {});
}

export function getMetaPageType(pathname: string): MetaPageType {
  if (pathname === "/") return "homepage";
  if (pathname === "/blog") return "blog_index";
  if (pathname.startsWith("/blog/")) return "blog_article";
  if (pathname === "/easy-ai-marketing-for-plumbers") return "ebook_sales";
  if (["/ty-starter-3110", "/ty-growth-1004", "/ty-pro-2211"].includes(pathname)) {
    return "service_package";
  }
  if (["/terms-of-service", "/privacy-policy", "/cookie-policy"].includes(pathname)) {
    return "legal";
  }
  if (pathname === "/ty-2512" || pathname === "/thank-you-1909" || pathname.startsWith("/thank-you-")) {
    return "thank_you";
  }
  return "other";
}

export function trackMetaPageView() {
  if (!marketingAllowed || !window.fbq) return;

  const route = window.location.pathname || "/";
  if (lastTrackedRoute === route) return;
  lastTrackedRoute = route;

  trackMetaEvent("PageView", {
    page_url: `${window.location.origin}${route}`,
    page_type: getMetaPageType(route),
  });
}

export function trackMetaEbookInitiateCheckout(ctaPosition: "hero" | "middle" | "final") {
  trackMetaEvent("InitiateCheckout", {
    currency: "GBP",
    value: 19.97,
    content_name: "Easy AI Marketing for Plumbers",
    content_ids: ["easy-ai-marketing-for-plumbers"],
    content_type: "product",
    cta_position: ctaPosition,
  });
}

export function disableMetaPixel() {
  setMarketingAllowed(false);
  lastTrackedRoute = null;

  const cookieNames = document.cookie
    .split(";")
    .map((entry) => entry.trim().split("=")[0])
    .filter((name) => name === "_fbp" || name === "_fbc");

  const host = window.location.hostname;
  const apexDomain = host.replace(/^www\./, "");

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${host}; SameSite=Lax; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${apexDomain}; SameSite=Lax; Secure`;
  }
}
