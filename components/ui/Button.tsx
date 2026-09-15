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
  // Base classes for consistent interactive feel
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

  // Size variants
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Predefined variant styles using central CSS variables
  const variantStyles = {
    primary:
      "bg-[var(--brand-primary,#FF6900)] hover:bg-[var(--brand-primary-hover,#E55E00)] text-white focus:ring-[var(--brand-primary,#FF6900)] shadow-sm",
    secondary:
      "bg-[var(--brand-primary-subtle,#FFE9D6)] hover:bg-[#FDDCC0] text-[var(--brand-primary,#FF6900)] focus:ring-[var(--brand-primary,#FF6900)]",
    outline:
      "bg-white hover:bg-[var(--surface-canvas,#F7F7F6)] text-[var(--text-primary,#01000B)] border border-[var(--border-hairline,#E3E3E1)] focus:ring-[var(--border-active,#FF6900)]",
    ghost:
      "bg-transparent hover:bg-[var(--surface-canvas,#F7F7F6)] text-[var(--text-primary,#01000B)] focus:ring-gray-300",
    green:
      "bg-[var(--accent-green,#9CB800)] hover:bg-[var(--accent-green-hover,#8AA300)] text-white focus:ring-[var(--accent-green,#9CB800)] shadow-sm",
    custom: "",
  };

  // Build custom dynamic styles if passed via props
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
      className={`${baseStyles} ${sizeStyles[size]} ${
        variant !== "custom" ? variantStyles[variant] : ""
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
