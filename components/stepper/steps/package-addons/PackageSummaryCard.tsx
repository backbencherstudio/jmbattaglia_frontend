"use client";

import React from "react";
import { PackageOption, AddonOption, IncludedItem } from "@/types/packageAddons";
import { Loader2 } from "lucide-react";

interface PackageSummaryCardProps {
  selectedPkgObj?: PackageOption;
  selectedAddonObjects: (AddonOption & { isLoading?: boolean })[];
  includedItems: IncludedItem[];
  uncheckedIncludedItems?: string[];
  onToggleIncludedItem?: (itemName: string) => void;
  totalAmount: number;
  isPackageLoading?: boolean;
}

export const PackageSummaryCard: React.FC<PackageSummaryCardProps> = ({
  selectedPkgObj,
  selectedAddonObjects,
  includedItems,
  uncheckedIncludedItems = [],
  onToggleIncludedItem,
  totalAmount,
  isPackageLoading = false,
}) => {
  return (
    <div className="w-full lg:w-72 xl:w-80 2xl:w-84 shrink-0 lg:sticky lg:top-6 self-start">
      <div className="bg-white rounded-2xl border border-hairline p-3.5 xs:p-4 sm:p-5 shadow-xs flex flex-col gap-3.5 sm:gap-4">
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
            <span className="text-sub font-medium truncate">{selectedPkgObj?.title} :</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {isPackageLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              <span className="text-main font-extrabold text-right shrink-0">
                + {selectedPkgObj?.priceText}
              </span>
            </div>
          </div>

          {selectedAddonObjects.map((addon) => (
            <div key={addon.id} className="flex justify-between items-center gap-2">
              <span className="text-sub font-medium truncate">{addon.title}:</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {addon.isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                <span className="text-main font-extrabold text-right shrink-0">
                  + {addon.priceText}
                </span>
              </div>
            </div>
          ))}
        </div>


        {/* Already in your package Section */}
        <div className="pt-3 border-t border-hairline/60 flex flex-col gap-2.5 sm:gap-3">
          <h4 className="font-extrabold text-sm sm:text-base text-main tracking-tight">
            Already in your package
          </h4>

          <div className="flex flex-col gap-2.5">
            {includedItems.map((item, idx) => {
              const isChecked = !uncheckedIncludedItems.includes(item.name);

              return (
                <div
                  key={idx}
                  onClick={() => onToggleIncludedItem?.(item.name)}
                  className="flex items-center justify-between gap-2 text-xs sm:text-sm cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2 xs:gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 xs:w-5 xs:h-5 rounded flex items-center justify-center shrink-0 transition-all ${
                        isChecked
                          ? "bg-primary-subtle border border-primary text-primary"
                          : "bg-white border border-gray-300 text-transparent group-hover:border-primary"
                      }`}
                    >
                      <svg
                        className={`w-2.5 h-2.5 xs:w-3 xs:h-3 stroke-current transition-opacity ${
                          isChecked ? "opacity-100" : "opacity-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium truncate transition-colors ${
                        isChecked ? "text-sub" : "text-muted line-through opacity-75"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`font-medium shrink-0 ml-1 transition-colors ${
                      isChecked ? "text-muted" : "text-gray-300 line-through opacity-75"
                    }`}
                  >
                    {item.priceText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Amounts Row */}
        <div className="pt-3.5 border-t border-hairline/60 flex items-center justify-between gap-2">
          <span className="font-extrabold text-base sm:text-lg text-main tracking-tight shrink-0">
            Total Amounts
          </span>
          <span className="font-extrabold text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-primary text-right shrink-0">
            + ${totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
