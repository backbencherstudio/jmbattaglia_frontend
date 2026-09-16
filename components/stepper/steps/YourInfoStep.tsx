"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone } from "lucide-react";

export const YourInfoStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="md:text-4xl text-2xl font-extrabold tracking-tight text-main">
          Tell Us About Yourself
        </h2>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          We&apos;ll use this to send your report and keep you posted on scheduling no pricing commitment yet.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* 2-column Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* First Name */}
        <Input
          label="First Name"
          requiredStar
          placeholder="e.g. Naffziger"
          value={formData.firstName || ""}
          onChange={(e) => {
            updateFormData({ firstName: e.target.value });
            clearError("firstName");
          }}
          error={errors.firstName}
          leftIcon={<User className="w-5 h-5 text-muted" />}
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          requiredStar
          placeholder="e.g. Realty"
          value={formData.lastName || ""}
          onChange={(e) => {
            updateFormData({ lastName: e.target.value });
            clearError("lastName");
          }}
          error={errors.lastName}
          leftIcon={<User className="w-5 h-5 text-muted" />}
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          requiredStar
          type="email"
          placeholder="e.g. info@nrcga.com"
          value={formData.email || ""}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            clearError("email");
          }}
          error={errors.email}
          leftIcon={<Mail className="w-5 h-5 text-muted" />}
        />

        {/* Mobile Phone */}
        <Input
          label="Mobile Phone"
          requiredStar
          type="tel"
          placeholder="e.g. (678) 631-1892"
          value={formData.phone || ""}
          onChange={(e) => {
            updateFormData({ phone: e.target.value });
            clearError("phone");
          }}
          error={errors.phone}
          leftIcon={<Phone className="w-5 h-5 text-muted" />}
        />
      </div>

      {/* Helper text below grid */}
      <p className="text-xs sm:text-sm text-sub mt-1">
        We&apos;ll follow up here if you need to step away before finishing your booking.
      </p>
    </div>
  );
};
