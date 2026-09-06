import React from "react";
import { motion } from "framer-motion";
import imgTsinjo from "./tsinjo.jpg";

const ProfileImage: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-6 rounded-full bg-neon/[0.08] blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-white/15 bg-[var(--surface-2)] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="overflow-hidden rounded-full border border-neon/20">
          <motion.img
            src={imgTsinjo}
            alt="Sandaniaina Tsinjo Nantosoa"
            width={480}
            height={480}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
