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
      className={`flex items-center space-x-3 px-3.5 py-3 rounded-lg font-trade font-bold text-base lg:text-[1rem] xl:text-[1.125rem] leading-[140%] tracking-[0.0125rem] transition-all whitespace-nowrap ${isActive
          ? "bg-primary text-white shadow-xs"
          : "text-sidebar-muted hover:bg-white hover:text-main"
        }`}
    >
      <Icon
        className={`w-6 h-6 lg:w-7 lg:h-7 shrink-0 ${isActive ? "text-white" : "text-sidebar-muted"
          }`}
      />
      <span>{item.name}</span>
    </Link>
  );
}
