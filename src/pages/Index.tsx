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

const Index = () => {
  const { language } = useI18n();

  useEffect(() => {
    const isFrench = language === "fr";
    const title = isFrench
      ? "Sandaniaina Tsinjo Nantosoa — Ingénieur IA | RAG, agents IA et Tool Calling"
      : "Sandaniaina Tsinjo Nantosoa — AI Engineer | RAG, AI Agents & Tool Calling";
    const description = isFrench
      ? "Ingénieur IA spécialisé en IA générative, plateformes RAG multi-tenant, agents IA avec Tool Calling, backend FastAPI et déploiement de solutions fiables."
      : "AI Engineer specializing in generative AI, multi-tenant RAG platforms, Tool Calling agents, FastAPI backends, and reliable production delivery.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://tsinjona.netlify.app/");
  }, [language]);

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
