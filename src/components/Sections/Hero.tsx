import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, Facebook } from "lucide-react";
import CounterItem from "../UI/CounterItem";
import ProfileImage from "../UI/ProfileImage";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(13,255,163,0.08)_0,rgba(0,0,0,0)_60%)]"></div>

      <div className="container mx-auto px-4 pb-16 pt-12 md:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 font-mono text-lg text-white/70"
            >
              AI Engineer & AI Automation Engineer
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-5xl font-bold leading-tight sm:text-6xl"
            >
              Hello I'm<br />
              <span className="text-neon">SANDANIAINA Tsinjo Nantosoa</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 max-w-xl text-lg text-white/70"
            >
              Agentic AI · Production RAG · Python/FastAPI · n8n Automation
            </motion.div>

            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 text-white/70"
            >
              Located at: Lot 122BIS Ambohimahintsy – Ambohimangakely
            </motion.p> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-10 flex flex-wrap items-center gap-4"
            >
<div className="flex gap-4">
  {/* Ouvrir dans navigateur */}
  <a
    href="/CV/CV_Tsinjo_Nantosoa.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-lg bg-neon px-6 py-3 font-semibold text-black transition hover:bg-neon/80"
  >
    <Download size={16} />
    VIEW CV
  </a>

  {/* Télécharger directement */}
  <a
    href="/CV/CV_Tsinjo_Nantosoa.pdf"
    download
    className="inline-flex items-center gap-2 rounded-lg border border-neon px-6 py-3 font-semibold text-neon transition hover:bg-neon/20"
  >
    <Download size={16} />
    DOWNLOAD
  </a>
</div>




              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/TsinjoNantosoa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-darkcard transition-all duration-300 hover:border-neon hover:text-neon"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/sandaniaina-tsinjo-nantosoa-b6209a330/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-darkcard transition-all duration-300 hover:border-neon hover:text-neon"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://web.facebook.com/sandaniaina.tsinjo.nantosoa.2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-darkcard transition-all duration-300 hover:border-neon hover:text-neon"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.datacamp.com/portfolio/sandaniainatsinjonantosoa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-darkcard transition-all duration-300 hover:border-neon hover:text-neon text-sm"
                  aria-label="DataCamp Portfolio"
                >
                  DC
                </a>
                <a
                  href="mailto:tsinjonantosoa@gmail.com"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-darkcard transition-all duration-300 hover:border-neon hover:text-neon"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 mx-auto max-w-md lg:order-2"
          >
            <ProfileImage className="aspect-square w-full max-w-md" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-3"
        >
          <CounterItem value={3} label="Production AI Assistants" delay={0} />
          <CounterItem value={97} label="Quality Validation Checks" suffix="/98" delay={1} />
          <CounterItem value={2} label="Live AI Products" delay={2} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
