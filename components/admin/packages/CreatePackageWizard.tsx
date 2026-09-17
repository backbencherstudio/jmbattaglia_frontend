"use client";

import React, { useState } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";
import { useTabQuery } from "@/hooks/useTabQuery";
import { PackageFormData, WizardStep } from "@/types/wizard";
import { WizardStepBasicInfo } from "@/components/admin/packages/wizard/WizardStepBasicInfo";
import { WizardStepMedia } from "@/components/admin/packages/wizard/WizardStepMedia";
import { WizardStepReview } from "@/components/admin/packages/wizard/WizardStepReview";

interface CreatePackageWizardProps {
  onBack: () => void;
  onSave: (data: {
    name: string;
    category: "Resale Home" | "New Construction" | "Commercial" | "Add-on";
    type: "Single" | "Bundle";
    price: string;
    shortDescription: string;
    status: "Published" | "Draft";
  }) => void;
}

export function CreatePackageWizard({
  onBack,
  onSave,
}: CreatePackageWizardProps) {
  const { getParam, updateQueryParams } = useTabQuery();

  // Active step from URL search param (default: 'basic')
  const stepParam = getParam("step", "basic") as WizardStep;
  const currentStep = ["basic", "media", "review"].includes(stepParam)
    ? stepParam
    : "basic";

  // Form State
  const [formData, setFormData] = useState<PackageFormData>({
    type: "Single",
    category: "Resale Home",
    name: "",
    shortDescription: "",
    price: "",
    whyItMatters:
      "A persuasive sentence shown in the expandable block on the portal — e.g. 'Buyers make a six-figure decision on a single walkthrough.'",
    featuresIncluded: [
      "Structural components & foundation",
      "Roofing system & attic space",
      "Electrical panels, wiring & outlets",
      "Heating & cooling systems (HVAC)",
    ],
    image: "/assets/images/safe_home_package.jpg",
    isRecommended: true,
    status: "Published",
  });

  const updateFormData = (fields: Partial<PackageFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleStepChange = (nextStep: WizardStep) => {
    updateQueryParams({ step: nextStep });
  };

  const handlePublish = () => {
    onSave({
      name: formData.name || "Pre-Drywall Phase Inspection",
      category: formData.category,
      type: formData.type,
      price: formData.price.startsWith("$")
        ? formData.price
        : `$${formData.price || "538"}`,
      shortDescription:
        formData.shortDescription || "Inspection package for your home.",
      status: "Published",
    });
  };

  const handleSaveDraft = () => {
    onSave({
      name: formData.name || "Draft Inspection Package",
      category: formData.category,
      type: formData.type,
      price: formData.price.startsWith("$")
        ? formData.price
        : `$${formData.price || "500"}`,
      shortDescription:
        formData.shortDescription || "Draft package for review.",
      status: "Draft",
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xs text-sub">
        <button
          onClick={onBack}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Packages
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted" />
        <span className="font-semibold text-main">Create Packages</span>
      </nav>

      {/* Main Grid: Left Stepper Navigation + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Wizard Stepper */}
        <div className="lg:col-span-4 bg-canvas border border-hairline rounded-2xl p-4 space-y-3">
          <button
            type="button"
            onClick={() => handleStepChange("basic")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all cursor-pointer ${
              currentStep === "basic"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => handleStepChange("media")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all cursor-pointer ${
              currentStep === "media"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Educational Content & Media</span>
          </button>

          <button
            type="button"
            onClick={() => handleStepChange("review")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all cursor-pointer ${
              currentStep === "review"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Review</span>
          </button>
        </div>

        {/* Right Form Step Rendering */}
        <div className="lg:col-span-8">
          {currentStep === "basic" && (
            <WizardStepBasicInfo
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => handleStepChange("media")}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {currentStep === "media" && (
            <WizardStepMedia
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => handleStepChange("review")}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {currentStep === "review" && (
            <WizardStepReview
              formData={formData}
              updateFormData={updateFormData}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
            />
          )}
        </div>
      </div>
    </div>
  );
}
