import React from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`mb-10 max-w-[720px] md:mb-12 ${className}`}>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neon sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-balance font-sans text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--text-secondary)] sm:text-base">
          {description}
        </p>
      )}
      <div className="mt-6 h-px w-16 bg-white/10" aria-hidden />
    </div>
  );
};

export default SectionHeader;
