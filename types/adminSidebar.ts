import React from "react";

export interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export interface AdminNavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<IconProps>;
}

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface AdminSidebarItemProps {
  item: AdminNavItem;
  isActive: boolean;
  onClick?: () => void;
}
