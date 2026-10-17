"use client";

import { usePathname } from "next/navigation";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Shared scroll reveals: any element with `data-reveal` fades up once when it enters,
 * and `data-reveal="mask"` headings slide up from behind a mask. Re-runs on route change.
 */
export default function Reveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const children = el.dataset.reveal === "stagger" ? Array.from(el.children) : [el];
          gsap.from(children, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
