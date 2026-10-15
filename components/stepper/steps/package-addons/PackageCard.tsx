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
  onOpenVideo?: (pkg: PackageOption) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onOpenVideo,
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

        {/* Price + Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline/50 sm:border-transparent">
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

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Video Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideo?.(pkg);
              }}
              className="h-8 px-2 xs:px-2.5 rounded-lg bg-primary-subtle/80 hover:bg-primary text-primary hover:text-white border border-primary/25 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 text-xs font-bold shadow-2xs active:scale-95"
              title="Watch package video"
              aria-label="Watch package video"
            >
              <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Video</span>
            </button>

            {/* Accordion Toggle */}
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
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="px-3.5 pb-4 xs:px-4 xs:pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-hairline/60 flex flex-col gap-3.5 sm:gap-4">
          {/* Image Banner if available */}
          {pkg.image && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideo?.(pkg);
              }}
              className="relative w-full h-40 xs:h-48 sm:h-52 md:h-56 lg:h-48 xl:h-56 rounded-xl overflow-hidden mt-1 group cursor-pointer"
            >
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:via-black/35 transition-colors" />

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Row inside banner */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 sm:p-4 gap-2">
                <span className="text-white font-extrabold text-xs xs:text-sm sm:text-base tracking-wide drop-shadow-md truncate">
                  {pkg.title}
                </span>
                <span className="text-[11px] xs:text-xs font-bold text-white bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 shrink-0 flex items-center gap-1.5">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Watch Video</span>
                </span>
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
