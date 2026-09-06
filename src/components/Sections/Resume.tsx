import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import SectionHeader from "@/components/ui-kit/SectionHeader";
import {
  allCertifications,
  CV_PATH,
  educationItems,
  experienceItems,
  featuredCertifications,
  languages,
  skillGroups,
} from "@/data/experience";

const Resume: React.FC = () => {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const certs = showAllCerts ? allCertifications : featuredCertifications;

  return (
    <>
      <section id="experience" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="Experience"
            title="Professional Experience"
            description="Recent work focused on conversational AI, RAG platforms, and reliable automation systems."
          />

          <div className="relative space-y-0 border-l border-white/10 pl-6 sm:pl-8">
            {experienceItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={`relative pb-10 last:pb-0 ${item.isPrimary ? "" : ""}`}
              >
                <span
                  className={`absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 sm:-left-[2.4rem] ${
                    item.isPrimary
                      ? "border-neon bg-neon/30"
                      : "border-white/30 bg-[var(--bg-primary)]"
                  }`}
                  aria-hidden
                />
                <p className="font-mono text-[12px] text-neon">{item.period}</p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
                  {item.company}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {item.title}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {item.plainSummary}
                </p>
                {item.proof && (
                  <p className="mt-3 font-mono text-[12.5px] text-neon/90">
                    {item.proof.map((p) => `${p.value} ${p.label}`).join(" · ")}
                  </p>
                )}
                {item.technicalSummary && (
                  <p className="mt-2 font-mono text-[12px] text-[var(--text-muted)]">
                    Technical: {item.technicalSummary}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-block scroll-mt-24">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="About"
                title="Engineer who turns LLM prototypes into reliable systems"
              />
              <div className="-mt-4 max-w-[680px] space-y-4 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">
                <p>
                  I&apos;m an AI Engineer focused on turning promising AI prototypes into systems
                  that businesses can actually use reliably.
                </p>
                <p>
                  My work covers RAG, AI agents, automation, and FastAPI backends, with a strong
                  focus on data quality, security, testing, and deployment.
                </p>
                <p>
                  I hold a Master&apos;s degree in Applied Mathematics, Computer Science and
                  Statistics and I&apos;m based in Madagascar, working with remote and international
                  teams.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#experience"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition hover:border-neon/40 hover:text-neon"
                >
                  <FileText size={16} />
                  View Resume
                </a>
                <a
                  href={CV_PATH}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neon/90"
                >
                  <Download size={16} />
                  Download CV
                </a>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Education
                </h3>
                <div className="space-y-5 border-t border-white/10 pt-5">
                  {educationItems.map((edu) => (
                    <div key={edu.title}>
                      <p className="font-mono text-[12px] text-neon">{edu.period}</p>
                      <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                        {edu.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Languages
                </h3>
                <ul className="space-y-2 border-t border-white/10 pt-5">
                  {languages.map((lang) => (
                    <li
                      key={lang.name}
                      className="flex items-center justify-between text-sm text-[var(--text-secondary)]"
                    >
                      <span>{lang.name}</span>
                      <span className="font-mono text-[12px] text-[var(--text-muted)]">
                        {lang.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-block scroll-mt-24">
        <div className="site-container">
          <SectionHeader
            eyebrow="Skills"
            title="Tooling & engineering stack"
            description="Focused on the stack used to ship RAG systems, agents, and automation backends."
          />
          <div className="grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neon">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.skills.map((skill) => (
                    <li key={skill} className="text-sm text-[var(--text-secondary)]">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications" className="section-block scroll-mt-24">
        <div className="site-container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Credentials"
              title="Selected credentials"
              className="mb-0"
            />
            <button
              type="button"
              onClick={() => setShowAllCerts((prev) => !prev)}
              className="min-h-11 text-sm text-neon hover:underline"
            >
              {showAllCerts ? "Show featured only" : "View all certifications →"}
            </button>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {certs.map((cert) => (
              <div
                key={cert.title + cert.imageUrl}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{cert.title}</p>
                  <p className="mt-1 font-mono text-[12px] text-[var(--text-muted)]">
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </p>
                </div>
                <a
                  href={cert.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neon hover:underline"
                >
                  View credential →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Resume;
