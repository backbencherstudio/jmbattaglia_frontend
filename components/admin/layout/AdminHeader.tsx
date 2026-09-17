"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 sm:py-6 px-4 sm:px-8 bg-canvas  border-b border-hairline">
      {/* Left: Mobile Hamburger & Welcome Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-sub hover:text-main hover:bg-canvas transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg sm:text-2xl font-bold text-main tracking-tight">
          Welcome back, <span className="text-primary">Dana</span>
        </h1>
      </div>

      {/* Right: Profile Badge */}
      <div className="flex items-center space-x-3">
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-hairline bg-canvas shrink-0">
          <Image
            src="/assets/images/logo.png"
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xs sm:text-sm font-medium text-main hidden sm:inline-block">
          Madun Laduni
        </span>
      </div>
    </header>
  );
}
