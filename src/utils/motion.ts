/** Shared motion helpers for vanilla scripts and React islands. */

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for mouse / trackpad users — hover-only effects are skipped on touch. */
export const hasFinePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Standard easing curve used across the site (matches --ease-out-expo). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
