import type { CatalogFinishOption, CatalogProduct } from "@/types/catalog";
import { FINISH_MOOD_IMAGES } from "@/lib/catalog/finish-gallery";

const FINISH = {
  polishedBrass: {
    name: "Polished Brass",
    slug: "polished-brass",
    hex: "#C5A45A",
  },
  antiqueBrass: {
    name: "Antique Brass",
    slug: "antique-brass",
    hex: "#9A7B3C",
  },
  agedBrass: {
    name: "Aged Brass",
    slug: "aged-brass",
    hex: "#7A6236",
  },
  matteBlack: {
    name: "Matte Black",
    slug: "matte-black",
    hex: "#1A1A1A",
  },
  chrome: {
    name: "Chrome",
    slug: "chrome",
    hex: "#D4D4D4",
  },
  // Legacy aliases — existing product calls still resolve
  brushedGold: {
    name: "Polished Brass",
    slug: "polished-brass",
    hex: "#C5A45A",
  },
  satinBrass: {
    name: "Antique Brass",
    slug: "antique-brass",
    hex: "#9A7B3C",
  },
  brushedNickel: {
    name: "Aged Brass",
    slug: "aged-brass",
    hex: "#7A6236",
  },
  polishedChrome: {
    name: "Chrome",
    slug: "chrome",
    hex: "#D4D4D4",
  },
  gunmetal: {
    name: "Matte Black",
    slug: "matte-black",
    hex: "#1A1A1A",
  },
} as const;

const STANDARD_FINISHES: Array<{
  key: keyof typeof FINISH;
  delta?: number;
}> = [
  { key: "polishedBrass" },
  { key: "antiqueBrass", delta: 40 },
  { key: "agedBrass", delta: 60 },
  { key: "matteBlack", delta: 30 },
  { key: "chrome", delta: -50 },
];

/** Always exposes the five VARENO atelier finishes with finish photography. */
function finishes(
  productKey: string,
  basePrice: number,
  _legacyOptions?: Array<{
    key: keyof typeof FINISH;
    delta?: number;
    available?: boolean;
  }>,
): CatalogFinishOption[] {
  return STANDARD_FINISHES.map(({ key, delta = 0 }) => {
    const finish = FINISH[key];
    const skuSuffix = finish.slug
      .split("-")
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    return {
      id: `${productKey}-${finish.slug}`,
      name: finish.name,
      slug: finish.slug,
      hex: finish.hex,
      sku: `VAR-${productKey.toUpperCase()}-${skuSuffix}`,
      price: basePrice + delta,
      available: true,
      images: FINISH_MOOD_IMAGES[finish.slug] ?? [],
    };
  });
}

const IMG = {
  kitchenWarm:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=1600&q=90",
  kitchenBright:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&q=90",
  bathFaucet:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=90",
  bathMarble:
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=90",
  bathClassic:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=90",
  bathSpa:
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=90",
  interiorLuxe:
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&q=90",
  bathModern:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=90",
} as const;

