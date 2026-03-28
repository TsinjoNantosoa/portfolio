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
  description: string;
  technologies: string[];
  imageUrl: string;
  githubLink?: string;
  isHighlighted?: boolean;
  category: ProjectCategory;
  repository: string;
}

const Projects: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");

  const projects: PortfolioProject[] = [
    {
      title: "My Portfolio Website",
      description:
        "Portfolio personnel React + Vite avec animations Framer Motion, sections dynamiques et présentation complète de mes projets data/AI.",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      imageUrl: "/portfolio-uploads/my-portfolio.png",
      isHighlighted: true,
      category: "Frontend",
      repository: "my_portfolio",
    },
    {
      title: "World Bank AI Chatbot (RAG)",
      description:
        "Chatbot RAG connecté aux données ouvertes World Bank avec recherche vectorielle, réponses sourcées et interface conversationnelle.",
      technologies: ["Python", "RAG", "FAISS", "FastAPI", "React"],
      imageUrl: "/portfolio-uploads/worldbank-ai-chatbot.png",
      githubLink: "https://github.com/TsinjoNantosoa/worldbank-ai-chatbot",
      isHighlighted: true,
      category: "AI/ML",
      repository: "worldbank-ai-chatbot",
    },
    {
      title: "AAA Data Chatbot (Entreprise)",
      description:
        "Assistant conversationnel RAG orienté entreprise: extraction du site AAA, index FAISS, orchestration FastAPI/LangChain et frontend chat.",
      technologies: ["Python", "LangChain", "Docker", "Vite", "FAISS"],
      imageUrl: "/portfolio-uploads/aaa-chatbot.png",
      category: "AI/ML",
      repository: "H4H_AAA_DATA_Chatbot-main",
    },
    {
      title: "IoT Kafka Spark Redshift Pipeline",
      description:
        "Pipeline temps réel de données IoT avec producteurs simulés, Kafka, Spark Structured Streaming et préparation d'ingestion analytics.",
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
        "DAG Airflow ETL météo: extraction Open-Meteo, transformations automatisées et préparation des données pour consommation analytics.",
      technologies: ["Airflow", "Python", "ETL", "API"],
      imageUrl: "/portfolio-uploads/weather-etl.png",
      githubLink: "https://github.com/TsinjoNantosoa/weather_etl",
      category: "Data Engineering",
      repository: "weather_etl",
    },
    {
      title: "Data Warehouse SQL Project",
      description:
        "Solution complète de data warehousing: modélisation, tables analytiques, requêtes métier et génération d'insights décisionnels.",
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
        "Projet analytics SQL Server réalisé sous Azure Data Studio pour analyser ventes, produits et clients via un modèle entrepôt.",
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
        "Dashboard analytique pour le suivi des prêts, qualité du portefeuille et indicateurs de risque bancaire.",
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
        "Analyse de sinistres et profilage du risque assurance via tableaux de bord et storytelling data-driven.",
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
        "Benchmark de 12 pipelines NLP sur le dataset 20 Newsgroups pour comparer vectorisations et algorithmes de classification.",
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
        "Projet PyTorch CNN (ML Zoomcamp): classification binaire curly/straight avec entraînement, validation et inférence.",
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
        "API backend Spring Boot pour gestion de prêts de livres avec CI Maven et architecture REST.",
      technologies: ["Java", "Spring Boot", "Maven", "REST API"],
      imageUrl: "/portfolio-uploads/book-loan-api.png",
      githubLink: "https://github.com/TsinjoNantosoa/book-loan-management",
      category: "Backend",
      repository: "book-loan-management",
    },
    {
      title: "Online Food Backend",
      description:
        "API backend Spring Boot pour système de commande de nourriture en ligne, architecture REST et logique métier transactionnelle.",
      technologies: ["Java", "Spring Boot", "Backend"],
      imageUrl: "/portfolio-uploads/online-food-backend.png",
      githubLink: "https://github.com/TsinjoNantosoa/tsinjo-online-food-",
      category: "Backend",
      repository: "tsinjo-online-food-",
    },
    {
      title: "Coding Interview Platform",
      description:
        "Plateforme d'entretien technique en temps réel avec sessions partagées, collaboration live et stack React + Express.",
      technologies: ["React", "Node.js", "Express", "Realtime"],
      imageUrl: "/portfolio-uploads/coding-interview.png",
      githubLink: "https://github.com/TsinjoNantosoa/coding_interview",
      category: "Fullstack",
      repository: "coding_interview",
    },
    {
      title: "AI-Assisted Development Learning",
      description:
        "Application TODO Django réalisée dans le cadre AI Dev Tools Zoomcamp avec CRUD complet et workflow AI-assisted development.",
      technologies: ["Django", "Python", "AI Assisted Dev"],
      imageUrl: "/portfolio-uploads/ai-assisted-dev.png",
      githubLink:
        "https://github.com/TsinjoNantosoa/learning-ai-assisted-development",
      category: "Fullstack",
      repository: "learning-ai-assisted-development",
    },
  ];

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
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory]
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
            My <span className="text-neon">Projects</span>
          </h2>
          <p className="text-white/70">
            A curated selection of my real GitHub work: Data Engineering, AI/ML,
            Analytics, and Fullstack products shipped through hands-on projects.
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

        {/* Carousel */}
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
                      description={project.description}
                      technologies={project.technologies}
                      imageUrl={project.imageUrl}
                      githubLink={project.githubLink}
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
