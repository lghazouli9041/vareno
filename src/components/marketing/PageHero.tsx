import Link from "next/link";
import { Container } from "@/components/layout/Container";

type Crumb = { label: string; href?: string };

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Crumb[];
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden border-b border-border/80 bg-surface"
      aria-labelledby="page-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(201_161_74_/_0.12),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(17_17_17_/_0.035),transparent_48%)]" />
      </div>

      <Container className="relative pb-16 pt-28 md:pb-20 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-9">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-border">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="mb-5 text-[11px] uppercase tracking-[var(--eyebrow-tracking)] text-accent">
          {eyebrow}
        </p>
        <h1
          id="page-hero-heading"
          className="max-w-3xl font-display text-4xl leading-[1.08] text-primary md:text-6xl md:leading-[1.05]"
        >
          {title}
        </h1>
        <div className="gold-line mt-7" aria-hidden="true" />
        <p className="mt-7 max-w-2xl text-pretty text-sm leading-[1.8] text-muted md:text-base md:leading-[1.8]">
          {description}
        </p>
      </Container>
    </section>
  );
}
