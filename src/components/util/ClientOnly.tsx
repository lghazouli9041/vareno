"use client";

import { useEffect, useState, type ReactNode } from "react";

type ClientOnlyProps = {
  children: ReactNode;
  /** Rendered during SSR and before mount. Defaults to null. */
  fallback?: ReactNode;
};

/**
 * Renders children only after the client has mounted.
 * Use for third-party widgets that are not SSR-safe (e.g. Clerk auth).
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
