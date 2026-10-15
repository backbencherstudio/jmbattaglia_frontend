"use client";

import React from "react";
import { X, Play } from "lucide-react";
import { PackageOption } from "@/types/packageAddons";

interface VideoModalHeaderProps {
  pkg: PackageOption;
  titleId: string;
  onClose: () => void;
}

export const VideoModalHeader: React.FC<VideoModalHeaderProps> = ({
  pkg,
  titleId,
  onClose,
}) => {
  return (
    <div className="px-4 py-2.5 sm:px-6 sm:py-3.5 border-b border-hairline flex items-center justify-between gap-3 bg-canvas/70 shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-primary">
              Package Overview Video
            </span>
            {pkg.isRecommended && (
              <span className="bg-primary text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded tracking-wide">
                Recommended
              </span>
            )}
          </div>
          <h3
            id={titleId}
            className="text-sm xs:text-base sm:text-lg font-extrabold text-main truncate tracking-tight"
          >
            {pkg.title}
          </h3>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-hairline text-sub hover:text-main flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
