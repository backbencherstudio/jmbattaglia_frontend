"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { useAppSelector } from "@/redux/store";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";

interface GuestAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Prevents authenticated admins from accessing guest-only auth pages
 * (e.g. /admin/login, /admin/forget, /admin/reset).
 * If authenticated with a valid token, redirects to /admin/dashboard.
 */
export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const stateToken = useAppSelector(selectCurrentToken);

  useEffect(() => {
    let isMounted = true;

    const checkGuestAccess = () => {
      try {
        const activeToken = stateToken || Cookies.get(authCookieNames.token);

        if (activeToken && activeToken.trim() && isMounted) {
          router.replace("/admin/dashboard");
        }
      } catch (err) {
        console.error("Guest access check error:", err);
      }
    };

    checkGuestAccess();

    return () => {
      isMounted = false;
    };
  }, [stateToken, router]);

  return <>{children}</>;
}
