import { cn } from "@/lib/utils";

type ContainerElement = "div" | "section" | "header" | "footer" | "nav" | "main";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: ContainerElement;
  narrow?: boolean;
}

export function Container({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
