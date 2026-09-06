import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[var(--bg-primary)] py-8">
      <div className="site-container flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Sandaniaina Tsinjo Nantosoa
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
            AI Engineer — RAG · Agents · Automation
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Github size={16} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Mail size={16} />
          </a>
        </div>
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Sandaniaina Tsinjo Nantosoa
        </p>
      </div>
    </footer>
  );
};

export default Footer;
