/**
 * VARENO brand marks — flat color only, no gradients.
 * Variants: black | white | gold
 */

export type MarkVariant = "black" | "white" | "gold";

const MARK_COLORS: Record<MarkVariant, string> = {
  black: "#111111",
  white: "#FAFAFA",
  gold: "#C9A14A",
};

interface HajamedMonogramProps {
  variant?: MarkVariant;
  className?: string;
  title?: string;
}

/** Geometric H monogram — favicon-ready proportions (square). */
export function HajamedMonogram({
  variant = "black",
  className,
  title = "VARENO",
}: HajamedMonogramProps) {
  const fill = MARK_COLORS[variant];

  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Outer frame — architectural restraint */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="none"
        stroke={fill}
        strokeWidth="1"
      />
      {/* Left stem */}
      <rect x="8" y="7" width="2.5" height="18" fill={fill} />
      {/* Right stem */}
      <rect x="21.5" y="7" width="2.5" height="18" fill={fill} />
      {/* Crossbar */}
      <rect x="8" y="14.75" width="16" height="2.5" fill={fill} />
    </svg>
  );
}

interface HajamedWordmarkProps {
  variant?: MarkVariant;
  className?: string;
  showMonogram?: boolean;
}

/** Serif wordmark with wide tracking + optional monogram. */
export function HajamedWordmark({
  variant = "black",
  className,
  showMonogram = true,
}: HajamedWordmarkProps) {
  const fill = MARK_COLORS[variant];

  return (
    <span className={className} style={{ color: fill }}>
      <span className="inline-flex items-center gap-3">
        {showMonogram && (
          <span aria-hidden="true" className="inline-flex">
            <HajamedMonogram
              variant={variant}
              className="h-7 w-7 shrink-0 md:h-8 md:w-8"
            />
          </span>
        )}
        <svg
          viewBox="0 0 220 28"
          className="h-5 w-auto md:h-6"
          role="img"
          aria-label="VARENO"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="0"
            y="22"
            fill={fill}
            fontFamily="var(--font-display), Georgia, 'Times New Roman', serif"
            fontSize="22"
            letterSpacing="0.28em"
            fontWeight="500"
          >
            VARENO
          </text>
        </svg>
      </span>
    </span>
  );
}
