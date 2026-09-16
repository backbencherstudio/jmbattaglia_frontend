"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StepProps } from "@/types/stepper";

export interface PackageOption {
  id: string;
  title: string;
  isRecommended?: boolean;
  priceText: string;
  priceNumeric: number;
  priceSubLabel?: string;
  description: string;
  image?: string;
  whyItMatters?: string;
  features?: string[];
}

export interface AddonOption {
  id: string;
  title: string;
  priceText: string;
  priceNumeric: number;
  image?: string;
  whyItMatters?: string;
  repairRisk?: string;
}

export interface IncludedItem {
  name: string;
  priceText: string;
}

const RESALE_PACKAGES: PackageOption[] = [
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
  },
  {
    id: "radon-testing",
    title: "Radon Testing Service",
    priceText: "$525",
    priceNumeric: 525,
    priceSubLabel: "Starting",
    description: "Measurement of radon gas levels to ensure safe indoor air quality.",
  },
];

const NEW_CONSTRUCTION_PACKAGES: PackageOption[] = [
  {
    id: "pre-drywall",
    title: "Pre-drywall inspection",
    priceText: "$465",
    priceNumeric: 465,
    priceSubLabel: "Starting",
    description: "Catch issues before the walls go up.",
  },
  {
    id: "final-inspection",
    title: "Final inspection",
    priceText: "$500",
    priceNumeric: 500,
    priceSubLabel: "Starting",
    description: "Final walkthrough before you close.",
  },
];