function gallery(...urls: string[]): string[] {
  return urls;
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: "prod-heritage-arbour",
    slug: "heritage-arbour-bridge",
    collection: "heritage",
    name: "Arbour Bridge",
    category: "bathroom",
    price: 1280,
    sku: "HAJ-ARB-BG",
    shortDescription: "A classic bridge faucet with refined arch and quiet precision.",
    marketingDescription:
      "Arbour Bridge recalls heritage bath architecture with a lighter contemporary hand. Solid brass construction, ceramic disc valves, and a gracefully proportioned spout make it equally at home in restored townhouses and new traditional interiors.",
    seoTitle: "Arbour Bridge Faucet | Heritage Collection | VARENO",
    seoDescription:
      "Shop the Arbour Bridge bathroom faucet from VARENO Heritage Collection. Solid brass, ceramic disc valves, and timeless bridge design.",
    featuredImage: IMG.bathClassic,
    gallery: gallery(IMG.bathClassic, IMG.bathMarble, IMG.interiorLuxe),
    dimensions: { height: '8.7"', spoutReach: '5.5"', spoutHeight: '6.1"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("arb", 1280, [
      { key: "brushedGold" },
      { key: "brushedNickel", delta: -40 },
      { key: "polishedChrome", delta: -80 },
    ]),
  },
  {
    id: "prod-heritage-eldon",
    slug: "heritage-eldon-widespread",
    collection: "heritage",
    name: "Eldon Widespread",
    category: "bathroom",
    price: 1420,
    sku: "HAJ-ELD-BN",
    shortDescription: "Three-piece widespread elegance with cross-handle optionality.",
    marketingDescription:
      "Eldon Widespread delivers ceremonial presence without excess. Designed for 8–16\" centers, it pairs sculpted handles with a low-profile spout for vanities that deserve quiet authority.",
    seoTitle: "Eldon Widespread Faucet | Heritage Collection | VARENO",
    seoDescription:
      "Discover the Eldon Widespread bathroom faucet by VARENO. Heritage proportions, solid brass, and premium finish options.",
    featuredImage: IMG.bathSpa,
    gallery: gallery(IMG.bathSpa, IMG.bathClassic, IMG.bathMarble),
    dimensions: { height: '6.3"', spoutReach: '5.2"', maxDeckThickness: '1.5"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("eld", 1420, [
      { key: "brushedNickel" },
      { key: "satinBrass", delta: 60 },
      { key: "matteBlack", delta: 40 },
    ]),
  },
  {
    id: "prod-heritage-cairn",
    slug: "heritage-cairn-kitchen",
    collection: "heritage",
    name: "Cairn Kitchen",
    category: "kitchen",
    price: 1180,
    sku: "HAJ-CAI-PC",
    shortDescription: "High-arc kitchen faucet with heritage detailing and modern flow.",
    marketingDescription:
      "Cairn brings heritage character to the working kitchen. A high-arc spout clears tall vessels while a dual-function spray supports both preparation and cleanup with effortless control.",
    seoTitle: "Cairn Kitchen Faucet | Heritage Collection | VARENO",
    seoDescription:
      "VARENO Cairn kitchen faucet—high-arc heritage design, dual spray, and durable PVD finishes for American homes.",
    featuredImage: IMG.kitchenWarm,
    gallery: gallery(IMG.kitchenWarm, IMG.kitchenBright, IMG.interiorLuxe),
    dimensions: { height: '16.9"', spoutReach: '8.3"', spoutHeight: '9.0"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("cai", 1180, [
      { key: "polishedChrome" },
      { key: "brushedGold", delta: 120 },
      { key: "brushedNickel", delta: 40 },
    ]),
  },
  {
    id: "prod-heritage-rowen",
    slug: "heritage-rowen-vessel",
    collection: "heritage",
    name: "Rowen Vessel",
    category: "bathroom",
    price: 980,
    sku: "HAJ-ROW-SB",
    shortDescription: "Tall vessel faucet with restrained classical lines.",
    marketingDescription:
      "Rowen is proportioned for vessel basins—elevated, calm, and deliberate. The slender body and tapered spout create a vertical accent that reads as architecture, not accessory.",
    seoTitle: "Rowen Vessel Faucet | Heritage Collection | VARENO",
    seoDescription:
      "Shop Rowen Vessel by VARENO—tall bathroom faucet for vessel sinks in satin brass, chrome, and brushed gold.",
    featuredImage: IMG.bathMarble,
    gallery: gallery(IMG.bathMarble, IMG.bathFaucet, IMG.bathSpa),
    dimensions: { height: '14.8"', spoutReach: '4.9"', spoutHeight: '12.2"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("row", 980, [
      { key: "satinBrass" },
      { key: "brushedGold", delta: 80 },
      { key: "polishedChrome", delta: -40 },
    ]),
  },
  {
    id: "prod-signature-eclipse",
    slug: "signature-eclipse-kitchen",
    collection: "signature",
    name: "Eclipse Pull-Down",
    category: "kitchen",
    price: 1290,
    sku: "HAJ-ECL-BG",
    shortDescription: "Magnetic docking pull-down kitchen faucet in signature proportions.",
    marketingDescription:
      "Eclipse is the VARENO kitchen essential—commercial capability with residential restraint. Magnetic docking, dual spray modes, and spot-resistant finishes keep the silhouette pristine through daily use.",
    seoTitle: "Eclipse Pull-Down Kitchen Faucet | Signature | VARENO",
    seoDescription:
      "Eclipse Pull-Down by VARENO—magnetic dock, dual spray, and luxury finishes including brushed gold and matte black.",
    featuredImage: IMG.kitchenBright,
    gallery: gallery(IMG.kitchenBright, IMG.kitchenWarm, IMG.interiorLuxe),
    dimensions: { height: '17.3"', spoutReach: '8.5"', spoutHeight: '9.4"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("ecl", 1290, [
      { key: "brushedGold" },
      { key: "matteBlack", delta: -40 },
      { key: "brushedNickel", delta: -20 },
    ]),
  },
  {
    id: "prod-signature-nova",
    slug: "signature-nova-single",
    collection: "signature",
    name: "Nova Single-Hole",
    category: "bathroom",
    price: 1090,
    sku: "HAJ-NOV-MB",
    shortDescription: "Single-lever bathroom faucet with architectural restraint.",
    marketingDescription:
      "Nova pares the bath faucet to essential geometry. A single lever, precise ceramic cartridge, and matte or metallic finishes deliver a calm focal point for contemporary vanities.",
    seoTitle: "Nova Single-Hole Bathroom Faucet | Signature | VARENO",
    seoDescription:
      "Nova Single-Hole faucet from VARENO Signature Collection—matte black, brushed gold, and polished chrome options.",
    featuredImage: IMG.bathFaucet,
    gallery: gallery(IMG.bathFaucet, IMG.bathModern, IMG.bathMarble),
    dimensions: { height: '11.8"', spoutReach: '5.1"', spoutHeight: '7.6"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("nov", 1090, [
      { key: "matteBlack" },
      { key: "brushedGold", delta: 80 },
      { key: "polishedChrome", delta: -60 },
    ]),
  },
  {
    id: "prod-signature-luna",
    slug: "signature-luna-wall",
    collection: "signature",
    name: "Luna Wall Mount",
    category: "bathroom",
    price: 980,
    sku: "HAJ-LUN-PC",
    shortDescription: "Wall-mounted mixer that clears the deck with elegant reach.",
    marketingDescription:
      "Luna Wall Mount frees the vanity surface and frames the basin with a horizontal line of quiet luxury. Concealed hardware and an anti-limescale aerator keep performance as refined as the form.",
    seoTitle: "Luna Wall Mount Faucet | Signature Collection | VARENO",
    seoDescription:
      "Luna Wall Mount by VARENO—wall-mounted bathroom faucet with polished chrome, gunmetal, and brushed nickel finishes.",
    featuredImage: IMG.bathClassic,
    gallery: gallery(IMG.bathClassic, IMG.bathModern, IMG.bathFaucet),
    dimensions: { height: '2.8"', spoutReach: '7.0"', spoutHeight: '2.2"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("lun", 980, [
      { key: "polishedChrome" },
      { key: "gunmetal", delta: 70 },
      { key: "brushedNickel", delta: 40 },
    ]),
  },
  {
    id: "prod-signature-atria",
    slug: "signature-atria-widespread",
    collection: "signature",
    name: "Atria Widespread",
    category: "bathroom",
    price: 1490,
    sku: "HAJ-ATR-BN",
    shortDescription: "Architect-favored widespread set with balanced proportions.",
    marketingDescription:
      "Atria is specified when the vanity must feel intentional. Separate controls, a composed spout, and museum-grade finishes make it a Signature Collection cornerstone for residential and boutique hospitality projects.",
    seoTitle: "Atria Widespread Faucet | Signature Collection | VARENO",
    seoDescription:
      "Atria Widespread by VARENO—architectural bathroom faucet in brushed nickel, brushed gold, and matte black.",
    featuredImage: IMG.bathMarble,
    gallery: gallery(IMG.bathMarble, IMG.interiorLuxe, IMG.bathSpa),
    dimensions: { height: '6.8"', spoutReach: '5.6"', maxDeckThickness: '1.75"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("atr", 1490, [
      { key: "brushedNickel" },
      { key: "brushedGold", delta: 100 },
      { key: "matteBlack", delta: 60 },
    ]),
  },
  {
    id: "prod-imperial-sovereign",
    slug: "imperial-sovereign-tub",
    collection: "imperial",
    name: "Sovereign Tub Filler",
    category: "bathroom",
    price: 4890,
    sku: "HAJ-SOV-PC",
    shortDescription: "Floor-mounted tub filler with ceremonial scale and hand shower.",
    marketingDescription:
      "Sovereign commands the bathing room. A floor-standing column, thermostatic control, and integrated hand shower deliver resort-level ritual for master suites and spa-inspired residences.",
    seoTitle: "Sovereign Floor Tub Filler | Imperial Collection | VARENO",
    seoDescription:
      "Sovereign Tub Filler by VARENO—floor-mounted luxury tub filler with hand shower in chrome, gold, and gunmetal.",
    featuredImage: IMG.bathSpa,
    gallery: gallery(IMG.bathSpa, IMG.interiorLuxe, IMG.bathModern),
    dimensions: { height: '39.4"', spoutReach: '9.2"', spoutHeight: '32.0"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "made_to_order",
    finishOptions: finishes("sov", 4890, [
      { key: "polishedChrome" },
      { key: "brushedGold", delta: 300 },
      { key: "gunmetal", delta: 180 },
    ]),
  },
  {
    id: "prod-imperial-regent",
    slug: "imperial-regent-bridge",
    collection: "imperial",
    name: "Regent Bridge",
    category: "bathroom",
    price: 2180,
    sku: "HAJ-REG-BG",
    shortDescription: "Grand bridge faucet with imperial proportions and jeweled detailing.",
    marketingDescription:
      "Regent Bridge is composed for statement vanities. Broader stance, richer finish depth, and a confident arch create a centerpiece that still performs with everyday ease.",
    seoTitle: "Regent Bridge Bathroom Faucet | Imperial | VARENO",
    seoDescription:
      "Regent Bridge from VARENO Imperial Collection—luxury bridge faucet in brushed gold, satin brass, and chrome.",
    featuredImage: IMG.bathClassic,
    gallery: gallery(IMG.bathClassic, IMG.bathMarble, IMG.bathFaucet),
    dimensions: { height: '10.2"', spoutReach: '6.0"', spoutHeight: '7.4"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("reg", 2180, [
      { key: "brushedGold" },
      { key: "satinBrass", delta: -40 },
      { key: "polishedChrome", delta: -120 },
    ]),
  },
  {
    id: "prod-imperial-monarch",
    slug: "imperial-monarch-kitchen",
    collection: "imperial",
    name: "Monarch Culinary",
    category: "kitchen",
    price: 1890,
    sku: "HAJ-MON-GM",
    shortDescription: "Professional-grade kitchen faucet with imperial finish depth.",
    marketingDescription:
      "Monarch Culinary pairs chef-level function with estate-level presence. Articulated spray, generous clearance, and deep PVD finishes suit statement kitchens that work as hard as they look.",
    seoTitle: "Monarch Culinary Kitchen Faucet | Imperial | VARENO",
    seoDescription:
      "Monarch Culinary by VARENO—premium kitchen faucet with gunmetal, brushed gold, and matte black finishes.",
    featuredImage: IMG.kitchenWarm,
    gallery: gallery(IMG.kitchenWarm, IMG.kitchenBright, IMG.interiorLuxe),
    dimensions: { height: '18.1"', spoutReach: '9.0"', spoutHeight: '10.2"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("mon", 1890, [
      { key: "gunmetal" },
      { key: "brushedGold", delta: 110 },
      { key: "matteBlack", delta: 40 },
    ]),
  },
  {
    id: "prod-imperial-crown",
    slug: "imperial-crown-thermostatic",
    collection: "imperial",
    name: "Crown Thermostatic",
    category: "bathroom",
    price: 2680,
    sku: "HAJ-CRW-BN",
    shortDescription: "Thermostatic shower trim with imperial control and calm geometry.",
    marketingDescription:
      "Crown Thermostatic brings precise temperature control to the wet room with Imperial Collection composure. Designed for specification-grade shower systems in luxury residences.",
    seoTitle: "Crown Thermostatic Shower Trim | Imperial | VARENO",
    seoDescription:
      "Crown Thermostatic by VARENO—luxury shower trim with brushed nickel, chrome, and brushed gold finishes.",
    featuredImage: IMG.bathModern,
    gallery: gallery(IMG.bathModern, IMG.bathSpa, IMG.interiorLuxe),
    dimensions: { height: '7.5"', spoutReach: "Wall trim" },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "made_to_order",
    finishOptions: finishes("crw", 2680, [
      { key: "brushedNickel" },
      { key: "polishedChrome", delta: -80 },
      { key: "brushedGold", delta: 140 },
    ]),
  },
  {
    id: "prod-atelier-line",
    slug: "atelier-line-minimal",
    collection: "atelier",
    name: "Line Minimal",
    category: "bathroom",
    price: 1320,
    sku: "HAJ-LIN-MB",
    shortDescription: "Studio-pure single-hole faucet reduced to a single continuous gesture.",
    marketingDescription:
      "Line Minimal is drawn for designers who edit relentlessly. One unbroken silhouette, exacting tolerances, and matte or metallic skins that read as material studies rather than fixtures.",
    seoTitle: "Line Minimal Bathroom Faucet | Atelier | VARENO",
    seoDescription:
      "Line Minimal by VARENO Atelier—ultra-refined single-hole faucet for contemporary architecture.",
    featuredImage: IMG.bathFaucet,
    gallery: gallery(IMG.bathFaucet, IMG.bathModern, IMG.bathMarble),
    dimensions: { height: '10.4"', spoutReach: '5.0"', spoutHeight: '6.8"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("lin", 1320, [
      { key: "matteBlack" },
      { key: "brushedNickel", delta: 20 },
      { key: "gunmetal", delta: 50 },
    ]),
  },
  {
    id: "prod-atelier-folio",
    slug: "atelier-folio-wall",
    collection: "atelier",
    name: "Folio Wall",
    category: "bathroom",
    price: 1540,
    sku: "HAJ-FOL-BG",
    shortDescription: "Wall spout and handle composition for gallery-like baths.",
    marketingDescription:
      "Folio Wall treats water delivery as a graphic element on stone or plaster. Separated controls and a slender spout give ateliers and high-design residences a tailored wet zone.",
    seoTitle: "Folio Wall Mount Faucet | Atelier Collection | VARENO",
    seoDescription:
      "Folio Wall by VARENO—designer wall-mounted faucet in brushed gold, chrome, and gunmetal.",
    featuredImage: IMG.bathModern,
    gallery: gallery(IMG.bathModern, IMG.bathClassic, IMG.interiorLuxe),
    dimensions: { height: '2.4"', spoutReach: '7.4"', spoutHeight: '1.8"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("fol", 1540, [
      { key: "brushedGold" },
      { key: "polishedChrome", delta: -90 },
      { key: "gunmetal", delta: 40 },
    ]),
  },
  {
    id: "prod-atelier-vector",
    slug: "atelier-vector-kitchen",
    collection: "atelier",
    name: "Vector Kitchen",
    category: "kitchen",
    price: 1680,
    sku: "HAJ-VEC-BN",
    shortDescription: "Angular culinary faucet engineered for open-plan luxury kitchens.",
    marketingDescription:
      "Vector is for kitchens that live in view. Crisp geometry, pull-down utility, and Atelier-level finish quality keep the island composition sharp from morning light through late entertaining.",
    seoTitle: "Vector Kitchen Faucet | Atelier Collection | VARENO",
    seoDescription:
      "Vector Kitchen by VARENO Atelier—architectural pull-down faucet with premium finish options.",
    featuredImage: IMG.kitchenBright,
    gallery: gallery(IMG.kitchenBright, IMG.kitchenWarm, IMG.bathMarble),
    dimensions: { height: '17.8"', spoutReach: '8.7"', spoutHeight: '9.6"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("vec", 1680, [
      { key: "brushedNickel" },
      { key: "matteBlack", delta: 30 },
      { key: "brushedGold", delta: 120 },
    ]),
  },
  {
    id: "prod-atelier-caliper",
    slug: "atelier-caliper-widespread",
    collection: "atelier",
    name: "Caliper Widespread",
    category: "bathroom",
    price: 1760,
    sku: "HAJ-CAL-SB",
    shortDescription: "Measured widespread set with atelier-grade handle geometry.",
    marketingDescription:
      "Caliper is drafted like instrument design—handles and spout aligned to a clear visual grid. Ideal for custom vanities where every millimeter is intentional.",
    seoTitle: "Caliper Widespread Faucet | Atelier | VARENO",
    seoDescription:
      "Caliper Widespread by VARENO—precision bathroom faucet for designer vanities in satin brass and more.",
    featuredImage: IMG.bathSpa,
    gallery: gallery(IMG.bathSpa, IMG.bathFaucet, IMG.bathMarble),
    dimensions: { height: '6.5"', spoutReach: '5.4"', maxDeckThickness: '1.5"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "made_to_order",
    finishOptions: finishes("cal", 1760, [
      { key: "satinBrass" },
      { key: "brushedGold", delta: 80 },
      { key: "matteBlack", delta: 50 },
    ]),
  },
  {
    id: "prod-element-pure",
    slug: "element-pure-single",
    collection: "element",
    name: "Pure Single",
    category: "bathroom",
    price: 890,
    sku: "HAJ-PUR-PC",
    shortDescription: "Essential single-hole faucet distilled to material and motion.",
    marketingDescription:
      "Pure Single is Element Collection distilled: no ornament, no noise—only finish, proportion, and a lever that moves with quiet certainty. The foundation piece for modern baths.",
    seoTitle: "Pure Single Bathroom Faucet | Element Collection | VARENO",
    seoDescription:
      "Pure Single by VARENO Element—essential luxury bathroom faucet in chrome, nickel, and matte black.",
    featuredImage: IMG.bathFaucet,
    gallery: gallery(IMG.bathFaucet, IMG.bathModern, IMG.bathClassic),
    dimensions: { height: '9.6"', spoutReach: '4.8"', spoutHeight: '6.2"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("pur", 890, [
      { key: "polishedChrome" },
      { key: "brushedNickel", delta: 40 },
      { key: "matteBlack", delta: 60 },
    ]),
  },
  {
    id: "prod-element-axis",
    slug: "element-axis-kitchen",
    collection: "element",
    name: "Axis Kitchen",
    category: "kitchen",
    price: 1040,
    sku: "HAJ-AXI-MB",
    shortDescription: "Clean-lined kitchen faucet for everyday architectural living.",
    marketingDescription:
      "Axis Kitchen is the Element workhorse—clear silhouette, reliable pull-down spray, and finishes that hold up to real life without losing their composure.",
    seoTitle: "Axis Kitchen Faucet | Element Collection | VARENO",
    seoDescription:
      "Axis Kitchen by VARENO—modern pull-down kitchen faucet in matte black, chrome, and brushed gold.",
    featuredImage: IMG.kitchenWarm,
    gallery: gallery(IMG.kitchenWarm, IMG.kitchenBright, IMG.bathModern),
    dimensions: { height: '16.4"', spoutReach: '8.1"', spoutHeight: '8.8"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("axi", 1040, [
      { key: "matteBlack" },
      { key: "polishedChrome", delta: -50 },
      { key: "brushedGold", delta: 90 },
    ]),
  },
  {
    id: "prod-element-halo",
    slug: "element-halo-centerset",
    collection: "element",
    name: "Halo Centerset",
    category: "bathroom",
    price: 760,
    sku: "HAJ-HAL-BN",
    shortDescription: "Compact centerset faucet with soft radius and clear utility.",
    marketingDescription:
      "Halo Centerset brings Element clarity to smaller vanities and powder rooms. Soft radii, dependable cartridge performance, and finishes that coordinate across the home.",
    seoTitle: "Halo Centerset Bathroom Faucet | Element | VARENO",
    seoDescription:
      "Halo Centerset by VARENO Element—compact luxury bathroom faucet for powder rooms and secondary baths.",
    featuredImage: IMG.bathClassic,
    gallery: gallery(IMG.bathClassic, IMG.bathFaucet, IMG.bathSpa),
    dimensions: { height: '6.0"', spoutReach: '4.3"', maxDeckThickness: '1.25"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("hal", 760, [
      { key: "brushedNickel" },
      { key: "polishedChrome", delta: -30 },
      { key: "satinBrass", delta: 70 },
    ]),
  },
  {
    id: "prod-element-drift",
    slug: "element-drift-wall",
    collection: "element",
    name: "Drift Wall",
    category: "bathroom",
    price: 920,
    sku: "HAJ-DRI-GM",
    shortDescription: "Simple wall-mounted faucet for uncluttered modern baths.",
    marketingDescription:
      "Drift Wall keeps the deck clear and the composition light. An Element Collection essential for spa baths, floating vanities, and rooms where material and light do the talking.",
    seoTitle: "Drift Wall Mount Faucet | Element Collection | VARENO",
    seoDescription:
      "Drift Wall by VARENO—minimal wall-mounted bathroom faucet in gunmetal, chrome, and brushed nickel.",
    featuredImage: IMG.bathModern,
    gallery: gallery(IMG.bathModern, IMG.bathMarble, IMG.bathFaucet),
    dimensions: { height: '2.2"', spoutReach: '6.6"', spoutHeight: '1.6"' },
    material: "Solid brass with PVD finish",
    warranty: "Limited lifetime warranty",
    availability: "in_stock",
    finishOptions: finishes("dri", 920, [
      { key: "gunmetal" },
      { key: "polishedChrome", delta: -40 },
      { key: "brushedNickel", delta: 20 },
    ]),
  },
];
