"use client";

import React from "react";
import { StepProps } from "@/types/stepper";

interface GenericStepProps extends StepProps {
  title: string;
  description: string;
}

export const GenericStep: React.FC<GenericStepProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-main">
          {title}
        </h2>
        <p className="text-base text-sub mt-2">
          {description}
        </p>
      </div>

      <hr className="border-t border-hairline my-1" />

      <div className="p-8 rounded-3xl bg-canvas border border-hairline text-center text-muted">
        <p className="font-semibold text-lg text-main">Step content configured and ready.</p>
        <p className="text-sm mt-1">Provide image or specifications in the next prompt to build this section.</p>
      </div>
    </div>
  );
};
