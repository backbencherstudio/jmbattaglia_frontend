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
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary,#01000B)]">
          {title}
        </h2>
        <p className="text-base text-[var(--text-secondary,#555555)] mt-2">
          {description}
        </p>
      </div>

      <hr className="border-t border-[var(--border-hairline,#E3E3E1)] my-1" />

      <div className="p-8 rounded-3xl bg-[var(--surface-canvas,#F7F7F6)] border border-[var(--border-hairline,#E3E3E1)] text-center text-gray-500">
        <p className="font-semibold text-lg">Step content configured and ready.</p>
        <p className="text-sm mt-1">Provide image or specifications in the next prompt to build this section.</p>
      </div>
    </div>
  );
};
