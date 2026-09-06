import React from "react";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import ContactForm from "../UI/ContactForm";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Contact: React.FC = () => {
  return (
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
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
