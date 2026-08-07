/**
 * VARENO brand marks — square frame + centered serif V.
 * Variants: black | white | gold
 */

export type MarkVariant = "black" | "white" | "gold";

const MARK_COLORS: Record<MarkVariant, string> = {
  black: "#111111",
  white: "#F8F6F2",
  gold: "#B68D40",
};

interface VarenoMonogramProps {
  variant?: MarkVariant;
  className?: string;
  title?: string;
  /** Black plate + ivory ink (favicon / app icon). */
  onDarkPlate?: boolean;
}

/** Square frame with a centered serif V monogram. */
export function VarenoMonogram({
  variant = "black",
  className,
  title = "VARENO",
  onDarkPlate = false,
}: VarenoMonogramProps) {
  const ink = onDarkPlate ? "#F8F6F2" : MARK_COLORS[variant];

  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {onDarkPlate && <rect width="32" height="32" fill="#111111" />}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        fill="none"
        stroke={ink}
        strokeWidth="1"
      />
      <text
        x="16"
        y="16"
        fill={ink}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="17"
        fontWeight="500"
      >
        V
      </text>
    </svg>
  );
}

interface VarenoWordmarkProps {
  variant?: MarkVariant;
  className?: string;
  showMonogram?: boolean;
}

/** Serif wordmark with wide tracking + V monogram. */
export function VarenoWordmark({
  variant = "black",
  className,
  showMonogram = true,
}: VarenoWordmarkProps) {
  const fill = MARK_COLORS[variant];

  return (
    <span className={className} style={{ color: fill }}>
      <span className="inline-flex items-center gap-3">
        {showMonogram && (
          <span aria-hidden="true" className="inline-flex">
            <VarenoMonogram
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
