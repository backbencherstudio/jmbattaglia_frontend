"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  RotateCw,
  Home,
  ShieldCheck,
  Wrench,
  PlusCircle,
  Layers,
} from "lucide-react";
import { useGetAdminServicesQuery } from "@/redux/features/packages/packageApi";
import { AdminIsnService, PackageType } from "@/types/packages";

interface WizardServiceSelectorProps {
  packageType: PackageType;
  selectedServiceIds: string[];
  onChange: (serviceIds: string[]) => void;
  error?: string | null;
}

type ServiceCategoryKey = "core" | "environmental" | "systems" | "ancillary";

interface ServiceCategoryMeta {
  key: ServiceCategoryKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  {
    key: "core",
    label: "Core Home Inspections",
    description: "Standard residential, pre-drywall, new construction, and warranty inspections.",
    icon: Home,
  },
  {
    key: "environmental",
    label: "Environmental & Specialty Testing",
    description: "Radon, termite / WDO, mold, air quality, and environmental lab tests.",
    icon: ShieldCheck,
  },
  {
    key: "systems",
    label: "Structural & Mechanical Systems",
    description: "Sewer scope, chimney, foundation, pool & spa, stucco/EIFS, and thermal imaging.",
    icon: Wrench,
  },
  {
    key: "ancillary",
    label: "Add-on & Ancillary Inspections",
    description: "Secondary inspection riders, outbuilding, and supplementary checks.",
    icon: PlusCircle,
  },
];

// Helper to categorize a service into clean human-readable groups
function categorizeService(service: AdminIsnService): ServiceCategoryKey {
  const name = (service.name || "").toLowerCase();

  // Environmental keywords
  if (
    name.includes("radon") ||
    name.includes("termite") ||
    name.includes("wdo") ||
    name.includes("pest") ||
    name.includes("mold") ||
    name.includes("asbestos") ||
    name.includes("lead") ||
    name.includes("air quality") ||
    name.includes("water quality") ||
    name.includes("water test") ||
    name.includes("well water")
  ) {
    return "environmental";
  }

  // Structural & Systems keywords
  if (
    name.includes("sewer") ||
    name.includes("scope") ||
    name.includes("chimney") ||
    name.includes("foundation") ||
    name.includes("pool") ||
    name.includes("spa") ||
    name.includes("roof") ||
    name.includes("thermal") ||
    name.includes("infrared") ||
    name.includes("stucco") ||
    name.includes("eifs") ||
    name.includes("septic") ||
    name.includes("crawl") ||
    name.includes("deck") ||
    name.includes("irrigation") ||
    name.includes("sprinkler")
  ) {
    return "systems";
  }

  // Core Home Inspection keywords
  if (
    name.includes("residential") ||
    name.includes("home inspection") ||
    name.includes("pre-drywall") ||
    name.includes("new construction") ||
    name.includes("11th month") ||
    name.includes("warranty") ||
    name.includes("commercial") ||
    name.includes("condo") ||
    name.includes("townhouse") ||
    name.includes("multi-family") ||
    name.includes("buyer inspection") ||
    name.includes("seller inspection") ||
    name.includes("pre-listing")
  ) {
    return "core";
  }

  // If flagged as ancillary or add-on by ISN
  if (service.ancillary || (service.kind || "").toUpperCase() === "ADDON") {
    return "ancillary";
  }

  return "core";
}

// Format fee/price safely without raw undefined
function formatServicePrice(service: AdminIsnService): string | null {
  if (service.priceCents !== undefined && service.priceCents !== null && service.priceCents > 0) {
    const dollars = service.priceCents / 100;
    return `$${dollars.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  if (service.fee) {
    const rawNum = typeof service.fee === "string" ? parseFloat(service.fee.replace(/[^0-9.]/g, "")) : Number(service.fee);
    if (!isNaN(rawNum) && rawNum > 0) {
      return `$${rawNum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
  }

  return null;
}

// Clean duplicate root identifier (e.g. identifies variations like sqft or condo variations)
function getBaseServiceName(name: string): string {
  return name
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*[-–—]\s*(up to|\d+|\d+\+).*$/i, "")
    .trim();
}

