"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import TransitionLink from "@/components/ui/TransitionLink";

const statement: { text: string; italic?: boolean }[] = [
  { text: "I like the web best when it feels" },
  { text: "alive", italic: true },
  { text: "— when a clear idea, considered design, and well-crafted code come together to make something people remember." },
];

/** Accent statement band; words light up as you scroll through it. */
export default function IntroBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".band-word",
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".band-statement", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.from(".band-circle", {
          rotate: -90,
          scale: 0.6,
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "center center", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="intro-band" aria-label="Introduction">
      <div className="wrap intro-band-inner">
        <p className="band-label">00 / A little about me</p>
        <p className="band-statement">
          {statement.map((chunk) =>
            chunk.text.split(" ").map((word, i) => (
              <span key={`${chunk.text}-${i}`} className={`band-word ${chunk.italic ? "band-word--italic" : ""}`}>
                {word}{" "}
              </span>
            )),
          )}
        </p>
        <TransitionLink
          href="/about"
          className="band-circle"
          aria-label="Read more about me"
          transitionLabel="About"
          color="#a2522f"
          ink="#f6f0e5"
        >
          <ArrowUpRight size={24} aria-hidden />
        </TransitionLink>
      </div>
    </section>
  );
}
