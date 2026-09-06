import React from "react";
import { motion } from "framer-motion";
import { Network, Database, Workflow } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { expertisePillars } from "@/data/experience";

const icons = [Network, Database, Workflow];

const Services: React.FC = () => {
  return (
    <section id="expertise" className="section-block scroll-mt-24">
      <div className="site-container">
        <SectionHeader
          eyebrow="Expertise"
          title="How I build AI systems"
          description="Three engineering pillars focused on agents, retrieval, and reliable automation backends."
        />

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
