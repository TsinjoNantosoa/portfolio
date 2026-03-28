
import React from "react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  iconColor?: "neon" | "white";
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  number,
  title,
  description,
  iconColor = "neon",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-darkcard p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(13,255,163,0.2)]"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="font-mono text-3xl font-semibold text-white/30">
          {number}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            iconColor === "neon" ? "bg-neon/20" : "bg-white/10"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor === "neon" ? "#0DFFA3" : "#FFFFFF"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
        </div>
      </div>
      <h3 className="mb-3 text-xl font-bold text-white group-hover:text-neon transition-colors">
        {title}
      </h3>
      <p className="text-white/70">{description}</p>
      
      {/* Decorative corner line */}
      <div className="absolute bottom-0 right-0 h-16 w-16 overflow-hidden">
        <div className="absolute bottom-0 right-0 h-[2px] w-8 bg-neon/40 transform origin-right transition-all duration-300 group-hover:bg-neon"></div>
        <div className="absolute bottom-0 right-0 h-8 w-[2px] bg-neon/40 transform origin-bottom transition-all duration-300 group-hover:bg-neon"></div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
