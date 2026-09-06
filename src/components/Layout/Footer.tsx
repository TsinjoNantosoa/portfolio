import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/experience";

const Footer = () => {
  return (
<<<<<<< HEAD
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
=======
    <footer className="border-t border-white/10 bg-darkbg py-8">
      <div className="container mx-auto px-4 text-center text-white/50 md:px-6 lg:px-8">
        <p className="break-words">
          &copy; {new Date().getFullYear()} Sandaniaina Tsinjo Nantosoa. All rights reserved.
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
        </p>
      </div>
    </footer>
  );
};

export default Footer;
