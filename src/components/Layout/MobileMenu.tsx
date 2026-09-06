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
<<<<<<< HEAD
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
=======
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
          id="mobile-navigation"
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 left-0 z-40 h-dvh w-60 max-w-[85vw] overflow-y-auto bg-darkcard/95 backdrop-blur-md md:hidden"
        >
          <div className="h-16" /> {/* Spacer for header */}
          <nav className="p-4 sm:p-6">
            <ul className="flex flex-col gap-6">
              <li>
                <Link
                  to="/"
                  className={`block text-lg font-medium ${
                    isActive("/") ? "text-neon" : "text-white/70"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className={`block text-lg font-medium ${
                    isActive("/services") ? "text-neon" : "text-white/70"
                  }`}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/resume"
                  className={`block text-lg font-medium ${
                    isActive("/resume") ? "text-neon" : "text-white/70"
                  }`}
                >
                  Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/work"
                  className={`block text-lg font-medium ${
                    isActive("/work") ? "text-neon" : "text-white/70"
                  }`}
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block text-lg font-medium ${
                    isActive("/contact") ? "text-neon" : "text-white/70"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="mt-10">
              <Link
                to="/contact"
                className="block w-full rounded-full bg-neon/90 py-3 text-center font-medium text-black transition-all hover:shadow-[0_0_15px_rgba(13,255,163,0.6)]"
              >
                Hire me
              </Link>
            </div>
          </nav>
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
