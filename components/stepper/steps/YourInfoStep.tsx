"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { User, Phone } from "lucide-react";

export const YourInfoStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-main">
          Your Contact Information
        </h2>
        <p className="text-base text-sub mt-2">
          Please provide your contact details so we can send inspection updates.
        </p>
      </div>

      <hr className="border-t border-hairline my-1" />

      <div className="flex flex-col gap-4">
        <Input
          label="Full Name"
          requiredStar
          placeholder="e.g. John Doe"
          value={formData.fullName || ""}
          onChange={(e) => {
            updateFormData({ fullName: e.target.value });
            clearError("fullName");
          }}
          error={errors.fullName}
          leftIcon={<User className="w-5 h-5 text-muted" />}
        />

        <Input
          label="Phone Number"
          requiredStar
          placeholder="e.g. (555) 000-0000"
          value={formData.phone || ""}
          onChange={(e) => {
            updateFormData({ phone: e.target.value });
            clearError("phone");
          }}
          error={errors.phone}
          leftIcon={<Phone className="w-5 h-5 text-muted" />}
        />
      </div>
    </div>
  );
};
