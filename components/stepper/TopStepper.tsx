import React from "react";
import { User, ClipboardList, Calendar, FileText } from "lucide-react";
import { MainStep } from "@/types/stepper";

interface TopStepperProps {
  steps: MainStep[];
  activeStepIndex: number;
  onStepClick: (index: number) => void;
}

const getStepIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "user":
      return <User className={className} />;
    case "clipboard":
      return <ClipboardList className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "file-text":
      return <FileText className={className} />;
    default:
      return <User className={className} />;
  }
};

export const TopStepper: React.FC<TopStepperProps> = ({
  steps,
  activeStepIndex,
  onStepClick,
}) => {
  return (
    <div className="w-full py-6 px-4 flex items-center justify-center bg-[var(--layout-bg,#FFFFFF)]">
      <div className="relative flex items-center justify-between w-full max-w-3xl">
        {/* Dotted Connecting Line */}
        <div className="absolute top-6 left-12 right-12 h-[2px] border-t-2 border-dotted border-[var(--border-hairline,#E3E3E1)] -z-0" />

        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isCompleted = idx < activeStepIndex;

          return (
            <div
              key={step.id}
              onClick={() => idx <= activeStepIndex && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center gap-2 group cursor-pointer transition-all ${
                idx > activeStepIndex ? "cursor-not-allowed opacity-75" : ""
              }`}
            >
              {/* Step Icon Box */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                  isActive
                    ? "border-[var(--brand-primary,#FF6900)] bg-[var(--brand-primary-subtle,#FFE9D6)] shadow-sm scale-105"
                    : isCompleted
                    ? "border-[var(--brand-primary,#FF6900)] bg-white"
                    : "border-[var(--border-hairline,#E3E3E1)] bg-[var(--surface-canvas,#F7F7F6)]"
                }`}
              >
                {getStepIcon(
                  step.iconName,
                  `w-5 h-5 ${
                    isActive
                      ? "text-[var(--brand-primary,#FF6900)]"
                      : isCompleted
                      ? "text-[var(--brand-primary,#FF6900)]"
                      : "text-gray-500"
                  }`
                )}
              </div>

              {/* Step Title */}
              <span
                className={`text-xs md:text-sm tracking-tight transition-colors text-center font-bold ${
                  isActive
                    ? "text-[var(--text-primary,#01000B)]"
                    : isCompleted
                    ? "text-[var(--text-primary,#01000B)]"
                    : "text-[var(--text-muted,#8E8E93)]"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
