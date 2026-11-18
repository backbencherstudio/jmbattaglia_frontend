import { PackageOption, AddonOption, IncludedItem } from "@/types/packageAddons";

// Real ISN Package & Addon UUIDs
export const RESALE_PACKAGES: PackageOption[] = [
  {
    id: "e2ff6ec2-72b3-4e31-b06b-680c17aec45b",
    title: "Safe Home Package (SHP)",
    isRecommended: true,
    priceText: "$1,236",
    priceNumeric: 1236,
    priceSubLabel: "Bundle Price",
    description: "Complete 5-in-1 protection: Home Inspection, Termite Letter (WDO), Radon, Mold, and Drain Line Inspection. Saves over $200 compared to individual services.",
    image: "/assets/images/safe_home_package.jpg",
    videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
    whyItMatters:
      "Bundling five essential inspections into one package saves you $200+ and eliminates the hassle of scheduling multiple vendors. One comprehensive report, one visit, total peace of mind.",
    features: [
      "Residential Home Inspection (Structural, Roof, HVAC, Electrical, Plumbing)",
      "Official Termite Letter (Wood-Destroying Organism Clearance)",
      "48-Hour Continuous Digital Radon Testing & EPA Lab Report",
      "Mold Spore Air Sampling & Certified Laboratory Analysis",
      "Video Camera Drain Line / Sewer Scope Inspection",
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
    id: "ce804441-8f91-4498-90af-da79a9b70ec7",
    title: "Termite Letter / Official WDO Report",
    priceText: "$75",
    priceNumeric: 75,
    image: "/assets/images/safe_home_package.jpg",
    whyItMatters: "Official Wood-Destroying Organism clearance letter required by most mortgage lenders.",
    repairRisk: "$1,500–$8,000",
  },
  {
    id: "b8f550de-922f-4bbb-9457-5138cf091df3",
    title: "Continuous Digital Radon Testing",
    priceText: "$199",
    priceNumeric: 199,
    image: "/assets/images/radon_testing.jpg",
    whyItMatters: "48-hour continuous EPA certified radon gas monitoring to verify safe indoor breathing air.",
    repairRisk: "$1,200–$2,500",
  },
  {
    id: "18f92ce3-3224-4f4b-8d18-5a02251a24d1",
    title: "Sewer Scope / Drain Line Camera Inspection",
    priceText: "$250",
    priceNumeric: 250,
    image: "/assets/images/residential_home_inspection.jpg",
    whyItMatters: "High-definition video scope to detect broken pipes, tree root intrusion, and sewer blockages.",
    repairRisk: "$3,000–$15,000",
  },
  {
    id: "71da77a4-f11f-4462-a160-1ab33a5139bf",
    title: "Pool & Spa Equipment Inspection",
    priceText: "$199",
    priceNumeric: 199,
    image: "/assets/images/pool_inspection.jpg",
    whyItMatters:
      "Comprehensive inspection of pool pump, filtration, heater, safety barriers, and plumbing.",
    repairRisk: "$2,000–$10,000",
  },
  {
    id: "4b68db60-705a-4b77-a859-bc015cb86802",
    title: "Stucco / EIFS Moisture Intrusion Inspection",
    priceText: "$250",
    priceNumeric: 250,
    image: "/assets/images/pre_drywall_inspection.jpg",
    whyItMatters: "Electronic moisture probe and cladding evaluation to detect hidden framing rot.",
    repairRisk: "$5,000–$30,000",
  },
  {
    id: "283f51ec-0677-4c46-8e10-c4feae25ba11",
    title: "Manufactured / Mobile Home Foundation Cert",
    priceText: "$350",
    priceNumeric: 350,
    image: "/assets/images/final_inspection.jpg",
    whyItMatters: "HUD/FHA compliance engineering certificate verifying tie-downs and foundation stability.",
    repairRisk: "$2,500–$6,000",
  },
  {
    id: "cf646e29-d587-4279-bf75-01e16f318da2",
    title: "Mold Air Sampling & Lab Analysis",
    priceText: "$299",
    priceNumeric: 299,
    image: "/assets/images/safe_home_package.jpg",
    whyItMatters: "Certified indoor/outdoor spore trap air sampling with third-party accredited laboratory analysis.",
    repairRisk: "$2,000–$12,000",
  },
  {
    id: "76ec11d5-bcda-4e55-b461-ea3b715a3df8",
    title: "Infrared Thermal Imaging Scan",
    priceText: "$150",
    priceNumeric: 150,
    image: "/assets/images/residential_home_inspection.jpg",
    whyItMatters: "Infrared heat-loss and moisture detection scan to pinpoint hidden insulation gaps and leaks.",
    repairRisk: "$1,000–$4,000",
  },
  {
    id: "80ff8ec1-79b8-4c8d-8a15-0bfa7c3bcfa7",
    title: "Well Water Quality & Bacteria Lab Test",
    priceText: "$225",
    priceNumeric: 225,
    image: "/assets/images/safe_home_package.jpg",
    whyItMatters: "Laboratory analysis for coliform bacteria, E. coli, lead, nitrates, and turbidity.",
    repairRisk: "$1,500–$5,000",
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
