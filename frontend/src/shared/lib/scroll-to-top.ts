/** Scrolls the page to the top, respecting reduced motion, and drops a stale #hash from the URL. */
export function scrollToTop() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
}
