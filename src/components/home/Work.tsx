"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { projectFilters, projects, type ProjectFilter } from "@/data/portfolio";
import { gsap, Flip, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER, prefersReducedMotion } from "@/lib/gsap";
import ProjectVisual from "@/components/work/ProjectVisual";
import TransitionLink from "@/components/ui/TransitionLink";

type FilterId = "all" | ProjectFilter;

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");

  const matches = (filters: ProjectFilter[]) => filter === "all" || filters.includes(filter);
  const counts = Object.fromEntries(
    projectFilters.map((f) => [f.id, f.id === "all" ? projects.length : projects.filter((p) => p.filters.includes(f.id as ProjectFilter)).length]),
  ) as Record<FilterId, number>;

  const changeFilter = (next: FilterId) => {
    if (next === filter) return;
    if (!prefersReducedMotion() && listRef.current) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll(".work-row"));
    }
    setFilter(next);
  };

  /* Animate the list re-layout after a filter change. */
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(".work-row", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%", once: true },
        });
      });

      /* Floating preview that follows the pointer over the list (desktop). */
      mm.add(`${MOTION_OK} and ${FINE_POINTER} and (min-width: 1024px)`, () => {
        const list = listRef.current;
        const preview = previewRef.current;
        const track = trackRef.current;
        if (!list || !preview || !track) return;

        // Offset to the right of the pointer so the hovered title stays readable.
        gsap.set(preview, { xPercent: 0, yPercent: -50, scale: 0.6, autoAlpha: 0, transformOrigin: "0% 50%" });
        const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
        const rotTo = gsap.quickTo(preview, "rotation", { duration: 0.9, ease: "power3.out" });
        let lastX = 0;

        const move = (e: PointerEvent) => {
          const bounds = root.current?.getBoundingClientRect();
          if (!bounds) return;
          xTo(e.clientX - bounds.left + 36);
          yTo(e.clientY - bounds.top);
          rotTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
        };
        const over = (e: PointerEvent) => {
          const row = (e.target as Element).closest<HTMLElement>(".work-row");
          if (!row) return;
          const index = Number(row.dataset.index);
          gsap.to(track, { yPercent: -100 * index, duration: 0.6, ease: "power3.inOut", overwrite: true });
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        };
        const leave = () => gsap.to(preview, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "power3.out", overwrite: "auto" });

        list.addEventListener("pointermove", move);
        list.addEventListener("pointerover", over);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerover", over);
          list.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const visibleCount = projects.filter((p) => matches(p.filters)).length;

  return (
    <section ref={root} className="work section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> 01 / Selected work
            </p>
            <h2 id="work-title" className="section-title">
              Things I’ve <br />
              <span className="serif">been building.</span>
            </h2>
          </div>
          <p className="section-aside">
            A selection of experiments, learning projects, and digital ideas. Each one is a chance to ask a better question.
          </p>
        </div>

        <div className="work-toolbar">
          <div className="filter-group" role="group" aria-label="Filter projects">
            {projectFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                className="filter-chip"
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
              >
                {f.label}
                <sup>{counts[f.id]}</sup>
              </button>
            ))}
          </div>
          <p className="work-count" aria-live="polite">
            Showing {String(visibleCount).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
        </div>

        <ol ref={listRef} className="work-list">
          {projects.map((project, index) => {
            const content = (
              <>
                <span className="work-row-number">{project.number}</span>
                <span className="work-row-main">
                  <span className="work-row-title">{project.title}</span>
                  <span className="work-row-desc">{project.description}</span>
                </span>
                <span className="work-row-meta">
                  <span className="work-row-category">{project.category}</span>
                  <span className="work-row-stack">{project.stack.join(" · ")}</span>
                </span>
                <span className="work-row-cta">
                  {project.caseStudy ? (
                    <>
                      <span className="work-row-cta-label">Case study</span>
                      <span className="work-row-arrow">
                        <ArrowUpRight size={20} aria-hidden />
                      </span>
                    </>
                  ) : (
                    <span className="work-row-soon">Case study coming soon</span>
                  )}
                </span>
                <span className="work-row-media">
                  <ProjectVisual
                    kind={project.visual}
                    number={project.number}
                    category={project.category}
                    status={project.status}
                    compact
                  />
                </span>
              </>
            );
            return (
              <li
                key={project.slug}
                className="work-row"
                data-index={index}
                data-flip-id={project.slug}
                hidden={!matches(project.filters)}
                style={{ "--row-accent": project.accent } as CSSProperties}
              >
                {project.caseStudy ? (
                  <TransitionLink
                    href={`/work/${project.slug}`}
                    className="work-row-inner"
                    color={project.accent}
                    ink={project.accentInk}
                    transitionLabel={project.title}
                    data-cursor="view"
                    aria-label={`${project.title} — read the case study`}
                  >
                    {content}
                  </TransitionLink>
                ) : (
                  <div className="work-row-inner work-row-inner--static">{content}</div>
                )}
              </li>
            );
          })}
        </ol>

        {visibleCount === 0 && <p className="work-empty">No projects in this category yet.</p>}

        <p className="footnote">
          Project visuals are illustrative compositions, not screenshots. Real screenshots and live/source links will be added
          as each project becomes ready to share.
        </p>
      </div>

      <div ref={previewRef} className="work-preview" aria-hidden="true">
        <div ref={trackRef} className="work-preview-track">
          {projects.map((p) => (
            <div className="work-preview-item" key={p.slug}>
              <ProjectVisual kind={p.visual} number={p.number} category={p.category} status={p.status} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
