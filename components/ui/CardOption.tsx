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
      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-200 border text-left flex flex-col justify-between h-full select-none ${
        isSelected
          ? "border-[var(--brand-primary,#FF6900)] bg-[var(--brand-primary-subtle,#FFE9D6)] shadow-sm"
          : "border-transparent bg-[var(--surface-canvas,#F7F7F6)] hover:bg-[#EFEFEF]"
      }`}
    >
      <div className="flex flex-col gap-2">
        {icon && <div className="mb-1 text-[var(--brand-primary,#FF6900)]">{icon}</div>}
        <h3
          className={`text-xl font-bold tracking-tight transition-colors ${
            isSelected
              ? "text-[var(--brand-primary,#FF6900)]"
              : "text-[var(--text-primary,#01000B)]"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-secondary,#555555)]">
          {description}
        </p>
      </div>
    </div>
  );
};
