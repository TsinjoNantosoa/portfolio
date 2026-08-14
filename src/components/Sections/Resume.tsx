import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { FaJava, FaReact, FaPython } from "react-icons/fa";
import {
  SiCplusplus,
  SiTailwindcss,
  SiSpringboot,
  SiNestjs,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiJavascript,
  SiTensorflow,
  SiTableau,
  SiTypescript,
  SiApacheairflow,
  SiApachespark,
  SiDocker,
  SiKubernetes,
  SiSnowflake,
  SiDbeaver,
} from "react-icons/si";
import { SiApachekafka } from "react-icons/si";
import ExperienceCard from "../UI/ExperienceCard";

// === Skills ===
const skillIcons: { [key: string]: IconType } = {
  // Languages
  Python: FaPython,
  Java: FaJava,
  "C++": SiCplusplus,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,

  // Frontend & UI
  "React.js": FaReact,
  TailwindCSS: SiTailwindcss,

  // Backend
  "Spring Boot": SiSpringboot,
  NestJS: SiNestjs,

  // Databases
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Snowflake: SiSnowflake,

  // Big Data / Orchestration
  "Apache Spark": SiApachespark,
  "Apache Airflow": SiApacheairflow,
  "Apache Kafka": SiApachekafka,
  dbt: SiDbeaver, // placeholder since dbt has no official icon
  "AI Automation": SiApacheairflow,
  "n8n Workflows": SiApacheairflow,
  "AI Agents": SiTensorflow,
  "RAG Systems": SiTensorflow,
  "MCP Integration": SiDbeaver,
  "Human-in-the-Loop": SiDbeaver,
  "API Orchestration": SiPostgresql,
  "Prompt Engineering": SiTensorflow,

  // DevOps / Cloud
  Docker: SiDocker,
  Kubernetes: SiKubernetes,

  // Data Science & BI
  "Machine Learning": SiTensorflow,
  "Deep Learning": SiTensorflow,
  "Data Analysis": SiTableau,
  "Power BI": SiTableau,
};

// ✅ Tabs
type TabType =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "languages";

const tabs: TabType[] = [
  "profile",
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
];

interface ExperienceItem {
  period: string;
  title: string;
  company: string;
  isActive?: boolean;
  role?: string;
  summary?: string;
  pillars?: string[];
  missions?: string[];
  achievements?: string[];
  impact?: string[];
  stack?: string[];
  skills?: string[];
}

