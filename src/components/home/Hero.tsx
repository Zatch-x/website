"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import LocalTime from "@/components/ui/LocalTime";
import TransitionLink from "@/components/ui/TransitionLink";
import { initialPathname } from "@/lib/session";

/**
 * The intro curtain only plays when the home page is the first page loaded,
 * never on client-side returns from a case study.
 */
let introPlayed = false;
const shouldPlayIntro = () => !introPlayed && (typeof window === "undefined" || initialPathname === "/");
const INTRO_DELAY = 1.45; // keep in sync with the .intro-curtain CSS animation

const headline = [
  { text: "Ideas into", variant: "sans" },
  { text: "digital", variant: "serif" },
  { text: "experiences", variant: "sans", period: true },
] as const;

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, words) => (
        <span className="hero-word" key={`${word}-${wi}`}>
          {Array.from(word).map((ch, ci) => (
            <span className="hero-char" key={ci}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="hero-space"> </span>}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [showCurtain] = useState(shouldPlayIntro);

  useEffect(() => {
    introPlayed = true;
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const delay = showCurtain ? INTRO_DELAY : 0.15;

        /* Entrance */
        const tl = gsap.timeline({ delay, defaults: { ease: "power4.out" } });
        tl.from(".hero-char", { yPercent: 115, rotate: 6, duration: 1.15, stagger: 0.028 })
          .from(".hero-period", { scale: 0, duration: 0.6, ease: "back.out(3)" }, "-=0.6")
          .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.25)
          .from(".hero-copy, .hero-actions > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.55)
          .from(".portrait-disc", { scale: 0.7, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.2)
          .from(".portrait-ring", { rotate: -120, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.3)
          .from(".portrait-orbit", { scale: 0.6, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.35)
          .from(".portrait-badge-inner", { y: 30, opacity: 0, duration: 0.9 }, 0.9)
          .from(".hero-rule", { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "expo.inOut" }, 0.2)
          .from(".hero-bottomline > *", { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 1);

        /* Scroll-linked exit: lines drift apart, portrait sinks and spins. */
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.to(".hero-line--0", { xPercent: -8, scrollTrigger: st });
        gsap.to(".hero-line--1", { xPercent: 10, scrollTrigger: st });
        gsap.to(".hero-line--2", { xPercent: -4, scrollTrigger: st });
        gsap.to(".hero-portrait", { yPercent: 18, scale: 0.88, scrollTrigger: st });
        gsap.to(".portrait-spin", { rotate: 140, scrollTrigger: st });
        gsap.to(".hero-type-body", { opacity: 0.15, y: -40, scrollTrigger: { ...st, end: "70% top" } });
      });

      /* Pointer parallax depth on the portrait layers (desktop only). */
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = root.current;
        if (!el) return;
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el).map((layer) => ({
          depth: Number(layer.dataset.depth),
          x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * 60 * l.depth);
            l.y(ny * 60 * l.depth);
          });
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      {showCurtain && (
        <div className="intro-curtain" aria-hidden="true">
          <div className="intro-curtain-name">
            <span>{site.name}</span>
          </div>
          <div className="intro-curtain-bar" />
          <div className="intro-curtain-meta">
            <span>Portfolio</span>
            <span>{site.year}</span>
          </div>
        </div>
      )}

      <div className="hero-glow" aria-hidden="true" />

      <div className="wrap hero-inner">
        <div className="hero-topline">
          <span className="hero-kicker">{site.role}</span>
          <span className="hero-kicker">Based in {site.location} · Available for the next chapter</span>
        </div>
        <div className="hero-rule" aria-hidden="true" />

        <div className="hero-grid">
          <div className="hero-type">
            <p className="eyebrow hero-kicker">
              <span className="eyebrow-line" /> Developer / design-led thinker
            </p>

            <h1 id="hero-title" className="hero-title" aria-label="Ideas into digital experiences.">
              {headline.map((line, i) => (
                <span key={line.text} className={`hero-line hero-line--${i} hero-line--${line.variant}`} aria-hidden="true">
                  <span className="hero-line-mask">
                    <SplitChars text={line.text} />
                    {"period" in line && line.period && <span className="hero-period">.</span>}
                  </span>
                </span>
              ))}
            </h1>

            <div className="hero-type-body">
              <p className="hero-copy">
                I’m {site.firstName} — a developer exploring the space where <em>technology, visual storytelling,</em> and
                thoughtful interaction meet.
              </p>
              <div className="hero-actions">
                <Magnetic>
                  <a className="btn btn--primary roll-host" href="#work" onClick={(e) => go(e, "work")} data-cursor="view">
                    <RollText>Explore my work</RollText>
                    <span className="btn-icon">
                      <ArrowDownRight size={17} aria-hidden />
                    </span>
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <TransitionLink className="btn btn--ghost roll-host" href="/contact" transitionLabel="Contact">
                    <RollText>Let’s connect</RollText>
                    <ArrowUpRight size={16} aria-hidden />
                  </TransitionLink>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="hero-portrait">
            <div className="portrait-caption hero-kicker">
              <span>Fig. 001</span>
              <span>The developer</span>
            </div>
            <div className="portrait-stage">
              <div className="portrait-layer portrait-glow" data-depth="1.2" aria-hidden="true" />
              <div className="portrait-layer" data-depth="0.7" aria-hidden="true">
                <div className="portrait-orbit" />
              </div>
              <div className="portrait-layer portrait-spin" data-depth="0.45" aria-hidden="true">
                <svg className="portrait-ring" viewBox="0 0 200 200">
                  <defs>
                    <path id="portrait-ring-path" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
                  </defs>
                  <g className="portrait-ring-rotor">
                    <text>
                      <textPath href="#portrait-ring-path" textLength="536" lengthAdjust="spacing">
                        VICKY NAYAK ✳ CREATIVE DEVELOPER ✳ BASED IN INDIA ✳
                      </textPath>
                    </text>
                  </g>
                </svg>
              </div>
              <div className="portrait-layer" data-depth="0.2">
                <figure className="portrait-disc">
                  <Image
                    src="/images/profile.jpg"
                    alt="Portrait of Vicky Nayak in a black suit, seated with his chin resting on his hand"
                    fill
                    priority
                    sizes="(max-width: 700px) 70vw, 340px"
                    className="portrait-img"
                  />
                </figure>
              </div>
              <div className="portrait-badge" data-depth="-0.4">
                <div className="portrait-badge-inner">
                  <span className="portrait-badge-star" aria-hidden>
                    ✳
                  </span>
                  <span>
                    Curious by nature.
                    <br />
                    Built through practice.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottomline">
          <a href="#work" className="scroll-cue" onClick={(e) => go(e, "work")}>
            <span className="scroll-cue-line" aria-hidden />
            Scroll to explore
          </a>
          <span className="hero-bottomline-mid">Design · Code · Experiment</span>
          <LocalTime className="hero-time" srLabel={false} />
        </div>
      </div>
    </section>
  );
}
