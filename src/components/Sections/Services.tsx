import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../UI/ServiceCard";

const Services: React.FC = () => {
  const services = [
    {
      number: "01",
      title: "AI Agents & Agentic Systems",
      description:
        "Building agentic AI applications with tool/function calling, multi-step execution, guardrails, and human-in-the-loop approvals—reliable end-to-end behavior.",
      delay: 0,
    },
    {
      number: "02",
      title: "Production RAG & Knowledge Systems",
      description:
        "Designing production-grade RAG pipelines: knowledge ingestion, vector retrieval, hybrid search, reranking, grounded citations, and multi-tenant isolation.",
      delay: 1,
    },
    {
      number: "03",
      title: "AI Automation & n8n",
      description:
        "Orchestrating business automations with n8n: modular workflows, validation/normalization/deduplication, webhooks, retries, idempotency, and secure credential handling.",
      delay: 2,
    },
    {
      number: "04",
      title: "AI Backend & Full-Stack Development",
      description:
        "Building FastAPI backends and full-stack AI products with React + PostgreSQL (and supporting infrastructure) designed for maintainability and deployment readiness.",
      delay: 3,
    },
    {
      number: "05",
      title: "AI Reliability & Production Engineering",
      description:
        "Ensuring production reliability: validation gates, output parsing, error workflows, observability, monitoring (latency/cost), and secure-by-design system integration.",
      delay: 4,
    },
  ];

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
            My <span className="text-neon">Expertise</span>
          </h2>
          <p className="text-white/70">
            AI Engineer & AI Automation Engineer building agentic AI systems,
            production RAG, FastAPI backends, and reliable n8n automations—end-to-end.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              number={service.number}
              title={service.title}
              description={service.description}
              delay={service.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
