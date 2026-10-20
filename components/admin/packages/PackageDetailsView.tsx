"use client";

import React from "react";
import Image from "next/image";
import { Edit, CheckCircle2, Play, ChevronRight } from "lucide-react";
import { PackageItem } from "@/types/packages";
import { Button } from "@/components/ui/Button";

interface PackageDetailsViewProps {
  packageItem: PackageItem;
  onBack: () => void;
  onEdit: (item: PackageItem) => void;
  onOpenVideo?: (item: PackageItem) => void;
}

export function PackageDetailsView({
  packageItem,
  onBack,
  onEdit,
  onOpenVideo,
}: PackageDetailsViewProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center space-x-1.5 text-xs text-sub">
            <button
              onClick={onBack}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Packages
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="font-semibold text-main">Package Details</span>
          </nav>
          <h2 className="font-trade font-bold text-2xl sm:text-3xl text-main">
            Package Details
          </h2>
        </div>

        <Button
          variant="primary"
          onClick={() => onEdit(packageItem)}
          className="w-full sm:w-auto flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit package</span>
        </Button>
      </div>

      {/* Basic Info Card */}
      <div className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">Package Name</p>
            <p className="text-base text-sub">{packageItem.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">
              Short Description
            </p>
            <p className="text-base text-sub">{packageItem.shortDescription}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">Package Type</p>
            <p className="text-base text-sub">{packageItem.type} Package</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">Category</p>
            <p className="text-base text-sub">{packageItem.category}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">
              Package Price (USD)
            </p>
            <p className="text-base font-semibold text-main">
              {packageItem.price}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-main uppercase">
              Recommended badge
            </p>
            <p className="text-base text-sub">
              {packageItem.isRecommended ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Why it matters & Features Included & Media Card */}
      <div className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Why it matters */}
          <div className="space-y-2">
            <h3 className="font-trade font-bold text-base text-main">
              Why it matters
            </h3>
            <p className="text-sm text-sub leading-relaxed">
              {packageItem.whyItMatters ||
                "A persuasive sentence shown in the expandable block on the portal e.g. 'Buyers make a six-figure decision on a single walkthrough. A Signature inspection surfaces the repairs that change the negotiation.'"}
            </p>
          </div>

          {/* What Features Included */}
          <div className="space-y-3">
            <h3 className="font-trade font-bold text-base text-main">
              What Features Included
            </h3>
            <div className="space-y-2">
              {(
                packageItem.featuresIncluded || [
                  "Structural components & foundation",
                  "Roofing system & attic space",
                  "Electrical panels, wiring & outlets",
                  "Heating & cooling systems (HVAC)",
                ]
              ).map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-sub">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Package Media */}
        <div className="space-y-3 pt-4 border-t border-hairline">
          <div className="flex items-center justify-between">
            <h3 className="font-trade font-bold text-base text-main">
              Package media
            </h3>
            {onOpenVideo && (
              <button
                type="button"
                onClick={() => onOpenVideo(packageItem)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Video</span>
              </button>
            )}
          </div>
          <div
            onClick={() => onOpenVideo?.(packageItem)}
            className="relative w-full max-w-md h-56 rounded-2xl overflow-hidden bg-neutral-900 border border-hairline group cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <Image
              src={packageItem.image}
              alt={packageItem.name}
              fill
              sizes="(min-width: 768px) 448px, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
              <div className="w-13 h-13 rounded-2xl bg-black/50 group-hover:bg-primary group-hover:text-white backdrop-blur-xs border border-white/25 flex items-center justify-center text-primary group-hover:scale-110 active:scale-95 transition-all shadow-xl">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
              <span className="text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-sm">
                <Play className="w-3 h-3 fill-current" />
                <span>Watch Overview Video</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
