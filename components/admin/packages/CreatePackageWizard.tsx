"use client";

import React, { useState } from "react";
import { ChevronRight, CheckCircle, Check } from "lucide-react";
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

  const steps: { id: WizardStep; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "media", label: "Educational Content & Media" },
    { id: "review", label: "Review" },
  ];

  const stepOrder: WizardStep[] = ["basic", "media", "review"];
  const currentIndex = stepOrder.indexOf(currentStep);

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
        <div className="lg:col-span-4 bg-canvas border border-hairline rounded-xl p-4 space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepChange(step.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-trade font-bold text-base transition-all cursor-pointer ${isCompleted
                  ? "bg-[#B44000] text-white shadow-xs"
                  : isActive
                    ? "bg-[#FF6900] text-white shadow-xs"
                    : "bg-white border border-hairline text-sub hover:text-main"
                  }`}
              >
                {/* Icon / Badge Container */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCompleted || isActive
                    ? "bg-[#FFE9D6]"
                    : "bg-canvas border border-hairline text-muted"
                    }`}
                >
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6900] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6900] flex items-center justify-center text-white font-sans text-xs font-bold">
                      {idx + 1}
                    </div>
                  ) : (
                    <span className="font-sans text-xs font-semibold text-muted">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <span>{step.label}</span>
              </button>
            );
          })}
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
