import { AdminNavItem } from "@/types/adminSidebar";
import {
  DashboardIcon,
  PackageManagementIcon,
  SettingsIcon,
} from "@/components/icons/AdminSidebarIcons";

export const adminNavItems: AdminNavItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    id: "packages",
    name: "Package Management",
    href: "/admin/packages",
    icon: PackageManagementIcon,
  },
  {
    id: "settings",
    name: "Settings",
    href: "/admin/settings",
    icon: SettingsIcon,
  },
];
