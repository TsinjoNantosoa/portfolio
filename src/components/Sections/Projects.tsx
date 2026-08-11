import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "../UI/ProjectCard";

type ProjectCategory =
  | "Data Engineering"
  | "AI/ML"
  | "Analytics/BI"
  | "Backend"
  | "Fullstack"
  | "Frontend";

interface PortfolioProject {
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoLink?: string;
  githubLink?: string;
  caseStudyLink?: string;
  highlights?: string[];
  isHighlighted?: boolean;
  category?: ProjectCategory;
  repository?: string;
}

const Projects: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");

  const featuredProjects: PortfolioProject[] = [
    {
      title: "AI Business Operating System",
      subtitle: "Agentic Business Platform",
      description:
        "Full-stack AI business platform combining CRM, tasks, projects, workflows, and agent-driven actions.",
      technologies: [
        "FastAPI",
        "React",
        "PostgreSQL",
        "Redis",
        "LLM Function Calling",
        "Python",
      ],
      imageUrl: "/portfolio-uploads/ai-business-os-dashboard.png",
      demoLink: "https://ai-business-os-murex.vercel.app/",
      category: "Fullstack",
      isHighlighted: true,
      highlights: [
        "LLM tool/function calling",
        "multi-step agent execution",
        "human-in-the-loop approval",
        "RBAC before tool execution",
        "trace IDs",
        "token usage",
        "cost monitoring",
        "latency monitoring",
        "FastAPI",
        "React",
        "PostgreSQL",
        "Redis",
      ],
    },
    {
      title: "Production Multi-Tenant RAG Platform",
      description:
        "Multi-tenant production RAG platform with knowledge ingestion, reliable vector retrieval, and secure isolation for scalable assistants.",
      technologies: [
        "FastAPI",
        "LangChain",
        "OpenAI",
        "Qdrant",
        "PostgreSQL",
        "Redis",
        "SSE",
        "Docker",
      ],
      imageUrl: "/portfolio-uploads/production-multi-tenant-rag-platform.png",
      category: "Backend",
      isHighlighted: true,
      highlights: [
        "FastAPI",
        "LangChain",
        "OpenAI",
        "Qdrant",
        "PostgreSQL",
        "Redis",
        "knowledge ingestion",
        "vector retrieval",
        "multi-tenant isolation",
        "SSE",
        "Docker",
        "reliability/security",
        "3 production AI assistants",
        "97/98 quality validation checks",
        "approximately +17–20 points on internal AI quality scoring",
        "0 critical errors in final security validation batches",
      ],
    },
    {
      title: "AI Automation & CRM Workflow System",
      description:
        "An anonymized CRM automation system built with modular n8n workflows and reliable validation, normalization, deduplication, and follow-up logic.",
      technologies: [
        "n8n",
        "JavaScript",
        "Python",
        "FastAPI",
        "Airtable",
        "REST APIs",
        "Webhooks",
        "Google Calendar",
        "Google Drive",
        "Google Sheets",
      ],
      imageUrl: "/portfolio-uploads/n8n-crm-automation-workflow.png",
      category: "Backend",
      isHighlighted: true,
      highlights: [
        "modular n8n workflow architecture",
        "parent workflow orchestration",
        "lead intake and qualification",
        "validation",
        "normalization",
        "deduplication",
        "Airtable/CRM synchronization",
        "automated follow-up",
        "Google Calendar integration",
        "onboarding workflows",
        "Google Drive / Google Sheets",
        "invoicing workflow",
        "human approval",
        "electronic signature API integration",
        "reporting",
        "global error handler",
        "retry queue",
        "idempotency",
        "webhooks",
        "secure credentials/environment variables",
        "Designed a modular architecture of 20 n8n workflows covering CRM, onboarding, scheduling, invoicing, reporting, and reliability.",
      ],
    },
    {
      title: "SIHIA — Full-Stack AI Healthcare Platform",
      subtitle: "Healthcare Operations + Advanced RAG",
      description:
        "AI healthcare platform combining document ingestion, hybrid retrieval, grounded citations, explicit no-answer handling, and RAG evaluation—built with FastAPI and React.",
      technologies: [
        "FastAPI",
        "React",
        "PostgreSQL",
        "Qdrant",
        "Docker",
        "automated tests",
      ],
      imageUrl: "/portfolio-uploads/sihia-rag-dashboard.png",
      demoLink: "https://sihia-platform.vercel.app/",
      category: "Fullstack",
      isHighlighted: true,
      highlights: [
        "document ingestion",
        "chunking",
        "embeddings",
        "Qdrant",
        "dense retrieval",
        "BM25",
        "hybrid retrieval",
        "RRF",
        "cross-encoder reranking",
        "grounded citations",
        "explicit no-answer handling",
        "RAG evaluation",
        "FastAPI",
        "React",
        "PostgreSQL",
        "Docker",
        "automated tests",
      ],
    },
  ];

  const moreProjects: PortfolioProject[] = useMemo(
    () => [
    {
      title: "My Portfolio Website",
      description:
        "Personal React + Vite portfolio with Framer Motion animations, dynamic sections, and a complete presentation of my data/AI projects.",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      imageUrl: "/portfolio-uploads/my-portfolio.png",
      isHighlighted: true,
      category: "Frontend",
      repository: "my_portfolio",
    },
    {
      title: "World Bank AI Chatbot (RAG)",
      description:
        "RAG chatbot connected to World Bank open data with vector search, sourced answers, and a conversational UI.",
      technologies: ["Python", "RAG", "FAISS", "FastAPI", "React"],
      imageUrl: "/portfolio-uploads/worldbank-ai-chatbot.png",
      githubLink: "https://github.com/TsinjoNantosoa/worldbank-ai-chatbot",
      isHighlighted: true,
      category: "AI/ML",
      repository: "worldbank-ai-chatbot",
    },
    {
      title: "AAA Data Chatbot (Enterprise)",
      description:
        "Enterprise-oriented RAG assistant: AAA website extraction, FAISS indexing, FastAPI/LangChain orchestration, and a chat frontend.",
      technologies: ["Python", "LangChain", "Docker", "Vite", "FAISS"],
      imageUrl: "/portfolio-uploads/aaa-chatbot.png",
      category: "AI/ML",
      repository: "H4H_AAA_DATA_Chatbot-main",
    },
    {
      title: "IoT Kafka Spark Redshift Pipeline",
      description:
        "Real-time IoT data pipeline with simulated producers, Kafka, Spark Structured Streaming, and ingestion analytics preparation.",
      technologies: ["Kafka", "Spark", "AWS", "Docker", "Python"],
      imageUrl: "/portfolio-uploads/iot-pipeline.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/iot-kafka-spark-redshift-pipeline",
      isHighlighted: true,
      category: "Data Engineering",
      repository: "iot-kafka-spark-redshift-pipeline",
    },
    {
      title: "Weather ETL with Airflow",
      description:
        "Weather ETL Airflow DAG: extract Open-Meteo data, automate transformations, and prepare datasets for analytics consumption.",
      technologies: ["Airflow", "Python", "ETL", "API"],
      imageUrl: "/portfolio-uploads/weather-etl.png",
      githubLink: "https://github.com/TsinjoNantosoa/weather_etl",
      category: "Data Engineering",
      repository: "weather_etl",
    },
    {
      title: "Data Warehouse SQL Project",
      description:
        "Complete data warehousing solution: modeling, analytical tables, business queries, and decision-ready insights generation.",
      technologies: ["SQL", "Data Warehouse", "Analytics"],
      imageUrl: "/portfolio-uploads/data-warehouse-sql.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/data_warehouse_sql_project",
      category: "Data Engineering",
      repository: "data_warehouse_sql_project",
    },
    {
      title: "Data Warehouse Analytics (SQL Server)",
      description:
        "SQL Server analytics project built in Azure Data Studio to analyze sales, products, and customers using a warehouse model.",
      technologies: ["SQL Server", "Azure Data Studio", "BI"],
      imageUrl: "/portfolio-uploads/data-warehouse-analytics.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/data-warehouse-analytics",
      category: "Analytics/BI",
      repository: "data-warehouse-analytics",
    },
    {
      title: "Bank Loan Analytics Dashboard",
      description:
        "Analytics dashboard for loan tracking, portfolio quality, and banking risk indicators.",
      technologies: ["Power BI", "SQL", "Dashboard"],
      imageUrl: "/portfolio-uploads/bank-loan-dashboard.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/bank-loan-analytics-dashboard",
      category: "Analytics/BI",
      repository: "bank-loan-analytics-dashboard",
    },
    {
      title: "Insurance Claims Analysis",
      description:
        "Insurance claims analysis and risk profiling using dashboards and data-driven storytelling.",
      technologies: ["Power BI", "Data Analysis", "KPI"],
      imageUrl: "/portfolio-uploads/insurance-claims.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/powerbi-insurance-claims-analysis",
      category: "Analytics/BI",
      repository: "powerbi-insurance-claims-analysis",
    },
    {
      title: "20 Newsgroups Text Classification",
      description:
        "Benchmark of multiple NLP pipelines on the 20 Newsgroups dataset to compare vectorization methods and classification algorithms.",
      technologies: ["NLP", "Scikit-learn", "Python", "Classification"],
      imageUrl: "/portfolio-uploads/20newsgroups.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/20newsgroups-text-classification",
      category: "AI/ML",
      repository: "20newsgroups-text-classification",
    },
    {
      title: "Hair Type Classification CNN",
      description:
        "PyTorch CNN project (ML Zoomcamp): binary classification (curly vs straight) with training, validation, and inference.",
      technologies: ["PyTorch", "CNN", "Computer Vision"],
      imageUrl: "/portfolio-uploads/hair-cnn.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/hair-type-classification-cnn-",
      category: "AI/ML",
      repository: "hair-type-classification-cnn-",
    },
    {
      title: "Book Loan Management API",
      description:
        "Spring Boot REST API for book loan management with Maven CI and a clean REST architecture.",
      technologies: ["Java", "Spring Boot", "Maven", "REST API"],
      imageUrl: "/portfolio-uploads/book-loan-api.png",
      githubLink: "https://github.com/TsinjoNantosoa/book-loan-management",
      category: "Backend",
      repository: "book-loan-management",
    },
    {
      title: "Online Food Backend",
      description:
        "Spring Boot REST API for an online food ordering system, REST architecture, and transactional business logic.",
      technologies: ["Java", "Spring Boot", "Backend"],
      imageUrl: "/portfolio-uploads/online-food-backend.png",
      githubLink: "https://github.com/TsinjoNantosoa/tsinjo-online-food-",
      category: "Backend",
      repository: "tsinjo-online-food-",
    },
    {
      title: "Coding Interview Platform",
      description:
        "Real-time technical interview platform with shared sessions, live collaboration, and a React + Express stack.",
      technologies: ["React", "Node.js", "Express", "Realtime"],
      imageUrl: "/portfolio-uploads/coding-interview.png",
      githubLink: "https://github.com/TsinjoNantosoa/coding_interview",
      category: "Fullstack",
      repository: "coding_interview",
    },
    {
      title: "AI-Assisted Development Learning",
      description:
        "AI Dev Tools Zoomcamp TODO app with full CRUD and an AI-assisted development workflow.",
      technologies: ["Django", "Python", "AI Assisted Dev"],
      imageUrl: "/portfolio-uploads/ai-assisted-dev.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/learning-ai-assisted-development",
      category: "Fullstack",
      repository: "learning-ai-assisted-development",
    },
    ],
    []
  );

  const categories: ("All" | ProjectCategory)[] = [
    "All",
    "Data Engineering",
    "AI/ML",
    "Analytics/BI",
    "Backend",
    "Fullstack",
    "Frontend",
  ];

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? moreProjects
        : moreProjects.filter((project) => project.category === activeCategory),
    [activeCategory, moreProjects]
  );

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  const projectsPerSlide = 2;
  const totalSlides = Math.max(
    1,
    Math.ceil(filteredProjects.length / projectsPerSlide)
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            FEATURED AI ENGINEERING PROJECTS
          </h2>
          <p className="text-white/70">
            Agentic AI systems, production RAG platforms, and n8n-powered automation—built as
            real end-to-end products.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              number={(index + 1).toString().padStart(2, "0")}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              technologies={project.technologies}
              imageUrl={project.imageUrl}
              demoLink={project.demoLink}
              githubLink={project.githubLink}
              caseStudyLink={project.caseStudyLink}
              highlights={project.highlights}
              isHighlighted={project.isHighlighted}
              index={index}
              category={project.category}
              repository={project.repository}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 mb-12 max-w-xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">MORE PROJECTS</h2>
          <p className="text-white/70">
            Additional engineering work across RAG, automation, backend systems, and analytics.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                activeCategory === category
                  ? "border-neon bg-neon/10 text-neon"
                  : "border-white/20 text-white/70 hover:border-neon/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel (secondary projects) */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const start = slideIndex * projectsPerSlide;
              const end = start + projectsPerSlide;
              const slideProjects = filteredProjects.slice(start, end);

              return (
                <div
                  key={slideIndex}
                  className="grid w-full flex-shrink-0 grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-2"
                >
                  {slideProjects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      number={(start + index + 1).toString().padStart(2, "0")}
                      title={project.title}
                      subtitle={project.subtitle}
                      description={project.description}
                      technologies={project.technologies}
                      imageUrl={project.imageUrl}
                      demoLink={project.demoLink}
                      githubLink={project.githubLink}
                      caseStudyLink={project.caseStudyLink}
                      highlights={project.highlights}
                      isHighlighted={project.isHighlighted}
                      index={index}
                      category={project.category}
                      repository={project.repository}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          {filteredProjects.length > projectsPerSlide && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={prevSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neon transition-all hover:bg-neon/80"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5 text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neon transition-all hover:bg-neon/80"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
