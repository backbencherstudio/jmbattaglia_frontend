"use client";

import React from "react";
import Link from "next/link";
import { AdminSidebarItemProps } from "@/types/adminSidebar";

export function AdminSidebarItem({
  item,
  isActive,
  onClick,
}: AdminSidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-trade font-bold text-sm lg:text-[0.95rem] xl:text-[1rem] leading-[140%] tracking-[0.0125rem] transition-all whitespace-nowrap ${isActive
          ? "bg-primary text-white shadow-xs"
          : "text-sidebar-muted hover:bg-white hover:text-main"
        }`}
    >
      <Icon
        className={`w-5.5 h-5.5 lg:w-6 lg:h-6 shrink-0 ${isActive ? "text-white" : "text-sidebar-muted"
          }`}
      />
      <span>{item.name}</span>
    </Link>
  );
}
