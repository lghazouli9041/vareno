"use client";

import { memo, useMemo } from "react";
import { cn, formatPriceExact } from "@/lib/utils";

interface AdminChartProps {
  title: string;
  points: Array<{ label: string; value: number }>;
  /** Serializable format key — safe across Server → Client boundaries. */
  valueFormat?: "number" | "currency";
  className?: string;
}

function formatChartValue(
  value: number,
  valueFormat: "number" | "currency",
): string {
  if (valueFormat === "currency") return formatPriceExact(value);
  return String(Math.round(value));
}

function AdminChartComponent({
  title,
  points,
  valueFormat = "number",
  className,
}: AdminChartProps) {
  const max = useMemo(
    () => Math.max(...points.map((point) => point.value), 1),
    [points],
  );

  return (
    <div className={cn("border border-border p-5", className)}>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
        {title}
      </p>
      <div className="mt-6 flex h-40 items-end gap-2">
        {points.map((point) => {
          const height = Math.max((point.value / max) * 100, 4);
          return (
            <div
              key={point.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full bg-accent/80 transition-all"
                style={{ height: `${height}%` }}
                title={formatChartValue(point.value, valueFormat)}
              />
              <span className="truncate text-[10px] uppercase tracking-[0.12em] text-muted">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const AdminChart = memo(AdminChartComponent);
