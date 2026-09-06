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
    <div className={`mb-8 max-w-[720px] md:mb-10 ${className}`}>
      <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-neon sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-balance font-sans text-[clamp(2rem,3vw,3rem)] font-semibold leading-[1.1] tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[15.5px]">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
