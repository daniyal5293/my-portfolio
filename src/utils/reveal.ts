/**
 * Scroll-triggered reveals.
 * Any element with `data-reveal` fades/slides in once it enters the viewport.
 * `data-reveal-delay="120"` staggers siblings (milliseconds).
 */
const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

elements.forEach((el) => {
  const delay = el.dataset.revealDelay;
  if (delay) el.style.setProperty('--reveal-delay', delay);
});

if (!('IntersectionObserver' in window)) {
  elements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  elements.forEach((el) => observer.observe(el));
}

export {};
