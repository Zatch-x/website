"use client";

import { usePathname } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { activeSocials, navHref, navSections, site, type NavItem } from "@/data/site";
import { scrollToTarget } from "@/lib/scroll";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import LocalTime from "@/components/ui/LocalTime";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import TransitionLink from "@/components/ui/TransitionLink";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".footer-wordmark-char", {
          yPercent: 100,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: { trigger: ".footer-wordmark", start: "top 100%", end: "bottom 95%", scrub: 0.8 },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  const onNav = (e: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!isHome || item.kind === "page") return;
    e.preventDefault();
    scrollToTarget(item.id);
  };

  return (
    <footer ref={root} className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-col--intro">
            <p className="footer-lead">
              Designed with curiosity.
              <br />
              <span className="serif">Built with intention.</span>
            </p>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h2 className="footer-heading">Navigate</h2>
            <ul>
              {navSections.map((s) => (
                <li key={s.id}>
                  <TransitionLink
                    href={navHref(s, isHome)}
                    onClick={(e) => onNav(e, s)}
                    className="footer-link"
                    transitionLabel={s.label}
                  >
                    {s.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-heading">Say hello</h2>
            <a className="footer-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <CopyEmailButton className="footer-copy" />
            {activeSocials.length > 0 && (
              <ul className="footer-socials">
                {activeSocials.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="footer-link">
                      <SocialIcon label={s.label} /> {s.label} <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Local time</h2>
            <LocalTime className="footer-time" />
            <span className="footer-small">Based in {site.location}</span>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          {Array.from(site.name.toUpperCase()).map((ch, i) => (
            <span key={i} className="footer-wordmark-mask">
              <span className="footer-wordmark-char">{ch === " " ? " " : ch}</span>
            </span>
          ))}
        </div>

        <div className="footer-bottom">
          <small>
            © {site.year} {site.name} · Personal portfolio
          </small>
          <button type="button" className="footer-top roll-host" onClick={() => scrollToTarget(0)}>
            Back to top <ArrowUp size={14} aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  );
}
