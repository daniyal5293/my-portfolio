import { hasFinePointer, prefersReducedMotion } from './motion';

/**
 * Magnetic hover: elements with `data-magnetic` drift slightly toward the
 * cursor. Mouse/trackpad only and disabled for reduced motion.
 * `data-magnetic="0.3"` sets the strength.
 */
if (hasFinePointer() && !prefersReducedMotion()) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.25;
    let frame = 0;

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    });

    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    });
  });
}

export {};
