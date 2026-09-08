import React from "react";
import { motion } from "framer-motion";
import { Network, Database, Workflow } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import { expertisePillars } from "@/data/experience";
import { useI18n } from "@/i18n/I18nProvider";

const icons = [Network, Database, Workflow];

const Services: React.FC = () => {
  const { t } = useI18n();
  const localizedPillars = [
    { title: t("expertise.agentTitle"), description: t("expertise.agentDescription") },
    { title: t("expertise.ragTitle"), description: t("expertise.ragDescription") },
    { title: t("expertise.backendTitle"), description: t("expertise.backendDescription") },
  ];
  return (
    <section id="expertise" className="section-block scroll-mt-24">
      <div className="site-container">
        <div className="layout-grid items-start">
          <div className="col-span-12 mb-2 lg:col-span-4 lg:mb-0 lg:pr-4">
            <SectionHeader
              eyebrow={t("nav.expertise")}
              title={t("expertise.title")}
              className="mb-4 md:mb-5"
            />
            <p className="max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {t("expertise.description")}
            </p>
          </div>

          <div className="col-span-12 grid auto-rows-fr gap-4 sm:grid-cols-3 lg:col-span-8">
            {expertisePillars.map((pillar, index) => {
              const Icon = icons[index] || Network;
              return (
                <motion.article
                  key={pillar.number}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="surface-card h-full p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-sm text-neon">{pillar.number}</p>
                    <Icon className="h-4 w-4 text-neon/70" aria-hidden />
                  </div>
                  <h3 className="mb-2.5 text-lg font-semibold leading-snug text-[var(--text-primary)]">
                    {localizedPillars[index]?.title || pillar.title}
                  </h3>
                  <p className="mb-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {localizedPillars[index]?.description || pillar.plainDescription}
                  </p>
                  <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
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
