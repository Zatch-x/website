"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/lib/scroll";

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Thin reading-progress bar plus a back-to-top button with a progress ring. No React re-renders on scroll. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      if (buttonRef.current) {
        // Hidden near the very bottom, where the footer has its own "Back to top" control.
        const show = window.scrollY > window.innerHeight * 0.8 && max - window.scrollY > 160;
        buttonRef.current.dataset.visible = show ? "true" : "false";
        buttonRef.current.inert = !show;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div ref={barRef} className="scroll-progress-bar" />
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="back-to-top"
        aria-label="Back to top"
        data-visible="false"
        inert
        onClick={() => scrollToTarget(0)}
      >
        <svg className="back-to-top-progress" viewBox="0 0 52 52" aria-hidden="true">
          <circle className="back-to-top-track" cx="26" cy="26" r={RADIUS} />
          <circle
            ref={ringRef}
            className="back-to-top-ring"
            cx="26"
            cy="26"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <ArrowUp size={17} aria-hidden />
      </button>
    </>
  );
}
