import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center font-body font-medium tracking-[0.16em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-inverse-text shadow-sm hover:-translate-y-1 hover:bg-accent hover:text-primary hover:shadow-gold",
        secondary:
          "border border-border bg-secondary/90 text-primary shadow-xs backdrop-blur-sm hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-md",
        outline:
          "border border-primary/90 text-primary hover:-translate-y-1 hover:bg-primary hover:text-inverse-text hover:shadow-md",
        ghost: "text-primary hover:text-accent",
        gold:
          "bg-accent text-primary shadow-sm hover:-translate-y-1 hover:bg-accent-hover hover:shadow-gold",
      },
      size: {
        sm: "rounded-md px-5 py-2.5 text-[10px]",
        md: "rounded-md px-8 py-3.5 text-xs",
        lg: "rounded-lg px-11 py-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type CommonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

export type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        "href" | "className" | "children"
      >)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

export function Button({
  variant,
  size,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    const linkProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export { buttonVariants };