const ADDONS_CONFIG: AddonOption[] = [
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

const PACKAGE_INCLUDED_ITEMS: Record<string, IncludedItem[]> = {
  "safe-home-package": [
    { name: "Termite Letter", priceText: "$75" },
    { name: "Mold Assessment", priceText: "$320" },
    { name: "Radon Testing", priceText: "$150" },
    { name: "Asbestos Inspection", priceText: "$200" },
    { name: "Lead Paint Evaluation", priceText: "$180" },
    { name: "Water Quality Analysis", priceText: "$130" },
  ],
  "residential-home": [
    { name: "Residential Home Inspection", priceText: "$538" },
  ],
  "radon-testing": [
    { name: "Radon Testing Service", priceText: "$525" },
  ],
  "pre-drywall": [
    { name: "Pre-drywall inspection", priceText: "$465" },
  ],
  "final-inspection": [
    { name: "Final inspection", priceText: "$500" },
  ],
};

export const PackageAddonsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const isNewConstruction = formData.inspectionKind === "new-construction";
  const packagesList = isNewConstruction ? NEW_CONSTRUCTION_PACKAGES : RESALE_PACKAGES;

  // Initialize selected package if not set or invalid for current inspection type
  useEffect(() => {
    const validIds = packagesList.map((p) => p.id);
    if (!formData.selectedPackage || !validIds.includes(formData.selectedPackage)) {
      updateFormData({ selectedPackage: validIds[0] });
    }
  }, [formData.inspectionKind, packagesList, formData.selectedPackage, updateFormData]);

  // Default addons to Chemical Balancing if not set
  useEffect(() => {
    if (!formData.selectedAddons) {
      updateFormData({ selectedAddons: ["chemical-balancing"] });
    }
  }, [formData.selectedAddons, updateFormData]);

  // Expandable accordions state
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    isNewConstruction ? null : "safe-home-package"
  );
  const [expandedAddonId, setExpandedAddonId] = useState<string | null>("pool-inspection");

  const selectedPackageId =
    formData.selectedPackage || (isNewConstruction ? "pre-drywall" : "safe-home-package");
  const selectedAddons = formData.selectedAddons || ["chemical-balancing"];

  const handleSelectPackage = (pkgId: string) => {
    updateFormData({ selectedPackage: pkgId });
    clearError("selectedPackage");
  };

  const togglePackageExpand = (pkgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPackageId((prev) => (prev === pkgId ? null : pkgId));
  };

  const toggleAddonSelect = (addonId: string) => {
    const current = [...selectedAddons];
    const exists = current.includes(addonId);
    const updated = exists ? current.filter((id) => id !== addonId) : [...current, addonId];
    updateFormData({ selectedAddons: updated });
  };

  const toggleAddonExpand = (addonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAddonId((prev) => (prev === addonId ? null : addonId));
  };

  // Selected object references for summary card
  const selectedPkgObj = packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];
  const selectedAddonObjects = ADDONS_CONFIG.filter((a) => selectedAddons.includes(a.id));
  const includedItems = PACKAGE_INCLUDED_ITEMS[selectedPackageId] || [
    { name: selectedPkgObj?.title || "Home Inspection", priceText: selectedPkgObj?.priceText || "$0" },
  ];

  // Calculate total amount
  const totalAmount =
    (selectedPkgObj?.priceNumeric || 0) +
    selectedAddonObjects.reduce((acc, a) => acc + a.priceNumeric, 0);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      {/* Left Column: Form Content */}
      <div className="flex-1 w-full flex flex-col gap-6">
        {/* Header section */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-main">
            Choose Your Inspection Package
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-sub mt-1.5 leading-normal">
            All packages include a full digital report delivered within 24 hours. Select the one that fits your property and needs.
          </p>
        </div>

        {/* Pricing callout banner */}
        <div className="bg-primary-subtle/40 border border-primary/30 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-primary-hover">
            Pricing is calculated based on your property details and synced with ISN.
          </p>
        </div>

        {/* SECTION 1: Choose your package */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-1">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-main">
            Choose your package
          </h3>

          <div className="flex flex-col gap-3.5">
            {packagesList.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const isExpanded = expandedPackageId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border ${
                    isSelected
                      ? "border border-primary bg-primary-subtle/30 shadow-xs"
                      : "border-hairline bg-canvas hover:border-gray-300"
                  }`}
                >
                  {/* Header Row */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Radio circle */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-2 border-primary bg-white"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>

                      {/* Title + Subtitle */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-base sm:text-lg text-main leading-snug">
                            {pkg.title}
                          </span>
                          {pkg.isRecommended && (
                            <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-sub mt-0.5 truncate">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    {/* Price + Accordion toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] sm:text-xs text-sub font-medium mr-1">
                          {pkg.priceSubLabel}
                        </span>
                        <span
                          className={`text-base sm:text-lg font-extrabold ${
                            pkg.isRecommended || isSelected ? "text-primary" : "text-main"
                          }`}
                        >
                          {pkg.priceText}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => togglePackageExpand(pkg.id, e)}
                        className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-sub hover:text-main hover:bg-gray-50 transition-all cursor-pointer"
                        aria-label="Toggle details"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Body */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-hairline/60 flex flex-col gap-4">
                      {/* Image Banner if available */}
                      {pkg.image && (
                        <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mt-1 group">
                          <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-4 sm:p-5">
                            <span className="text-white font-extrabold text-base sm:text-lg tracking-wide drop-shadow-md">
                              {pkg.title}
                            </span>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                            >
                              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Why It Matters Box */}
                      {pkg.whyItMatters && (
                        <div className="border-l-4 border-primary bg-white p-3.5 sm:p-4 rounded-r-xl border border-hairline border-l-0 shadow-2xs">
                          <h4 className="font-extrabold text-xs sm:text-sm text-main mb-1">
                            Why It Matters
                          </h4>
                          <p className="text-xs sm:text-sm text-sub leading-relaxed">
                            {pkg.whyItMatters}
                          </p>
                        </div>
                      )}

                      {/* Features checklist */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {pkg.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-sub">
                              <div className="w-4 h-4 rounded-full bg-feedback-success-bg flex items-center justify-center text-feedback-success flex-shrink-0">
                                <svg className="w-2.5 h-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors.selectedPackage && (
            <p className="text-xs sm:text-sm text-red-500 font-medium">{errors.selectedPackage}</p>
          )}
        </div>

        {/* SECTION 2: Optional Add-Ons */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-2">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-main">
            Optional Add-Ons
          </h3>

          <div className="flex flex-col gap-3.5">
            {ADDONS_CONFIG.map((addon) => {
              const isAddonSelected = selectedAddons.includes(addon.id);
              const isAddonExpanded = expandedAddonId === addon.id;
              const hasDetails = Boolean(addon.image || addon.whyItMatters);

              return (
                <div
                  key={addon.id}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                    isAddonSelected
                      ? "border border-primary bg-primary-subtle/30 shadow-xs"
                      : "border-hairline bg-canvas hover:border-gray-300"
                  }`}
                >
                  {/* Header Row */}
                  <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-extrabold text-base sm:text-lg leading-snug ${
                          isAddonSelected ? "text-primary" : "text-main"
                        }`}
                      >
                        {addon.title}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-sub mt-0.5">
                        {addon.priceText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      {/* Add / Remove Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleAddonSelect(addon.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isAddonSelected
                            ? "bg-primary text-white hover:bg-primary-hover"
                            : "border border-primary text-primary bg-white hover:bg-primary-subtle/30"
                        }`}
                        aria-label={isAddonSelected ? "Remove addon" : "Add addon"}
                      >
                        {isAddonSelected ? (
                          <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M12 6v12m-6-6h12"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Expand/Collapse Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleAddonExpand(addon.id, e)}
                        className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-sub hover:text-main hover:bg-gray-50 transition-all cursor-pointer"
                        aria-label="Toggle details"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isAddonExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  {isAddonExpanded && hasDetails && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-2 border-t border-hairline/60">
                      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-hairline flex flex-col sm:flex-row gap-4 items-center">
                        {addon.image && (
                          <div className="relative w-full sm:w-56 h-36 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={addon.image}
                              alt={addon.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-2 flex-1 w-full">
                          {addon.whyItMatters && (
                            <div>
                              <h4 className="font-extrabold text-xs sm:text-sm text-main mb-1">
                                Why it matters
                              </h4>
                              <p className="text-xs sm:text-sm text-sub leading-relaxed">
                                {addon.whyItMatters}
                              </p>
                            </div>
                          )}

                          {addon.repairRisk && (
                            <div className="border-l-4 border-accent-green bg-feedback-success-bg px-3 py-1.5 rounded-r-lg flex items-center justify-between mt-1">
                              <span className="text-[11px] sm:text-xs font-semibold text-feedback-success">
                                Repair Risk
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold text-main">
                                {addon.repairRisk}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info Callout Banner */}
        <div className="bg-primary-subtle/40 border border-primary/30 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 mt-2">
          <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-sub leading-normal">
            <span className="font-extrabold text-main">Fees are estimates.</span> Final pricing confirmed before your appointment. For standalone services (without a home inspection), call us directly at{" "}
            <a href="tel:7707656869" className="text-primary font-bold hover:underline">
              (770) 765-6869
            </a>.
          </p>
        </div>
      </div>

      {/* Right Column: Sticky Package Amounts Summary Card */}
      <div className="w-full lg:w-80 xl:w-84 shrink-0 lg:sticky lg:top-6 self-start">
        <div className="bg-white rounded-2xl border border-hairline p-4 sm:p-5 shadow-xs flex flex-col gap-4">
          {/* Header Row: Title + Edit Button */}
          <div className="flex items-center justify-between pb-3 border-b border-hairline/60">
            <h3 className="font-extrabold text-base sm:text-lg text-main tracking-tight">
              Package Amounts
            </h3>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-primary font-bold text-xs sm:text-sm underline hover:text-primary-hover cursor-pointer transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Selected Package & Addons list */}
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sub font-medium">{selectedPkgObj?.title} :</span>
              <span className="text-main font-extrabold text-right shrink-0">
                + {selectedPkgObj?.priceText}
              </span>
            </div>

            {selectedAddonObjects.map((addon) => (
              <div key={addon.id} className="flex justify-between items-center gap-2">
                <span className="text-sub font-medium">{addon.title}:</span>
                <span className="text-main font-extrabold text-right shrink-0">
                  + {addon.priceText}
                </span>
              </div>
            ))}
          </div>

          {/* Already in your package Section */}
          <div className="pt-3 border-t border-hairline/60 flex flex-col gap-3">
            <h4 className="font-extrabold text-base text-main tracking-tight">
              Already in your package
            </h4>

            <div className="flex flex-col gap-2.5">
              {includedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-5 h-5 rounded bg-primary-subtle border border-primary flex items-center justify-center text-primary shrink-0">
                      <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sub font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-muted font-medium shrink-0">{item.priceText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amounts Row */}
          <div className="pt-3.5 border-t border-hairline/60 flex items-center justify-between">
            <span className="font-extrabold text-base sm:text-lg text-main tracking-tight">
              Total Amounts
            </span>
            <span className="font-extrabold text-lg sm:text-xl text-primary">
              + ${totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
