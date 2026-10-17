"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { activeNavForPath, activeSocials, navHref, navSections, site, type NavItem, type NavSectionId } from "@/data/site";
import { projects } from "@/data/portfolio";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import LocalTime from "@/components/ui/LocalTime";
import CopyEmailButton from "@/components/ui/CopyEmailButton";
import TransitionLink from "@/components/ui/TransitionLink";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<NavSectionId | null>(activeNavForPath(pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Active state: routes for pages, scroll position for home-page sections. */
  useEffect(() => {
    if (!isHome) {
      setActive(activeNavForPath(pathname));
      return;
    }
    setActive(null);
    const sections = navSections
      .filter((s) => s.kind === "section")
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as NavSectionId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    const top = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, [isHome, pathname]);

  /* Sliding indicator under the active link. */
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const place = () => {
      const link = active ? nav.querySelector<HTMLElement>(`[data-section="${active}"]`) : null;
      const reduce = prefersReducedMotion();
      if (!link) {
        gsap.to(indicator, { opacity: 0, duration: reduce ? 0 : 0.25 });
        return;
      }
      gsap.to(indicator, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        opacity: 1,
        duration: reduce ? 0 : 0.5,
        ease: "power3.out",
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  /* Hide on scroll down, reveal on scroll up; add a backdrop once scrolled. */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      header.dataset.scrolled = y > 24 ? "true" : "false";
      if (!document.documentElement.classList.contains("is-scroll-locked")) {
        const hide = y > last && y > window.innerHeight * 0.6;
        header.dataset.hidden = hide ? "true" : "false";
      }
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    lockScroll(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  /* Mobile menu: lock scroll, focus first link, trap focus, close on Escape. */
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const menu = menuRef.current;
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    if (menu && !prefersReducedMotion()) {
      gsap.fromTo(
        menu.querySelectorAll(".menu-link-inner"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.06, delay: 0.15 },
      );
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
      if (e.key !== "Tab") return;
      const items = [toggleRef.current, ...focusables()].filter((el): el is HTMLElement => Boolean(el));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  /* Close the menu if the viewport grows past the mobile breakpoint or the route changes. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => mq.matches && closeMenu(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  useEffect(() => {
    closeMenu(false);
  }, [pathname, closeMenu]);

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, item: NavItem, fromMenu = false) => {
    // Pages and off-home sections navigate (with the page wipe); home sections smooth-scroll.
    if (item.kind === "page" || !isHome) {
      if (fromMenu && pathname === item.href) closeMenu(false);
      return;
    }
    const id = item.id;
    e.preventDefault();
    if (fromMenu) {
      closeMenu(false);
      // wait for the scroll lock to release before scrolling
      requestAnimationFrame(() => scrollToTarget(id));
    } else {
      scrollToTarget(id);
    }
    history.replaceState(null, "", `#${id}`);
  };

  const onBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    e.preventDefault();
    if (menuOpen) closeMenu(false);
    requestAnimationFrame(() => scrollToTarget(0));
    history.replaceState(null, "", "/");
  };


  return (
    <header ref={headerRef} className="site-header" data-menu-open={menuOpen || undefined}>
      <div className="header-inner">
        <Link className="brand" href="/" onClick={onBrandClick} aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden>
            V.
          </span>
          <span className="brand-name">{site.name}</span>
        </Link>

        <nav ref={navRef} className="main-nav" aria-label="Main">
          <span ref={indicatorRef} className="nav-indicator" aria-hidden />
          {navSections.map((s) => (
            <TransitionLink
              key={s.id}
              href={navHref(s, isHome)}
              data-section={s.id}
              transitionLabel={s.label}
              aria-current={active === s.id ? (s.kind === "page" && pathname === s.href ? "page" : isHome ? "location" : undefined) : undefined}
              onClick={(e) => onNavClick(e, s)}
            >
              {s.label}
              {s.id === "work" && <sup>{String(projects.length).padStart(2, "0")}</sup>}
            </TransitionLink>
          ))}
        </nav>

        <div className="header-meta">
          <span className="status-dot" aria-hidden />
          <LocalTime srLabel={false} />
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="menu-toggle-lines" aria-hidden>
            <i />
            <i />
          </span>
          <span className="menu-toggle-text" aria-hidden>
            {menuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="mobile-menu"
        data-open={menuOpen || undefined}
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen || undefined}
        aria-label={menuOpen ? "Site menu" : undefined}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ol className="menu-links">
            {navSections.map((s, i) => (
              <li key={s.id}>
                <TransitionLink
                  href={navHref(s, isHome)}
                  className="menu-link"
                  transitionLabel={s.label}
                  aria-current={active === s.id ? (s.kind === "page" ? "page" : "location") : undefined}
                  onClick={(e) => onNavClick(e, s, true)}
                >
                  <span className="menu-link-inner">
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    {s.label}
                    <ArrowUpRight aria-hidden size={22} />
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu-footer">
          <a href={`mailto:${site.email}`} className="menu-email">
            {site.email}
          </a>
          <CopyEmailButton />
          {activeSocials.length > 0 && (
            <ul className="menu-socials">
              {activeSocials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    <SocialIcon label={s.label} /> {s.label} <ArrowUpRight size={13} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
