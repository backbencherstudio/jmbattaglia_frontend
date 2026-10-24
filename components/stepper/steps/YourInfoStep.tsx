"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone, Users } from "lucide-react";

export const YourInfoStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const isAgent = formData.customerRole === "buyers-agent";

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="md:text-4xl text-2xl font-extrabold tracking-tight text-main">
          {isAgent ? "Agent & Client Information" : "Tell Us About Yourself"}
        </h2>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          {isAgent
            ? "Enter your agent contact details and your buyer client's contact info for the inspection report."
            : "We'll use this to send your report and keep you posted on scheduling no pricing commitment yet."}
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* Main Contact (Agent or Primary Customer) */}
      <div className="flex flex-col gap-3">
        {isAgent && (
          <div className="flex items-center gap-2 text-sm font-bold text-main">
            <User className="w-4 h-4 text-primary" />
            <span>Agent Contact Details</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* First Name */}
          <Input
            label={isAgent ? "Agent First Name" : "First Name"}
            requiredStar
            placeholder="e.g. Jane"
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
            label={isAgent ? "Agent Last Name" : "Last Name"}
            requiredStar
            placeholder="e.g. Miller"
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
            label={isAgent ? "Agent Email Address" : "Email Address"}
            requiredStar
            type="email"
            placeholder="e.g. agent@example.com"
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
            label={isAgent ? "Agent Phone" : "Mobile Phone"}
            requiredStar
            type="tel"
            placeholder="e.g. (404) 555-0100"
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

      {/* Buyer Contact section if role is buyer's agent */}
      {isAgent && (
        <div className="flex flex-col gap-3 pt-3 border-t border-hairline">
          <div className="flex items-center gap-2 text-sm font-bold text-main">
            <Users className="w-4 h-4 text-primary" />
            <span>Buyer / Client Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <Input
              label="Buyer First Name"
              placeholder="e.g. John"
              value={formData.buyerFirstName || ""}
              onChange={(e) => {
                updateFormData({ buyerFirstName: e.target.value });
              }}
              leftIcon={<User className="w-5 h-5 text-muted" />}
            />

            <Input
              label="Buyer Last Name"
              placeholder="e.g. Doe"
              value={formData.buyerLastName || ""}
              onChange={(e) => {
                updateFormData({ buyerLastName: e.target.value });
              }}
              leftIcon={<User className="w-5 h-5 text-muted" />}
            />

            <Input
              label="Buyer Email"
              type="email"
              placeholder="e.g. buyer@example.com"
              value={formData.buyerEmail || ""}
              onChange={(e) => {
                updateFormData({ buyerEmail: e.target.value });
                clearError("buyerEmail");
              }}
              error={errors.buyerEmail}
              leftIcon={<Mail className="w-5 h-5 text-muted" />}
            />

            <Input
              label="Buyer Phone"
              type="tel"
              placeholder="e.g. (404) 555-0101"
              value={formData.buyerPhone || ""}
              onChange={(e) => {
                updateFormData({ buyerPhone: e.target.value });
                clearError("buyerPhone");
              }}
              error={errors.buyerPhone}
              leftIcon={<Phone className="w-5 h-5 text-muted" />}
            />
          </div>
        </div>
      )}

      {/* Helper text below grid */}
      <p className="text-xs sm:text-sm text-sub mt-1">
        We&apos;ll follow up here if you need to step away before finishing your booking.
      </p>
    </div>
  );
};
