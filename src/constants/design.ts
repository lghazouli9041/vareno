/**
 * Design system constants — keep in sync with `src/styles/globals.css`.
 * Prefer CSS variables in components; use these for JS/TS logic (motion, layout).
 */

export const colors = {
  primary: "#111111",
  secondary: "#FAFAFA",
  accent: "#C9A14A",
  accentHover: "#D4B05E",
  border: "#E8E8E8",
  text: "#2B2B2B",
  muted: "#777777",
  background: "#FFFFFF",
} as const;

export const motion = {
  easeLuxury: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.15,
    base: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export const layout = {
  containerMax: 1280,
  headerHeight: 80,
  sectionY: { mobile: 64, desktop: 120 },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 40,
  sticky: 50,
  header: 60,
  overlay: 70,
  modal: 80,
  toast: 90,
} as const;
