import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, Facebook } from "lucide-react";
import CounterItem from "../UI/CounterItem";
import ProfileImage from "../UI/ProfileImage";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(13,255,163,0.08)_0,rgba(0,0,0,0)_60%)]"></div>

      <div className="container mx-auto px-4 pb-12 pt-8 sm:pb-16 sm:pt-12 md:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="order-2 min-w-0 text-center lg:order-1 lg:text-left">
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
              className="mb-6 break-words text-[clamp(1.75rem,9vw,3rem)] font-bold leading-[1.15] sm:text-6xl sm:leading-tight"
            >
              Hello I'm<br />
              <span className="text-neon">SANDANIAINA Tsinjo Nantosoa</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-8 max-w-xl break-words text-base text-white/70 sm:text-lg lg:mx-0"
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
              className="mb-10 flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:flex-wrap lg:justify-start"
            >
<div className="flex w-full flex-col gap-3 min-[380px]:flex-row sm:w-auto sm:gap-4">
  {/* Ouvrir dans navigateur */}
  <a
    href="/CV/CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-neon px-4 py-3 font-semibold text-black transition hover:bg-neon/80 sm:w-auto sm:px-6"
  >
    <Download size={16} />
    VIEW CV
  </a>

  {/* Download */}
  <a
    href="/CV/CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf"
    download="CV_AIEngineer_AgentProduct_Sandaniaina_Tsinjo.pdf"
    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-neon px-4 py-3 font-semibold text-neon transition hover:bg-neon/20 sm:w-auto sm:px-6"
  >
    <Download size={16} />
    DOWNLOAD
  </a>
</div>




              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
            className="order-1 mx-auto w-full max-w-[18rem] sm:max-w-md lg:order-2"
          >
            <ProfileImage className="aspect-square w-full max-w-md" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 gap-6 min-[360px]:grid-cols-2 sm:mt-20 sm:grid-cols-3 sm:gap-8"
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
