"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

interface PageIntroProps {
  index: string;
  eyebrow: string;
  /** Headline lines; `serif` lines use the italic display face. */
  lines: { text: string; serif?: boolean }[];
  children?: ReactNode;
  aside?: ReactNode;
}

/** Shared opening for inner pages: masked letter reveal, giant parallax index number, intro copy. */
export default function PageIntro({ index, eyebrow, lines, children, aside }: PageIntroProps) {
  const root = useRef<HTMLElement>(null);
  const label = lines.map((l) => l.text).join(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 0.25, defaults: { ease: "power4.out" } })
          .from(".pi-char", { yPercent: 115, rotate: 5, duration: 1.1, stagger: 0.022 })
          .from(".pi-eyebrow, .pi-body > *, .pi-aside", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.3)
          .from(".pi-index", { yPercent: 30, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.1);

        gsap.to(".pi-index", {
          yPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      /* The giant index number leans toward the pointer. */
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = root.current;
        if (!el) return;
        const xTo = gsap.quickTo(".pi-index-inner", "x", { duration: 1.2, ease: "power3.out" });
        const rTo = gsap.quickTo(".pi-index-inner", "rotation", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          xTo(nx * 60);
          rTo(nx * 4);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header ref={root} className="page-intro">
      <span className="pi-index" aria-hidden="true">
        <span className="pi-index-inner">{index}</span>
      </span>
      <div className="wrap pi-inner">
        <p className="eyebrow pi-eyebrow">
          <span className="eyebrow-line" /> {index} / {eyebrow}
        </p>
        <h1 className="pi-title" aria-label={label}>
          {lines.map((line, li) => (
            <span key={li} className={`pi-line ${line.serif ? "pi-line--serif" : ""}`} aria-hidden="true">
              {line.text.split(" ").map((word, wi) => (
                <span className="pi-word" key={wi}>
                  {Array.from(word).map((ch, ci) => (
                    <span className="pi-char" key={ci}>
                      <span className="pi-char-in">{ch}</span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <div className="pi-row">
          {children && <div className="pi-body">{children}</div>}
          {aside && <div className="pi-aside">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
