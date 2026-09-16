"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { Building2, Building, Globe, MapPin, ChevronDown, HelpCircle } from "lucide-react";

export const PropertyAddressStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-main">
          Property Address
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-sub mt-1.5">
          We&apos;ll use this to send your report and keep you posted on scheduling no pricing commitment yet.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* Form Fields Stack */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          requiredStar
          placeholder="123 Main Street"
          value={formData.addressLine1 || ""}
          onChange={(e) => {
            updateFormData({ addressLine1: e.target.value });
            clearError("addressLine1");
          }}
          error={errors.addressLine1}
          leftIcon={<Building2 className="w-5 h-5 text-muted" />}
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2 (Apt, Suite, etc.)"
          placeholder="Apt 2B, Unit 100"
          value={formData.addressLine2 || ""}
          onChange={(e) => {
            updateFormData({ addressLine2: e.target.value });
            clearError("addressLine2");
          }}
          error={errors.addressLine2}
          leftIcon={<Building className="w-5 h-5 text-muted" />}
        />

        {/* City */}
        <Input
          label="City"
          requiredStar
          placeholder="Atlanta"
          value={formData.city || ""}
          onChange={(e) => {
            updateFormData({ city: e.target.value });
            clearError("city");
          }}
          error={errors.city}
          leftIcon={<Building2 className="w-5 h-5 text-muted" />}
        />

        {/* State & Zip Code Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* State */}
          <Input
            label="State"
            requiredStar
            placeholder="Georgia (GA)"
            value={formData.state || ""}
            onChange={(e) => {
              updateFormData({ state: e.target.value });
              clearError("state");
            }}
            error={errors.state}
            leftIcon={<Globe className="w-5 h-5 text-muted" />}
            rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
          />

          {/* Zip Code */}
          <Input
            label="Zip Code"
            requiredStar
            placeholder="30301"
            value={formData.zipCode || ""}
            onChange={(e) => {
              updateFormData({ zipCode: e.target.value });
              clearError("zipCode");
            }}
            error={errors.zipCode}
            leftIcon={<MapPin className="w-5 h-5 text-muted" />}
            rightAction={<HelpCircle className="w-4 h-4 text-muted cursor-pointer hover:text-main" />}
          />
        </div>
      </div>
    </div>
  );
};
