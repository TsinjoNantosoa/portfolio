import React, { useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Sections/Hero";
import Projects from "@/components/Sections/Projects";
import Services from "@/components/Sections/Services";
import Experience from "@/components/Sections/Experience";
import Background from "@/components/Sections/Background";
import Contact from "@/components/Sections/Contact";
import { useI18n } from "@/i18n/I18nProvider";
import { getStaticSeo } from "@/seo/routes";
import { useSeo } from "@/seo/useSeo";

const Index = () => {
  const { language } = useI18n();

  useSeo(getStaticSeo("/", language));

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
        <Experience />
        <Projects />
        <Services />
        <Background />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
