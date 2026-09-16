"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { CardOption } from "@/components/ui/CardOption";

export const WhoItsForStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const options = [
    {
      id: "home-buyer",
      title: "Home Buyer",
      description: "Purchasing a property and need a pre-sale inspection",
    },
    {
      id: "home-owner",
      title: "Home Owner",
      description: "Get your home checked out before you put it up for sale",
    },
    {
      id: "buyers-agent",
      title: "Buyer's Agent",
      description: "Ordering on behalf of your client for their purchase",
    },
  ];

  const handleSelect = (id: string) => {
    updateFormData({ customerRole: id as any });
    clearError("customerRole");
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main">
          Who Is This Inspection For?
        </h2>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          This helps us tailor your experience and show the right options for your situation.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* Option cards stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {options.map((option) => (
          <CardOption
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
            isSelected={formData.customerRole === option.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {errors.customerRole && (
        <p className="text-xs sm:text-sm text-red-500 font-medium">{errors.customerRole}</p>
      )}
    </div>
  );
};
