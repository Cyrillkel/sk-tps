export type Consent = "all" | "necessary";
/** "pending" is the server snapshot: nothing renders until the browser reads the stored choice. */
export type ConsentState = Consent | "unset" | "pending";

const storageKey = "sk-tps-cookie-consent";
const changeEvent = "sk-tps-cookie-consent-change";

// Fallback for browsers that block storage: the choice still holds for the current visit.
let memoryConsent: Consent | null = null;

export function getConsent(): ConsentState {
  try {
    const value = localStorage.getItem(storageKey);
    if (value === "all" || value === "necessary") return value;
  } catch {
    // Storage is unavailable; fall back to the in-memory choice.
  }
  return memoryConsent ?? "unset";
}

export function getServerConsent(): ConsentState {
  return "pending";
}

function writeConsent(value: Consent | null) {
  memoryConsent = value;
  try {
    if (value) localStorage.setItem(storageKey, value);
    else localStorage.removeItem(storageKey);
  } catch {
    // The in-memory value covers this visit.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function setConsent(value: Consent) {
  const metrikaIsRunning = typeof window.ym === "function";
  writeConsent(value);
  // A loaded Metrika tag cannot be unloaded; a reload starts the page without it.
  if (value === "necessary" && metrikaIsRunning) window.location.reload();
}

/** Shows the banner again so the visitor can change or withdraw consent. */
export function resetConsent() {
  writeConsent(null);
}

export function subscribeConsent(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) listener();
  }

  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", onStorage);
  };
}
