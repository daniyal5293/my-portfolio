/** Keeps the footer copyright year current, even on an older static build. */
const year = String(new Date().getFullYear());
document.querySelectorAll<HTMLElement>('[data-current-year]').forEach((el) => {
  el.textContent = year;
});

export {};
