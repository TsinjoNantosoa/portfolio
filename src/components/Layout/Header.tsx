import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navItems } from "@/data/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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
          <ul className="flex items-center gap-1">
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