const Resume: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const experience: ExperienceItem[] = [
    {
      period: "2025–2026",
      title: "AI Automation Engineer — Agentic Workflow Systems",
      company: "Applied AI Systems | Independent & Project-based",
      role: "AI Automation Engineer (Agents, n8n, API Orchestration, MCP, HITL)",
      summary:
        "Conception de systèmes d'automatisation IA de bout en bout: agents mono/multi-agents, workflows n8n robustes, pipelines API et intégration frontend/backend.",
      pillars: [
        "Automatisation orientée workflows (triggers, webhooks, parsing JSON, tables, fichiers binaires)",
        "Systèmes agentiques fiables avec garde-fous, supervision humaine et stratégies d'évaluation",
      ],
      missions: [
        "Construire des workflows IA complets: RAG chatbot, support client, génération de contenu, traitement de factures",
        "Intégrer des APIs externes (LLM, scraping, image/video generation, recherche) avec gestion des credentials",
        "Concevoir des architectures multi-agents et patterns de coordination selon les cas d'usage",
        "Mettre en place Human-in-the-Loop, parsing de sortie, error workflows et stratégies de debug",
        "Déployer des architectures self-hosted avec webhooks, base PostgreSQL/Supabase et composants frontend",
        "Structurer la conformité: sécurité, bonnes pratiques data, gouvernance des prompts et traçabilité",
      ],
      achievements: [
        "Maîtrise opérationnelle des patterns d'automatisation IA: déclenchement, orchestration, fallback et reprise",
        "Capacité à livrer rapidement des automatisations business-ready avec instrumentation et documentation",
        "Standardisation de playbooks techniques réutilisables pour accélérer la création de nouveaux workflows",
      ],
      impact: [
        "Réduction du temps de prototypage d'agents et workflows grâce à des templates robustes",
        "Amélioration de la fiabilité en production via gestion d'erreurs et validations de sortie systématiques",
        "Meilleure adoption métier via interfaces claires, supervision humaine et flux explicables",
      ],
      stack: [
        "n8n",
        "AI Agents",
        "RAG",
        "MCP",
        "Webhooks",
        "PostgreSQL",
        "Supabase",
        "HTTP APIs",
        "Output Parsing",
        "Human-in-the-Loop",
        "Error Workflows",
        "Frontend Integration",
      ],
      skills: [
        "Automatisation IA orientée ROI et besoins métier",
        "Conception de systèmes multi-agents robustes",
        "Fiabilisation de workflows (erreurs, retry, monitoring, validation)",
        "Intégration API & data pipelines à grande échelle",
      ],
      isActive: true,
    },
    {
      period: "Janvier 2026 – Mars 2026",
      title: "Expérience Projet — Humans4Help Madagascar",
      company: "Humans4Help Madagascar | Antananarivo, Madagascar",
      role: "Développeur IA / Full-Stack (RAG, API, Data Extraction, Déploiement)",
      summary:
        "Conception et évolution d'une plateforme conversationnelle orientée carrière et information institutionnelle, basée sur une architecture RAG (Retrieval-Augmented Generation).",
      pillars: [
        "Pipeline d'extraction et structuration de contenus web (JSON/CSV)",
        "Agent conversationnel FastAPI connecté à une base vectorielle FAISS",
      ],
      missions: [
        "Concevoir un pipeline d'extraction web: scraping, nettoyage, structuration, préparation des corpus textuels",
        "Mettre en place un backend IA FastAPI + LangChain + OpenAI + FAISS pour des réponses contextualisées et sourcées",
        "Développer la logique conversationnelle métier: normalisation des requêtes, mémoire utilisateur, règles HTML, multilingue FR/EN",
        "Améliorer la robustesse produit: fallback intelligents, FAQ déterministes, rate limiting, cache de réponses, logs applicatifs",
        "Industrialiser le déploiement avec Docker/docker-compose et documenter la mise en production (Plesk/Nginx)",
        "Contribuer au chantier Figma-to-Code: authentification, reset password, scripts WSL/Windows et stabilisation dev",
      ],
      achievements: [
        "Architecture modulaire Extraction → Vectorisation → API Chatbot avec rechargement automatique du retriever",
        "Implémentation de réponses RAG avec citations de sources officielles et contraintes métiers strictes",
        "Mémoire conversationnelle avec purge automatique après inactivité",
        "Handlers FAQ ciblés réduisant les erreurs fonctionnelles sur les questions critiques",
        "Renforcement sécurité/RGPD: refus des demandes sensibles, encadrement des prompts, bonnes pratiques de gestion des données",
        "Scripts de démarrage/restart (WSL/PowerShell) facilitant onboarding et reproductibilité",
      ],
      impact: [
        "Amélioration de la qualité du chatbot d'environ +17 à +20 points selon les séries de tests",
        "Réduction des erreurs critiques jusqu'à 0% sur certains lots de tests complexes",
        "Baisse du temps moyen de réponse sur scénarios ciblés grâce aux logiques FAQ/cache",
        "Stabilité applicative renforcée: moins d'échecs d'itérations agent et meilleure continuité de service",
        "Documentation technique complète: architecture, exploitation, troubleshooting, déploiement",
      ],
      stack: [
        "Python",
        "FastAPI",
        "LangChain",
        "OpenAI API",
        "FAISS",
        "Pydantic",
        "BeautifulSoup",
        "Selenium",
        "NLTK",
        "Docker",
        "docker-compose",
        "Nginx/Plesk",
        "Uvicorn",
        "PowerShell",
        "WSL",
        "SQLite",
        "Angular",
      ],
      skills: [
        "Conception de systèmes IA appliqués (RAG) orientés besoins métier",
        "Structuration de données web et préparation de corpus pour recherche sémantique",
        "Développement backend API robuste, testable et déployable",
        "Résolution de problèmes production: performance, fiabilité, sécurité, conformité",
        "Documentation, transfert de connaissances et amélioration continue via retours REX",
      ],
      isActive: false,
    },
    {
      period: "2024–2025",
      title: "IoT Data Pipeline with Kafka-Spark and AWS S3",
      company: "Academic Project",
      isActive: false,
    },
    {
      period: "2024",
      title: "ETL Pipeline with Orchestration (Airflow/PostgreSQL)",
      company: "Academic Project",
      isActive: false,
    },
    {
      period: "2024",
      title: "Weather ETL using Airflow TaskFlow API",
      company: "Academic Project",
      isActive: false,
    },
    {
      period: "2023–2024",
      title: "Machine Learning Projects (Classification & Regression)",
      company: "Academic & DataCamp",
      isActive: false,
    },
  ];

  const education = [
    {
      period: "2024–2025",
      title: "Master’s Degree in Computer Science (MISA)",
      company: "University of Antananarivo",
      isActive: true,
    },
    {
      period: "2023–2024",
      title: "Bachelor’s Degree in Computer Science (MISA)",
      company: "University of Antananarivo",
      isActive: false,
    },
    {
      period: "2024",
      title: "Cloud & Data Flow Training (Certified)",
      company: "Etech",
      isActive: false,
    },
    {
      period: "2021",
      title: "Office Suite (Word, Excel, PowerPoint)",
      company: "CFPM (Certified)",
      isActive: false,
    },
  ];

  const certifications = [
    { title: "Data Engineer Associate", img: "/certificate/data_engineer_associate.png" },
    { title: "Data Analyst Associate", img: "/certificate/data_analyst_associate.png" },
    { title: "Python Data Associate", img: "/certificate/python_data_associate.png" },
    { title: "SQL Associate", img: "/certificate/sql_associate.png" },
    { title: "AI Engineer for Developers Associate", img: "/certificate/Screenshot from 2025-10-01 11-42-08.png" },
    { title: "AWS Cloud Practitioner (CLF-C02)", img: "/certificate/aws_cloud_practitioner.png" },
    { title: "Data Engineer Career Track", img: "/certificate/data_engineer_track.png" },
    { title: "Data Analyst in Python", img: "/certificate/data_analyst_in_python.png" },
    { title: "Data Analyst in Power BI", img: "/certificate/data_analyst_power_bi.png" },
    { title: "Professional Data Engineer in Python", img: "/certificate/professional_data_engeener.png" },
    { title: "Data Engineer in Python", img: "/certificate/Data_engeener_in_python.png" },
    { title: "Power BI Fundamentals (Skill Track)", img: "/certificate/power_bi_fondamental.png" },
    { title: "Snowflake Data Engineer Associate", img: "/certificate/data_engeener_in_snowflake.png" },
  ];

  const languages = [
    { name: "Malagasy", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "English", level: "Professional" },
  ];

  const skills = Object.keys(skillIcons);

  const getTabTitle = (tab: TabType) => {
    if (tab === "profile") return "Profile";
    if (tab === "experience") return "Projects & Experience";
    if (tab === "education") return "Education";
    if (tab === "skills") return "Skills";
    if (tab === "certifications") return "Certifications";
    return "Languages";
  };

  const renderTabContent = (tab: TabType) => {
    if (tab === "profile") {
      return (
        <div className="min-w-0 break-words rounded-lg bg-darkcard p-4 text-white/70 sm:p-6">
          AI Engineer & AI Automation Engineer specializing in agentic AI
          systems, production-ready RAG architectures, and reliable n8n-driven
          automation. I build application automation (APIs/webhooks), retrieval
          pipelines, and operational reliability (error handling, monitoring,
          security, and Human-in-the-Loop). My goal: ship AI systems that are
          measurable, robust, and maintainable at scale.
        </div>
      );
    }

    if (tab === "experience") {
      return (
        <div className="min-w-0 space-y-4">
          {experience.map((item, index) => (
            <ExperienceCard
              key={index}
              period={item.period}
              title={item.title}
              company={item.company}
              isActive={item.isActive}
              index={index}
              role={item.role}
              summary={item.summary}
              pillars={item.pillars}
              missions={item.missions}
              achievements={item.achievements}
              impact={item.impact}
              stack={item.stack}
              skills={item.skills}
            />
          ))}
        </div>
      );
    }

    if (tab === "education") {
      return (
        <div className="min-w-0 space-y-4">
          {education.map((item, index) => (
            <ExperienceCard
              key={index}
              period={item.period}
              title={item.title}
              company={item.company}
              isActive={item.isActive}
              index={index}
            />
          ))}
        </div>
      );
    }

    if (tab === "skills") {
      return (
        <div className="relative flex min-w-0 flex-wrap gap-4">
          {skills.map((skill, index) => {
            const Icon = skillIcons[skill];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="relative flex flex-col items-center"
              >
                <div className="rounded-full bg-darkcard p-4 transition-all hover:bg-neon/20">
                  <Icon className="text-3xl text-white/80 hover:text-neon" />
                </div>
                {hoveredSkill === skill && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-12 z-10 max-w-[min(12rem,80vw)] break-words rounded-md bg-darkcard px-3 py-1 text-center text-sm text-white/80"
                  >
                    {skill}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (tab === "certifications") {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {certifications.map((cert, i) => (
            <div key={i} className="min-w-0 overflow-hidden rounded-lg bg-darkcard p-4">
              <img src={cert.img} alt={cert.title} className="h-auto w-full max-w-full rounded-lg object-contain" />
              <p className="mt-2 break-words text-center text-white/80">{cert.title}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="list-disc space-y-2 pl-6 text-white/70">
        {languages.map((lang, i) => (
          <li key={i}>
            {lang.name}: {lang.level}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8 lg:hidden">
          <h2 className="mb-6 text-3xl font-bold">
            My <span className="text-neon">Resume</span>
          </h2>
          <div className="space-y-3">
            {tabs.map((tab) => (
              <div key={tab}>
                <button
                  className={`w-full rounded-md px-4 py-3 text-left transition-all ${
                    activeTab === tab
                      ? "bg-neon text-black"
                      : "bg-darkcard text-white hover:bg-darkcard/80"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>

                {activeTab === tab && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 min-w-0 overflow-x-clip"
                  >
                    <h3 className="mb-6 break-words text-xl font-bold sm:text-2xl">{getTabTitle(tab)}</h3>
                    {renderTabContent(tab)}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-12 lg:grid lg:grid-cols-5">
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 text-3xl font-bold">
                My <span className="text-neon">Resume</span>
              </h2>
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`w-full rounded-md px-4 py-3 text-left transition-all ${
                      activeTab === tab
                        ? "bg-neon text-black"
                        : "bg-darkcard text-white hover:bg-darkcard/80"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="min-w-0 lg:col-span-3"
          >
            <h3 className="mb-6 text-2xl font-bold">{getTabTitle(activeTab)}</h3>
            {renderTabContent(activeTab)}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
