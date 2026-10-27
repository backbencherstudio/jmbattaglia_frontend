"use client";

import React, { useState } from "react";
import { Box, Layers } from "lucide-react";
import { PackageCategory, PackageType } from "@/types/packages";
import { PackageFormData } from "@/types/wizard";
import { Button } from "@/components/ui/Button";
import { WizardServiceSelector } from "./WizardServiceSelector";

interface WizardStepBasicInfoProps {
  formData: PackageFormData;
  updateFormData: (fields: Partial<PackageFormData>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export function WizardStepBasicInfo({
  formData,
  updateFormData,
  onNext,
  onSaveDraft,
  isSubmitting,
}: WizardStepBasicInfoProps) {
  const [serviceError, setServiceError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError(null);

    if (!formData.name?.trim() || !formData.price?.trim()) {
      alert("Please enter package name and starting price.");
      return;
    }

    if (!formData.serviceIds || formData.serviceIds.length === 0) {
      setServiceError("Please select at least one ISN service for this package.");
      return;
    }

    onNext();
  };

  return (
    <form
      onSubmit={handleContinue}
      className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <h3 className="font-trade font-bold text-xl text-main border-b border-hairline pb-4">
        Basic Info
      </h3>

      <div className="space-y-6">
        {/* Package Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-main uppercase">
            Package type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateFormData({ type: "Single" })}
              className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-trade font-bold transition-all cursor-pointer ${
                formData.type === "Single"
                  ? "border-primary bg-primary-subtle text-primary"
                  : "border-hairline bg-white text-main hover:bg-canvas"
              }`}
            >
              <Box className="w-6 h-6 shrink-0 text-primary" />
              <span className="text-base sm:text-lg">Single Package</span>
            </button>

            <button
              type="button"
              onClick={() => updateFormData({ type: "Bundle" })}
              className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-trade font-bold transition-all cursor-pointer ${
                formData.type === "Bundle"
                  ? "border-primary bg-primary-subtle text-primary"
                  : "border-hairline bg-white text-main hover:bg-canvas"
              }`}
            >
              <Layers className="w-6 h-6 shrink-0 text-primary" />
              <span className="text-base sm:text-lg">Bundle Package</span>
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-main uppercase">
            Category
          </label>
          <div className="flex items-center bg-white border border-hairline p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => updateFormData({ category: "Resale Home" })}
              className={`px-6 py-2.5 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                formData.category === "Resale Home"
                  ? "bg-main text-white shadow-xs"
                  : "text-sub hover:text-main"
              }`}
            >
              Resale Home
            </button>

            <button
              type="button"
              onClick={() => updateFormData({ category: "New Construction" })}
              className={`px-6 py-2.5 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                formData.category === "New Construction"
                  ? "bg-main text-white shadow-xs"
                  : "text-sub hover:text-main"
              }`}
            >
              New Construction
            </button>
          </div>
        </div>

        {/* Package Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-main uppercase">
            Package name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="e.g. Pre-Drywall Phase Inspection"
            required
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
          />
        </div>

        {/* Short Description Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-main uppercase">
            Short description <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => updateFormData({ shortDescription: e.target.value })}
            placeholder="One sentence shown on the booking portal card"
            required
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
          />
        </div>

        {/* Starting Price Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-main uppercase">
            Starting price (USD) <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => updateFormData({ price: e.target.value })}
            placeholder="e.g. $538"
            required
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
          />
        </div>

        {/* Services Selection */}
        <WizardServiceSelector
          packageType={formData.type}
          selectedServiceIds={formData.serviceIds || []}
          onChange={(serviceIds) => {
            setServiceError(null);
            updateFormData({ serviceIds });
          }}
          error={serviceError}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-hairline">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="bg-white"
        >
          {isSubmitting ? "Saving..." : "Save as draft"}
        </Button>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  );
}
