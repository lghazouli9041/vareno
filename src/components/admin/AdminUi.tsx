import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
          Admin
        </p>
        <h1 className="mt-2 font-display text-3xl text-primary md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-border bg-background", className)}>
      {children}
    </div>
  );
}

export function AdminKpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <AdminCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-primary">{value}</p>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </AdminCard>
  );
}
