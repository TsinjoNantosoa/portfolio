import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import {
  allCertifications,
  educationItems,
  featuredCertifications,
  languages,
  skillGroups,
} from "@/data/experience";
import { useI18n } from "@/i18n/I18nProvider";
import { localizePortfolioText } from "@/i18n/portfolioContent";

const Background: React.FC = () => {
  const { language, t } = useI18n();
  const [showAllCerts, setShowAllCerts] = useState(false);
  const visibleCerts = showAllCerts ? allCertifications : featuredCertifications;

  return (
    <section id="background" className="section-block scroll-mt-24 bg-[var(--bg-secondary)]/35">
      <div className="site-container">
        <SectionHeader
          eyebrow={t("nav.background")}
          title={t("background.title")}
          description={t("background.description")}
          className="mb-8 md:mb-10"
        />

        <div className="layout-grid">
          <div className="surface-card col-span-12 p-5 sm:p-6 lg:col-span-7">
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-neon">
              {t("background.stack")}
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title} className="border-t border-white/10 pt-4">
                  <h4 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
                    {group.title}
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="tech-tag"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card col-span-12 p-5 sm:p-6 lg:col-span-5">
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-neon">
              {t("background.education")}
            </h3>
            <ul className="space-y-5">
              {educationItems.map((edu) => (
                <li
                  key={`${edu.title}-${edu.period || edu.detail}`}
                  className="border-t border-white/10 pt-4"
                >
                  {edu.period ? (
                    <p className="mb-1.5 font-mono text-xs text-neon">{edu.period}</p>
                  ) : null}
                  <p className="text-[15px] font-medium text-[var(--text-primary)]">{localizePortfolioText(edu.title, language)}</p>
                  {edu.detail && (
                    <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
                      {localizePortfolioText(edu.detail, language)}
                    </p>
                  )}
                  <p className="mt-1.5 text-sm text-white/50">{edu.institution}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-4">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-neon">
                {t("background.languages")}
              </h3>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-baseline justify-between gap-4 text-[14.5px]"
                  >
                    <span className="text-[var(--text-primary)]">{lang.name}</span>
                    <span className="font-mono text-[12.5px] text-white/50">
                      {language === "fr"
                        ? lang.level === "Native" ? "Langue maternelle" : "Professionnel"
                        : lang.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-12 mt-2 border-t border-white/10 pt-8">
            <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-neon">
              {t("background.credentials")}
            </h3>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
              {visibleCerts.map((cert) => (
                <li
                  key={`${cert.title}-${cert.issuer}`}
                  className="flex items-center justify-between gap-4 border-t border-white/10 py-3.5"
                >
                  <div>
                    <p className="text-[14.5px] font-medium text-[var(--text-primary)]">
                      {cert.title}
                    </p>
                    <p className="mt-0.5 text-[14px] text-white/55">
                      {cert.issuer}
                      {cert.year ? ` · ${cert.year}` : ""}
                    </p>
                  </div>
                  <a
                    href={cert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 shrink-0 items-center gap-1 text-sm text-neon hover:underline"
                  >
                    {t("background.view")}
                    <ExternalLink size={13} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            {!showAllCerts &&
              allCertifications.length > featuredCertifications.length && (
                <button
                  type="button"
                  onClick={() => setShowAllCerts(true)}
                  className="mt-4 text-sm text-neon hover:underline"
                >
                  {t("background.viewAll")}
                </button>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Background;
