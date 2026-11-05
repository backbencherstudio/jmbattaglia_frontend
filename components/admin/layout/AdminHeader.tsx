"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  LayoutDashboard,
  Package,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useGetAdminProfileQuery } from "@/redux/features/profile/profileApi";
import { useAuth } from "@/redux/features/auth/hooks";
import { resolveMediaUrl } from "@/lib/env";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const { data: profileResponse } = useGetAdminProfileQuery();
  const profile = profileResponse?.data;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.name || profile?.firstName || user?.name || "Administrator";
  const userEmail =
    profile?.email || user?.email || "admin@ateaseinspections.net";
  const avatarSrc =
    resolveMediaUrl(profile?.avatarUrl) || "/assets/images/logo.png";

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logOut();
    router.push("/admin/login");
  };

  return (
    <header className="shrink-0 sticky top-0 z-30 flex items-center justify-between py-4 sm:py-5 px-4 sm:px-8 bg-canvas border-b border-hairline backdrop-blur-md bg-canvas/90">
      {/* Left: Mobile Hamburger & Welcome Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-sub hover:text-main hover:bg-canvas transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-base sm:text-xl md:text-2xl font-bold text-main tracking-tight">
          Welcome back, <span className="text-primary">{displayName}</span>
        </h1>
      </div>

      {/* Right: Profile Dropdown Trigger & Popover */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`flex items-center space-x-2.5 bg-white border rounded-xl p-1.5 pr-3 shadow-2xs transition-all cursor-pointer select-none ${
            isDropdownOpen
              ? "border-primary ring-2 ring-primary/20 shadow-xs"
              : "border-hairline hover:border-primary/50 hover:bg-canvas/50"
          }`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-canvas shrink-0 border border-hairline">
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
          <span className="text-sm font-semibold text-main hidden sm:inline-block max-w-[140px] truncate">
            {displayName}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-sub transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-hairline z-50 py-2 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-hairline flex items-center space-x-3 bg-canvas/40">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shrink-0 border border-hairline shadow-2xs">
                <Image
                  src={avatarSrc}
                  alt={displayName}
                  fill
                  sizes="44px"
                  className="object-cover"
                  unoptimized={avatarSrc.startsWith("http")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-main truncate">
                  {displayName}
                </p>
                <p className="text-xs text-sub truncate" title={userEmail}>
                  {userEmail}
                </p>
                <span className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-subtle text-primary border border-primary/20 uppercase tracking-wide">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Administrator</span>
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="py-1 px-1.5 space-y-0.5">
              <Link
                href="/admin/dashboard"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-main hover:bg-canvas hover:text-primary transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-sub" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/packages"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-main hover:bg-canvas hover:text-primary transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4 text-sub" />
                <span>Package Management</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-main hover:bg-canvas hover:text-primary transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-sub" />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-main hover:bg-canvas hover:text-primary transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-4 h-4 text-sub" />
                  <span>View Public Portal</span>
                </div>
                <span className="text-[10px] text-muted uppercase font-bold bg-canvas px-1.5 py-0.5 rounded border border-hairline">
                  Live
                </span>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="pt-1.5 mt-1 border-t border-hairline px-1.5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-danger hover:bg-danger-bg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-danger" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