export function WizardServiceSelector({
  packageType,
  selectedServiceIds,
  onChange,
  error,
}: WizardServiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const {
    data: servicesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAdminServicesQuery({
    limit: 100,
    search: searchTerm.trim() || undefined,
  });

  const allServices: AdminIsnService[] = useMemo(() => {
    const items = servicesResponse?.data?.items;
    if (!Array.isArray(items)) return [];
    return items.filter((s) => s && s.id);
  }, [servicesResponse?.data?.items]);

  const isSingle = packageType === "Single";

  // Selected service objects lookup
  const selectedServicesMap = useMemo(() => {
    const map = new Map<string, AdminIsnService>();
    allServices.forEach((s) => {
      if (selectedServiceIds.includes(s.id)) {
        map.set(s.id, s);
      }
    });
    return map;
  }, [allServices, selectedServiceIds]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return allServices.filter((service) => {
      const name = (service.name || "").toLowerCase();
      const searchMatch = searchTerm.trim()
        ? name.includes(searchTerm.toLowerCase().trim())
        : true;

      const category = categorizeService(service);
      const categoryMatch =
        activeCategoryFilter === "ALL" || activeCategoryFilter === category;

      return searchMatch && categoryMatch;
    });
  }, [allServices, searchTerm, activeCategoryFilter]);

  // Grouped by Category with duplicate detection
  const groupedCategories = useMemo(() => {
    const groups: {
      category: ServiceCategoryMeta;
      services: {
        item: AdminIsnService;
        isVariation: boolean;
        baseName: string;
      }[];
      selectedCount: number;
    }[] = [];

    // Count root names to flag variations / near duplicates
    const rootNameCounts = new Map<string, number>();
    allServices.forEach((s) => {
      const base = getBaseServiceName(s.name || "").toLowerCase();
      rootNameCounts.set(base, (rootNameCounts.get(base) || 0) + 1);
    });

    SERVICE_CATEGORIES.forEach((catMeta) => {
      const catServices = filteredServices.filter(
        (s) => categorizeService(s) === catMeta.key
      );

      if (catServices.length > 0) {
        let catSelectedCount = 0;
        const enriched = catServices.map((service) => {
          if (selectedServiceIds.includes(service.id)) {
            catSelectedCount += 1;
          }
          const baseName = getBaseServiceName(service.name || "");
          const isVariation = (rootNameCounts.get(baseName.toLowerCase()) || 0) > 1;
          return { item: service, isVariation, baseName };
        });

        groups.push({
          category: catMeta,
          services: enriched,
          selectedCount: catSelectedCount,
        });
      }
    });

    return groups;
  }, [filteredServices, allServices, selectedServiceIds]);

  const handleToggleService = (serviceId: string) => {
    if (isSingle) {
      if (selectedServiceIds.includes(serviceId)) {
        onChange([]);
      } else {
        onChange([serviceId]);
      }
    } else {
      if (selectedServiceIds.includes(serviceId)) {
        onChange(selectedServiceIds.filter((id) => id !== serviceId));
      } else {
        onChange([...selectedServiceIds, serviceId]);
      }
    }
  };

  const handleRemoveService = (serviceId: string) => {
    onChange(selectedServiceIds.filter((id) => id !== serviceId));
  };

  const handleSelectAllVisible = () => {
    if (isSingle) return;
    const visibleIds = filteredServices.map((s) => s.id);
    const merged = Array.from(new Set([...selectedServiceIds, ...visibleIds]));
    onChange(merged);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const toggleCategoryCollapse = (catKey: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  const handleExpandAll = () => {
    setCollapsedCategories({});
  };

  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    SERVICE_CATEGORIES.forEach((c) => {
      allCollapsed[c.key] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <label className="block text-xs font-bold text-main uppercase">
            Services Included <span className="text-primary">*</span>
          </label>
          <p className="text-xs text-sub">
            {isSingle
              ? "Select 1 primary ISN inspection service for this package."
              : "Select and bundle the ISN inspection services included in this package."}
          </p>
        </div>

        {/* Selected count pill */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-trade font-bold px-3 py-1 rounded-full transition-colors ${
              selectedServiceIds.length > 0
                ? "bg-primary text-white shadow-2xs"
                : "bg-hairline text-muted"
            }`}
          >
            {selectedServiceIds.length}{" "}
            {selectedServiceIds.length === 1 ? "service" : "services"} selected
          </span>
          {!isSingle && selectedServiceIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-muted hover:text-danger text-xs font-semibold underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Selected services chips bar (Human-readable only, NEVER exposes UUIDs) */}
      {selectedServiceIds.length > 0 && (
        <div className="p-3 bg-white border border-hairline rounded-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Selected for package ({selectedServiceIds.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedServiceIds.map((id) => {
              const service = selectedServicesMap.get(id);
              // Clean human-readable fallback, never display raw UUID
              const displayName =
                service?.name?.trim() || "Inspection Service Item";
              const priceTag = service ? formatServicePrice(service) : null;

              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-subtle border border-primary/30 rounded-lg text-xs font-semibold text-primary shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[240px]">{displayName}</span>
                  {priceTag && (
                    <span className="text-[10px] bg-primary/15 px-1.5 py-0.5 rounded font-bold">
                      {priceTag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveService(id)}
                    className="p-0.5 hover:bg-primary/20 rounded-md text-primary transition-colors cursor-pointer"
                    title="Remove service"
                    aria-label={`Remove ${displayName}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Category Filter Row */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ISN services by name..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isSingle && filteredServices.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="px-3 py-2 bg-white border border-hairline rounded-xl text-xs font-bold text-main hover:bg-canvas transition-colors shrink-0 cursor-pointer"
              >
                Select All Shown
              </button>
            )}

            <div className="flex items-center gap-1 text-xs text-sub">
              <button
                type="button"
                onClick={handleExpandAll}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Expand all
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-trade font-bold transition-all cursor-pointer shrink-0 ${
              activeCategoryFilter === "ALL"
                ? "bg-main text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            All Services ({allServices.length})
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-trade font-bold transition-all cursor-pointer shrink-0 ${
                activeCategoryFilter === cat.key
                  ? "bg-main text-white shadow-xs"
                  : "bg-white border border-hairline text-sub hover:text-main"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-danger-bg border border-danger/20 rounded-xl text-danger text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to load services catalog from ISN.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 border border-hairline rounded-xl bg-white flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-xs font-medium text-muted">
            Loading grouped ISN services catalog...
          </p>
        </div>
      )}

      {/* Grouped Services Accordion List */}
      {!isLoading && (
        <div className="max-h-96 overflow-y-auto space-y-3 pr-1 custom-scrollbar border border-hairline rounded-xl p-3 bg-canvas">
          {groupedCategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-sub bg-white rounded-lg border border-hairline">
              No services found matching &quot;{searchTerm}&quot;.
            </div>
          ) : (
            groupedCategories.map(({ category, services, selectedCount }) => {
              const isCollapsed = Boolean(collapsedCategories[category.key]);
              const Icon = category.icon;

              return (
                <div
                  key={category.key}
                  className="bg-white border border-hairline rounded-xl overflow-hidden shadow-2xs transition-all"
                >
                  {/* Category Group Header */}
                  <div
                    onClick={() => toggleCategoryCollapse(category.key)}
                    className="flex items-center justify-between p-3.5 bg-canvas/70 hover:bg-canvas transition-colors cursor-pointer border-b border-hairline/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-trade font-bold text-sm text-main truncate">
                            {category.label}
                          </h4>
                          {selectedCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                              {selectedCount} selected
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted truncate hidden sm:block">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sub shrink-0">
                      <span className="text-xs font-medium">
                        {services.length} {services.length === 1 ? "item" : "items"}
                      </span>
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Services List inside Group */}
                  {!isCollapsed && (
                    <div className="p-2 space-y-1.5 divide-y divide-hairline/40">
                      {services.map(({ item, isVariation }) => {
                        const isSelected = selectedServiceIds.includes(item.id);
                        const displayName =
                          item.name?.trim() || "Inspection Service";
                        const price = formatServicePrice(item);
                        const isAddon =
                          (item.kind || "").toUpperCase() === "ADDON" ||
                          Boolean(item.ancillary);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleService(item.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary-subtle text-primary font-bold shadow-2xs"
                                : "hover:bg-canvas text-main"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-3">
                              {/* Selection Indicator (Radio circle for Single, Checkbox square for Bundle) */}
                              <div
                                className={`w-4 h-4 rounded-${
                                  isSingle ? "full" : "md"
                                } border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-primary border-primary text-white"
                                    : "border-hairline bg-white text-transparent"
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-trade font-bold truncate">
                                    {displayName}
                                  </span>
                                  {isVariation && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                                      Tier Variation
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted font-normal mt-0.5">
                                  {isAddon
                                    ? "Specialty inspection add-on rider"
                                    : "Primary home inspection service"}
                                </p>
                              </div>
                            </div>

                            {/* Badges Right (Price and Kind - NO UUIDs) */}
                            <div className="flex items-center gap-2 shrink-0">
                              {price && (
                                <span className="text-xs font-bold font-trade px-2 py-0.5 rounded bg-accent-green/15 text-accent-green">
                                  {price}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  isAddon
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {isAddon ? "Add-on" : "Core"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Field Validation Error */}
      {error && (
        <p className="text-xs font-medium text-danger flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
