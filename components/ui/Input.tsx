import React, { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredStar?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightAction?: ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  requiredStar,
  error,
  helperText,
  leftIcon,
  rightAction,
  containerClassName = "",
  className = "",
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold tracking-wide text-[var(--text-primary,#01000B)] flex items-center gap-1"
        >
          {label}
          {requiredStar && <span className="text-[var(--brand-primary,#FF6900)]">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-4 flex items-center justify-center text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          className={`w-full rounded-2xl transition-all duration-200 text-[var(--text-primary,#01000B)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary,#FF6900)] border border-[var(--border-hairline,#E3E3E1)] bg-[var(--surface-canvas,#F7F7F6)] ${
            leftIcon ? "pl-11" : "pl-4"
          } ${rightAction ? "pr-36" : "pr-4"} py-3.5 text-base ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
          {...props}
        />

        {rightAction && (
          <div className="absolute right-2 flex items-center justify-center">
            {rightAction}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[var(--text-secondary,#555555)] mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
