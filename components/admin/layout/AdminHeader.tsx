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

        <h1 className="text-md md:text-2xl font-bold text-main tracking-tight">
          Welcome back, <span className="text-primary">Dana</span>
        </h1>
      </div>

      {/* Right: Profile Badge */}
      <div className="flex items-center space-x-2.5 bg-white border border-hairline rounded-xl p-1.5 pr-4 shadow-2xs">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-canvas shrink-0">
          <Image
            src="/assets/images/logo.png"
            alt="Madun Laduni"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-main">
          Madun Laduni
        </span>
      </div>
    </header>
  );
}
