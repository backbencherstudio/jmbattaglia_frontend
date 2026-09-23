"use client";

import React, { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  requiredStar?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  options: (string | SelectOption)[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  requiredStar,
  error,
  helperText,
  leftIcon,
  options,
  placeholder = "Select an option",
  containerClassName = "",
  className = "",
  id,
  disabled,
  value,
  onChange,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold tracking-wide text-main flex items-center gap-1"
        >
          {label}
          {requiredStar && <span className="text-primary">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-4 flex items-center justify-center text-muted pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        <select
          id={selectId}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg transition-all duration-200 text-main focus:outline-none border border-hairline hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white shadow-2xs appearance-none cursor-pointer ${
            leftIcon ? "pl-11" : "pl-4"
          } pr-10 py-3.5 text-base ${
            !value ? "text-muted" : "text-main"
          } ${error ? "border-red-500 focus:ring-red-500" : ""} ${
            disabled ? "opacity-60 cursor-not-allowed bg-canvas" : ""
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-muted bg-white">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val} className="text-main bg-white py-1.5">
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 flex items-center justify-center text-muted pointer-events-none">
          <ChevronDown className="w-5 h-5 text-muted" />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-sub mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
