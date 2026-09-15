"use client";

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
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 flex items-center justify-center bg-layout-bg border-b sm:border-b-0 border-hairline">
      <div className="relative flex items-center justify-between w-full max-w-4xl">
        {/* Dynamic Dotted Connecting Line Segments */}
        <div className="absolute top-4 sm:top-6 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between -z-0">
          {steps.slice(0, steps.length - 1).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-[2px] border-t-2 border-dotted transition-colors duration-300 ${
                i < activeStepIndex ? "border-primary" : "border-hairline"
              }`}
            />
          ))}
        </div>

        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isCompleted = idx < activeStepIndex;

          return (
            <div
              key={step.id}
              onClick={() => idx <= activeStepIndex && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer transition-all ${
                idx > activeStepIndex ? "cursor-not-allowed opacity-75" : ""
              }`}
            >
              {/* Step Icon Box */}
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                  isCompleted
                    ? "border-primary bg-primary text-white shadow-xs"
                    : isActive
                    ? "border-primary bg-primary-subtle text-primary shadow-xs scale-105"
                    : "border-hairline bg-canvas text-gray-400"
                }`}
              >
                {getStepIcon(
                  step.iconName,
                  `w-4 h-4 sm:w-5 sm:h-5 ${
                    isCompleted
                      ? "text-white"
                      : isActive
                      ? "text-primary"
                      : "text-gray-400"
                  }`
                )}
              </div>

              {/* Step Title */}
              <span
                className={`text-[10px] sm:text-xs md:text-sm tracking-tight transition-colors text-center font-bold ${
                  isActive || isCompleted ? "text-main font-bold" : "text-muted font-normal"
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
