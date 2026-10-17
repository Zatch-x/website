"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Endless text band that drifts on its own and speeds up / skews with scroll velocity.
 * Scrolling up reverses its direction. Static under reduced motion.
 */
export default function VelocityMarquee({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "accent" }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = root.current?.querySelector<HTMLElement>(".vm-track");
        if (!track) return;
        // The track holds two identical halves; wrapping at -50% loops seamlessly.
        const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        // Start deep into the repeat so playing in reverse (scrolling up) never hits time 0.
        loop.totalTime(loop.duration() * 200);
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
        let direction = 1;
        let skewed = false;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            direction = self.direction;
            loop.timeScale(direction * (1 + Math.min(Math.abs(v) / 300, 5)));
            skewTo(gsap.utils.clamp(-10, 10, v / -250));
            skewed = true;
          },
        });
        // Ease the speed back to normal after scrolling stops.
        const settle = () => {
          const ts = loop.timeScale();
          if (Math.abs(ts - direction) > 0.01) loop.timeScale(ts + (direction - ts) * 0.06);
          // Once scrolling has slowed right down, straighten the text again.
          if (skewed && Math.abs(st.getVelocity()) < 20) {
            skewTo(0);
            skewed = false;
          }
        };
        gsap.ticker.add(settle);
        return () => {
          st.kill();
          loop.kill();
          gsap.ticker.remove(settle);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const half = (key: string) => (
    <span className="vm-half" key={key}>
      {items.map((item, i) => (
        <span key={i} className="vm-item">
          {item}
          <span className="vm-star" aria-hidden>
            ✳
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div ref={root} className={`velocity-marquee vm--${tone}`} aria-label={items.join(", ")} role="img">
      <div className="vm-track" aria-hidden="true">
        {half("a")}
        {half("b")}
      </div>
    </div>
  );
}
