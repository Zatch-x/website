"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { coverPage } from "@/components/chrome/PageTransition";
import { prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Colour of the wipe panel. */
  color?: string;
  /** Text colour on the wipe panel. */
  ink?: string;
  /** Short label shown during the wipe. */
  transitionLabel?: string;
};

/**
 * A Next.js Link that plays a colour wipe before navigating.
 * Modified clicks (new tab, etc.) and reduced-motion users get normal navigation.
 */
export default function TransitionLink({
  href,
  color = "#1f1d1a",
  ink = "#faf7f1",
  transitionLabel = "Loading",
  onClick,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (prefersReducedMotion()) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) {
      // Same page: no wipe. A bare link to the current page just returns to the top.
      if (!url.hash) {
        e.preventDefault();
        scrollToTarget(0);
      }
      return;
    }
    e.preventDefault();
    coverPage({ color, ink, label: transitionLabel }).then(() => router.push(href));
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
