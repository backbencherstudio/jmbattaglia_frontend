"use client";

import React from "react";

export interface AlertProps {
  message: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ message, className = "" }) => {
  return (
    <div
      className={`w-full flex items-center gap-4 p-3 rounded-xl border-t border-r border-b border-t-feedback-success border-r-feedback-success border-b-feedback-success border-l-6 border-l-feedback-success bg-feedback-success-bg text-main font-bold text-sm sm:text-base shadow-2xs ${className}`}
    >
      <span>{message}</span>
    </div>
  );
};
