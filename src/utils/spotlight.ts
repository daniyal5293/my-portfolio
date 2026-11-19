import { hasFinePointer, prefersReducedMotion } from './motion';

/**
 * Cursor spotlight + gentle tilt for interactive cards (`data-spotlight`).
 * Sets `--mx` / `--my` (cursor position in %) and `--rx` / `--ry` (tilt in deg)
 * which the card's CSS uses. Mouse/trackpad only.
 */
if (hasFinePointer()) {
  const tilt = !prefersReducedMotion();

  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    let frame = 0;
    const maxTilt = Number(card.dataset.spotlight) || 0;

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        if (tilt) {
          // Unitless offsets (-0.5 … 0.5) for parallax layers inside the card.
          card.style.setProperty('--px', (px - 0.5).toFixed(3));
          card.style.setProperty('--py', (py - 0.5).toFixed(3));
        }
        if (tilt && maxTilt) {
          card.style.setProperty('--rx', `${((0.5 - py) * maxTilt).toFixed(2)}deg`);
          card.style.setProperty('--ry', `${((px - 0.5) * maxTilt).toFixed(2)}deg`);
        }
      });
    });

    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--px', '0');
      card.style.setProperty('--py', '0');
    });
  });
}

export {};
