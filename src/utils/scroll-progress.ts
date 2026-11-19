/**
 * Page scroll progress bar. Browsers with CSS scroll-driven animations use
 * the pure-CSS version; this script provides the `--progress` fallback.
 */
const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
const supportsTimeline = CSS.supports('animation-timeline: scroll()');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (bar && (!supportsTimeline || reduced)) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

export {};
