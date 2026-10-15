"use client";

import React, { useState, useEffect } from "react";
import { StepProps } from "@/types/stepper";
import {
  PackageOption,
  AddonOption,
  IncludedItem,
} from "@/types/packageAddons";
import {
  RESALE_PACKAGES,
  NEW_CONSTRUCTION_PACKAGES,
  ADDONS_CONFIG,
  PACKAGE_INCLUDED_ITEMS,
} from "@/data/packageAddonsData";
import { PackageCard } from "./package-addons/PackageCard";
import { AddonCard } from "./package-addons/AddonCard";
import { PackageSummaryCard } from "./package-addons/PackageSummaryCard";
import { PackageVideoModal } from "./package-addons/PackageVideoModal";
import { WarnIcon } from "@/components/icons/StepperStepIcons";

export type { PackageOption, AddonOption, IncludedItem };

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

  // Expandable accordions & summary checkbox state
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    isNewConstruction ? null : "safe-home-package"
  );
  const [expandedAddonId, setExpandedAddonId] = useState<string | null>("pool-inspection");
  const [uncheckedIncludedItems, setUncheckedIncludedItems] = useState<string[]>([]);
  const [videoModalPackage, setVideoModalPackage] = useState<PackageOption | null>(null);

  const selectedPackageId =
    formData.selectedPackage || (isNewConstruction ? "pre-drywall" : "safe-home-package");
  const selectedAddons = formData.selectedAddons || ["chemical-balancing"];

  // Reset unchecked items when package changes
  useEffect(() => {
    setUncheckedIncludedItems([]);
  }, [selectedPackageId]);

  const handleSelectPackage = (pkgId: string) => {
    updateFormData({ selectedPackage: pkgId });
    clearError("selectedPackage");
    setExpandedPackageId((prev) => (prev === pkgId ? null : pkgId));
  };

  const togglePackageExpand = (pkgId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleSelectPackage(pkgId);
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

  const handleToggleIncludedItem = (itemName: string) => {
    setUncheckedIncludedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Selected object references for summary card
  const selectedPkgObj = packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];
  const selectedAddonObjects = ADDONS_CONFIG.filter((a) => selectedAddons.includes(a.id));
  const includedItems = PACKAGE_INCLUDED_ITEMS[selectedPackageId] || [
    { name: selectedPkgObj?.title || "Home Inspection", priceText: selectedPkgObj?.priceText || "$0" },
  ];

  // Calculate total amount with deductions for unchecked package items
  const uncheckedDeductions = includedItems
    .filter((item) => uncheckedIncludedItems.includes(item.name))
    .reduce((acc, item) => acc + (item.priceNumeric || 0), 0);

  const totalAmount = Math.max(
    0,
    (selectedPkgObj?.priceNumeric || 0) +
      selectedAddonObjects.reduce((acc, a) => acc + a.priceNumeric, 0) -
      uncheckedDeductions
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8 xl:gap-10 items-start">
      {/* Left Column: Form Content */}
      <div className="flex-1 w-full min-w-0 flex flex-col gap-5 sm:gap-6">
        {/* Header section */}
        <div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-main">
            Choose Your Inspection Package
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-sub mt-1 sm:mt-1.5 leading-normal">
            All packages include a full digital report delivered within 24 hours. Select the one that fits your property and needs.
          </p>
        </div>

        {/* Pricing callout banner */}
        <div className="bg-canvas border-l-6 border-l-primary border border-hairline rounded-xl p-2.5 xs:p-3 sm:p-3.5 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary">
            <WarnIcon />
          </div>
          <p className="text-xs xs:text-sm md:text-base font-semibold text-primary-hover">
            Pricing is calculated based on your property details and synced with ISN.
          </p>
        </div>

        {/* SECTION 1: Choose your package */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-1">
          <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold tracking-tight text-main">
            Choose your package
          </h3>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {packagesList.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPackageId === pkg.id}
                isExpanded={expandedPackageId === pkg.id}
                onSelect={handleSelectPackage}
                onToggleExpand={togglePackageExpand}
                onOpenVideo={(pkgToOpen) => setVideoModalPackage(pkgToOpen)}
              />
            ))}
          </div>

          {errors.selectedPackage && (
            <p className="text-xs sm:text-sm text-red-500 font-medium">{errors.selectedPackage}</p>
          )}
        </div>

        {/* SECTION 2: Optional Add-Ons */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-2">
          <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold tracking-tight text-main">
            Optional Add-Ons
          </h3>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {ADDONS_CONFIG.map((addon) => (
              <AddonCard
                key={addon.id}
                addon={addon}
                isSelected={selectedAddons.includes(addon.id)}
                isExpanded={expandedAddonId === addon.id}
                onToggleSelect={toggleAddonSelect}
                onToggleExpand={toggleAddonExpand}
              />
            ))}
          </div>
        </div>

        {/* Bottom Info Callout Banner */}
        <div className="bg-canvas border-l-6 border-l-primary border border-hairline rounded-xl p-3 xs:p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 mt-2">
          <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
            <WarnIcon />
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
      <PackageSummaryCard
        selectedPkgObj={selectedPkgObj}
        selectedAddonObjects={selectedAddonObjects}
        includedItems={includedItems}
        uncheckedIncludedItems={uncheckedIncludedItems}
        onToggleIncludedItem={handleToggleIncludedItem}
        totalAmount={totalAmount}
      />

      {/* Package Video Modal */}
      {videoModalPackage && (
        <PackageVideoModal
          pkg={videoModalPackage}
          isSelected={selectedPackageId === videoModalPackage.id}
          onSelectPackage={(id) => {
            handleSelectPackage(id);
            setVideoModalPackage(null);
          }}
          onClose={() => setVideoModalPackage(null)}
        />
      )}
    </div>
  );
};
