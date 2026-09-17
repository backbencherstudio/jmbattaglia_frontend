"use client";

import React from "react";
import { Check } from "lucide-react";
import { SubStep } from "@/types/stepper";

interface LeftSubStepperProps {
  subSteps: SubStep[];
  activeSubStepIndex: number;
  onSubStepClick: (index: number) => void;
}

export const LeftSubStepper: React.FC<LeftSubStepperProps> = ({
  subSteps,
  activeSubStepIndex,
  onSubStepClick,
}) => {
  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 p-3.5 sm:p-4 bg-white rounded-xl  border border-hairline shadow-xs self-start">
      {subSteps.map((subStep, idx) => {
        const isActive = idx === activeSubStepIndex;
        const isCompleted = idx < activeSubStepIndex;

        return (
          <div
            key={subStep.id}
            onClick={() => onSubStepClick(idx)}
            className={`flex-1 flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-lg cursor-pointer transition-all duration-200 select-none border ${isActive
              ? "bg-canvas border-hairline shadow-2xs"
              : isCompleted
                ? "bg-primary-subtle border-primary shadow-xs"
                : "bg-canvas border-transparent hover:border-hairline"
              }`}
          >
            {/* SubStep Badge */}
            {isCompleted ? (
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0 shadow-2xs">
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary stroke-[3]" />
                </span>
              </div>
            ) : isActive ? (
              <div className="w-7 h-7 rounded-md bg-white text-main border border-[#E3E3E1] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {subStep.number}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-md bg-white border border-[#E3E3E1] text-sub font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {subStep.number}
              </div>
            )}

            {/* SubStep Title */}
            <span
              className={`tracking-tight ${isActive
                ? "text-main font-bold text-base sm:text-lg lg:text-lg leading-[124%]"
                : isCompleted
                  ? "text-primary font-bold text-sm sm:text-base lg:text-lg leading-tight"
                  : "text-sub font-bold text-sm sm:text-base lg:text-lg leading-tight"
                }`}
            >
              {subStep.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
