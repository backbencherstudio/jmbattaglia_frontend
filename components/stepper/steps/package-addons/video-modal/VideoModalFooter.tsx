"use client";

import React from "react";
import { Check } from "lucide-react";
import { PackageOption } from "@/types/packageAddons";

interface VideoModalFooterProps {
  pkg: PackageOption;
  isSelected?: boolean;
  onSelectPackage?: (pkgId: string) => void;
  onClose: () => void;
}

export const VideoModalFooter: React.FC<VideoModalFooterProps> = ({
  pkg,
  isSelected = false,
  onSelectPackage,
  onClose,
}) => {
  return (
    <div className="p-3 xs:p-3.5 sm:px-6 sm:py-4 border-t border-hairline bg-canvas/90 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] xs:text-xs font-semibold text-sub truncate">
          {pkg.priceSubLabel || "Package Fee"}
        </span>
        <span className="text-lg xs:text-xl sm:text-2xl font-extrabold text-primary leading-tight">
          {pkg.priceText}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-hairline bg-white hover:bg-gray-100 text-sub hover:text-main font-bold text-xs sm:text-sm transition-all cursor-pointer"
        >
          Close
        </button>

        {onSelectPackage && (
          <button
            type="button"
            onClick={() => {
              onSelectPackage(pkg.id);
              onClose();
            }}
            className={`px-3.5 xs:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
              isSelected
                ? "bg-feedback-success-bg text-feedback-success border border-accent-green"
                : "bg-primary hover:bg-primary-hover text-white hover:shadow-md"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Selected</span>
              </>
            ) : (
              <span>Select Package</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
