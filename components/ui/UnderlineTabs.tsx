"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface UnderlineTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function UnderlineTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: UnderlineTabsProps) {
  return (
    <div className={`border-b border-hairline ${className}`}>
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-3 font-trade font-bold text-base sm:text-lg transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-sub hover:text-main"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-primary-subtle text-primary"
                      : "bg-canvas text-sub"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
