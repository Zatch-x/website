"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

const LABELS: Record<string, string> = { view: "View", copy: "Copy", drag: "Drag", open: "Open" };

/**
 * Desktop-only custom cursor: a dot plus a trailing ring that grows over interactive
 * elements. Elements can request a label with `data-cursor="view" | "copy" | "open"`.
 * Touch devices and reduced-motion users keep the native cursor.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
      const root = document.documentElement;
      root.classList.add("has-custom-cursor");
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
      let shown = false;

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
          gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
          shown = true;
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const over = (e: PointerEvent) => {
        const target = e.target as Element | null;
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        const text = target?.closest("input, textarea, select, [contenteditable='true']");
        const interactive = target?.closest("a, button, [role='tab'], label, summary");
        const key = labelled?.dataset.cursor ?? "";
        const state = text ? "text" : labelled && LABELS[key] ? "label" : interactive ? "hover" : "";
        ring.dataset.state = state;
        dot.dataset.state = state;
        label.textContent = state === "label" ? LABELS[key] : "";
      };

      const leaveWindow = () => {
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
        shown = false;
      };
      const down = () => ring.classList.add("is-pressed");
      const up = () => ring.classList.remove("is-pressed");

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leaveWindow);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);

      return () => {
        root.classList.remove("has-custom-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leaveWindow);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
