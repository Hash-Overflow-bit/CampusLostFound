const REVEAL_SELECTOR = [
  ".clf-home > section:not(.clf-hero)",
  ".clf-final-cta",
].join(",");

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

if (typeof window !== "undefined" && typeof document !== "undefined" && !reducedMotion()) {
  const observed = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  const scan = () => {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
      if (observed.has(element)) return;
      observed.add(element);
      element.classList.add("clf-reveal");
      observer.observe(element);
    });
  };

  queueMicrotask(scan);
  requestAnimationFrame(() => requestAnimationFrame(scan));
  window.addEventListener("load", scan, { once: true });

  const mutationObserver = new MutationObserver(scan);
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
}
