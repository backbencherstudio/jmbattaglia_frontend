"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Check,
  Layers,
  Box,
  AlertCircle,
  Loader2,
  X,
  RotateCw,
} from "lucide-react";
import { useGetAdminServicesQuery } from "@/redux/features/packages/packageApi";
import { AdminIsnService, PackageType } from "@/types/packages";

interface WizardServiceSelectorProps {
  packageType: PackageType;
  selectedServiceIds: string[];
  onChange: (serviceIds: string[]) => void;
  error?: string | null;
}

export function WizardServiceSelector({
  packageType,
  selectedServiceIds,
  onChange,
  error,
}: WizardServiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [kindFilter, setKindFilter] = useState<"ALL" | "SERVICE" | "ADDON">("ALL");

  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminServicesQuery({
    limit: 100,
    search: searchTerm.trim() || undefined,
  });

  const allServices: AdminIsnService[] = useMemo(() => {
    const items = servicesResponse?.data?.items;
    if (!Array.isArray(items)) return [];
    // Filter out services that have completely blank id
    return items.filter((s) => s.id);
  }, [servicesResponse?.data?.items]);

  const isSingle = packageType === "Single";

  // Filtered list based on search and kind filter
  const displayedServices = useMemo(() => {
    return allServices.filter((service) => {
      const name = (service.name || "").toLowerCase();
      const searchMatch = searchTerm.trim()
        ? name.includes(searchTerm.toLowerCase().trim())
        : true;

      const kindUpper = (service.kind || "").toUpperCase();
      const kindMatch =
        kindFilter === "ALL"
          ? true
          : kindFilter === "SERVICE"
            ? kindUpper === "SERVICE"
            : kindUpper === "ADDON" || Boolean(service.ancillary);

      return searchMatch && kindMatch;
    });
  }, [allServices, searchTerm, kindFilter]);

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
    const visibleIds = displayedServices.map((s) => s.id);
    const merged = Array.from(new Set([...selectedServiceIds, ...visibleIds]));
    onChange(merged);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <label className="block text-xs font-bold text-main uppercase">
            Services Included <span className="text-primary">*</span>
          </label>
          <p className="text-xs text-sub">
            {isSingle
              ? "Select 1 primary ISN inspection service for this package."
              : "Select the ISN inspection services bundled into this package."}
          </p>
        </div>

        {/* Selected count pill */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-trade font-bold px-3 py-1 rounded-full ${
              selectedServiceIds.length > 0
                ? "bg-primary text-white"
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

      {/* Selected services chips bar */}
      {selectedServiceIds.length > 0 && (
        <div className="p-3 bg-white border border-hairline rounded-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
            Selected for package:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedServiceIds.map((id) => {
              const service = selectedServicesMap.get(id);
              const displayName =
                service?.name?.trim() || `Service (${id.slice(0, 8)})`;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-subtle border border-primary/30 rounded-lg text-xs font-semibold text-primary"
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[220px]">{displayName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(id)}
                    className="p-0.5 hover:bg-primary/20 rounded-md text-primary transition-colors cursor-pointer"
                    title="Remove service"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ISN services..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Kind Filters */}
        <div className="flex items-center gap-1 bg-white border border-hairline p-1 rounded-xl shrink-0">
          {(["ALL", "SERVICE", "ADDON"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-trade font-bold transition-all cursor-pointer ${
                kindFilter === k
                  ? "bg-main text-white shadow-xs"
                  : "text-sub hover:text-main"
              }`}
            >
              {k === "ALL" ? "All" : k === "SERVICE" ? "Services" : "Add-ons"}
            </button>
          ))}
        </div>

        {!isSingle && displayedServices.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAllVisible}
            className="px-3 py-2 bg-white border border-hairline rounded-xl text-xs font-bold text-main hover:bg-canvas transition-colors shrink-0 cursor-pointer"
          >
            Select All Shown
          </button>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 bg-danger-bg border border-danger/20 rounded-xl text-danger text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to load services from ISN.</span>
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
            Loading ISN services catalog...
          </p>
        </div>
      )}

      {/* Services List / Grid */}
      {!isLoading && (
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar border border-hairline rounded-xl p-2 bg-canvas">
          {displayedServices.length === 0 ? (
            <div className="p-6 text-center text-xs text-sub bg-white rounded-lg border border-hairline">
              No services found matching &quot;{searchTerm}&quot;.
            </div>
          ) : (
            displayedServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              const displayName =
                service.name?.trim() || `Unnamed Service (${service.id.slice(0, 8)})`;
              const isAddon =
                (service.kind || "").toUpperCase() === "ADDON" ||
                Boolean(service.ancillary);

              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary-subtle text-primary shadow-xs"
                      : "border-hairline bg-white hover:border-neutral-300 text-main"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Checkbox / Radio Icon */}
                    <div
                      className={`w-5 h-5 rounded-${
                        isSingle ? "full" : "md"
                      } border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-hairline bg-white text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-trade font-bold truncate">
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted font-mono">
                          ID: {service.id.slice(0, 8)}...
                        </span>
                        {service.orderTypeId && (
                          <span className="text-[10px] text-muted">
                            Order Type: {service.orderTypeId.slice(0, 8)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges Right */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isAddon
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isAddon ? "Addon" : "Service"}
                    </span>
                    {service.source && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                        {service.source}
                      </span>
                    )}
                  </div>
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
