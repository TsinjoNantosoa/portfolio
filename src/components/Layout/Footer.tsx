import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[var(--bg-primary)] py-10">
      <div className="site-container flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <p className="font-medium text-[var(--text-primary)]">Sandaniaina Tsinjo Nantosoa</p>
          <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
            AI Engineer — RAG · Agents · Automation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Github size={18} />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Linkedin size={18} />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            aria-label="Email"
            title="Email"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/65 hover:border-neon hover:text-neon"
          >
            <Mail size={18} />
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
