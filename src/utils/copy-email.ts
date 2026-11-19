/**
 * Copy-to-clipboard buttons: `<button data-copy="text">`.
 * The result is announced through the button's `[data-copy-status]` element,
 * which should sit inside an `aria-live` region.
 */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
  const status = button.querySelector<HTMLElement>('[data-copy-status]');
  const idle = status?.textContent ?? '';
  let timer = 0;

  button.addEventListener('click', async () => {
    const ok = await copy(button.dataset.copy ?? '');
    button.dataset.copied = ok ? 'true' : 'false';
    if (status) status.textContent = ok ? 'Copied!' : 'Copy failed — select it manually';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.dataset.copied = '';
      if (status) status.textContent = idle;
    }, 2400);
  });
});

export {};
