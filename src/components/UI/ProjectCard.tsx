
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

interface ProjectCardProps {
  number: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoLink?: string;
  githubLink?: string;
  isHighlighted?: boolean;
  index?: number;
  category?: string;
  repository?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  number,
  title,
  description,
  technologies,
  imageUrl,
  demoLink,
  githubLink,
  isHighlighted = false,
  index = 0,
  category,
  repository,
}) => {
  const [imageError, setImageError] = useState(!imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group overflow-hidden rounded-lg ${
        isHighlighted ? "bg-blue-800" : "bg-darkcard"
      } transition-all duration-300 hover:shadow-[0_0_20px_rgba(13,255,163,0.2)]`}
    >
      <div className="relative">
        <div
          className={`absolute left-0 top-0 z-10 flex h-14 w-14 items-center justify-center ${
            isHighlighted ? "bg-blue-700" : "bg-neon"
          }`}
        >
          <span className="font-mono text-2xl font-bold text-black">
            {number}
          </span>
        </div>
        
        <div className="relative h-80 overflow-hidden bg-darkbg/80">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={title}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(13,255,163,0.25)_0,rgba(0,0,0,0.85)_65%)] p-8 text-center">
              <p className="text-lg font-semibold text-white/90">{title}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-darkbg/90 to-transparent"></div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {category && (
            <span className="inline-block rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
              {category}
            </span>
          )}
          {repository && (
            <span className="inline-block rounded-full border border-white/20 px-3 py-1 font-mono text-xs text-white/70">
              {repository}
            </span>
          )}
        </div>
        <h3 className="mb-2 text-2xl font-bold">{title}</h3>
        <p className="mb-4 text-white/70">{description}</p>
        
        <div className="mb-6 flex flex-wrap gap-2">
          {technologies.map((tech, i) => (
            <span
              key={i}
              className="inline-block rounded-full bg-neon/10 px-3 py-1 text-xs font-medium text-neon"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neon hover:underline"
            >
              <ArrowUpRight size={16} />
              <span>Live Demo</span>
            </a>
          )}
          
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/70 hover:text-white"
            >
              <Github size={16} />
              <span>View Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
