"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FINE_POINTER, prefersReducedMotion } from "@/lib/gsap";

/**
 * Black-and-white portrait with a colour "spotlight" that follows the pointer.
 * On touch screens a tap toggles full colour.
 */
export default function PortraitSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const enter = () => el.setAttribute("data-spot", prefersReducedMotion() ? "full" : "on");
    const leave = () => el.removeAttribute("data-spot");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [fine]);

  const img = (className: string) => (
    <Image
      src="/images/profile.jpg"
      alt=""
      fill
      sizes="(max-width: 900px) 80vw, 420px"
      className={className}
    />
  );

  return (
    <figure className="spotlight">
      <div
        ref={ref}
        className="spotlight-frame"
        data-spot={!fine && revealed ? "full" : undefined}
        role="img"
        aria-label="Portrait of Vicky Nayak in a black suit"
      >
        {img("spotlight-base")}
        <div className="spotlight-color" aria-hidden>
          {img("spotlight-img")}
        </div>
        <span className="spotlight-ring" aria-hidden />
      </div>
      <figcaption className="spotlight-caption">
        {fine ? (
          <span>Move your cursor across the photo</span>
        ) : (
          <button type="button" className="copy-btn" aria-pressed={revealed} onClick={() => setRevealed((r) => !r)}>
            {revealed ? "Show black & white" : "Show in colour"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
