/** Links of the main menu. Education stays on the page and in the footer; Contact is the "Let's Talk" button. */
export const navItems = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "AI Lab", href: "/lab", id: "lab" },
  { label: "Skills", href: "/#skills", id: "skills" },
] as const;

/** Home-page sections followed while scrolling, in page order. Not all of them are menu links. */
export const homeSectionIds = ["home", "about", "experience", "projects", "skills", "education", "contact"] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

/** The menu entry that stands for a section: Education belongs to the Skills area, Contact is the button. */
export const menuIdForSection = (section: HomeSectionId): string => (section === "education" ? "skills" : section);

/** Footer links: the sections that are not in the main menu, plus the two main destinations. */
export const footerLinks = [
  { href: "/#projects", key: "nav.projects" },
  { href: "/lab", key: "nav.lab" },
  { href: "/#education", key: "nav.education" },
  { href: "/#contact", key: "nav.contact" },
] as const;

/**
 * Which section is current at this scroll position. A section is current once its top passes the header
 * line (with 1 px of tolerance for sub-pixel layout). Contact is the last section and sits at the end of the
 * page, so it counts as current as soon as it fills the lower half of the screen, and at the very bottom.
 */
export const currentHomeSection = (
  tops: Partial<Record<HomeSectionId, number>>,
  viewport: { height: number; scrollY: number; documentHeight: number },
  headerLine = 96,
): HomeSectionId => {
  if (viewport.scrollY + viewport.height >= viewport.documentHeight - 2 && tops.contact !== undefined) return "contact";
  let current: HomeSectionId = homeSectionIds[0];
  for (const id of homeSectionIds) {
    const top = tops[id];
    if (top === undefined) continue;
    const line = id === "contact" ? Math.max(headerLine, viewport.height * 0.5) : headerLine;
    if (top - line <= 1) current = id;
  }
  return current;
};
