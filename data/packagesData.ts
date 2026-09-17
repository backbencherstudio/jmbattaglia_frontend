import { PackageItem, AddonItem } from "@/types/packages";

export const initialPackages: PackageItem[] = [
  {
    id: "1",
    name: "Safe Home Package",
    category: "Resale Home",
    type: "Bundle",
    price: "$1,499",
    status: "Published",
    updated: "2 hours ago",
    shortDescription: "Safe Home Package ensures protection.",
    image: "/assets/images/safe_home_package.jpg",
    isRecommended: true,
    whyItMatters:
      "Buyers make a six-figure decision on a single walkthrough. A Signature inspection surfaces the repairs that change the negotiation.",
    featuresIncluded: [
      "Structural components & foundation",
      "Roofing system & attic space",
      "Electrical panels, wiring & outlets",
      "Heating & cooling systems (HVAC)",
    ],
  },
  {
    id: "2",
    name: "Residential Home Inspection",
    category: "Resale Home",
    type: "Single",
    price: "$538",
    status: "Published",
    updated: "30 minutes ago",
    shortDescription: "A comprehensive inspection of all accessible areas of the home.",
    image: "/assets/images/residential_home_inspection.jpg",
    isRecommended: false,
    whyItMatters:
      "A comprehensive walkthrough surfaces major safety issues and necessary repair costs before closing.",
    featuresIncluded: [
      "Structural components & foundation",
      "Roofing system & attic space",
      "Electrical panels, wiring & outlets",
      "Heating & cooling systems (HVAC)",
    ],
  },
  {
    id: "3",
    name: "Radon Testing Service",
    category: "Resale Home",
    type: "Single",
    price: "$525",
    status: "Draft",
    updated: "1 day ago",
    shortDescription: "Measurement of radon gas levels to ensure safe indoor air quality.",
    image: "/assets/images/radon_testing.jpg",
    isRecommended: false,
    whyItMatters:
      "Radon gas is an invisible health hazard. Testing protects your household from long-term exposure.",
    featuresIncluded: ["48-hour continuous monitor test", "Certified lab analysis report"],
  },
  {
    id: "4",
    name: "Pre-drywall inspection",
    category: "New Construction",
    type: "Single",
    price: "$465",
    status: "Published",
    updated: "3 days ago",
    shortDescription: "Catch issues before the walls go up.",
    image: "/assets/images/pre_drywall_inspection.jpg",
    isRecommended: false,
    whyItMatters:
      "Inspecting framing and rough-in plumbing/wiring before insulation ensures builder compliance.",
    featuresIncluded: ["Wall framing inspection", "Plumbing rough-in check", "Electrical rough-in check"],
  },
  {
    id: "5",
    name: "Final inspection",
    category: "New Construction",
    type: "Single",
    price: "$500",
    status: "Published",
    updated: "45 minutes ago",
    shortDescription: "Final walkthrough before you close.",
    image: "/assets/images/final_inspection.jpg",
    isRecommended: false,
    whyItMatters:
      "Verifies that all new construction punch-list items and builder standards are 100% complete.",
    featuresIncluded: ["Full system operation check", "Cosmetic & safety walkthrough"],
  },
];

export const initialAddons: AddonItem[] = [
  {
    id: "a1",
    name: "Chemical Balancing",
    price: "$79",
    image: "/assets/images/pool_inspection.jpg",
  },
  {
    id: "a2",
    name: "Spa Maintenance",
    price: "$149",
    image: "/assets/images/pool_inspection.jpg",
  },
  {
    id: "a3",
    name: "Filter Replacement",
    price: "$89",
    image: "/assets/images/pool_inspection.jpg",
  },
  {
    id: "a4",
    name: "Pool Inspection",
    price: "$199",
    image: "/assets/images/pool_inspection.jpg",
  },
];
