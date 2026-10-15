import React from "react";
import { PlaneTakeoff, Workflow } from "lucide-react";

interface ProjectMediaProps {
  src: string;
  alt: string;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  onError?: () => void;
}

const ProjectMedia: React.FC<ProjectMediaProps> = ({
  src,
  alt,
  aspectClassName = "aspect-[16/10]",
  className = "",
  imageClassName = "",
  objectPosition = "object-top",
  objectFit = "cover",
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
        className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"} transition duration-500 group-hover:brightness-105 ${objectPosition} ${imageClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/20 via-transparent to-transparent" />
    </div>
  );
};

export default ProjectMedia;

interface ProjectMediaPlaceholderProps {
  title: string;
  subtitle: string;
  alt: string;
  aspectClassName?: string;
}

export const ProjectMediaPlaceholder: React.FC<ProjectMediaPlaceholderProps> = ({
  title,
  subtitle,
  alt,
  aspectClassName = "aspect-[16/10]",
}) => (
  <div
    role="img"
    aria-label={alt}
    className={`relative flex min-w-0 max-w-full overflow-hidden border-b border-white/[0.08] bg-[var(--surface-2)] ${aspectClassName}`}
  >
    <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(245,247,248,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,248,0.24)_1px,transparent_1px)] [background-size:40px_40px]" />
    <div className="relative m-auto flex w-full min-w-0 max-w-md flex-col items-center px-4 text-center sm:px-6">
      <div className="mb-5 flex items-center gap-3 text-neon" aria-hidden>
        <PlaneTakeoff size={30} strokeWidth={1.6} />
        <span className="h-px w-12 bg-neon/45" />
        <Workflow size={30} strokeWidth={1.6} />
      </div>
      <p className="text-[clamp(1.45rem,3vw,2.2rem)] font-semibold leading-tight text-[var(--text-primary)]">
        {title}
      </p>
      <p className="mt-2 max-w-full break-words font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-neon/80 sm:text-xs sm:tracking-[0.15em]">
        {subtitle}
      </p>
    </div>
  </div>
);
