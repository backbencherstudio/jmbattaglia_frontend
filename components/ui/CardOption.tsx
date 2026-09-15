"use client";

import React from "react";

export interface CardOptionProps {
  id: string;
  title: string;
  description: string;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  icon?: React.ReactNode;
}

export const CardOption: React.FC<CardOptionProps> = ({
  id,
  title,
  description,
  isSelected = false,
  onSelect,
  icon,
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-200 border text-left flex flex-col justify-between h-full select-none ${
        isSelected
          ? "border-primary bg-primary-subtle shadow-2xs"
          : "border-transparent bg-canvas hover:bg-gray-200/60"
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Title row with Radio indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            {isSelected ? (
              <span className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0 bg-white">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full border border-gray-400 bg-white shrink-0" />
            )}
          </div>

          {icon && <div className="text-primary">{icon}</div>}

          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-main">
            {title}
          </h3>
        </div>

        {/* Description text */}
        <p className="text-xs sm:text-sm leading-relaxed text-sub pl-8">
          {description}
        </p>
      </div>
    </div>
  );
};
