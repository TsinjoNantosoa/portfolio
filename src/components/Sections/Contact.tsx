import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/UI/ContactForm";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { EMAIL } from "@/data/experience";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="section-block scroll-mt-24">
      <div className="site-container">
        <SectionHeader
          eyebrow="Contact"
          title="Let's talk about your AI system"
          description="Tell me what you're building — agents, RAG, automation, or AI backends. I'll reply with a clear engineering take."
        />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-neon" aria-hidden />
              <div>
                <p className="text-sm text-white/50">Email</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-[15px] text-[var(--text-primary)] hover:text-neon"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neon" aria-hidden />
              <div>
                <p className="text-sm text-white/50">Location</p>
                <p className="text-[15px] text-[var(--text-primary)]">
                  Madagascar · Open to remote
                </p>
              </div>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-[var(--text-muted)]">
              Prefer email? Use the form or write directly — both work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
