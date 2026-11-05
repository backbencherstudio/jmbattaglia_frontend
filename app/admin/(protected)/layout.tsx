"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  logOut,
  setUser,
  selectCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
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
  const token =
    stateToken ||
    (typeof window !== "undefined"
      ? Cookies.get(authCookieNames.token) ?? null
      : null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Fetch current user details & permissions from backend /auth/me
  const { data: meResponse } = useGetMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    let isMounted = true;

    // If user has no token, they must authenticate
    if (!token) {
      if (isMounted) {
        dispatch(logOut());
        router.replace("/admin/login");
      }
      return;
    }

    if (meResponse?.data) {
      const userData = meResponse.data;
      const isAdmin =
        userData.role === "ADMIN" ||
        (Array.isArray(userData.roles) && userData.roles.includes("ADMIN"));

      if (!isAdmin) {
        if (isMounted) {
          dispatch(logOut());
          router.replace("/admin/login");
        }
        return;
      }

      if (isMounted) {
        dispatch(setUser(userData));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [token, meResponse, router, dispatch]);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-canvas">
      {/* Sidebar (Responsive Drawer on Mobile, Fixed 100vh on Desktop) */}
      <AdminSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AdminHeader onMenuToggle={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 bg-layout-bg sm:p-6 lg:p-8 space-y-6 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
