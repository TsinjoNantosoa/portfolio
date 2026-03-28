import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../UI/ServiceCard";

const Services: React.FC = () => {
  const services = [
    {
      number: "01",
      title: "Data Engineering & Cloud",
      description: "Building data pipelines using Python (pandas, PySpark), ETL/ELT with Airflow & dbt, Big Data processing with Kafka, and Cloud solutions with AWS (EC2, S3, IAM).",
      delay: 0,
    },
    {
      number: "02",
      title: "AI Automation & n8n",
      description: "Designing end-to-end AI automations with n8n, webhooks, API orchestration, and agentic workflows (RAG, Human-in-the-Loop, output parsing, and error handling).",
      delay: 1,
    },
    {
      number: "03",
      title: "Data Analysis & BI",
      description: "Creating interactive reports and dashboards using Power BI (DAX), performing EDA, data cleaning, and visualization with Matplotlib & Seaborn.",
      delay: 2,
    },
    {
      number: "04",
      title: "Machine Learning",
      description: "Developing ML models using Scikit-learn and TensorFlow for classification and regression tasks, including model tuning and evaluation.",
      delay: 3,
    },
    {
      number: "05",
      title: "DevOps & Infrastructure",
      description: "Implementing CI/CD pipelines, containerization with Docker & Kubernetes, and building APIs with FastAPI. Strong expertise in Git and Shell scripting.",
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
            AI Automation Engineer and Data Engineer specialized in intelligent
            workflows, agentic systems, and production-ready data platforms.
            Backed by 85+ completed DataCamp courses, 300+ learning hours,
            9 major certifications, and 11+ career tracks.
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
