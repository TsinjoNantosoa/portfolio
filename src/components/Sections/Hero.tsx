import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import ProfileImage from "../UI/ProfileImage";
import MetricCard from "@/components/ui-kit/MetricCard";
import { CV_PATH, EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const socials = [
  { href: GITHUB_URL, label: "GitHub", icon: Github },
  { href: LINKEDIN_URL, label: "LinkedIn", icon: Linkedin },
  { href: `mailto:${EMAIL}`, label: "Email", icon: Mail },
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pb-10 pt-24 sm:pb-14 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,247,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,248,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(13,255,163,0.06),transparent_35%)]" />

      <div className="site-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neon sm:text-xs"
            >
              AI Engineer — RAG · Agents · Automation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-3 max-w-3xl text-balance font-sans text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)]"
            >
              I build production-ready AI systems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-5 font-mono text-sm text-[var(--text-muted)] sm:text-base"
            >
              Sandaniaina Tsinjo Nantosoa
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mb-3 max-w-[680px] text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-[18px]"
            >
              I design knowledge assistants, controlled AI agents, and business automation with
              Python, FastAPI, LangGraph, Qdrant, PostgreSQL, and n8n.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mb-8 text-sm text-[var(--text-muted)]"
            >
              Based in Madagascar · Open to Remote Opportunities
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-black transition hover:bg-neon/90"
              >
                View Selected Work
                <ArrowDown size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-neon/50 hover:text-neon"
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
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  title={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-neon hover:text-neon"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto w-full max-w-sm"
          >
            <ProfileImage className="aspect-square w-full" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 grid grid-cols-1 gap-3 border-t border-white/10 pt-8 sm:grid-cols-3 sm:gap-4"
        >
          <MetricCard
            value="3"
            label="Production AI Assistants"
            hint="Deployed for real organizations"
          />
          <MetricCard
            value="97/98"
            label="Quality & Security Checks"
            hint="Validated before production"
          />
          <MetricCard
            value="20"
            label="Automation Workflows"
            hint="Business operations automated"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
