"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronUp, ChevronDown, Play } from "lucide-react";
import { PackageFormData } from "@/types/wizard";
import { Button } from "@/components/ui/Button";
import { PackageVideoModal } from "@/components/stepper/steps/package-addons/PackageVideoModal";
import { PackageOption } from "@/types/packageAddons";

interface WizardStepReviewProps {
  formData: PackageFormData;
  updateFormData: (fields: Partial<PackageFormData>) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export function WizardStepReview({
  formData,
  updateFormData,
  onPublish,
  onSaveDraft,
  isSubmitting,
}: WizardStepReviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const reviewPkgOption: PackageOption = {
    id: "wizard-review-preview",
    title: formData.name || "Safe Home Package",
    priceText: formData.price.startsWith("$")
      ? formData.price
      : `$${formData.price || "1,236"}`,
    priceNumeric:
      parseInt((formData.price || "1236").replace(/[^0-9]/g, ""), 10) || 1236,
    priceSubLabel: `${formData.type} Price`,
    description: formData.shortDescription || "Package ensures protection.",
    image: formData.image || "/assets/images/safe_home_package.jpg",
    videoUrl: formData.videoUrl || "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
    whyItMatters: formData.whyItMatters,
    features: formData.featuresIncluded,
    isRecommended: formData.isRecommended,
  };

  return (
    <div className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6">
      <h3 className="font-trade font-bold text-xl text-main border-b border-hairline pb-4">
        Basic Info
      </h3>

      <div className="space-y-6">
        {/* Recommended Badge Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-main uppercase">
            Recommended badge
          </label>
          <button
            type="button"
            onClick={() =>
              updateFormData({ isRecommended: !formData.isRecommended })
            }
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              formData.isRecommended ? "bg-accent-green" : "bg-hairline"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                formData.isRecommended ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Recommended Badge Section */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-main uppercase">
            Recommended badge
          </label>

          {/* Preview Card Container */}
          <div className="bg-white border border-hairline rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Header: Title, Recommended Badge, Price & Accordion Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-trade font-bold text-xl text-main">
                    {formData.name || "Safe Home Package"}
                  </h4>
                  {formData.isRecommended && (
                    <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-bold rounded-md uppercase">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-sub">
                  {formData.shortDescription || "Package ensures protection."}
                </p>
              </div>

              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="text-right">
                  <span className="text-xs text-sub block">
                    {formData.type} Price
                  </span>
                  <span className="font-trade font-bold text-2xl text-primary">
                    {formData.price || "$1,236"}
                  </span>
                </div>

                {/* Video Button */}
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="h-8 px-2.5 rounded-lg bg-primary-subtle/80 hover:bg-primary text-primary hover:text-white border border-primary/25 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold shadow-2xs active:scale-95 shrink-0"
                  title="Watch package video"
                  aria-label="Watch package video"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 bg-canvas border border-hairline rounded-xl hover:bg-hairline/30 transition-colors cursor-pointer"
                  aria-label="Toggle details"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-main" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-main" />
                  )}
                </button>
              </div>
            </div>

            {/* Accordion Content */}
            {isExpanded && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Media Thumbnail with Play Overlay */}
                  <div
                    onClick={() => setShowVideoModal(true)}
                    className="md:col-span-6 relative h-48 sm:h-52 rounded-xl overflow-hidden bg-neutral-900 border border-hairline group cursor-pointer shadow-xs hover:shadow-md transition-all"
                  >
                    <Image
                      src={
                        formData.image ||
                        "/assets/images/safe_home_package.jpg"
                      }
                      alt={formData.name || "Package Media"}
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 group-hover:via-black/35 transition-colors" />

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Row inside banner */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3.5 gap-2">
                      <span className="font-trade font-bold text-white text-base truncate drop-shadow-md">
                        {formData.name || "Safe Home Package"}
                      </span>
                      <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 shrink-0 flex items-center gap-1.5 shadow-xs">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Watch Video</span>
                      </span>
                    </div>
                  </div>

                  {/* Included Features List */}
                  <div className="md:col-span-6 space-y-2.5">
                    {formData.featuresIncluded.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 text-sm text-sub"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why It Matters Callout Block */}
                <div className="bg-canvas border-l-4 border-primary p-4 rounded-r-xl space-y-1">
                  <h5 className="font-trade font-bold text-sm text-main uppercase">
                    Why It Matters
                  </h5>
                  <p className="text-xs sm:text-sm text-sub leading-relaxed">
                    {formData.whyItMatters ||
                      "Bundling essential inspections into one package saves you time and eliminates the hassle of scheduling multiple vendors. One report, one visit, one call."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-hairline">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="bg-white"
        >
          {isSubmitting ? "Saving..." : "Save as draft"}
        </Button>

        <Button
          variant="primary"
          onClick={onPublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>

      {/* Package Video Modal */}
      {showVideoModal && (
        <PackageVideoModal
          pkg={reviewPkgOption}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
}
