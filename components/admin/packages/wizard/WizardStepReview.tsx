"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronUp, ChevronDown, Play } from "lucide-react";
import { PackageFormData } from "@/types/wizard";
import { Button } from "@/components/ui/Button";

interface WizardStepReviewProps {
  formData: PackageFormData;
  updateFormData: (fields: Partial<PackageFormData>) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
}

export function WizardStepReview({
  formData,
  updateFormData,
  onPublish,
  onSaveDraft,
}: WizardStepReviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-sub block">
                    {formData.type} Price
                  </span>
                  <span className="font-trade font-bold text-2xl text-primary">
                    {formData.price || "$1,236"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 bg-canvas border border-hairline rounded-xl hover:bg-hairline/30 transition-colors"
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
                  <div className="md:col-span-6 relative h-48 rounded-xl overflow-hidden bg-neutral-900 border border-hairline">
                    <Image
                      src={
                        formData.image ||
                        "/assets/images/safe_home_package.jpg"
                      }
                      alt={formData.name || "Package Media"}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 justify-between">
                      <span className="font-trade font-bold text-white text-lg">
                        {formData.name}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
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
        <Button variant="outline" onClick={onSaveDraft} className="bg-white">
          Save as draft
        </Button>

        <Button variant="primary" onClick={onPublish}>
          Publish
        </Button>
      </div>
    </div>
  );
}
