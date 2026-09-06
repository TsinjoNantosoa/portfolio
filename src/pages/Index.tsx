import React, { useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Sections/Hero";
import Projects from "@/components/Sections/Projects";
import Services from "@/components/Sections/Services";
import Experience from "@/components/Sections/Experience";
import Background from "@/components/Sections/Background";
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
        <Experience />
        <Background />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
