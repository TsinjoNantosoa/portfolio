import React from "react";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import ContactForm from "../UI/ContactForm";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Contact: React.FC = () => {
  return (
<<<<<<< HEAD
    <section id="contact" className="section-block scroll-mt-24">
      <div className="site-container">
        <SectionHeader
          eyebrow="Contact"
          title="Building an AI product, RAG system or automation workflow?"
          description="Let's discuss how to turn it into a reliable production-ready system."
        />

        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5 sm:p-7">
            <ContactForm />
          </div>

          <div className="space-y-8 border-t border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Contact
              </h3>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-neon" />
                  <a href={`mailto:${EMAIL}`} className="hover:text-neon">
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Linkedin className="mt-0.5 h-4 w-4 text-neon" />
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-neon">
                    LinkedIn
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Github className="mt-0.5 h-4 w-4 text-neon" />
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-neon">
                    GitHub
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-neon" />
                  <span>Antananarivo, Madagascar · Open to Remote</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Availability
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Open to remote AI engineering roles, RAG systems, agentic applications, and selected
                freelance engagements.
=======
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-xl text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Let's <span className="text-neon">work together</span>
          </h2>
          <p className="text-white/70">
            Have a project in mind? Let's discuss how I can help you bring your
            vision to life with innovative solutions.
          </p>
        </motion.div>
        
        <div className="grid min-w-0 gap-8 lg:grid-cols-3 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="min-w-0 lg:col-span-2"
          >
            <div className="rounded-lg bg-darkcard/50 p-4 backdrop-blur-sm sm:p-6">
              <ContactForm />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="min-w-0 space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <Phone className="h-5 w-5 text-neon" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-lg font-semibold">Phone</h3>
                <p className="break-words text-white/70">0381448741 / 0332658918</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <Mail className="h-5 w-5 text-neon" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-lg font-semibold">Email</h3>
                <p className="break-all text-white/70">tsinjonantosoa@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <MapPin className="h-5 w-5 text-neon" />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 text-lg font-semibold">Location</h3>
                <p className="text-white/70">
                  Antananarivo, Madagascar — Open to Remote
                </p>
              </div>
            </div>
            
            <div className="mt-10 min-w-0 rounded-lg bg-darkcard/50 p-4 backdrop-blur-sm sm:p-6">
              <h3 className="mb-3 text-lg font-semibold">Availability</h3>
              <p className="text-white/70">
                Open to remote AI engineering roles, AI automation projects, RAG systems,
                agentic applications, and selected freelance engagements.
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
