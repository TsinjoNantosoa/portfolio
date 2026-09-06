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
        <div className="layout-grid items-start">
          <div className="col-span-12 mb-2 lg:col-span-4 lg:mb-0 lg:pr-4">
            <SectionHeader
              eyebrow="Expertise"
              title="How I build AI systems"
              className="mb-4 md:mb-5"
            />
            <p className="max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
              I care about the layers around the model: data, authorization, reliability, testing
              and deployment.
            </p>
          </div>

          <div className="col-span-12 grid gap-6 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
            {expertisePillars.map((pillar, index) => {
              const Icon = icons[index] || Network;
              return (
                <motion.article
                  key={pillar.number}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="border-t border-white/10 pt-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-sm text-neon">{pillar.number}</p>
                    <Icon className="h-4 w-4 text-neon/70" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>
                  <p className="mb-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
                    {pillar.plainDescription}
                  </p>
                  <p className="font-mono text-[11.5px] leading-relaxed text-[var(--text-muted)]">
                    {pillar.technicalDetail}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
