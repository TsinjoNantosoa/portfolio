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
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-primary)]">
      <Header />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
