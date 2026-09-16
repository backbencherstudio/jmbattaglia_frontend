"use client";

import React from "react";
import Image from "next/image";
import { AddonOption } from "@/types/packageAddons";

interface AddonCardProps {
  addon: AddonOption;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelect: (addonId: string) => void;
  onToggleExpand: (addonId: string, e: React.MouseEvent) => void;
}

export const AddonCard: React.FC<AddonCardProps> = ({
  addon,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
}) => {
  const hasDetails = Boolean(addon.image || addon.whyItMatters);

  return (
    <div
      className={`rounded-2xl transition-all duration-200 overflow-hidden border ${isSelected
          ? "border border-primary bg-primary-subtle/30 shadow-xs"
          : "border-hairline bg-canvas hover:border-gray-300"
        }`}
    >
      {/* Header Row */}
      <div className="p-3.5 xs:p-4 sm:p-4.5 flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`font-extrabold text-sm xs:text-base sm:text-lg leading-snug ${isSelected ? "text-primary" : "text-main"
              }`}
          >
            {addon.title}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-sub mt-0.5">
            {addon.priceText}
          </span>
        </div>

        <div className="flex items-center gap-2 xs:gap-2.5 flex-shrink-0">
          {/* Add / Remove Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleSelect(addon.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isSelected
                ? "bg-primary text-white hover:bg-primary-hover"
                : "border border-primary text-primary bg-white hover:bg-primary-subtle/30"
              }`}
            aria-label={isSelected ? "Remove addon" : "Add addon"}
          >
            {isSelected ? (
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
            onClick={(e) => onToggleExpand(addon.id, e)}
            className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-sub hover:text-main hover:bg-gray-50 transition-all cursor-pointer shrink-0"
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

      {/* Expanded Details Section */}
      {isExpanded && hasDetails && (
        <div className="px-3.5 pb-4 xs:px-4 xs:pb-5 sm:px-5 sm:pb-5 pt-2 border-t border-hairline/60">
          <div className="bg-white p-3 xs:p-3.5 sm:p-4 rounded-xl border border-hairline flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start sm:items-center">
            {addon.image && (
              <div className="relative w-full sm:w-48 md:w-56 h-36 sm:h-32 md:h-36 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={addon.image}
                  alt={addon.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 flex-1 w-full justify-between">
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
                <div className="border-l-4 border-accent-green bg-feedback-success-bg px-2.5 xs:px-3 py-1.5 rounded-r-lg flex items-center justify-between gap-2 mt-1">
                  <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-feedback-success">
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
};
