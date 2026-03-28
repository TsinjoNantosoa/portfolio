
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 h-screen w-[240px] bg-darkcard/95 backdrop-blur-md md:hidden"
        >
          <div className="h-16" /> {/* Spacer for header */}
          <nav className="p-6">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
