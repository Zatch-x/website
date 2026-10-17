import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

function headerOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  return -(parseFloat(value) || 0);
}

/**
 * Scroll to an element id, an element or a pixel position.
 * Uses Lenis when smooth scrolling is active, otherwise native scrolling.
 */
export function scrollToTarget(target: string | HTMLElement | number, opts: { immediate?: boolean } = {}) {
  let el: HTMLElement | null = null;
  if (typeof target === "string") el = document.getElementById(target.replace(/^#/, ""));
  else if (typeof target !== "number") el = target;
  if (typeof target !== "number" && !el) return;

  // Resolve to a pixel position so the header offset is applied exactly once
  // (some Lenis versions also read scroll-margin-top when given an element).
  const top = el ? el.getBoundingClientRect().top + window.scrollY + headerOffset() : (target as number);

  if (lenis) {
    lenis.scrollTo(Math.max(0, top), { immediate: opts.immediate, duration: 1.4 });
  } else {
    window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  }

  // Move focus for keyboard and screen-reader users without a second jump.
  if (el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

/** Freeze page scrolling, e.g. while the mobile menu is open. */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("is-scroll-locked", locked);
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
