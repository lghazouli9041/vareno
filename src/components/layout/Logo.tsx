import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  VarenoWordmark,
  type MarkVariant,
} from "@/components/brand/VarenoMark";

interface LogoProps {
  className?: string;
  href?: string;
  inverted?: boolean;
  variant?: MarkVariant;
}

/**
 * Site logo — Header, Footer, Sign-in, Sign-up.
 * Maison monogram + VARENO wordmark from VarenoMark.
 */
export function Logo({
  className,
  href = "/",
  inverted = false,
  variant,
}: LogoProps) {
  const markVariant: MarkVariant =
    variant ?? (inverted ? "white" : "black");

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <VarenoWordmark variant={markVariant} showMonogram />
    </Link>
  );
}
