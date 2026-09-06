import React from "react";
import { motion } from "framer-motion";
import { Network, Database, Workflow } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { expertisePillars } from "@/data/experience";

const icons = [Network, Database, Workflow];

const Services: React.FC = () => {
  return (
<<<<<<< HEAD
    <section id="expertise" className="section-block scroll-mt-24">
      <div className="site-container">
        <SectionHeader
          eyebrow="Expertise"
          title="How I build AI systems"
          description="Three engineering pillars focused on agents, retrieval, and reliable automation backends."
        />
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
            My <span className="text-neon">Expertise</span>
          </h2>
          <p className="text-white/70">
            AI Engineer & AI Automation Engineer building agentic AI systems,
            production RAG, FastAPI backends, and reliable n8n automations—end-to-end.
          </p>
        </motion.div>
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {expertisePillars.map((pillar, index) => {
            const Icon = icons[index] || Network;
            return (
              <motion.article
                key={pillar.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="border-t border-white/10 pt-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono text-sm text-neon">{pillar.number}</p>
                  <Icon className="h-4 w-4 text-neon/70" aria-hidden />
                </div>
                <h3 className="mb-3 text-xl font-semibold leading-snug text-[var(--text-primary)]">
                  {pillar.title}
                </h3>
                <p className="mb-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {pillar.plainDescription}
                </p>
                <p className="font-mono text-[12px] leading-relaxed text-[var(--text-muted)]">
                  {pillar.technicalDetail}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
