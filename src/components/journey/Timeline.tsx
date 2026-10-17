"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { journey, type JourneyEntry } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

type Filter = "all" | JourneyEntry["kind"];
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

/** Filterable, expandable timeline. The line draws on scroll, nodes light up, cards tilt toward the pointer. */
export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(journey[0]?.id ?? null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.from(".timeline-item", {
          x: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ".timeline", start: "top 80%", once: true },
        });
      });

      /* 3D tilt toward the pointer on desktop. */
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
        const cleanups = cards.map((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
          gsap.set(card, { transformPerspective: 900 });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            ry(nx * 8);
            rx(-ny * 8);
            card.style.setProperty("--glare-x", `${(nx + 0.5) * 100}%`);
            card.style.setProperty("--glare-y", `${(ny + 0.5) * 100}%`);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });

      /* Light up each node as the line reaches it (a class toggle, so it also works with reduced motion). */
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: "top 65%", toggleClass: { targets: item, className: "is-reached" } });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  const visible = journey.filter((e) => filter === "all" || e.kind === filter);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <section ref={root} className="section journey-timeline" aria-labelledby="timeline-title">
      <div className="wrap journey-grid">
        <div className="journey-heading">
          <div data-reveal>
            <p className="eyebrow">
              <span className="eyebrow-line" /> Timeline
            </p>
            <h2 id="timeline-title" className="section-title">
              Where I’ve
              <br />
              <span className="serif">been learning.</span>
            </h2>
          </div>
          <div className="filter-group" role="group" aria-label="Filter timeline" data-reveal>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className="filter-chip"
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
              >
                {f.label}
                <sup>{f.id === "all" ? journey.length : journey.filter((e) => e.kind === f.id).length}</sup>
              </button>
            ))}
          </div>
          <p className="journey-hint" data-reveal>
            Select an entry to expand it.
          </p>
        </div>

        <div className="timeline-wrap">
          <span className="timeline-line" aria-hidden>
            <span className="timeline-progress" />
          </span>
          <ol className="timeline">
            {visible.map((entry) => {
              const isOpen = open === entry.id;
              const panelId = `journey-${entry.id}`;
              return (
                <li key={entry.id} className={`timeline-item timeline-item--${entry.kind}`} data-open={isOpen || undefined}>
                  <span className="timeline-node" aria-hidden />
                  <div className="timeline-card">
                    <span className="timeline-glare" aria-hidden />
                    <button
                      type="button"
                      className="timeline-trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : entry.id)}
                    >
                      {entry.orgLogo && (
                        <span className="timeline-logo">
                          <Image src={entry.orgLogo} alt={`${entry.org} logo`} width={36} height={36} />
                        </span>
                      )}
                      <span className="timeline-meta">
                        <span className="timeline-kind">{entry.kind}</span>
                        <span className="timeline-period">
                          {entry.current && <span className="status-dot" aria-hidden />}
                          {entry.period}
                        </span>
                      </span>
                      <span className="timeline-title">{entry.kind === "experience" ? entry.org : entry.title}</span>
                      <span className="timeline-org">
                        {entry.kind === "experience" ? (
                          entry.title ?? <span className="is-placeholder">[Role title to be added]</span>
                        ) : (
                          entry.org
                        )}
                      </span>
                      <span className="timeline-toggle" aria-hidden>
                        <Plus size={18} />
                      </span>
                    </button>
                    <div className="timeline-panel" id={panelId} role="region" aria-label={`${entry.org} details`} inert={!isOpen}>
                      <div className="timeline-panel-inner">
                        {entry.details.map((d) => (
                          <p key={d}>{d}</p>
                        ))}
                        {entry.orgUrl && (
                          <a className="copy-btn timeline-link" href={entry.orgUrl} target="_blank" rel="noreferrer">
                            Visit {entry.org} <ArrowUpRight size={14} aria-hidden />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
