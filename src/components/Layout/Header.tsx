import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navItems } from "@/data/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const location = useLocation();
  const menuId = useId();

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

    const sectionIds = navItems.map((item) => item.id);

    const updateActive = () => {
      const marker = 96;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - marker <= 0) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [location.pathname]);

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

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`menu-item ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li className="ml-3">
              <a href="/#contact" className="btn-neon">
                Let&apos;s Talk
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[var(--surface-1)] md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
        items={navItems.map(({ label, href }) => ({ label, href }))}
      />
    </header>
  );
};

export default Header;
