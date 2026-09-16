"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StepProps } from "@/types/stepper";

export interface PackageOption {
  id: string;
  title: string;
  isRecommended?: boolean;
  priceText: string;
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
  image?: string;
  whyItMatters?: string;
  repairRisk?: string;
}

const RESALE_PACKAGES: PackageOption[] = [
  {
    id: "safe-home-package",
    title: "Safe Home Package",
    isRecommended: true,
    priceText: "$1,236",
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
    priceSubLabel: "Starting",
    description: "A comprehensive inspection of all accessible areas of the home.",
  },
  {
    id: "radon-testing",
    title: "Radon Testing Service",
    priceText: "$525",
    priceSubLabel: "Starting",
    description: "Measurement of radon gas levels to ensure safe indoor air quality.",
  },
];

const NEW_CONSTRUCTION_PACKAGES: PackageOption[] = [
  {
    id: "pre-drywall",
    title: "Pre-drywall inspection",
    priceText: "$465",
    priceSubLabel: "Starting",
    description: "Catch issues before the walls go up.",
  },
  {
    id: "final-inspection",
    title: "Final inspection",
    priceText: "$500",
    priceSubLabel: "Starting",
    description: "Final walkthrough before you close.",
  },
];

const ADDONS_CONFIG: AddonOption[] = [
  {
    id: "chemical-balancing",
    title: "Chemical Balancing",
    priceText: "$79",
  },
  {
    id: "spa-maintenance",
    title: "Spa Maintenance",
    priceText: "$149",
  },
  {
    id: "filter-replacement",
    title: "Filter Replacement",
    priceText: "$89",
  },
  {
    id: "pool-inspection",
    title: "Pool Inspection",
    priceText: "$199",
    image: "/assets/images/pool_inspection.jpg",
    whyItMatters:
      "Inspection of pool equipment including built-in spas. Added to home inspection. $199 and up based on size.",
    repairRisk: "$2,000–$10,000",
  },
];

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

  return (
    <div className="w-full flex flex-col gap-6">
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
      <div className="bg-[#FFF8F3] border border-orange-200/60 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-[#FF6900]">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#B34700]">
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
                className={`rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border ${isSelected
                    ? "border-2 border-[#FF6900] bg-[#FFF9F5] shadow-xs"
                    : "border-hairline bg-[#F9F9F8] hover:border-gray-300"
                  }`}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Radio circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                          ? "border-2 border-[#FF6900] bg-white"
                          : "border-2 border-gray-300 bg-white"
                        }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6900]" />}
                    </div>

                    {/* Title + Subtitle */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base sm:text-lg text-main leading-snug">
                          {pkg.title}
                        </span>
                        {pkg.isRecommended && (
                          <span className="bg-[#FF6900] text-white text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide">
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
                        className={`text-base sm:text-lg font-extrabold ${pkg.isRecommended || isSelected ? "text-[#FF6900]" : "text-main"
                          }`}
                      >
                        {pkg.priceText}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => togglePackageExpand(pkg.id, e)}
                      className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-gray-500 hover:text-main hover:bg-gray-50 transition-all cursor-pointer"
                      aria-label="Toggle details"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
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
                            className="w-8 h-8 rounded-lg bg-[#FF6900] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
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
                      <div className="border-l-4 border-[#FF6900] bg-white p-3.5 sm:p-4 rounded-r-xl border border-hairline border-l-0 shadow-2xs">
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
                            <div className="w-4 h-4 rounded-full bg-[#8C9600]/15 flex items-center justify-center text-[#8C9600] flex-shrink-0">
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
                className={`rounded-2xl transition-all duration-200 overflow-hidden border ${isAddonSelected
                    ? "border-2 border-[#FF6900] bg-[#FFF8F3] shadow-xs"
                    : "border-hairline bg-[#F9F9F8] hover:border-gray-300"
                  }`}
              >
                {/* Header Row */}
                <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-extrabold text-base sm:text-lg leading-snug ${isAddonSelected ? "text-[#FF6900]" : "text-main"
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
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isAddonSelected
                          ? "bg-[#C45100] text-white hover:bg-[#A84500]"
                          : "border border-[#FF6900] text-[#FF6900] bg-white hover:bg-orange-50"
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
                      className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-gray-500 hover:text-main hover:bg-gray-50 transition-all cursor-pointer"
                      aria-label="Toggle details"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isAddonExpanded ? "rotate-180" : ""
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
                          <div className="border-l-3 border-[#9CB800] bg-[#F7F9E8] px-3 py-1.5 rounded-r-lg flex items-center justify-between mt-1">
                            <span className="text-[11px] sm:text-xs font-semibold text-[#667800]">
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
      <div className="bg-[#FFF8F3] border border-orange-200/60 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 mt-2">
        <div className="w-5 h-5 rounded-full border-1.5 border-[#FF6900] flex items-center justify-center flex-shrink-0 text-[#FF6900] mt-0.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <p className="text-xs sm:text-sm text-sub leading-normal">
          <span className="font-extrabold text-main">Fees are estimates.</span> Final pricing confirmed before your appointment. For standalone services (without a home inspection), call us directly at{" "}
          <a href="tel:7707656869" className="text-[#FF6900] font-bold hover:underline">
            (770) 765-6869
          </a>.
        </p>
      </div>
    </div>
  );
};
