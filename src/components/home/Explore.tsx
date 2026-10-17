"use client";

import { useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import TransitionLink from "@/components/ui/TransitionLink";

const pages = [
  {
    href: "/about",
    n: "02",
    title: "About",
    blurb: "The person behind the pixels, and how I work.",
    color: "#a2522f",
    ink: "#f6f0e5",
  },
  {
    href: "/journey",
    n: "04",
    title: "Journey",
    blurb: "Two years at RivyneOfficial.com, a BCA, and an MCA in progress.",
    color: "#556b35",
    ink: "#f3f4ec",
  },
  {
    href: "/contact",
    n: "05",
    title: "Contact",
    blurb: "Have a project or an opportunity? Let’s talk.",
    color: "#2c4c6e",
    ink: "#fdfcf9",
  },
];

/** Home-page index of the inner pages: big rows that fill with colour from the pointer's side. */
export default function Explore() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".explore-row");
        const cleanups = rows.map((row) => {
          const fill = row.querySelector<HTMLElement>(".explore-fill");
          if (!fill) return () => {};
          // Fill enters from whichever edge (top or bottom) the pointer came in through.
          const enter = (e: PointerEvent) => {
            const r = row.getBoundingClientRect();
            const fromTop = e.clientY - r.top < r.height / 2;
            gsap.fromTo(fill, { yPercent: fromTop ? -101 : 101 }, { yPercent: 0, duration: 0.5, ease: "power3.out", overwrite: true });
          };
          const leave = (e: PointerEvent) => {
            const r = row.getBoundingClientRect();
            const toTop = e.clientY - r.top < r.height / 2;
            gsap.to(fill, { yPercent: toTop ? -101 : 101, duration: 0.5, ease: "power3.out", overwrite: true });
          };
          row.addEventListener("pointerenter", enter);
          row.addEventListener("pointerleave", leave);
          return () => {
            row.removeEventListener("pointerenter", enter);
            row.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="explore section" aria-labelledby="explore-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> Keep exploring
            </p>
            <h2 id="explore-title" className="section-title">
              There’s more
              <br />
              <span className="serif">to the story.</span>
            </h2>
          </div>
        </div>
        <ul className="explore-list" data-reveal="stagger">
          {pages.map((p) => (
            <li key={p.href}>
              <TransitionLink
                href={p.href}
                className="explore-row"
                color={p.color}
                ink={p.ink}
                transitionLabel={p.title}
                data-cursor="open"
                style={{ "--explore-color": p.color, "--explore-ink": p.ink } as CSSProperties}
              >
                <span className="explore-fill" aria-hidden />
                <span className="explore-n">{p.n}</span>
                <span className="explore-title">{p.title}</span>
                <span className="explore-blurb">{p.blurb}</span>
                <span className="explore-arrow" aria-hidden>
                  <ArrowUpRight size={26} />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
