/**
 * Site-wide identity and contact details.
 * Edit this file to update the email address or add social profiles.
 */

export interface SocialLink {
  label: string;
  /** Leave empty until you have the real profile URL — empty links are not rendered. */
  url: string;
  /** Short display handle, e.g. "@name". */
  handle?: string;
}

export const site = {
  name: "Vicky Nayak",
  firstName: "Vicky",
  role: "Creative Developer",
  location: "India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "nyxerzeus0@gmail.com",
  year: 2026,
  socials: [
    { label: "GitHub", url: "https://github.com/Zatch-x", handle: "@Zatch-x" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/vicky-nk-1851b62a6", handle: "in/vicky-nk" },
  ] satisfies SocialLink[],
};

/** Only socials with a real URL are shown anywhere on the site. */
export const activeSocials: SocialLink[] = site.socials.filter((s) => s.url.trim() !== "");

/**
 * Main navigation. `section` items scroll to a block on the home page;
 * `page` items are their own routes.
 */
export const navSections = [
  { id: "work", label: "Work", kind: "section", href: "/#work" },
  { id: "about", label: "About", kind: "page", href: "/about" },
  { id: "skills", label: "Skills", kind: "section", href: "/#skills" },
  { id: "journey", label: "Journey", kind: "page", href: "/journey" },
  { id: "contact", label: "Contact", kind: "page", href: "/contact" },
] as const;

export type NavSectionId = (typeof navSections)[number]["id"];
export type NavItem = (typeof navSections)[number];

/** Resolve a nav item's link for the current page (plain `#id` on home so it can smooth-scroll). */
export function navHref(item: NavItem, isHome: boolean) {
  return item.kind === "section" && isHome ? `#${item.id}` : item.href;
}

/** Which nav item is active for a route (sections on home are tracked separately by scroll). */
export function activeNavForPath(pathname: string): NavSectionId | null {
  if (pathname.startsWith("/work/")) return "work";
  const page = navSections.find((n) => n.kind === "page" && pathname === n.href);
  return page ? page.id : null;
}
