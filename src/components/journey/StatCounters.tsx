"use client";

import { useRef } from "react";
import { journeyStats } from "@/data/portfolio";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Factual counters that count up when scrolled into view. The final value is rendered on the server. */
export default function StatCounters() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el, i) => {
          const target = Number(el.dataset.value);
          const counter = { v: 0 };
          el.textContent = "00";
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v)).padStart(2, "0");
            },
          });
        });
        gsap.from(".stat", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="wrap stats">
      {journeyStats.map((s) => (
        <div key={s.label} className="stat">
          <span className="stat-value" data-value={s.value}>
            {String(s.value).padStart(2, "0")}
          </span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
