import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X } from "lucide-react";
import PreferencesControls from "./PreferencesControls";
import { useI18n } from "@/i18n/I18nProvider";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: "lab";
}

interface MobileMenuProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: NavItem[];
  /** True while the Contact section is current: the call-to-action stands for it. */
  talkActive?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ id, isOpen, setIsOpen, items, talkActive = false }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, setIsOpen]);

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label={t("nav.close")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.mobile")}
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[100] w-[min(340px,88vw)] border-r border-white/10 bg-[var(--surface-1)] pb-[env(safe-area-inset-bottom)] text-[var(--text-primary)] shadow-2xl xl:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                Tsinjo<span className="text-neon">.</span>
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("nav.close")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-neon transition hover:border-neon/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-6 pt-8" aria-label={t("nav.mobile")}>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={item.active ? "true" : undefined}
                      className={`flex min-h-11 items-center gap-2 rounded-lg px-3 text-base transition hover:bg-white/5 hover:text-neon ${
                        item.active ? "bg-white/5 text-neon" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {item.icon === "lab" && <FlaskConical className="h-4 w-4 shrink-0 text-neon/80" aria-hidden />}
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-7 border-t border-white/10 pt-5">
                <PreferencesControls compact />
              </div>
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                aria-current={talkActive ? "true" : undefined}
                className={`mt-8 flex min-h-11 w-full items-center justify-center rounded-full bg-neon text-sm font-semibold text-black ${
                  talkActive ? "ring-2 ring-neon/50 ring-offset-2 ring-offset-[var(--surface-1)]" : ""
                }`}
              >
                {t("nav.talk")}
              </a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
};

export default MobileMenu;
