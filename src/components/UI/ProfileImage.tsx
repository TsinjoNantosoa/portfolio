
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import imgTsinjo from "./tsinjo.png"

const ProfileImage: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // Animate
    let animationFrame: number;
    let rotation = 0;
    let pulseSize = 0;
    let pulseDir = 0.01;
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer circle with glow effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#0DFFA3";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#0DFFA3";
      ctx.shadowBlur = 10 + pulseSize * 5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw rotating dashed circle
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.95, 0, 2 * Math.PI);
      ctx.strokeStyle = "#0DFFA3";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 15]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.restore();
      
      // Draw small circles along the perimeter with pulsing effect
      const numberOfCircles = 8;
      const angleIncrement = (2 * Math.PI) / numberOfCircles;
      
      for (let i = 0; i < numberOfCircles; i++) {
        const angle = i * angleIncrement + rotation;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        // Make the circles pulse in size
        const circleSize = 3 + Math.sin(rotation * 3 + i) * 1.5;
        ctx.arc(x, y, circleSize, 0, 2 * Math.PI);
        ctx.fillStyle = "#0DFFA3";
        ctx.shadowColor = "#0DFFA3";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Update animations
      rotation += 0.005;
      pulseSize += pulseDir;
      if (pulseSize > 1) pulseDir = -0.01;
      if (pulseSize < 0) pulseDir = 0.01;
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center">
        {/* Conteneur avec bordure et ombre */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 shadow-xl border-4 border-white">
          <motion.img
            src={imgTsinjo}
            alt="Profile"
            className="h-full w-full object-cover"
            whileHover={{
              scale: 1.15, // Légèrement plus grand au survol
              rotate: 5,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-25"
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
  
};

export default ProfileImage;
