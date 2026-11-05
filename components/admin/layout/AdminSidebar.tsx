"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AdminSidebarProps } from "@/types/adminSidebar";
import { adminNavItems } from "@/data/adminSidebarData";
import { AdminSidebarItem } from "@/components/admin/layout/AdminSidebarItem";
import { LogOutIcon } from "@/components/icons/AdminSidebarIcons";
import { useAuth } from "@/redux/features/auth/hooks";

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
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
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 md:w-72 lg:w-80 xl:w-80 bg-sidebar-bg border-r border-sidebar-border h-screen h-[100dvh] max-h-screen flex flex-col justify-between p-5 lg:p-6 shrink-0 gap-[0.625rem] transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col min-h-0 space-y-6">
          {/* Logo Container (Centered) */}
          <div className="relative flex items-center justify-center w-full pt-1 shrink-0">
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="block relative w-[8.79931rem] h-20 lg:h-24 mx-auto"
            >
              <Image
                src="/assets/images/logo.png"
                alt="At Ease Inspections Logo"
                fill
                sizes="141px"
                className="object-contain object-center"
                priority
                loading="eager"
              />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden absolute right-0 top-1 p-1.5 rounded-lg text-sidebar-muted hover:text-main hover:bg-white transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 overflow-y-auto min-h-0">
            {adminNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <AdminSidebarItem
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  onClick={onClose}
                />
              );
            })}
          </nav>
        </div>

        {/* Logout Action Button at Bottom */}
        <div className="pt-4 border-t border-sidebar-border shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-trade font-bold text-sm lg:text-[0.95rem] xl:text-[1rem] leading-[140%] tracking-[0.0125rem] text-danger bg-danger-bg hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
          >
            <LogOutIcon className="w-5.5 h-5.5 lg:w-6 lg:h-6 shrink-0 text-danger" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
