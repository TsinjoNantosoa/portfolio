import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FlaskConical, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import PreferencesControls from "./PreferencesControls";
import { currentHomeSection, homeSectionIds, menuIdForSection, navItems, type HomeSectionId } from "@/data/navigation";
import { useI18n, type TranslationKey } from "@/i18n/I18nProvider";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<HomeSectionId>("home");
  const location = useLocation();
  const menuId = useId();
  const { t } = useI18n();
  const navKey = (id: string) => `nav.${id}` as TranslationKey;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const updateActive = () => {
      const tops: Partial<Record<HomeSectionId, number>> = {};
      for (const id of homeSectionIds) {
        const el = document.getElementById(id);
        if (el) tops[id] = el.getBoundingClientRect().top;
      }
      setActiveSection(
        currentHomeSection(tops, {
          height: window.innerHeight,
          scrollY: window.scrollY,
          documentHeight: document.documentElement.scrollHeight,
        }),
      );
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [location.pathname]);

  const onHome = location.pathname === "/";
  const isMenuItemActive = (id: string) =>
    id === "lab" ? location.pathname.startsWith("/lab") : onHome && menuIdForSection(activeSection) === id;
  const talkActive = onHome && activeSection === "contact";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[var(--bg-primary)]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="site-container flex h-14 items-center justify-between sm:h-16">
        <Link to="/" className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Tsinjo<span className="text-neon">.</span>
        </Link>

        <nav className="hidden xl:block" aria-label={t("nav.primary")}>
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isMenuItemActive(item.id);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`menu-item inline-flex items-center gap-1.5 ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {item.id === "lab" && <FlaskConical className="h-3.5 w-3.5 shrink-0 text-neon/80" aria-hidden />}
                    {t(navKey(item.id))}
                  </a>
                </li>
              );
            })}
            <li className="ml-3">
              <PreferencesControls />
            </li>
            <li className="ml-3">
              <a
                href="/#contact"
                className={`btn-neon ${talkActive ? "ring-2 ring-neon/50 ring-offset-2 ring-offset-[var(--bg-primary)]" : ""}`}
                aria-current={talkActive ? "true" : undefined}
              >
                {t("nav.talk")}
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[var(--surface-1)] xl:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? t("nav.close") : t("nav.open")}
          aria-expanded={mobileMenuOpen}
          aria-controls={menuId}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-neon" />
          ) : (
            <Menu className="h-5 w-5 text-neon" />
          )}
        </button>
      </div>

      <MobileMenu
        id={menuId}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        items={navItems.map(({ id, href }) => ({
          label: t(navKey(id)),
          href,
          active: isMenuItemActive(id),
          icon: id === "lab" ? ("lab" as const) : undefined,
        }))}
        talkActive={talkActive}
      />
    </header>
  );
};

export default Header;
