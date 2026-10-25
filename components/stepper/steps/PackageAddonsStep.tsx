"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  useGetPortalPackagesQuery,
  useGetPortalPackageByIdQuery,
  useGetPortalAddonsQuery,
  useLazyGetPortalAddonByIdQuery,
  useCalculateServiceQuoteMutation,
} from "@/redux/features/booking/bookingApi";
import type { PortalPackageItem, PortalAddonItem } from "@/types/booking";
import {
  buildPropertyDto,
  sanitizePackageAndServices,
  sanitizeServiceIds,
} from "@/lib/bookingUtils";

import { CheckCircle2, Loader2 } from "lucide-react";

export type { PackageOption, AddonOption, IncludedItem };

export const PackageAddonsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const isNewConstruction = formData.inspectionKind === "new-construction";
  const categoryApi = isNewConstruction ? "NEW_CONSTRUCTION" : "RESALE_HOME";

  // 1. Fetch portal packages & addons from API
  const { data: packagesRes, isLoading: isLoadingPackages } = useGetPortalPackagesQuery();
  const { data: addonsRes, isLoading: isLoadingAddons } = useGetPortalAddonsQuery();
  const [calculateQuote, { isLoading: isCalculatingQuote }] = useCalculateServiceQuoteMutation();

  // 2. Map portal packages with local fallback
  const packagesList = useMemo<PackageOption[]>(() => {
    const list = packagesRes?.data;
    if (Array.isArray(list) && list.length > 0) {
      const filtered = list.filter((p) => p.category === categoryApi && p.visible !== false);
      if (filtered.length > 0) {
        return filtered.map((p) => ({
          id: p.id,
          title: p.name,
          isRecommended: Boolean(p.recommended || p.best),
          priceText: p.formattedPrice || (p.price ? `$${p.price.toLocaleString()}` : "$0"),
          priceNumeric: p.price || (p.priceCents ? p.priceCents / 100 : 0),
          priceSubLabel: p.type === "BUNDLE" ? "Bundle Price" : "Starting",
          description: p.description,
          image: p.imageUrl || p.mediaUrl || "/assets/images/safe_home_package.jpg",
          videoUrl: p.videoUrl || "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
          whyItMatters: p.whyItMatters || "",
          features:
            p.features && p.features.length > 0
              ? p.features
              : [
                  "Structural components & foundation",
                  "Roofing system & attic space",
                  "Electrical panels, wiring & outlets",
                  "Heating & cooling systems (HVAC)",
                ],
        }));
      }
    }
    return isNewConstruction ? NEW_CONSTRUCTION_PACKAGES : RESALE_PACKAGES;
  }, [packagesRes, categoryApi, isNewConstruction]);

  // 3. Map portal addons with local fallback
  const addonsList = useMemo<AddonOption[]>(() => {
    const list = addonsRes?.data;
    if (Array.isArray(list) && list.length > 0) {
      const filtered = list.filter(
        (a) => (!a.category || a.category === categoryApi)
      );
      if (filtered.length > 0) {
        return filtered.map((a) => ({
          id: a.id,
          title: a.name,
          priceText: a.formattedPrice || (a.price ? `$${a.price.toLocaleString()}` : "$0"),
          priceNumeric: a.price || (a.priceCents ? a.priceCents / 100 : 0),
          image: a.imageUrl || a.mediaUrl || "/assets/images/pool_inspection.jpg",
          whyItMatters: a.whyItMatters || "",
          repairRisk: a.description || "",
        }));
      }
    }
    return ADDONS_CONFIG;
  }, [addonsRes, categoryApi]);

  // Initialize selected package if not set or invalid
  useEffect(() => {
    if (packagesList.length > 0) {
      const validIds = packagesList.map((p) => p.id);
      if (!formData.selectedPackage || !validIds.includes(formData.selectedPackage)) {
        updateFormData({ selectedPackage: validIds[0] });
      }
    }
  }, [packagesList, formData.selectedPackage, updateFormData]);

  // Expandable accordions & modal state
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  const [expandedAddonId, setExpandedAddonId] = useState<string | null>(null);
  const [uncheckedIncludedItems, setUncheckedIncludedItems] = useState<string[]>([]);
  const [videoModalPackage, setVideoModalPackage] = useState<PackageOption | null>(null);

  const selectedPackageId = formData.selectedPackage || packagesList[0]?.id || "";
  const selectedAddons = useMemo(
    () => sanitizeServiceIds(formData.selectedAddons || []),
    [formData.selectedAddons]
  );
  const selectedAddonsKey = useMemo(() => [...selectedAddons].sort().join(","), [selectedAddons]);

  // 1b. Fetch single package by ID when selected
  const {
    data: singlePackageRes,
    isFetching: isFetchingSinglePackage,
  } = useGetPortalPackageByIdQuery(selectedPackageId, {
    skip: !selectedPackageId,
  });
  const singlePackage = singlePackageRes?.data;

  // 1c. Fetch single add-on by ID when an add-on is selected
  const [triggerGetAddon] = useLazyGetPortalAddonByIdQuery();
  const [singleAddonsMap, setSingleAddonsMap] = useState<Record<string, PortalAddonItem>>({});
  const [loadingAddonIds, setLoadingAddonIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    selectedAddons.forEach((addonId) => {
      if (!singleAddonsMap[addonId] && !loadingAddonIds[addonId]) {
        setLoadingAddonIds((prev) => ({ ...prev, [addonId]: true }));
        triggerGetAddon(addonId, true)
          .unwrap()
          .then((res) => {
            if (res?.data) {
              setSingleAddonsMap((prev) => ({ ...prev, [addonId]: res.data }));
            }
          })
          .catch((err) => {
            console.error(`Failed to fetch addon ${addonId}:`, err);
          })
          .finally(() => {
            setLoadingAddonIds((prev) => ({ ...prev, [addonId]: false }));
          });
      }
    });
  }, [selectedAddons, singleAddonsMap, loadingAddonIds, triggerGetAddon]);

  // Keep latest refs to avoid re-triggering callbacks on formData updates
  const formDataRef = React.useRef(formData);
  formDataRef.current = formData;

  const packagesDataRef = React.useRef(packagesRes?.data);
  packagesDataRef.current = packagesRes?.data;

  const lastQuoteKeyRef = React.useRef<string>("");
  const isCalculatingRef = React.useRef<boolean>(false);

  // Reset unchecked items when package changes
  useEffect(() => {
    setUncheckedIncludedItems([]);
  }, [selectedPackageId]);

  // 4. Trigger ISN Quote Calculation with deduplication and loop guard
  const triggerQuoteCalculation = useCallback(
    async (pkgId: string, addonIds: string[]) => {
      if (!pkgId || isCalculatingRef.current) return;

      const currentFormData = formDataRef.current;
      const propertyDto = buildPropertyDto(currentFormData);
      const { packageId: safePackageId, serviceIds: safeServiceIds } =
        sanitizePackageAndServices(
          categoryApi,
          pkgId,
          addonIds,
          packagesDataRef.current
        );

      const quoteKey = `${categoryApi}_${safePackageId || ""}_${[...safeServiceIds].sort().join(",")}_${propertyDto.foundationType}_${propertyDto.squareFeet}_${propertyDto.yearBuilt}`;

      // Guard: do NOT recalculate if the exact same inputs have already been quoted
      if (lastQuoteKeyRef.current === quoteKey) {
        return;
      }

      lastQuoteKeyRef.current = quoteKey;
      isCalculatingRef.current = true;

      try {
        const res = await calculateQuote({
          category: categoryApi,
          ...(safePackageId ? { packageId: safePackageId } : {}),
          serviceIds: safeServiceIds,
          property: propertyDto,
        }).unwrap();

        if (res?.data?.quoteId) {
          updateFormData({
            quoteId: res.data.quoteId,
            calculatedQuote: res.data,
            quoteError: null,
          });
        }
      } catch (err: any) {
        const status = err?.status || err?.statusCode;
        if (status === 429) {
          console.warn("ISN rate limit reached, waiting before retry.");
        } else {
          console.warn("Quote calculation notice:", err?.data?.message || err?.message);
        }
      } finally {
        isCalculatingRef.current = false;
      }
    },
    [calculateQuote, categoryApi, updateFormData]
  );

  // Debounced quote calculation when package or addons change
  useEffect(() => {
    if (!selectedPackageId) return;

    const timer = setTimeout(() => {
      triggerQuoteCalculation(selectedPackageId, selectedAddons);
    }, 350);

    return () => clearTimeout(timer);
  }, [selectedPackageId, selectedAddonsKey, triggerQuoteCalculation]);

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

  // Selected object references for summary card with single API price priority
  const selectedPkgFromList = packagesList.find((p) => p.id === selectedPackageId) || packagesList[0];

  const activeSelectedPkgObj = useMemo<PackageOption>(() => {
    if (singlePackage && singlePackage.id === selectedPackageId) {
      return {
        id: singlePackage.id,
        title: singlePackage.name,
        isRecommended: Boolean(singlePackage.recommended || singlePackage.best),
        priceText: singlePackage.formattedPrice || (singlePackage.price ? `$${singlePackage.price.toLocaleString()}` : "$0"),
        priceNumeric: singlePackage.price ?? (singlePackage.priceCents ? singlePackage.priceCents / 100 : 0),
        priceSubLabel: singlePackage.type === "BUNDLE" ? "Bundle Price" : "Starting",
        description: singlePackage.description,
        image: singlePackage.imageUrl || singlePackage.mediaUrl || selectedPkgFromList?.image || "/assets/images/safe_home_package.jpg",
        videoUrl: singlePackage.videoUrl || selectedPkgFromList?.videoUrl || "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
        whyItMatters: singlePackage.whyItMatters || selectedPkgFromList?.whyItMatters || "",
        features: singlePackage.features && singlePackage.features.length > 0 ? singlePackage.features : (selectedPkgFromList?.features || []),
      };
    }
    return selectedPkgFromList || packagesList[0];
  }, [singlePackage, selectedPackageId, selectedPkgFromList, packagesList]);

  // Selected addon objects with single API prices
  const activeSelectedAddonObjects = useMemo(() => {
    return selectedAddons.map((id) => {
      const single = singleAddonsMap[id];
      const fallback = addonsList.find((a) => a.id === id);
      return {
        id,
        title: single?.name || fallback?.title || "Add-on",
        priceText: single?.formattedPrice || (single?.price ? `$${single.price.toLocaleString()}` : fallback?.priceText || "$0"),
        priceNumeric: single?.price ?? (single?.priceCents ? single.priceCents / 100 : fallback?.priceNumeric || 0),
        image: single?.imageUrl || single?.mediaUrl || fallback?.image,
        whyItMatters: single?.whyItMatters || fallback?.whyItMatters,
        repairRisk: single?.description || fallback?.repairRisk,
        isLoading: Boolean(loadingAddonIds[id]),
      };
    });
  }, [selectedAddons, singleAddonsMap, addonsList, loadingAddonIds]);

  // Included items resolution directly from single package API or fallbacks
  const includedItems = useMemo<IncludedItem[]>(() => {
    if (singlePackage?.services && singlePackage.services.length > 0) {
      return singlePackage.services.map((s) => ({
        name: s.name,
        priceText: s.priceCents > 0 ? `$${(s.priceCents / 100).toLocaleString()}` : "Included",
        priceNumeric: s.priceCents / 100,
      }));
    }
    const rawPkg = (packagesRes?.data || []).find((p) => p.id === selectedPackageId);
    if (rawPkg?.services && rawPkg.services.length > 0) {
      return rawPkg.services.map((s) => ({
        name: s.name,
        priceText: s.priceCents > 0 ? `$${(s.priceCents / 100).toLocaleString()}` : "Included",
        priceNumeric: s.priceCents / 100,
      }));
    }
    return (
      PACKAGE_INCLUDED_ITEMS[selectedPackageId] || [
        {
          name: activeSelectedPkgObj?.title || "Home Inspection",
          priceText: activeSelectedPkgObj?.priceText || "$0",
          priceNumeric: activeSelectedPkgObj?.priceNumeric || 0,
        },
      ]
    );
  }, [singlePackage, packagesRes, selectedPackageId, activeSelectedPkgObj]);

  // Calculate total amount based on single package price + single add-on prices
  const uncheckedDeductions = includedItems
    .filter((item) => uncheckedIncludedItems.includes(item.name))
    .reduce((acc, item) => acc + (item.priceNumeric || 0), 0);

  const directTotal = Math.max(
    0,
    (activeSelectedPkgObj?.priceNumeric || 0) +
      activeSelectedAddonObjects.reduce((acc, a) => acc + (a.priceNumeric || 0), 0) -
      uncheckedDeductions
  );

  const totalAmount = directTotal;


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

        {/* Pricing & ISN Quote status banner */}
        <div className="bg-canvas border-l-6 border-l-primary border border-hairline rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary">
              <WarnIcon />
            </div>
            <p className="text-xs xs:text-sm md:text-base font-semibold text-primary-hover">
              Pricing is calculated in real-time based on your property details and synced with ISN.
            </p>
          </div>
          {/* {isCalculatingQuote ? (
            <div className="flex items-center gap-1.5 text-xs text-sub font-semibold shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Updating quote...</span>
            </div>
          ) : formData.quoteId ? (
            <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold shrink-0 bg-green-50 px-2 py-1 rounded-md border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>Live Quote</span>
            </div>
          ) : null} */}
        </div>

        {/* SECTION 1: Choose your package */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold tracking-tight text-main">
              Choose your package
            </h3>
            {isLoadingPackages && (
              <span className="text-xs text-sub flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-primary" /> Loading live packages...
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {packagesList.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const displayPkg = isSelected && singlePackage ? activeSelectedPkgObj : pkg;
              return (
                <PackageCard
                  key={pkg.id}
                  pkg={displayPkg}
                  isSelected={isSelected}
                  isExpanded={expandedPackageId === pkg.id}
                  onSelect={handleSelectPackage}
                  onToggleExpand={togglePackageExpand}
                  onOpenVideo={(pkgToOpen) => setVideoModalPackage(pkgToOpen)}
                />
              );
            })}
          </div>

          {errors.selectedPackage && (
            <p className="text-xs sm:text-sm text-red-500 font-medium">{errors.selectedPackage}</p>
          )}
        </div>

        {/* SECTION 2: Optional Add-Ons */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold tracking-tight text-main">
              Optional Add-Ons
            </h3>
            {isLoadingAddons && (
              <span className="text-xs text-sub flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-primary" /> Loading add-ons...
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {addonsList.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id);
              const single = singleAddonsMap[addon.id];
              const displayAddon = single
                ? {
                    id: single.id,
                    title: single.name,
                    priceText:
                      single.formattedPrice ||
                      (single.price ? `$${single.price.toLocaleString()}` : addon.priceText),
                    priceNumeric:
                      single.price ??
                      (single.priceCents ? single.priceCents / 100 : addon.priceNumeric),
                    image: single.imageUrl || single.mediaUrl || addon.image,
                    whyItMatters: single.whyItMatters || addon.whyItMatters,
                    repairRisk: single.description || addon.repairRisk,
                  }
                : addon;

              return (
                <AddonCard
                  key={addon.id}
                  addon={displayAddon}
                  isSelected={isSelected}
                  isExpanded={expandedAddonId === addon.id}
                  onToggleSelect={toggleAddonSelect}
                  onToggleExpand={toggleAddonExpand}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Info Callout Banner */}
        <div className="bg-canvas border-l-6 border-l-primary border border-hairline rounded-xl p-3 xs:p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 mt-2">
          <div className="w-5 h-5 rounded-full border-1.5 border-primary flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
            <WarnIcon />
          </div>
          <p className="text-xs sm:text-sm text-sub leading-normal">
            <span className="font-extrabold text-main">Fees are verified quotes.</span> Final scope confirmed before your appointment. For custom inquiries, call us directly at{" "}
            <a href="tel:7707656869" className="text-primary font-bold hover:underline">
              (770) 765-6869
            </a>.
          </p>
        </div>
      </div>

      {/* Right Column: Sticky Package Amounts Summary Card */}
      <PackageSummaryCard
        selectedPkgObj={activeSelectedPkgObj}
        selectedAddonObjects={activeSelectedAddonObjects}
        includedItems={includedItems}
        uncheckedIncludedItems={uncheckedIncludedItems}
        onToggleIncludedItem={handleToggleIncludedItem}
        totalAmount={totalAmount}
        isPackageLoading={isFetchingSinglePackage}
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
