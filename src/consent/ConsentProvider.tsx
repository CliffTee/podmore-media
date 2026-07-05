import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  disableGoogleAnalytics,
  loadGoogleAnalytics,
  setAnalyticsAllowed,
  trackCurrentPage,
} from "../analytics/ga4";
import {
  createConsentPreferences,
  readConsentPreferences,
  type ConsentPreferences,
  writeConsentPreferences,
} from "./consentStorage";
import {
  disableMetaPixel,
  loadMetaPixel,
  setMarketingAllowed,
  trackMetaPageView,
} from "../marketing/metaPixel";

type ConsentContextValue = {
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);
const ROUTE_CHANGE_EVENT = "podmore:routechange";

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used inside ConsentProvider");
  return context;
}

function RouteObserver() {
  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    const notifyRouteChange = () => window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      notifyRouteChange();
    };
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      notifyRouteChange();
    };

    window.addEventListener("popstate", notifyRouteChange);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", notifyRouteChange);
    };
  }, []);

  return null;
}

function Analytics({ consent }: { consent: ConsentPreferences | null }) {
  useEffect(() => {
    const allowed = consent?.analytics === true;
    setAnalyticsAllowed(allowed);
    if (!allowed) return;

    let active = true;
    const sendPageView = () => {
      window.requestAnimationFrame(() => {
        if (!active) return;
        void loadGoogleAnalytics()
          .then(() => {
            if (active) trackCurrentPage();
          })
          .catch(() => {
            // A blocked analytics request must not affect the website experience.
          });
      });
    };

    window.addEventListener(ROUTE_CHANGE_EVENT, sendPageView);
    sendPageView();

    return () => {
      active = false;
      window.removeEventListener(ROUTE_CHANGE_EVENT, sendPageView);
    };
  }, [consent]);

  return null;
}

function Marketing({ consent }: { consent: ConsentPreferences | null }) {
  useEffect(() => {
    const allowed = consent?.marketing === true;
    setMarketingAllowed(allowed);
    if (!allowed) return;

    let active = true;
    const sendPageView = () => {
      window.requestAnimationFrame(() => {
        if (!active) return;
        void loadMetaPixel()
          .then(() => {
            if (active) trackMetaPageView();
          })
          .catch(() => {
            // A blocked marketing request must not affect the website experience.
          });
      });
    };

    window.addEventListener(ROUTE_CHANGE_EVENT, sendPageView);
    sendPageView();

    return () => {
      active = false;
      window.removeEventListener(ROUTE_CHANGE_EVENT, sendPageView);
    };
  }, [consent]);

  return null;
}

function CookieBanner({
  onAcceptAll,
  onEssentialOnly,
  onManage,
}: {
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
  onManage: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const scrollPosition = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyRight = document.body.style.right;
    const previousBodyLeft = document.body.style.left;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.right = "0";
    document.body.style.left = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const firstControl = dialog.querySelector<HTMLElement>("button:not([disabled])");
    firstControl?.focus();

    const keepFocusInside = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) {
        event.stopPropagation();
        firstControl?.focus();
      }
    };

    document.addEventListener("focusin", keepFocusInside, true);

    return () => {
      document.removeEventListener("focusin", keepFocusInside, true);
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.right = previousBodyRight;
      document.body.style.left = previousBodyLeft;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollPosition);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>("button:not([disabled])"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="cookie-modal-backdrop cookie-consent-backdrop">
      <section
        className="cookie-banner"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="cookie-banner-copy">
          <h2 id="cookie-banner-title">Your privacy choices</h2>
          <p id="cookie-banner-description">
            We use optional cookies to understand website use and improve how we reach potential customers.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-action cookie-action-primary" type="button" onClick={onAcceptAll}>Accept all</button>
          <button className="cookie-action cookie-action-secondary" type="button" onClick={onEssentialOnly}>Essential only</button>
          <button className="cookie-action cookie-action-link" type="button" onClick={onManage}>Manage preferences</button>
        </div>
      </section>
    </div>
  );
}

