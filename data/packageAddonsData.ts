import { PackageOption, AddonOption, IncludedItem } from "@/types/packageAddons";

// Real ISN Package & Addon UUIDs
export const RESALE_PACKAGES: PackageOption[] = [
  {
    id: "e2ff6ec2-72b3-4e31-b06b-680c17aec45b",
    title: "Safe Home Package",
    isRecommended: true,
    priceText: "$1,236",
    priceNumeric: 1236,
    priceSubLabel: "Bundle Price",
    description: "Essential protection for you and your loved ones.",
    image: "/assets/images/safe_home_package.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
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
    id: "bbbc1155-310f-11e3-80f0-22000afd1674",
    title: "Residential Home Inspection",
    priceText: "$538",
    priceNumeric: 538,
    priceSubLabel: "Starting",
    description: "A comprehensive inspection of all accessible areas of the home.",
    image: "/assets/images/residential_home_inspection.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
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
    id: "e3526673-db55-489b-9bc3-018ecfd32c1b",
    title: "Radon Testing Service",
    priceText: "$525",
    priceNumeric: 525,
    priceSubLabel: "Starting",
    description: "Measurement of radon gas levels to ensure safe indoor air quality.",
    image: "/assets/images/radon_testing.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
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
    id: "c32cb328-765a-4239-a936-b35d2c04a1c5",
    title: "Pre-drywall inspection",
    priceText: "$465",
    priceNumeric: 465,
    priceSubLabel: "Starting",
    description: "Catch issues before the walls go up.",
    image: "/assets/images/pre_drywall_inspection.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
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
    id: "10e8a223-122f-42fc-91d6-9d43994558a4",
    title: "Final inspection",
    priceText: "$500",
    priceNumeric: 500,
    priceSubLabel: "Starting",
    description: "Final walkthrough before you close.",
    image: "/assets/images/final_inspection.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
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
    id: "a52111c7-212d-475a-948a-84f5b00c18d3",
    title: "Chemical Balancing",
    priceText: "$79",
    priceNumeric: 79,
    whyItMatters: "Water chemistry analysis and balancing ensure a healthy, safe swimming environment.",
  },
  {
    id: "56a45531-1ba6-432f-8cc5-2626337ac231",
    title: "Spa Maintenance",
    priceText: "$149",
    priceNumeric: 149,
    whyItMatters: "Thorough hot tub and spa inspection including heating elements, jets, and safety controls.",
  },
  {
    id: "0f347f94-0f6a-4560-9ec0-8f4563f5f722",
    title: "Filter Replacement",
    priceText: "$89",
    priceNumeric: 89,
    whyItMatters: "Clogged or degraded filters cause poor circulation and short pump life.",
  },
  {
    id: "71da77a4-f11f-4462-a160-1ab33a5139bf",
    title: "Pool Inspection",
    priceText: "$199",
    priceNumeric: 199,
    image: "/assets/images/pool_inspection.jpg",
    whyItMatters:
      "Inspection of pool equipment including built-in spas. Added to home inspection.",
    repairRisk: "$2,000–$10,000",
  },
];

export const PACKAGE_INCLUDED_ITEMS: Record<string, IncludedItem[]> = {
  "e2ff6ec2-72b3-4e31-b06b-680c17aec45b": [
    { name: "Residential Inspection", priceText: "$622.50", priceNumeric: 622.5 },
    { name: "Termite Letter", priceText: "$75", priceNumeric: 75 },
    { name: "Radon Test", priceText: "$199", priceNumeric: 199 },
    { name: "Mold Test", priceText: "$299", priceNumeric: 299 },
    { name: "Drain Line Inspection", priceText: "$250", priceNumeric: 250 },
  ],
  "safe-home-package": [
    { name: "Residential Inspection", priceText: "$622.50", priceNumeric: 622.5 },
    { name: "Termite Letter", priceText: "$75", priceNumeric: 75 },
    { name: "Radon Test", priceText: "$199", priceNumeric: 199 },
    { name: "Mold Test", priceText: "$299", priceNumeric: 299 },
    { name: "Drain Line Inspection", priceText: "$250", priceNumeric: 250 },
  ],
  "c32cb328-765a-4239-a936-b35d2c04a1c5": [
    { name: "New Construction Inspection - Pre-Drywall", priceText: "$465", priceNumeric: 465 },
  ],
  "10e8a223-122f-42fc-91d6-9d43994558a4": [
    { name: "New Construction - Final Inspection", priceText: "$500", priceNumeric: 500 },
  ],
};
