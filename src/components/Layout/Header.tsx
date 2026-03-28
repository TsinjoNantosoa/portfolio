
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-darkbg/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            Tsinjo<span className="text-neon">.</span>
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            <li>
              <Link to="/" className={`menu-item ${isActive("/") ? "active" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className={`menu-item ${isActive("/services") ? "active" : ""}`}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/resume" className={`menu-item ${isActive("/resume") ? "active" : ""}`}>
                Resume
              </Link>
            </li>
            <li>
              <Link to="/work" className={`menu-item ${isActive("/work") ? "active" : ""}`}>
                Work
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`menu-item ${isActive("/contact") ? "active" : ""}`}>
                Contact
              </Link>
            </li>
            <li className="ml-4">
              <Link to="/contact" className="btn-neon">
                Hire me
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-darkcard md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-neon" />
          ) : (
            <Menu className="h-5 w-5 text-neon" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
    </header>
  );
};

export default Header;