function CookiePreferences({
  initialAnalytics,
  initialMarketing,
  hasSavedChoice,
  onClose,
  onSave,
  onEssentialOnly,
}: {
  initialAnalytics: boolean;
  initialMarketing: boolean;
  hasSavedChoice: boolean;
  onClose: () => void;
  onSave: (analytics: boolean, marketing: boolean) => void;
  onEssentialOnly: () => void;
}) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [marketing, setMarketing] = useState(initialMarketing);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const scrollPosition = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyRight = document.body.style.right;
    const previousBodyLeft = document.body.style.left;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.right = "0";
    document.body.style.left = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const firstControl = dialog.querySelector<HTMLElement>("button, input:not([disabled])");
    firstControl?.focus();

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.right = previousBodyRight;
      document.body.style.left = previousBodyLeft;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollPosition);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("button, input:not([disabled])"),
    ).filter((element) => !element.hasAttribute("disabled"));
    if (!controls.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="cookie-modal-backdrop">
      <div
        className="cookie-preferences"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        onKeyDown={handleKeyDown}
      >
        <div className="cookie-preferences-heading">
          <div>
            <p className="cookie-kicker">Podmore Media</p>
            <h2 id="cookie-preferences-title">Cookie preferences</h2>
          </div>
          <button className="cookie-close" type="button" onClick={onClose} aria-label="Close cookie preferences">×</button>
        </div>

        <p>Choose whether we may use optional analytics and marketing technologies. You can change these choices at any time through “Cookie settings” in the footer.</p>

        <div className="cookie-category">
          <div>
            <h3>Necessary</h3>
            <p>Always on — Saves your cookie choices and supports essential site functions.</p>
          </div>
          <span className="cookie-status">Always on</span>
        </div>

        <label className="cookie-category cookie-category-toggle">
          <div>
            <h3>Analytics</h3>
            <p>Optional — Allows Google Analytics 4 to measure page views and ebook checkout starts. Off until you choose it.</p>
          </div>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(event) => setAnalytics(event.target.checked)}
            aria-label="Allow Analytics cookies"
          />
        </label>

        <label className="cookie-category cookie-category-toggle">
          <div>
            <h3>Marketing</h3>
            <p>Optional — Allows Meta Pixel to measure visits and actions for advertising and retargeting. Off until you choose it.</p>
          </div>
          <input
            type="checkbox"
            checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)}
            aria-label="Allow Marketing cookies"
          />
        </label>

        <p className="cookie-policy-link">Read our <a href="/cookie-policy">Cookie Policy</a> for full details.</p>

        <div className="cookie-preferences-actions">
          <button className="cookie-action cookie-action-primary" type="button" onClick={() => onSave(analytics, marketing)}>Save choices</button>
          <button className="cookie-action cookie-action-secondary" type="button" onClick={onEssentialOnly}>Essential only</button>
          {!hasSavedChoice && <span className="cookie-unsaved-note">No optional cookies will load unless you save or accept.</span>}
        </div>
      </div>
    </div>
  );
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(() => readConsentPreferences());
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openPreferences = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setPreferencesOpen(true);
  };

  const closePreferences = () => {
    setPreferencesOpen(false);
    window.requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>(
        ".cookie-banner .cookie-action-link, .footer-cookie-settings, .ebook-footer-cookie-settings",
      );
      const target = returnFocusRef.current?.isConnected ? returnFocusRef.current : fallback;
      target?.focus();
    });
  };

  const saveChoice = (analytics: boolean, marketing: boolean) => {
    const analyticsWasAllowed = consent?.analytics === true;
    const marketingWasAllowed = consent?.marketing === true;
    const next = createConsentPreferences(analytics, marketing);
    writeConsentPreferences(next);
    setConsent(next);
    setPreferencesOpen(false);

    const analyticsWithdrawn = analyticsWasAllowed && !analytics;
    const marketingWithdrawn = marketingWasAllowed && !marketing;

    if (analyticsWithdrawn) disableGoogleAnalytics();
    if (marketingWithdrawn) disableMetaPixel();

    if (analyticsWithdrawn || marketingWithdrawn) {
      window.location.reload();
    }
  };

  return (
    <ConsentContext.Provider value={{ openPreferences }}>
      {children}
      <RouteObserver />
      <Analytics consent={consent} />
      <Marketing consent={consent} />
      {!consent && !preferencesOpen && (
        <CookieBanner
          onAcceptAll={() => saveChoice(true, true)}
          onEssentialOnly={() => saveChoice(false, false)}
          onManage={openPreferences}
        />
      )}
      {preferencesOpen && (
        <CookiePreferences
          initialAnalytics={consent?.analytics ?? false}
          initialMarketing={consent?.marketing ?? false}
          hasSavedChoice={Boolean(consent)}
          onClose={closePreferences}
          onSave={saveChoice}
          onEssentialOnly={() => saveChoice(false, false)}
        />
      )}
    </ConsentContext.Provider>
  );
}
