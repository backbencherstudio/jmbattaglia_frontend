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
    <div className="w-full md:w-64 flex flex-col gap-3 p-4 bg-white rounded-3xl border border-[var(--border-hairline,#E3E3E1)] shadow-sm self-start">
      {subSteps.map((subStep, idx) => {
        const isActive = idx === activeSubStepIndex;
        const isCompleted = idx < activeSubStepIndex;

        return (
          <div
            key={subStep.id}
            onClick={() => onSubStepClick(idx)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
              isActive
                ? "bg-[var(--surface-canvas,#F7F7F6)] border border-[var(--border-hairline,#E3E3E1)] shadow-xs"
                : "bg-[var(--surface-canvas,#F7F7F6)]/50 hover:bg-[var(--surface-canvas,#F7F7F6)]"
            }`}
          >
            {/* SubStep Number Badge */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                isActive
                  ? "bg-white text-[var(--text-primary,#01000B)] border border-gray-200 shadow-xs"
                  : isCompleted
                  ? "bg-[var(--brand-primary,#FF6900)] text-white"
                  : "bg-white text-gray-400"
              }`}
            >
              {subStep.number}
            </div>

            {/* SubStep Title */}
            <span
              className={`text-sm font-bold tracking-tight ${
                isActive
                  ? "text-[var(--text-primary,#01000B)]"
                  : "text-gray-400 font-medium"
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
