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
    label: "Quality & Security Checks",
    hint: "Validated before production",
  },
  {
    value: "20",
    label: "Automation Workflows",
    hint: "Business operations automated",
  },
];

const aboutMeta = [
  { label: "Based in", value: "Madagascar" },
  { label: "Open to", value: "Remote Opportunities" },
  { label: "Focus", value: "RAG · Agents · Automation" },
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_28%,rgba(13,255,163,0.05),transparent_34%)]" />

      <div className="site-container">
        <div className="layout-grid items-center py-8 lg:py-10">
          <div className="col-span-12 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neon sm:text-xs"
            >
              AI Engineer — RAG · Agents · Automation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="mb-3 max-w-[760px] text-balance font-sans text-[clamp(3rem,5.5vw,5.2rem)] font-semibold leading-[1.02] tracking-tight text-[var(--text-primary)]"
            >
              I build production-ready AI systems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="mb-4 font-mono text-sm text-[var(--text-muted)] sm:text-[15px]"
            >
              Sandaniaina Tsinjo Nantosoa
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="mb-2 max-w-[680px] text-[16.5px] leading-relaxed text-[var(--text-secondary)] sm:text-[17.5px]"
            >
              I design RAG platforms, governed AI agents, and business automation with Python,
              FastAPI, LangGraph, Qdrant, PostgreSQL, and n8n.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="mb-6 text-sm text-[var(--text-muted)]"
            >
              Based in Madagascar · Open to Remote Opportunities
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-5 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-neon/90"
              >
                View Selected Work
                <ArrowDown size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition hover:border-neon/50 hover:text-neon"
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
              initial={{ opacity: 0, y: 12 }}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-neon hover:text-neon"
                >
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 mx-auto w-full max-w-[340px] lg:col-span-5 lg:mx-0 lg:justify-self-end"
          >
            <ProfileImage className="aspect-square w-full" />
          </motion.div>
        </div>

        <div className="border-y border-white/10 py-5 sm:py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="sm:border-l sm:border-white/10 sm:pl-6 first:sm:border-l-0 first:sm:pl-0">
                <p className="font-mono text-[clamp(1.6rem,2vw,2rem)] font-semibold leading-none text-neon">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{metric.label}</p>
                <p className="mt-1 text-[13px] text-[var(--text-muted)]">{metric.hint}</p>
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
              <div className="max-w-[680px] space-y-3">
                {ABOUT.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[15px] leading-relaxed text-[var(--text-secondary)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <aside
              className="col-span-12 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1"
              aria-label="Profile metadata"
            >
              {aboutMeta.map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[14.5px] text-[var(--text-primary)]">{item.value}</p>
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
