"use client";

import React from "react";

export interface PillItem {
  id: string;
  label: string;
}

export interface PillTabsProps {
  items: PillItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({
  items,
  activeId,
  onChange,
  className = "",
}: PillTabsProps) {
  return (
    <div
      className={`flex items-center bg-canvas border border-hairline p-1 rounded-xl w-fit ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`px-5 py-2 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
              isActive
                ? "bg-main text-white shadow-xs"
                : "text-sub hover:text-main"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
