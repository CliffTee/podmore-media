export const CONSENT_COOKIE_NAME = "pm_cookie_consent";
export const CONSENT_VERSION = "2026-07-05-3";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 * 6;

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

export function createConsentPreferences(analytics: boolean, marketing: boolean): ConsentPreferences {
  return {
    necessary: true,
    analytics,
    marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export function readConsentPreferences(): ConsentPreferences | null {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) return null;

  try {
    const value = cookie.slice(CONSENT_COOKIE_NAME.length + 1);
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentPreferences>;

    if (
      parsed.version !== CONSENT_VERSION ||
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

export function writeConsentPreferences(preferences: ConsentPreferences) {
  const value = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${value}`,
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",
  ].join("; ");
}
