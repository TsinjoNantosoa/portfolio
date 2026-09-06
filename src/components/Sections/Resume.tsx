import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import {
  ABOUT,
  CV_PATH,
  allCertifications,
  educationItems,
  experienceItems,
  featuredCertifications,
  languages,
  skillGroups,
} from "@/data/experience";

const Resume: React.FC = () => {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const visibleCerts = showAllCerts ? allCertifications : featuredCertifications;

  return (
    <>
      <section id="experience" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="Experience"
            title="Professional Experience"
            description="Roles focused on production AI systems, automation, and backend reliability."
          />

          <div className="space-y-0 border-l border-white/10 pl-6">
            {experienceItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="relative pb-10 last:pb-0"
              >
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border border-neon/50 bg-[var(--bg-primary)]" />
                <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <span className="font-mono text-xs text-neon">{item.period}</span>
                </div>
                <p className="mb-2 text-sm text-white/55">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <p className="mb-3 max-w-3xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {item.plainSummary}
                </p>
                {item.technicalSummary && (
                  <p className="mb-4 font-mono text-[12px] text-[var(--text-muted)]">
                    {item.technicalSummary}
                  </p>
                )}
                {item.proof && item.proof.length > 0 && (
                  <ul className="mb-4 flex flex-wrap gap-2">
                    {item.proof.map((proof) => (
                      <li
                        key={proof.label}
                        className="rounded-full border border-neon/25 bg-neon/5 px-2.5 py-1 font-mono text-[11px] text-neon"
                      >
                        {proof.value} {proof.label}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mb-4 max-w-3xl space-y-2">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="text-[14px] leading-relaxed text-white/70"
                    >
                      <span className="mr-2 text-neon">▹</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                {item.stack && (
                  <div className="flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/55"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="About"
            title={ABOUT.headline}
            description="Background, education, and working languages."
          />

          <div className="mb-12 max-w-3xl space-y-4">
            {ABOUT.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[16px]"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#experience" className="btn-outline">
                View Experience
              </a>
              <a
                href={CV_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon inline-flex items-center gap-2"
              >
                <Download size={16} />
                Download CV
              </a>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neon">
                Education
              </h3>
              <ul className="space-y-5">
                {educationItems.map((edu) => (
                  <li key={`${edu.title}-${edu.period}`}>
                    {edu.period ? (
                      <p className="font-mono text-xs text-neon">{edu.period}</p>
                    ) : null}
                    <p className="mt-1 text-[15px] font-medium text-[var(--text-primary)]">
                      {edu.title}
                    </p>
                    <p className="text-sm text-white/55">{edu.institution}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-neon">
                Languages
              </h3>
              <ul className="space-y-3">
                {languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 text-[15px]"
                  >
                    <span className="text-[var(--text-primary)]">{lang.name}</span>
                    <span className="font-mono text-xs text-white/50">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="Skills"
            title="Engineering toolkit"
            description="Practical stack used to ship agents, RAG systems, and automation backends."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.title} className="border-t border-white/10 pt-5">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-neon">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.skills.map((skill) => (
                    <li key={skill} className="text-[15px] text-[var(--text-secondary)]">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="credentials" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="Credentials"
            title="Certifications"
            description="Selected credentials that support the AI, data, and cloud engineering work."
          />
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {visibleCerts.map((cert) => (
              <li
                key={`${cert.title}-${cert.issuer}`}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div>
                  <p className="text-[15px] font-medium text-[var(--text-primary)]">
                    {cert.title}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </p>
                </div>
                <a
                  href={cert.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neon hover:underline"
                >
                  View credential
                  <ExternalLink size={14} />
                </a>
              </li>
            ))}
          </ul>
          {!showAllCerts && allCertifications.length > featuredCertifications.length && (
            <button
              type="button"
              onClick={() => setShowAllCerts(true)}
              className="mt-6 text-sm text-neon hover:underline"
            >
              View all certifications →
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Resume;
