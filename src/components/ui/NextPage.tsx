import { ArrowUpRight } from "lucide-react";
import TransitionLink from "./TransitionLink";

/** Large full-width link to the next page in the site's reading order. */
export default function NextPage({ href, label, kicker = "Next page" }: { href: string; label: string; kicker?: string }) {
  return (
    <TransitionLink href={href} className="next-page roll-host" transitionLabel={label} data-cursor="open">
      <span className="wrap next-page-inner">
        <span className="eyebrow">
          <span className="eyebrow-line" /> {kicker}
        </span>
        <span className="next-page-title">
          <span className="roll" data-text={label}>
            <span className="roll-inner">{label}</span>
          </span>
          <ArrowUpRight className="next-page-arrow" aria-hidden />
        </span>
      </span>
    </TransitionLink>
  );
}
