import React from "react";

interface ProjectMediaProps {
  src: string;
  alt: string;
  aspectClassName?: string;
  className?: string;
  objectPosition?: string;
  onError?: () => void;
}

const ProjectMedia: React.FC<ProjectMediaProps> = ({
  src,
  alt,
  aspectClassName = "aspect-[16/10]",
  className = "",
  objectPosition = "object-top",
  onError,
}) => {
  return (
    <div className={`relative overflow-hidden border-b border-white/[0.08] bg-[var(--surface-2)] ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={1280}
        height={800}
        onError={onError}
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.015] group-hover:brightness-105 ${objectPosition}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 via-transparent to-transparent" />
    </div>
  );
};

export default ProjectMedia;
