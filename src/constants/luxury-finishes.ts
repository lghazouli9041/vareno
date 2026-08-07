export type LuxuryFinish = {
  id: string;
  name: string;
  description: string;
  hex: string;
  highlight: string;
  shadow: string;
};

/** The five atelier finishes offered across the VARENO collection. */
export const luxuryFinishes: LuxuryFinish[] = [
  {
    id: "polished-brass",
    name: "Polished Brass",
    description: "Mirror warmth — living gold with a luminous, hand-polished face.",
    hex: "#C5A45A",
    highlight: "#E8D49A",
    shadow: "#8A6B2E",
  },
  {
    id: "antique-brass",
    name: "Antique Brass",
    description: "Softened heritage tone with quiet depth and European character.",
    hex: "#9A7B3C",
    highlight: "#C4A66A",
    shadow: "#5C4520",
  },
  {
    id: "aged-brass",
    name: "Aged Brass",
    description: "Time-worn patina — the richness of brass that has lived well.",
    hex: "#7A6236",
    highlight: "#A88B52",
    shadow: "#3F3218",
  },
  {
    id: "matte-black",
    name: "Matte Black",
    description: "Architectural restraint with a soft, non-reflective presence.",
    hex: "#1A1A1A",
    highlight: "#3A3A3A",
    shadow: "#0A0A0A",
  },
  {
    id: "chrome",
    name: "Chrome",
    description: "Cool brilliance that sharpens line and light with clarity.",
    hex: "#D4D4D4",
    highlight: "#FFFFFF",
    shadow: "#8E8E8E",
  },
];
