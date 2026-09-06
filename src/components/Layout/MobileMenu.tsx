import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ id, isOpen, setIsOpen, items }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
            aria-label="Close menu overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[100] w-[min(320px,86vw)] border-r border-white/10 bg-[#0D1318] shadow-2xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <span className="text-lg font-semibold text-white">
                Tsinjo<span className="text-neon">.</span>
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-neon transition hover:border-neon/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-6 pt-8" aria-label="Mobile">
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-base text-white/75 transition hover:bg-white/5 hover:text-neon"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="mt-8 flex min-h-11 w-full items-center justify-center rounded-full bg-neon text-sm font-semibold text-black"
              >
                Let&apos;s Talk
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
