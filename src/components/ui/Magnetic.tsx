"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

interface MagneticProps {
  children: ReactNode;
  /** How strongly the element follows the pointer (0–1). */
  strength?: number;
  className?: string;
}

/** Wraps an interactive element and pulls it gently toward the pointer on desktop. */
export default function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { dependencies: [strength] },
  );

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`}>
      {children}
    </span>
  );
}
