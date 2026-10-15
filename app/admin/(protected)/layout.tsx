"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logOut, selectCurrentToken } from "@/redux/features/auth/authSlice";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = stateToken || Cookies.get(authCookieNames.token);

      if (!token) {
        if (isMounted) {
          setIsAuthorized(false);
          dispatch(logOut());
          router.replace("/admin/login");
        }
        return;
      }

      // Verify token signature, expiration and role
      const verification = await verifyAdminToken(token);

      if (!isMounted) return;

      if (!verification.isValid) {
        setIsAuthorized(false);
        dispatch(logOut());
        router.replace("/admin/login");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [stateToken, router, dispatch]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

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
