import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import ProfileImage from "../UI/ProfileImage";
import { CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";
import { useI18n } from "@/i18n/I18nProvider";

const socials = [
  { href: GITHUB_URL, label: "GitHub", icon: Github },
  { href: LINKEDIN_URL, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${EMAIL}`, label: "Email", icon: Mail },
];

const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const portraitEntranceDelay = 0.24;

const Hero: React.FC = () => {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const fromHidden = reduceMotion ? false : { opacity: 0, y: 14 };
  const toVisible = { opacity: 1, y: 0 };
  const fade = (delay: number, duration = 0.48) => ({
    initial: fromHidden,
    animate: toVisible,
    transition: reduceMotion
      ? { duration: 0.01 }
      : { duration, delay, ease: HERO_EASE },
  });
  const metrics = [
    { value: "Multi-tenant", label: t("metrics.assistants"), hint: t("metrics.assistantsHint") },
    { value: "RAG + Agent", label: t("metrics.checks"), hint: t("metrics.checksHint") },
    { value: "End-to-end", label: t("metrics.workflows"), hint: t("metrics.workflowsHint") },
  ];
  const aboutMeta = [
    { label: t("hero.build"), value: t("hero.buildValue") },
    { label: t("hero.prioritize"), value: t("hero.prioritizeValue") },
    { label: t("hero.deliver"), value: t("hero.deliverValue") },
  ];
  const aboutParagraphs = [t("hero.aboutOne"), t("hero.aboutTwo")];

  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden pb-0 pt-20 sm:pt-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,247,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,248,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="site-container">
        <div className="layout-grid items-center py-8 sm:py-10 lg:py-12">
          <div className="col-span-12 lg:col-span-7">
            <motion.p
              {...fade(0, 0.42)}
              className="mb-3 max-w-full break-words font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-neon sm:text-xs sm:tracking-[0.2em]"
            >
              {t("hero.eyebrow")}
            </motion.p>

            <motion.h1
              {...fade(0.08, 0.52)}
              className="mb-4 max-w-[760px] break-words text-balance font-sans text-[2.15rem] font-semibold leading-[1.08] tracking-normal text-[var(--text-primary)] sm:text-5xl lg:text-[4rem]"
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              {...fade(0.14, 0.46)}
              className="mb-4 font-mono text-sm text-[var(--text-muted)] sm:text-[15px]"
            >
              Sandaniaina Tsinjo Nantosoa
            </motion.p>

            <motion.p
              {...fade(0.2, 0.46)}
              className="mb-2 w-full max-w-[min(100%,340px)] break-words text-[16.5px] leading-relaxed text-[var(--text-secondary)] sm:max-w-[650px] sm:text-[17.5px]"
            >
              {t("hero.description")}
            </motion.p>

            <motion.p
              {...fade(0.26, 0.44)}
              className="mb-6 text-sm text-[var(--text-muted)]"
            >
              {t("hero.location")}
            </motion.p>

            <motion.div
              {...fade(0.32, 0.46)}
              className="mb-5 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projects"
                className="btn-neon gap-2 px-6"
              >
                {t("hero.work")}
                <ArrowDown size={16} />
              </a>
              <a
                href={CV_PATH}
                download
                className="btn-outline gap-2 px-6"
              >
                <Download size={15} />
                {t("hero.cv")}
              </a>
              <a
                href="#contact"
                className="btn-outline px-6"
              >
                {t("hero.contact")}
              </a>
            </motion.div>

            <motion.div
              {...fade(0.38, 0.44)}
              className="flex items-center gap-2.5"
            >
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  title={label}
                  className="icon-link"
                >
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>
          </div>

          <div className="col-span-12 mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:col-span-5 lg:mx-0 lg:max-w-[340px] lg:justify-self-end">
            <ProfileImage
              className="aspect-square w-full"
              entranceDelay={portraitEntranceDelay}
            />
          </div>
        </div>

        <div className="border-y border-white/10 py-5 sm:py-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {t("metrics.title")}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4 sm:rounded-none sm:border-y-0 sm:border-r-0 sm:bg-transparent sm:px-6 sm:py-1 first:sm:border-l-0 first:sm:pl-0">
                <p className="font-mono text-[clamp(1.6rem,2vw,2rem)] font-semibold leading-none text-neon">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{metric.label}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-[var(--text-muted)]">{metric.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="about" className="section-tight scroll-mt-24 border-b border-white/10">
          <div className="layout-grid items-start gap-y-6">
            <div className="col-span-12 lg:col-span-8">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neon">
                {t("hero.about")}
              </p>
              <h2 className="mb-3 max-w-[620px] text-[clamp(1.45rem,2.2vw,1.85rem)] font-semibold leading-snug text-[var(--text-primary)]">
                {t("hero.aboutTitle")}
              </h2>
              <div className="max-w-[700px] space-y-3">
                {aboutParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[15.5px] leading-relaxed text-[var(--text-secondary)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <aside
              className="col-span-12 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1"
              aria-label="Profile metadata"
            >
              {aboutMeta.map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[15px] text-[var(--text-primary)]">{item.value}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
