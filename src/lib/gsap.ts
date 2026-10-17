import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

/** Media query used to gate every non-essential animation. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Desktop pointer devices that support hover — cursor, magnetic and preview effects. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches;
}

export { gsap, ScrollTrigger, Flip, useGSAP };
