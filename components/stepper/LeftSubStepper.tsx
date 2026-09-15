"use client";

import React from "react";
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
    <div className="w-full md:w-72 flex flex-col gap-2.5 p-3.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border border-hairline shadow-xs self-start">
      {subSteps.map((subStep, idx) => {
        const isActive = idx === activeSubStepIndex;

        return (
          <div
            key={subStep.id}
            onClick={() => onSubStepClick(idx)}
            className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 select-none border ${
              isActive
                ? "bg-primary-subtle border-primary shadow-xs"
                : "bg-canvas border-transparent hover:border-hairline"
            }`}
          >
            {/* SubStep Number Badge */}
            <div className="w-7 h-7 rounded-lg bg-white border border-hairline text-sub font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {subStep.number}
            </div>

            {/* SubStep Title */}
            <span
              className={`text-sm sm:text-base font-bold tracking-tight ${
                isActive ? "text-primary" : "text-sub"
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
