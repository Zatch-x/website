/** Copy text to the clipboard, falling back to a hidden textarea on older browsers. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Fire a toast message, rendered by <Toaster /> in the root layout. */
export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<string>("app:toast", { detail: message }));
}

export async function copyWithToast(text: string, success: string) {
  const ok = await copyText(text);
  showToast(ok ? success : `Couldn’t copy — ${text}`);
  return ok;
}
