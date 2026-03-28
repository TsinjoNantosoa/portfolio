
import React from "react";
import { motion } from "framer-motion";

interface ExperienceCardProps {
  period: string;
  title: string;
  company: string;
  isActive?: boolean;
  index?: number;
  role?: string;
  summary?: string;
  pillars?: string[];
  missions?: string[];
  achievements?: string[];
  impact?: string[];
  stack?: string[];
  skills?: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  period,
  title,
  company,
  isActive = false,
  index = 0,
  role,
  summary,
  pillars,
  missions,
  achievements,
  impact,
  stack,
  skills,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-lg bg-darkcard ${
        isActive ? "border border-neon/30" : ""
      } p-6 transition-all duration-300 hover:border-neon/50 hover:shadow-[0_0_15px_rgba(13,255,163,0.2)]`}
    >
      <div className="mb-2 font-mono text-sm text-neon">{period}</div>
      <h3 className="mb-1 text-xl font-bold text-white">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-neon"></span>
        <p className="text-white/70">{company}</p>
      </div>

      {role && <p className="mt-3 text-sm font-medium text-neon/90">Rôle: {role}</p>}
      {summary && <p className="mt-3 text-sm leading-relaxed text-white/75">{summary}</p>}

      {pillars && pillars.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Piliers du projet</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {pillars.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {missions && missions.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Missions principales</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {missions.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Réalisations techniques clés</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {achievements.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {impact && impact.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Impact mesurable</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {impact.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {stack && stack.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Stack & outils</p>
          <div className="flex flex-wrap gap-2">
            {stack.map((item, itemIndex) => (
              <span
                key={itemIndex}
                className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-white">Compétences démontrées</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
            {skills.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;
