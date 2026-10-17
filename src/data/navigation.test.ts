import { describe, expect, it } from "vitest";
import { currentHomeSection, footerLinks, homeSectionIds, menuIdForSection, navItems } from "./navigation";

const viewport = { height: 900, scrollY: 0, documentHeight: 10000 };

describe("navigation data", () => {
  it("keeps Contact and Education out of the main menu but reachable elsewhere", () => {
    const ids = navItems.map((item) => item.id) as string[];
    expect(ids).not.toContain("contact");
    expect(ids).not.toContain("education");
    expect(ids).toEqual(expect.arrayContaining(["home", "about", "experience", "projects", "lab", "skills"]));
    const footer = footerLinks.map((link) => link.href) as string[];
    expect(footer).toContain("/#education");
    expect(footer).toContain("/#contact");
  });

  it("only links to sections that exist on the home page, or to the Lab", () => {
    for (const item of navItems) {
      if (item.href.startsWith("/#")) expect(homeSectionIds).toContain(item.href.slice(2));
    }
    for (const link of footerLinks) {
      if (link.href.startsWith("/#")) expect(homeSectionIds).toContain(link.href.slice(2));
    }
  });

  it("maps Education to the Skills menu entry", () => {
    expect(menuIdForSection("education")).toBe("skills");
    expect(menuIdForSection("projects")).toBe("projects");
    expect(menuIdForSection("contact")).toBe("contact");
  });
});

describe("currentHomeSection", () => {
  const tops = (overrides: Record<string, number>) => ({ home: -3000, about: -2500, experience: -2000, projects: -1000, skills: 1500, education: 2000, contact: 3000, ...overrides });

  it("is home at the top of the page", () => {
    expect(currentHomeSection({ home: 0, about: 700, experience: 1200, projects: 2200, skills: 7000, education: 7500, contact: 9000 }, viewport)).toBe("home");
  });

  it("picks the last section whose top passed the header line", () => {
    expect(currentHomeSection(tops({}), viewport)).toBe("projects");
  });

  it("tolerates one pixel of sub-pixel layout when a section was scrolled to its anchor", () => {
    expect(currentHomeSection(tops({ skills: 96.6 }), viewport)).toBe("skills");
    expect(currentHomeSection(tops({ skills: 98 }), viewport)).toBe("projects");
  });

  it("treats Education as current when it is", () => {
    expect(currentHomeSection(tops({ skills: -400, education: 60 }), viewport)).toBe("education");
  });

  it("makes Contact current once it fills the lower half of the screen, even if the page cannot scroll further", () => {
    expect(currentHomeSection(tops({ skills: -2000, education: -900, contact: 440 }), viewport)).toBe("contact");
    expect(currentHomeSection(tops({ skills: -2000, education: -900, contact: 460 }), viewport)).toBe("education");
  });

  it("is Contact at the very bottom of the page", () => {
    expect(currentHomeSection(tops({ contact: 836 }), { height: 900, scrollY: 9100, documentHeight: 10000 })).toBe("contact");
  });
});
