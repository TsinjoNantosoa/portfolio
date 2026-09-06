import React from "react";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/UI/ContactForm";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="section-block scroll-mt-24 bg-[radial-gradient(ellipse_at_top,rgba(13,255,163,0.04),transparent_45%)]"
    >
      <div className="site-container">
        <div className="layout-grid items-start">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeader
              eyebrow="Contact"
              title="Building an AI product, RAG system or automation workflow?"
              description="Let's discuss how to turn it into a reliable production-ready system."
              className="mb-6"
            />

            <div className="space-y-4 border-t border-white/10 pt-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                <div>
                  <p className="text-xs text-white/45">Email</p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-[15px] text-[var(--text-primary)] hover:text-neon"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                <div>
                  <p className="text-xs text-white/45">Location</p>
                  <p className="text-[15px] text-[var(--text-primary)]">
                    Madagascar · Open to remote
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
                >
                  <Github size={16} />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
