import { PackageOption, AddonOption, IncludedItem } from "@/types/packageAddons";

export const RESALE_PACKAGES: PackageOption[] = [
  {
    id: "safe-home-package",
    title: "Safe Home Package",
    isRecommended: true,
    priceText: "$1,236",
    priceNumeric: 1236,
    priceSubLabel: "Bundle Price",
    description: "Safe Home Package ensures protection.",
    image: "/assets/images/safe_home_package.jpg",
    whyItMatters:
      "Bundling five essential inspections into one package saves you $125 and eliminates the hassle of scheduling multiple vendors. One report, one visit, one call.",
    features: [
      "Structural components & foundation",
      "Roofing system & attic space",
      "Electrical panels, wiring & outlets",
      "Heating & cooling systems (HVAC)",
    ],
  },
  {
    id: "residential-home",
    title: "Residential Home Inspection",
    priceText: "$538",
    priceNumeric: 538,
    priceSubLabel: "Starting",
    description: "A comprehensive inspection of all accessible areas of the home.",
    image: "/assets/images/residential_home_inspection.jpg",
    whyItMatters:
      "A thorough top-to-bottom visual evaluation of the home's structure, roof, plumbing, electrical, and HVAC systems. Ensures peace of mind before closing.",
    features: [
      "Complete interior & exterior wall assessment",
      "Roof, attic & chimney inspection",
      "Electrical panel & outlet testing",
      "Plumbing & fixture checks",
    ],
  },
  {
    id: "radon-testing",
    title: "Radon Testing Service",
    priceText: "$525",
    priceNumeric: 525,
    priceSubLabel: "Starting",
    description: "Measurement of radon gas levels to ensure safe indoor air quality.",
    image: "/assets/images/radon_testing.jpg",
    whyItMatters:
      "Radon is an odorless, radioactive gas that poses serious health risks. Continuous testing provides 48-hour monitoring and certified EPA results.",
    features: [
      "48-hour continuous digital radon monitor",
      "EPA certified lab testing report",
      "Identify mitigation requirements",
      "Indoor air quality health safety check",
    ],
  },
];

export const NEW_CONSTRUCTION_PACKAGES: PackageOption[] = [
  {
    id: "pre-drywall",
    title: "Pre-drywall inspection",
    priceText: "$465",
    priceNumeric: 465,
    priceSubLabel: "Starting",
    description: "Catch issues before the walls go up.",
    image: "/assets/images/pre_drywall_inspection.jpg",
    whyItMatters:
      "Inspecting framing, wiring, plumbing rough-ins, and ductwork while walls are open catches costly structural and mechanical defects before drywall covers them up.",
    features: [
      "Wall framing, studs & load-bearing checks",
      "Rough plumbing & drain lines inspection",
      "Electrical wiring & junction box verification",
      "HVAC ducting & vent positioning check",
    ],
  },
  {
    id: "final-inspection",
    title: "Final inspection",
    priceText: "$500",
    priceNumeric: 500,
    priceSubLabel: "Starting",
    description: "Final walkthrough before you close.",
    image: "/assets/images/final_inspection.jpg",
    whyItMatters:
      "A comprehensive final walkthrough to verify that all systems are operational, finishes are completed to standard, and builder punch-list items are properly addressed.",
    features: [
      "Full operational test of all appliances & HVAC",
      "Interior finishes, doors & windows check",
      "Exterior grading, drainage & porch inspection",
      "Comprehensive builder punch-list report",
    ],
  },
];

export const ADDONS_CONFIG: AddonOption[] = [
  {
    id: "chemical-balancing",
    title: "Chemical Balancing",
    priceText: "$79",
    priceNumeric: 79,
  },
  {
    id: "spa-maintenance",
    title: "Spa Maintenance",
    priceText: "$149",
    priceNumeric: 149,
  },
  {
    id: "filter-replacement",
    title: "Filter Replacement",
    priceText: "$89",
    priceNumeric: 89,
  },
  {
    id: "pool-inspection",
    title: "Pool Inspection",
    priceText: "$199",
    priceNumeric: 199,
    image: "/assets/images/pool_inspection.jpg",
    whyItMatters:
      "Inspection of pool equipment including built-in spas. Added to home inspection. $199 and up based on size.",
    repairRisk: "$2,000–$10,000",
  },
];

export const PACKAGE_INCLUDED_ITEMS: Record<string, IncludedItem[]> = {
  "safe-home-package": [
    { name: "Termite Letter", priceText: "$75", priceNumeric: 75 },
    { name: "Mold Assessment", priceText: "$320", priceNumeric: 320 },
    { name: "Radon Testing", priceText: "$150", priceNumeric: 150 },
    { name: "Asbestos Inspection", priceText: "$200", priceNumeric: 200 },
    { name: "Lead Paint Evaluation", priceText: "$180", priceNumeric: 180 },
    { name: "Water Quality Analysis", priceText: "$130", priceNumeric: 130 },
  ],
  "residential-home": [
    { name: "Residential Home Inspection", priceText: "$538", priceNumeric: 538 },
  ],
  "radon-testing": [
    { name: "Radon Testing Service", priceText: "$525", priceNumeric: 525 },
  ],
  "pre-drywall": [
    { name: "Pre-drywall inspection", priceText: "$465", priceNumeric: 465 },
  ],
  "final-inspection": [
    { name: "Final inspection", priceText: "$500", priceNumeric: 500 },
  ],
};
