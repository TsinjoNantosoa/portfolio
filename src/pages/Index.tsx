
import React, { useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Sections/Hero";
import Services from "@/components/Sections/Services";
import Resume from "@/components/Sections/Resume";
import Projects from "@/components/Sections/Projects";
import Contact from "@/components/Sections/Contact";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', () => {});
      });
    };
  }, []);
  
  return (
    <div className="relative bg-darkbg min-h-screen overflow-hidden">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(13,255,163,0.05)_0,rgba(0,0,0,0)_60%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(13,255,163,0.05)_0,rgba(0,0,0,0)_60%)]"></div>
      
      <Header />
      
      <main>
        <Hero />
        <Services />
        <Resume />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
