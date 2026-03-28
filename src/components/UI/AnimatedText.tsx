
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

interface AnimatedTextProps {
  textArray: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetween?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  textArray,
  className = "",
  typingSpeed = 0.05,
  deletingSpeed = 0.02,
  delayBetween = 2,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  
  useEffect(() => {
    if (!textRef.current || !cursorRef.current) return;
    
    timeline.current = gsap.timeline({ repeat: -1 });
    
    // Create a blinking cursor
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
    
    textArray.forEach((text, index) => {
      // Type text
      timeline.current!.to(textRef.current!, {
        duration: text.length * typingSpeed,
        text: {
          value: text,
          delimiter: "",
        },
        ease: "none",
      });
      
      // Pause after typing
      timeline.current!.to({}, { duration: delayBetween });
      
      // Delete text (unless it's the last item and we're not repeating)
      timeline.current!.to(textRef.current!, {
        duration: text.length * deletingSpeed,
        text: {
          value: "",
          delimiter: "",
        },
        ease: "none",
      });
      
      // Small pause before typing next text
      timeline.current!.to({}, { duration: 0.5 });
    });
    
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
      gsap.killTweensOf(cursorRef.current);
    };
  }, [textArray, typingSpeed, deletingSpeed, delayBetween]);
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span
        ref={textRef}
        className="inline-block min-h-[1em]"
        aria-label={`Animated text: ${textArray.join(", ")}`}
      ></span>
      <span ref={cursorRef} className="inline-block ml-1 h-[1em] w-[2px] bg-neon"></span>
    </div>
  );
};

export default AnimatedText;
