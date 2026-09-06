
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CounterItemProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const CounterItem: React.FC<CounterItemProps> = ({
  value,
  label,
  suffix = "",
  delay = 0,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const start = 0;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();
          
          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * value);
            
            setCount(currentCount);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          // Delay the start of the animation
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, delay * 200);
        }
      },
      { threshold: 0.5 }
    );
    
    const observedElement = countRef.current;
    if (observedElement) {
      observer.observe(observedElement);
    }
    
    return () => {
      if (observedElement) {
        observer.unobserve(observedElement);
      }
    };
  }, [value, delay, hasAnimated]);
  
  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="min-w-0 flex flex-col items-center"
    >
      <div className="mb-2 font-mono text-3xl font-bold text-white sm:text-4xl">
        {count}
        <span className="text-neon">{suffix}</span>
      </div>
      <p className="break-words text-center text-sm text-white/70 sm:text-base">{label}</p>
    </motion.div>
  );
};

export default CounterItem;
