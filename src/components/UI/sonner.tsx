import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--surface-1)] group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[var(--text-muted)]",
          actionButton:
            "group-[.toast]:bg-neon group-[.toast]:text-black",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/70",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
