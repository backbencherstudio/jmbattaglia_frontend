"use client";

import React from "react";
import { ShieldCheck, Sparkles, Check } from "lucide-react";
import { PackageOption } from "@/types/packageAddons";

interface VideoModalDetailsProps {
  pkg: PackageOption;
}

export const VideoModalDetails: React.FC<VideoModalDetailsProps> = ({ pkg }) => {
  return (
    <>
      {/* Value / Why It Matters Callout */}
      {pkg.whyItMatters && (
        <div className="border-l-4 border-primary bg-primary-subtle/35 p-3 sm:p-4 rounded-l-2xl">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary mb-1">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Why It Matters</span>
          </div>
          <p className="text-xs sm:text-sm text-sub leading-relaxed font-medium">
            {pkg.whyItMatters}
          </p>
        </div>
      )}

      {/* Key Features Checklist */}
      {pkg.features && pkg.features.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2">
          <h4 className="text-xs sm:text-sm font-extrabold text-main flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Included with this package</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
            {pkg.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start sm:items-center gap-2 p-2 rounded-lg bg-canvas border border-hairline text-xs sm:text-sm text-sub"
              >
                <div className="w-4 h-4 rounded-full bg-feedback-success-bg flex items-center justify-center text-feedback-success flex-shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-medium text-main">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
