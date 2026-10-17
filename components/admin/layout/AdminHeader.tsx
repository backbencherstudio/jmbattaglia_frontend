"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useGetAdminProfileQuery } from "@/redux/features/profile/profileApi";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { data: profileResponse } = useGetAdminProfileQuery();
  const profile = profileResponse?.data;

  const displayName = profile?.name || profile?.firstName || "Admin";
  const avatarSrc = profile?.avatarUrl
    ? profile.avatarUrl.startsWith("http")
      ? profile.avatarUrl
      : `http://10.10.9.230:3000${profile.avatarUrl.startsWith("/") ? "" : "/"}${profile.avatarUrl}`
    : "/assets/images/logo.png";

  return (
    <header className="flex items-center justify-between py-4 sm:py-6 px-4 sm:px-8 bg-canvas border-b border-hairline">
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
          Welcome back, <span className="text-primary">{displayName}</span>
        </h1>
      </div>

      {/* Right: Profile Badge */}
      <div className="flex items-center space-x-2.5 bg-white border border-hairline rounded-xl p-1.5 pr-4 shadow-2xs">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-canvas shrink-0">
          <Image
            src={avatarSrc}
            alt={displayName}
            fill
            sizes="36px"
            className="object-cover"
            priority
            unoptimized={avatarSrc.startsWith("http")}
          />
        </div>
        <span className="text-sm font-medium text-main">
          {displayName}
        </span>
      </div>
    </header>
  );
}

export default AdminHeader;
