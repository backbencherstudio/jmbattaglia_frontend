"use client";

import React from "react";
import { PackageOption, AddonOption, IncludedItem } from "@/types/packageAddons";

interface PackageSummaryCardProps {
  selectedPkgObj?: PackageOption;
  selectedAddonObjects: AddonOption[];
  includedItems: IncludedItem[];
  totalAmount: number;
}

export const PackageSummaryCard: React.FC<PackageSummaryCardProps> = ({
  selectedPkgObj,
  selectedAddonObjects,
  includedItems,
  totalAmount,
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
            <span className="text-main font-extrabold text-right shrink-0">
              + {selectedPkgObj?.priceText}
            </span>
          </div>

          {selectedAddonObjects.map((addon) => (
            <div key={addon.id} className="flex justify-between items-center gap-2">
              <span className="text-sub font-medium truncate">{addon.title}:</span>
              <span className="text-main font-extrabold text-right shrink-0">
                + {addon.priceText}
              </span>
            </div>
          ))}
        </div>

        {/* Already in your package Section */}
        <div className="pt-3 border-t border-hairline/60 flex flex-col gap-2.5 sm:gap-3">
          <h4 className="font-extrabold text-sm sm:text-base text-main tracking-tight">
            Already in your package
          </h4>

          <div className="flex flex-col gap-2.5">
            {includedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 xs:gap-2.5 min-w-0 flex-1">
                  <div className="w-4 h-4 xs:w-5 xs:h-5 rounded bg-primary-subtle border border-primary flex items-center justify-center text-primary shrink-0">
                    <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sub font-medium truncate">{item.name}</span>
                </div>
                <span className="text-muted font-medium shrink-0 ml-1">{item.priceText}</span>
              </div>
            ))}
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
