"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { CardOption } from "@/components/ui/CardOption";

export const InspectionTypeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const options = [
    {
      id: "resale-home",
      title: "Resale Home",
      description: "Existing home, being bought or sold",
    },
    {
      id: "new-construction",
      title: "New Construction",
      description: "Recently built or still under construction",
    },
  ];

  const handleSelect = (id: string) => {
    updateFormData({ inspectionKind: id as any });
    clearError("inspectionKind");
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="md:text-4xl text-2xl font-extrabold tracking-tight text-main">
          What Kind Of Inspection?
        </h2>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          We&apos;ll use this to send your report and keep you posted on scheduling no pricing commitment yet.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* 2-column Option Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {options.map((option) => (
          <CardOption
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
            isSelected={formData.inspectionKind === option.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {errors.inspectionKind && (
        <p className="text-xs sm:text-sm text-red-500 font-medium">{errors.inspectionKind}</p>
      )}
    </div>
  );
};
