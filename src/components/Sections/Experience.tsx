import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { experienceItems } from "@/data/experience";

const Experience: React.FC = () => {
  return (
    <section id="experience" className="section-block scroll-mt-24">
      <div className="site-container">
        <div className="layout-grid">
          <div className="col-span-12 lg:col-span-3">
            <SectionHeader
              eyebrow="Experience"
              title="Professional Experience"
              description="Production AI systems, automation, and backend reliability."
              className="mb-6 lg:mb-0"
            />
          </div>

          <div className="col-span-12 space-y-0 lg:col-span-9">
            {experienceItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="layout-grid border-t border-white/10 py-6 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                  <p className="font-mono text-xs text-neon">{item.period}</p>
                </div>

                <div className="col-span-12 sm:col-span-9 lg:col-span-7">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {item.plainSummary}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {item.highlights.slice(0, 3).map((highlight) => (
                      <li
                        key={highlight}
                        className="text-[13.5px] leading-relaxed text-white/70"
                      >
                        <span className="mr-2 text-neon">▹</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-12 mt-3 space-y-3 lg:col-span-3 lg:mt-0">
                  {item.proof && item.proof.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 lg:flex-col">
                      {item.proof.map((proof) => (
                        <li
                          key={proof.label}
                          className="font-mono text-[11.5px] text-neon"
                        >
                          {proof.value} {proof.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.stack && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.stack.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10.5px] text-white/55"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
