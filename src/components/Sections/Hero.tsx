import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import ProfileImage from "../UI/ProfileImage";
import { ABOUT, CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const socials = [
  { href: GITHUB_URL, label: "GitHub", icon: Github },
  { href: LINKEDIN_URL, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${EMAIL}`, label: "Email", icon: Mail },
];

const metrics = [
  {
    value: "3",
    label: "Production AI Assistants",
    hint: "Deployed for real organizations",
  },
  {
    value: "97/98",
    label: "Automated Checks Passed",
    hint: "Quality and security validation",
  },
  {
    value: "20",
    label: "Automation Workflows",
    hint: "Business operations automated",
  },
];

const aboutMeta = [
  { label: "Build", value: "End-to-end AI products" },
  { label: "Prioritize", value: "Reliability, safety & clarity" },
  { label: "Deliver", value: "Tested, deployable systems" },
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pb-0 pt-20 sm:pt-24">
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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neon sm:text-xs"
            >
              AI Engineer — RAG · Agents · Automation
            </motion.p>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="mb-4 max-w-[720px] text-balance font-sans text-[clamp(2.5rem,5vw,4.8rem)] font-semibold leading-[1.03] tracking-tight text-[var(--text-primary)]"
            >
              I build production-ready AI systems.
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="mb-4 font-mono text-sm text-[var(--text-muted)] sm:text-[15px]"
            >
              Sandaniaina Tsinjo Nantosoa
            </motion.p>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mb-2 max-w-[650px] text-[16.5px] leading-relaxed text-[var(--text-secondary)] sm:text-[17.5px]"
            >
              I design RAG platforms, governed AI agents, and business automation with Python,
              FastAPI, LangGraph, Qdrant, PostgreSQL, and n8n.
            </motion.p>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="mb-6 text-sm text-[var(--text-muted)]"
            >
              Based in Madagascar · Open to Remote Opportunities
            </motion.p>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-5 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="btn-neon gap-2 px-6"
              >
                View Selected Work
                <ArrowDown size={16} />
              </a>
              <a
                href="#contact"
                className="btn-outline px-6"
              >
                Let&apos;s Talk
              </a>
              <a
                href={CV_PATH}
                download
                className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-[var(--text-muted)] transition hover:text-white"
              >
                <Download size={15} />
                Download CV
              </a>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
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

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:col-span-5 lg:mx-0 lg:max-w-[340px] lg:justify-self-end"
          >
            <ProfileImage className="aspect-square w-full" />
          </motion.div>
        </div>

        <div className="border-y border-white/10 py-5 sm:py-6">
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

        <div className="section-tight border-b border-white/10">
          <div className="layout-grid items-start gap-y-6">
            <div className="col-span-12 lg:col-span-8">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-neon">
                About
              </p>
              <h2 className="mb-3 max-w-[620px] text-[clamp(1.45rem,2.2vw,1.85rem)] font-semibold leading-snug text-[var(--text-primary)]">
                {ABOUT.headline}
              </h2>
              <div className="max-w-[700px] space-y-3">
                {ABOUT.paragraphs.map((paragraph) => (
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
