import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  HajamedWordmark,
  type MarkVariant,
} from "@/components/brand/HajamedMark";

interface LogoProps {
  className?: string;
  href?: string;
  inverted?: boolean;
  variant?: MarkVariant;
}

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
      <HajamedWordmark variant={markVariant} showMonogram />
    </Link>
  );
}
