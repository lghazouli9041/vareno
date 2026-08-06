"use client";

import { cn } from "@/lib/utils";

interface FloatingFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FloatingField({
  id,
  label,
  error,
  className,
  value,
  ...props
}: FloatingFieldProps) {
  const filled = String(value ?? "").length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={id}
          value={value}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "peer w-full rounded-xl border bg-background px-4 pb-2.5 pt-6 text-base text-primary shadow-xs outline-none transition-all duration-300",
            "placeholder:text-transparent",
            "focus:border-accent focus:shadow-[0_0_0_3px_rgb(201_161_74_/_0.18)]",
            error
              ? "border-error"
              : "border-border hover:border-primary/25",
            className,
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 origin-left text-muted transition-all duration-300",
            filled || props.type === "date"
              ? "top-2 text-[10px] uppercase tracking-[0.16em] text-accent"
              : "top-1/2 -translate-y-1/2 text-sm",
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-accent",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-[:not(:placeholder-shown)]:text-accent",
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatingSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[] | readonly string[];
}

export function FloatingSelect({
  id,
  label,
  error,
  options,
  className,
  value,
  ...props
}: FloatingSelectProps) {
  const filled = String(value ?? "").length > 0;
  const normalized = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : option,
  );

  return (
    <div className="w-full">
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full appearance-none rounded-xl border bg-background px-4 pb-2.5 pt-6 text-base text-primary shadow-xs outline-none transition-all duration-300",
            "focus:border-accent focus:shadow-[0_0_0_3px_rgb(201_161_74_/_0.18)]",
            error
              ? "border-error"
              : "border-border hover:border-primary/25",
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            Select
          </option>
          {normalized.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 top-2 text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
            filled ? "text-accent" : "text-muted",
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
