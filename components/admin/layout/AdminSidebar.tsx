"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Settings,
  LogOut,
  Layers,
  X,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Package Management",
    href: "/admin/packages",
    icon: Package,
  },
  {
    name: "Add-on Services",
    href: "/admin/add-ons",
    icon: Layers,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-canvas border-r border-hairline min-h-screen flex flex-col justify-between p-5 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Mobile Close Button */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="block relative w-44 h-12"
            >
              <Image
                src="/assets/images/logo.png"
                alt="At Ease Inspections Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
            {/* Close Button on Mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-sub hover:text-main hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-sub hover:bg-white hover:text-main"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-sub"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Action at Bottom */}
        <div className="pt-4 border-t border-hairline">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-danger bg-danger-bg hover:opacity-90 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-danger" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
