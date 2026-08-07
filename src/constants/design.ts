/**
 * Design system constants — keep in sync with `src/styles/globals.css`.
 * Prefer CSS variables in components; use these for JS/TS logic (motion, layout).
 */

export const colors = {
  primary: "#111111",
  secondary: "#F8F6F2",
  accent: "#B68D40",
  accentHover: "#C9A054",
  border: "#E8E4DC",
  text: "#1A1814",
  muted: "#7A7468",
  background: "#F8F6F2",
} as const;

export const motion = {
  easeLuxury: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.2,
    base: 0.45,
    slow: 0.8,
    slower: 1.2,
  },
  fadeUp: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export const layout = {
  containerMax: 1280,
  headerHeight: 84,
  sectionY: { mobile: 80, desktop: 140 },
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
