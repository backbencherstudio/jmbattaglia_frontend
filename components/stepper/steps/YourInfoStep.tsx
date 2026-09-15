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
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary,#01000B)]">
          Your Contact Information
        </h2>
        <p className="text-base text-[var(--text-secondary,#555555)] mt-2">
          Please provide your contact details so we can send inspection updates.
        </p>
      </div>

      <hr className="border-t border-[var(--border-hairline,#E3E3E1)] my-1" />

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
          leftIcon={<User className="w-5 h-5 text-gray-400" />}
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
          leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
        />
      </div>
    </div>
  );
};
