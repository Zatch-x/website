"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import "@/lib/session"; // capture the first-load path early (used by the hero intro)

interface CoverOptions {
  color: string;
  ink: string;
  label: string;
}

type Api = { cover: (opts: CoverOptions) => Promise<void> };
let api: Api | null = null;

/** Wipe the transition panel over the page. Resolves once the screen is covered. */
export function coverPage(opts: CoverOptions): Promise<void> {
  return api ? api.cover(opts) : Promise.resolve();
}

/** Full-screen colour wipe used between the home page and case studies. */
export default function PageTransition() {
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const covered = useRef(false);
  const fallback = useRef<number | undefined>(undefined);
  const revealRef = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    const panel = panelRef.current;
    const label = labelRef.current;
    if (!panel || !label) return;
    const timer = fallback;

    api = {
      cover: ({ color, ink, label: text }) =>
        new Promise<void>((resolve) => {
          label.textContent = text;
          gsap.killTweensOf(panel);
          gsap.set(panel, { visibility: "visible", backgroundColor: color, color: ink });
          gsap
            .timeline({
              onComplete: () => {
                covered.current = true;
                // Never leave the screen covered if navigation stalls.
                window.clearTimeout(fallback.current);
                fallback.current = window.setTimeout(reveal, 4000);
                resolve();
              },
            })
            .fromTo(panel, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" })
            .fromTo(label, { yPercent: 120 }, { yPercent: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");
        }),
    };

    function reveal() {
      if (!panel || !label) return;
      window.clearTimeout(fallback.current);
      covered.current = false;
      gsap
        .timeline({
          delay: 0.15,
          onComplete: () => {
            gsap.set(panel, { visibility: "hidden" });
            ScrollTrigger.refresh();
          },
        })
        .to(label, { yPercent: -120, duration: 0.4, ease: "power3.in" })
        .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" }, "-=0.15");
    }

    revealRef.current = reveal;
    return () => {
      api = null;
      window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    // Cancel any in-flight smooth scroll aimed at the previous page.
    getLenis()?.scrollTo(window.scrollY, { immediate: true, force: true });
    if (covered.current) revealRef.current();
  }, [pathname]);

  return (
    <div ref={panelRef} className="page-transition" aria-hidden="true">
      <span className="page-transition-mask">
        <span ref={labelRef} className="page-transition-label" />
      </span>
    </div>
  );
}
