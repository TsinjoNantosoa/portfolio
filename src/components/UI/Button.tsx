import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon" | "default"; // AJOUTÉ: 'default' ici
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const buttonVariants = ({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon" | "default"; // AJOUTÉ: 'default' ici
  className?: string;
}) =>
  cn(
    "relative inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-neon/50 disabled:opacity-50 disabled:pointer-events-none",
    {
      primary: "bg-neon text-black hover:shadow-[0_0_15px_rgba(13,255,163,0.6)]",
      outline: "border border-neon text-neon hover:bg-neon/10",
      ghost: "bg-transparent text-white hover:bg-white/10",
    }[variant],
    {
      sm: "text-xs px-3 py-1.5 rounded-full",
      md: "text-sm px-4 py-2 rounded-full",
      lg: "text-base px-6 py-3 rounded-full",
      icon: "h-9 w-9 p-0 rounded-full", // Styles pour la taille 'icon'
      default: "text-sm px-4 py-2 rounded-full", // AJOUTÉ: Styles pour la taille 'default', ici j'ai mis les mêmes que 'md'
    }[size],
    className
  );

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    icon,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
export type { ButtonProps };