"use client";

import React from "react";
import { Search } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search packages...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-4 pr-10 bg-canvas border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-sub focus:outline-none transition-all"
      />
      <div className="absolute right-3 text-primary pointer-events-none flex items-center justify-center">
        <Search className="w-4 h-4" />
      </div>
    </div>
  );
}
