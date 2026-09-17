"use client";

import React, { useState } from "react";
import { ChevronRight, CheckCircle, Box, Layers as LayersIcon } from "lucide-react";
import { PackageCategory, PackageType } from "@/types/packages";
import { Button } from "@/components/ui/Button";

interface CreatePackageWizardProps {
  onBack: () => void;
  onSave: (data: {
    name: string;
    category: PackageCategory;
    type: PackageType;
    price: string;
    shortDescription: string;
    status: "Published" | "Draft";
  }) => void;
}

export function CreatePackageWizard({
  onBack,
  onSave,
}: CreatePackageWizardProps) {
  const [currentStep, setCurrentStep] = useState<
    "basic" | "media" | "review"
  >("basic");

  // Form State
  const [packageType, setPackageType] = useState<PackageType>("Single");
  const [category, setCategory] = useState<PackageCategory>("Resale Home");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (isDraft = false) => {
    if (!name || !price) {
      alert("Please enter package name and starting price.");
      return;
    }

    onSave({
      name,
      category,
      type: packageType,
      price: price.startsWith("$") ? price : `$${price}`,
      shortDescription: shortDescription || "Inspection package.",
      status: isDraft ? "Draft" : "Published",
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
            onClick={() => setCurrentStep("basic")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all ${
              currentStep === "basic"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Basic Info</span>
          </button>

          <button
            onClick={() => setCurrentStep("media")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all ${
              currentStep === "media"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Educational Content & Media</span>
          </button>

          <button
            onClick={() => setCurrentStep("review")}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-trade font-bold text-base transition-all ${
              currentStep === "review"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-hairline text-sub hover:text-main"
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Review</span>
          </button>
        </div>

        {/* Right Form Container */}
        <div className="lg:col-span-8 bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6">
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
                  onClick={() => setPackageType("Single")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-trade font-bold transition-all cursor-pointer ${
                    packageType === "Single"
                      ? "border-primary bg-primary-subtle text-primary"
                      : "border-hairline bg-white text-main hover:bg-canvas"
                  }`}
                >
                  <Box className="w-6 h-6 shrink-0" />
                  <span>Single Package</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPackageType("Bundle")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border text-left font-trade font-bold transition-all cursor-pointer ${
                    packageType === "Bundle"
                      ? "border-primary bg-primary-subtle text-primary"
                      : "border-hairline bg-white text-main hover:bg-canvas"
                  }`}
                >
                  <LayersIcon className="w-6 h-6 shrink-0" />
                  <span>Bundle Package</span>
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
                  onClick={() => setCategory("Resale Home")}
                  className={`px-6 py-2.5 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                    category === "Resale Home"
                      ? "bg-main text-white shadow-xs"
                      : "text-sub hover:text-main"
                  }`}
                >
                  Resale Home
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("New Construction")}
                  className={`px-6 py-2.5 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                    category === "New Construction"
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pre-Drywall Phase Inspection"
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
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One sentence shown on the booking portal card"
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$538"
                className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-hairline">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              className="bg-white"
            >
              Save as draft
            </Button>

            <Button variant="primary" onClick={() => handleSubmit(false)}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
