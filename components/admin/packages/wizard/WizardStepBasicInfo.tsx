"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Layers,
  AlertCircle,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
  Info,
} from "lucide-react";
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

const MAX_DESCRIPTION_LENGTH = 160;

export function WizardStepBasicInfo({
  formData,
  updateFormData,
  onNext,
  onSaveDraft,
  isSubmitting,
}: WizardStepBasicInfoProps) {
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState<boolean>(true);
  const [showMobilePreview, setShowMobilePreview] = useState<boolean>(false);

  const descLength = formData.shortDescription?.length || 0;
  const isDescOverLimit = descLength > MAX_DESCRIPTION_LENGTH;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setServiceError(null);

    if (!formData.name?.trim() || !formData.price?.trim()) {
      alert("Please enter package name and starting price.");
      return;
    }

    const numericPrice = (formData.price || "").replace(/[^0-9.]/g, "");
    const dollars = parseFloat(numericPrice) || 0;
    if (dollars <= 0 && !formData.quoteRequired) {
      alert(
        "Packages with $0 price cannot be created without enabling 'Quote Required / Custom Pricing'."
      );
      return;
    }

    if (!formData.serviceIds || formData.serviceIds.length === 0) {
      setServiceError("Please select at least one ISN service for this package.");
      return;
    }

    onNext();
  };

  // Live formatted price string for preview
  const previewPrice = React.useMemo(() => {
    if (formData.quoteRequired) {
      const num = parseFloat((formData.price || "").replace(/[^0-9.]/g, ""));
      return num > 0 ? `$${num.toLocaleString()}` : "Custom Quote";
    }
    if (!formData.price?.trim()) return "$0";
    if (formData.price.startsWith("$")) return formData.price;
    const num = parseFloat(formData.price.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? "$0" : `$${num.toLocaleString()}`;
  }, [formData.price, formData.quoteRequired]);

  return (
    <div className="space-y-6">
      {/* Mobile Live Preview Toggle Button */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-white border border-hairline rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="font-trade font-bold text-xs text-main">
            Customer Portal Live Preview
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          {showMobilePreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <form
          onSubmit={handleContinue}
          className="lg:col-span-7 bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h3 className="font-trade font-bold text-xl text-main">
              Basic Info
            </h3>
            <span className="text-xs text-muted font-medium">
              Step 1 of 3
            </span>
          </div>

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
                      ? "border-primary bg-primary-subtle text-primary shadow-xs"
                      : "border-hairline bg-white text-main hover:bg-canvas"
                  }`}
                >
                  <Box className="w-6 h-6 shrink-0 text-primary" />
                  <div>
                    <span className="text-base sm:text-lg block">Single Package</span>
                    <span className="text-xs font-normal text-sub">Individual inspection service</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateFormData({ type: "Bundle" })}
                  className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-trade font-bold transition-all cursor-pointer ${
                    formData.type === "Bundle"
                      ? "border-primary bg-primary-subtle text-primary shadow-xs"
                      : "border-hairline bg-white text-main hover:bg-canvas"
                  }`}
                >
                  <Layers className="w-6 h-6 shrink-0 text-primary" />
                  <div>
                    <span className="text-base sm:text-lg block">Bundle Package</span>
                    <span className="text-xs font-normal text-sub">Multiple bundled inspections</span>
                  </div>
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
                placeholder="e.g. Signature Safe Home Package"
                required
                className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
              />
            </div>

            {/* Short Description Input with Character Limit & Real-time Warning */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-main uppercase">
                  Short description <span className="text-primary">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-mono font-bold transition-colors ${
                      isDescOverLimit ? "text-danger" : "text-muted"
                    }`}
                  >
                    {descLength} / {MAX_DESCRIPTION_LENGTH}
                  </span>
                  {isDescOverLimit && (
                    <span className="text-[10px] font-bold uppercase bg-danger/10 text-danger px-1.5 py-0.5 rounded">
                      Overflow
                    </span>
                  )}
                </div>
              </div>

              <textarea
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                placeholder="Concise overview shown directly on the booking portal card (e.g. 'Comprehensive buyer protection covering structural, electrical, plumbing, and HVAC systems.')"
                required
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none resize-none transition-colors ${
                  isDescOverLimit
                    ? "border-danger focus:border-danger ring-1 ring-danger"
                    : "border-hairline focus:border-brand-border"
                }`}
              />

              {isDescOverLimit ? (
                <div className="p-2.5 bg-danger-bg/50 border border-danger/20 rounded-xl flex items-start gap-2 text-xs text-danger font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Warning: Description exceeds recommended {MAX_DESCRIPTION_LENGTH} characters. Text beyond {MAX_DESCRIPTION_LENGTH} characters may be truncated on mobile customer screens.
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-muted">
                  Keep under {MAX_DESCRIPTION_LENGTH} characters for optimal display on customer booking cards.
                </p>
              )}
            </div>

            {/* Starting Price Input & Quote Required Toggle */}
            <div className="space-y-3">
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

              {/* Quote Required Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-hairline rounded-xl shadow-2xs">
                <div className="space-y-0.5 pr-4">
                  <label
                    className="text-sm font-semibold text-main cursor-pointer"
                    htmlFor="quote-required-toggle"
                  >
                    Quote Required / Dynamic Pricing
                  </label>
                  <p className="text-xs text-sub">
                    Enable if price is calculated on property square footage or requires custom quote review (allows $0 starting price).
                  </p>
                </div>
                <input
                  id="quote-required-toggle"
                  type="checkbox"
                  checked={Boolean(formData.quoteRequired)}
                  onChange={(e) =>
                    updateFormData({ quoteRequired: e.target.checked })
                  }
                  className="w-5 h-5 accent-primary cursor-pointer rounded shrink-0"
                />
              </div>
            </div>

            {/* Services Selection (Grouped & Cleaned) */}
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
              Continue to Media
            </Button>
          </div>
        </form>

        {/* Right Column: Sticky Live Card Preview (Desktop & Toggled Mobile) */}
        <div
          className={`lg:col-span-5 ${
            showMobilePreview ? "block" : "hidden lg:block"
          } space-y-4 lg:sticky lg:top-6`}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-900 text-white rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
              <span className="font-trade font-bold text-xs uppercase tracking-wider text-neutral-200">
                Live Customer Portal Preview
              </span>
            </div>
            <span className="text-[11px] font-medium text-neutral-400">
              Interactive Card
            </span>
          </div>

          {/* Customer Portal Package Card Preview */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-sub px-1">
              <span>Customer View: Step 2 Selection</span>
              <span className="font-semibold text-primary">
                {formData.category} • {formData.type}
              </span>
            </div>

            {/* Card Simulation */}
            <div className="rounded-xl transition-all overflow-hidden border border-primary bg-white shadow-xs">
              {/* Header Row */}
              <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Radio Circle */}
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-white flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base sm:text-lg text-main leading-snug">
                          {formData.name?.trim() || "Untitled Inspection Package"}
                        </span>
                        {formData.isRecommended && (
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide shrink-0">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-sub mt-1 leading-relaxed">
                        {formData.shortDescription?.trim() ||
                          "Package short description will appear here as you type."}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-lg sm:text-xl font-extrabold text-primary block">
                      {previewPrice}
                    </span>
                    <span className="text-[11px] text-muted">
                      {formData.type} Price
                    </span>
                  </div>
                </div>

                {/* Sub-bar with Video & Accordion Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-hairline/60">
                  <span className="text-xs text-sub flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent-green" />
                    <span>
                      {formData.serviceIds?.length || 0} ISN{" "}
                      {formData.serviceIds?.length === 1 ? "service" : "services"} bundled
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-7 px-2 rounded-lg bg-primary-subtle text-primary border border-primary/25 flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                      className="p-1 rounded-lg border border-hairline bg-canvas hover:bg-hairline/40 transition-colors cursor-pointer"
                      aria-label="Toggle preview details"
                    >
                      {isPreviewExpanded ? (
                        <ChevronUp className="w-4 h-4 text-main" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-main" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Card Details Body */}
              {isPreviewExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-hairline/60 flex flex-col gap-3">
                  {/* Media banner preview */}
                  <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mt-1 bg-neutral-900 border border-hairline">
                    <Image
                      src={formData.image || "/assets/images/safe_home_package.jpg"}
                      alt={formData.name || "Package Media Preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-center justify-between">
                      <span className="text-white font-bold text-xs truncate drop-shadow-sm">
                        {formData.name || "Package Overview"}
                      </span>
                      <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded font-bold">
                        Watch Video
                      </span>
                    </div>
                  </div>

                  {/* Why It Matters Callout */}
                  <div className="border-l-3 border-primary bg-canvas p-2.5 rounded-r-lg">
                    <h5 className="font-bold text-[11px] text-main uppercase">
                      Why It Matters
                    </h5>
                    <p className="text-xs text-sub mt-0.5 leading-relaxed line-clamp-3">
                      {formData.whyItMatters ||
                        "A persuasive sentence explaining why buyers or sellers need this inspection package."}
                    </p>
                  </div>

                  {/* Features Checklist */}
                  {Array.isArray(formData.featuresIncluded) &&
                    formData.featuresIncluded.length > 0 && (
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {formData.featuresIncluded.slice(0, 3).map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-sub"
                          >
                            <Check className="w-3.5 h-3.5 text-accent-green shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                        {formData.featuresIncluded.length > 3 && (
                          <span className="text-[11px] text-muted italic pl-5.5">
                            + {formData.featuresIncluded.length - 3} more features included
                          </span>
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>

            <p className="text-[11px] text-muted text-center pt-1">
              Changes typed in the form are reflected in this live card immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
