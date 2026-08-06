import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  children: React.ReactNode;
  containerClassName?: string;
  narrow?: boolean;
  contained?: boolean;
  tone?: "default" | "surface" | "inverse";
}

const toneClasses = {
  default: "bg-background text-text",
  surface: "bg-surface text-text",
  inverse: "bg-inverse text-inverse-text",
} as const;

export function Section({
  children,
  className,
  containerClassName,
  id,
  narrow = false,
  contained = true,
  tone = "default",
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-[var(--section-y)]",
        tone === "surface" &&
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {contained ? (
        <Container
          narrow={narrow}
          className={cn("relative z-10", containerClassName)}
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </section>
  );
}
