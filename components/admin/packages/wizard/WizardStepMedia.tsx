"use client";

import React from "react";
import { PackageFormData } from "@/types/wizard";
import { Button } from "@/components/ui/Button";
import { WizardFeaturesManager } from "./WizardFeaturesManager";
import { PackageMediaUploader } from "./PackageMediaUploader";

interface WizardStepMediaProps {
  formData: PackageFormData;
  updateFormData: (fields: Partial<PackageFormData>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function WizardStepMedia({
  formData,
  updateFormData,
  onNext,
  onSaveDraft,
}: WizardStepMediaProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <h3 className="font-trade font-bold text-xl text-main border-b border-hairline pb-4">
        Educational Content & Media
      </h3>

      <div className="space-y-6">
        {/* Why it matters */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-main uppercase">
            Why it matters <span className="text-primary">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.whyItMatters}
            onChange={(e) => updateFormData({ whyItMatters: e.target.value })}
            placeholder="A persuasive sentence shown in the expandable block on the portal — e.g. 'Buyers make a six-figure decision on a single walkthrough. A Signature inspection surfaces the repairs that change the negotiation.'"
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border resize-none"
          />
        </div>

        {/* What Features Included */}
        <WizardFeaturesManager
          features={formData.featuresIncluded}
          onChange={(featuresIncluded) => updateFormData({ featuresIncluded })}
        />

        {/* Package Media Upload */}
        <PackageMediaUploader
          image={formData.image}
          videoUrl={formData.videoUrl}
          onUpdateImage={(image) => updateFormData({ image })}
          onUpdateVideoUrl={(videoUrl) => updateFormData({ videoUrl })}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-hairline">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="bg-white"
        >
          Save as draft
        </Button>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </form>
  );
}
