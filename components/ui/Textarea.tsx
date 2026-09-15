"use client";

import React, { TextareaHTMLAttributes, ReactNode } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  requiredStar?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  requiredStar,
  error,
  helperText,
  leftIcon,
  containerClassName = "",
  className = "",
  id,
  disabled,
  rows = 4,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold tracking-wide text-main flex items-center gap-1"
        >
          {label}
          {requiredStar && <span className="text-primary">*</span>}
        </label>
      )}

      <div className="relative flex w-full">
        {leftIcon && (
          <div className="absolute left-4 top-4 flex items-center justify-center text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}

        <textarea
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={`w-full rounded-lg transition-all duration-200 text-main placeholder:text-muted focus:outline-none border border-hairline bg-canvas ${
            leftIcon ? "pl-11" : "pl-4"
          } p-3.5 text-base ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-sub mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
