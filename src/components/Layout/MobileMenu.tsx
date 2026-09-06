import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen, items }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-[min(280px,85vw)] border-r border-white/10 bg-[#0D1117] md:hidden"
          >
            <div className="h-16" />
            <nav className="p-6" aria-label="Mobile">
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
};

export default MobileMenu;
