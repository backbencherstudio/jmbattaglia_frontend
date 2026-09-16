"use client";

import React from "react";
import Image from "next/image";
import { PackageOption } from "@/types/packageAddons";

interface PackageCardProps {
  pkg: PackageOption;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (pkgId: string) => void;
  onToggleExpand: (pkgId: string, e: React.MouseEvent) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}) => {
  return (
    <div
      onClick={() => onSelect(pkg.id)}
      className={`rounded-lg transition-all duration-200 cursor-pointer overflow-hidden border ${
        isSelected
          ? "border border-primary bg-primary-subtle/30 shadow-xs"
          : "border-hairline bg-canvas hover:border-gray-300"
      }`}
    >
      {/* Header Row */}
      <div className="p-3.5 xs:p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Radio circle */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-0.5 sm:mt-0 ${
              isSelected
                ? "border-2 border-primary bg-white"
                : "border-2 border-gray-300 bg-white"
            }`}
          >
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>

          {/* Title + Subtitle */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm xs:text-base sm:text-lg text-main leading-snug">
                {pkg.title}
              </span>
              {pkg.isRecommended && (
                <span className="bg-primary text-white text-[10px] xs:text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide shrink-0">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-sub mt-0.5 leading-relaxed">
              {pkg.description}
            </p>
          </div>
        </div>

        {/* Price + Accordion toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline/50 sm:border-transparent">
          <div className="text-left sm:text-right">
            <span className="text-[11px] sm:text-xs text-sub font-medium mr-1.5">
              {pkg.priceSubLabel}
            </span>
            <span
              className={`text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extrabold ${
                pkg.isRecommended || isSelected ? "text-primary" : "text-main"
              }`}
            >
              {pkg.priceText}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => onToggleExpand(pkg.id, e)}
            className="w-8 h-8 rounded-lg border border-hairline bg-white flex items-center justify-center text-sub hover:text-main hover:bg-gray-50 transition-all cursor-pointer shrink-0"
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
        <div className="px-3.5 pb-4 xs:px-4 xs:pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-hairline/60 flex flex-col gap-3.5 sm:gap-4">
          {/* Image Banner if available */}
          {pkg.image && (
            <div className="relative w-full h-36 xs:h-44 sm:h-52 md:h-56 lg:h-48 xl:h-56 rounded-xl overflow-hidden mt-1 group">
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-3.5 sm:p-5">
                <span className="text-white font-extrabold text-sm xs:text-base sm:text-lg tracking-wide drop-shadow-md">
                  {pkg.title}
                </span>
                <button
                  type="button"
                  className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Why It Matters Box */}
          {pkg.whyItMatters && (
            <div className="border-l-4 border-primary bg-white p-3 xs:p-3.5 sm:p-4 rounded-l-md shadow-2xs">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-2.5 pt-1">
              {pkg.features.map((feature, idx) => (
                <div key={idx} className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-sub">
                  <div className="w-4 h-4 rounded-full bg-feedback-success-bg flex items-center justify-center text-feedback-success flex-shrink-0 mt-0.5 sm:mt-0">
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
};
