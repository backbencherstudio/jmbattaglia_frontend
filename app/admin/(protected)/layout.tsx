"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  logOut,
  selectCurrentToken,
  selectCurrentRefreshToken,
} from "@/redux/features/auth/authSlice";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stateToken = useAppSelector(selectCurrentToken);
  const stateRefreshToken = useAppSelector(selectCurrentRefreshToken);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = () => {
      const token = stateToken || Cookies.get(authCookieNames.token);
      const refreshToken =
        stateRefreshToken || Cookies.get(authCookieNames.refreshToken);

      // If user has neither token nor refreshToken, they must authenticate
      if (!token && !refreshToken) {
        if (isMounted) {
          dispatch(logOut());
          router.replace("/admin/login");
        }
      }
      // Note: If token is expired, baseApi automatically refreshes it via refresh token
      // on the first API query using a single-flight mutex promise without race conditions.
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [stateToken, stateRefreshToken, router, dispatch]);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar (Responsive Drawer on Mobile, Fixed on Desktop) */}
      <AdminSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 bg-layout-bg sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
