"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "green" | "custom";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  bgColor,
  textColor,
  borderColor,
  className = "",
  disabled,
  children,
  style,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-hover text-white focus:ring-primary shadow-xs",
    secondary:
      "bg-primary-subtle hover:bg-[#FDDCC0] text-primary focus:ring-primary",
    outline:
      "bg-white hover:bg-canvas text-main border border-hairline focus:ring-primary",
    ghost:
      "bg-transparent hover:bg-canvas text-main focus:ring-gray-300",
    green:
      "bg-accent-green hover:bg-accent-green-hover text-white focus:ring-accent-green shadow-xs",
    custom: "",
  };

  const customStyles: React.CSSProperties = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor
      ? { borderColor: borderColor, borderWidth: "1px", borderStyle: "solid" }
      : {}),
    ...style,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variant !== "custom" ? variantStyles[variant] : ""
        } ${className}`}
      disabled={disabled || isLoading}
      style={customStyles}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
