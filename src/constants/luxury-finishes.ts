export type LuxuryFinish = {
  id: string;
  name: string;
  description: string;
  hex: string;
  highlight: string;
  shadow: string;
};

export const luxuryFinishes: LuxuryFinish[] = [
  {
    id: "brushed-gold",
    name: "Brushed Gold",
    description: "Warm luminosity with a refined, hand-brushed texture.",
    hex: "#C9A14A",
    highlight: "#E8D09A",
    shadow: "#8A6B2E",
  },
  {
    id: "matte-black",
    name: "Matte Black",
    description: "Architectural depth with a soft, non-reflective surface.",
    hex: "#1A1A1A",
    highlight: "#3A3A3A",
    shadow: "#0A0A0A",
  },
  {
    id: "polished-chrome",
    name: "Polished Chrome",
    description: "Mirror brilliance that sharpens light and line.",
    hex: "#D4D4D4",
    highlight: "#FFFFFF",
    shadow: "#8E8E8E",
  },
  {
    id: "brushed-nickel",
    name: "Brushed Nickel",
    description: "Quiet sophistication with a silken metallic grain.",
    hex: "#A8A29A",
    highlight: "#D4CFC8",
    shadow: "#6F6A63",
  },
  {
    id: "gunmetal",
    name: "Gunmetal",
    description: "Dark industrial elegance with a cool graphite sheen.",
    hex: "#4A4E55",
    highlight: "#7A808A",
    shadow: "#2A2D32",
  },
  {
    id: "satin-brass",
    name: "Satin Brass",
    description: "Muted golden warmth with a velvety, low-luster glow.",
    hex: "#B8A05A",
    highlight: "#D4C08A",
    shadow: "#7A652F",
  },
];
