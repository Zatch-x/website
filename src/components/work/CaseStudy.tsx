"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, ImageIcon } from "lucide-react";
import type { CaseStudy as CaseStudyData, DraftCopy, Project } from "@/data/portfolio";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import ProjectVisual from "./ProjectVisual";
import TransitionLink from "@/components/ui/TransitionLink";

type FullProject = Project & { caseStudy: CaseStudyData };

interface CaseStudyProps {
  project: FullProject;
  index: number;
  total: number;
  next: FullProject;
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "features", label: "Key features" },
  { id: "technology", label: "Technology" },
  { id: "visuals", label: "Visuals" },
  { id: "results", label: "Results" },
] as const;

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="cs-placeholder">
      <span className="placeholder-tag">Placeholder</span>
      <p>{children}</p>
    </div>
  );
}

function Copy({ copy, missing }: { copy: DraftCopy | null; missing: string }) {
  if (!copy) return <Placeholder>{missing}</Placeholder>;
  return (
    <div className="cs-copy">
      {copy.draft && (
        <span className="draft-tag" title="Written from the project summary — confirm or rewrite">
          Draft · confirm
        </span>
      )}
      <p>{copy.text}</p>
    </div>
  );
}

export default function CaseStudy({ project, index, total, next }: CaseStudyProps) {
  const root = useRef<HTMLElement>(null);
  const cs = project.caseStudy;
  const [active, setActive] = useState<string>("overview");

  /* Section index highlighting: the last section whose top has passed 40% of the viewport. */
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = els[0]?.id ?? "overview";
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= line || (atBottom && r.top < window.innerHeight)) current = el.id;
      }
      setActive(current);
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power4.out" } });
        tl.from(".cs-title-char", { yPercent: 115, duration: 1.1, stagger: 0.025 })
          .from(".cs-hero-meta > *, .cs-back", { y: 20, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.3)
          .from(".cs-cover", { clipPath: "inset(18% 8% 18% 8%)", duration: 1.4, ease: "expo.inOut" }, 0.2)
          .from(".cs-cover .pv", { scale: 1.25, duration: 1.6, ease: "expo.out" }, 0.3);

        gsap.to(".cs-cover .pv", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ".cs-cover", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.from(".cs-feature", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cs-features", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  const style = { "--cs-accent": project.accent, "--cs-ink": project.accentInk } as CSSProperties;

  return (
    <article ref={root} className={`case-study case-study--${project.slug}`} style={style}>
      <header className="cs-hero wrap">
        <TransitionLink href="/#work" className="cs-back" transitionLabel="All work">
          <ArrowLeft size={16} aria-hidden /> All work
        </TransitionLink>

        <p className="eyebrow cs-eyebrow">
          <span className="eyebrow-line" /> Case study {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <h1 className="cs-title" aria-label={project.title}>
          {project.title.split(" ").map((word, wi) => (
            <span className="cs-title-word" key={wi} aria-hidden>
              {Array.from(word).map((ch, ci) => (
                <span className="cs-title-char" key={ci}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="cs-tagline">{cs.tagline}</p>

        <dl className="cs-hero-meta">
          <div>
            <dt>Category</dt>
            <dd>{project.category}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd className={cs.role ? undefined : "is-placeholder"}>{cs.role ?? "[Placeholder]"}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd className={cs.year ? undefined : "is-placeholder"}>{cs.year ?? "[Placeholder]"}</dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd>
              {cs.links.length > 0 ? (
                cs.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="cs-link">
                    {l.label} <ArrowUpRight size={13} aria-hidden />
                  </a>
                ))
              ) : (
                <span className="is-placeholder">Not published yet</span>
              )}
            </dd>
          </div>
        </dl>
      </header>

      <div className="cs-cover wrap-wide">
        <ProjectVisual kind={project.visual} number={project.number} category={project.category} status={project.status} />
      </div>

      <div className="wrap cs-body">
        <nav className="cs-index" aria-label="Case study sections">
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => jump(e, s.id)}
                  aria-current={active === s.id ? "location" : undefined}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-content">
          <section id="overview" className="cs-section" data-reveal>
            <h2 className="cs-h2">Overview</h2>
            <p className="cs-lead">{cs.overview}</p>
          </section>

          <div className="cs-split">
            <section id="problem" className="cs-section" data-reveal>
              <h2 className="cs-h2">Problem</h2>
              <Copy copy={cs.problem} missing="Describe the problem this project set out to solve." />
            </section>
            <section id="solution" className="cs-section" data-reveal>
              <h2 className="cs-h2">Solution</h2>
              <Copy copy={cs.solution} missing="Describe how the project approaches the problem." />
            </section>
          </div>

          <section id="features" className="cs-section">
            <h2 className="cs-h2" data-reveal>
              Key features
            </h2>
            <ol className="cs-features">
              {cs.features.map((f, i) => (
                <li className="cs-feature" key={f.title}>
                  <span className="cs-feature-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </li>
              ))}
            </ol>
            {cs.featuresNote && <p className="cs-note">{cs.featuresNote}</p>}
          </section>

          <section id="technology" className="cs-section" data-reveal>
            <h2 className="cs-h2">Technology</h2>
            <ul className="cs-tech">
              {cs.technologies.map((t) => (
                <li key={t.name}>
                  <span className="cs-tech-name">{t.name}</span>
                  <span className={`cs-tech-purpose ${t.purpose ? "" : "is-placeholder"}`}>
                    {t.purpose ?? "[Placeholder] how it was used"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="visuals" className="cs-section" data-reveal>
            <h2 className="cs-h2">Visuals</h2>
            {cs.screenshots.length > 0 ? (
              <div className="cs-gallery">
                {cs.screenshots.map((shot) => (
                  <figure key={shot.src} className="cs-shot">
                    <div className="cs-shot-frame">
                      <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 900px) 100vw, 60vw" />
                    </div>
                    {shot.caption && <figcaption>{shot.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="cs-gallery">
                {[1, 2].map((n) => (
                  <figure key={n} className="cs-shot cs-shot--empty">
                    <div className="cs-shot-frame">
                      <ImageIcon size={28} aria-hidden />
                      <span className="placeholder-tag">Screenshot placeholder</span>
                      <code>
                        public/images/work/{project.slug}/0{n}.jpg
                      </code>
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <section id="results" className="cs-section" data-reveal>
            <h2 className="cs-h2">Results</h2>
            {cs.results.length > 0 ? (
              <ul className="cs-results">
                {cs.results.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <Placeholder>
                No results published yet. Add measured outcomes, demos or lessons learned once they’re available.
              </Placeholder>
            )}
          </section>

          {cs.openQuestions.length > 0 && (
            <aside className="cs-todo" data-reveal aria-label="Details still to add">
              <h2 className="cs-h2">Still to add</h2>
              <ul>
                {cs.openQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>

      <TransitionLink
        href={`/work/${next.slug}`}
        className="cs-next"
        color={next.accent}
        ink={next.accentInk}
        transitionLabel={next.title}
        data-cursor="view"
        style={{ "--next-accent": next.accent, "--next-ink": next.accentInk } as CSSProperties}
      >
        <span className="wrap cs-next-inner">
          <span className="eyebrow">
            <span className="eyebrow-line" /> Next case study
          </span>
          <span className="cs-next-title">
            {next.title}
            <ArrowUpRight className="cs-next-arrow" aria-hidden />
          </span>
        </span>
      </TransitionLink>
    </article>
  );
}
