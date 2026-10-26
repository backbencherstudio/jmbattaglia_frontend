"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { env } from "@/lib/env";
import { extractAuthTokens } from "@/redux/features/auth/authHelpers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setCredentials,
  selectCurrentToken,
  selectCurrentRefreshToken,
} from "@/redux/features/auth/authSlice";

interface GuestAuthGuardProps {
  children: React.ReactNode;
}

/**
 * Prevents authenticated admins from accessing guest-only auth pages
 * (e.g. /admin/login, /admin/forget, /admin/reset).
 * If authenticated (or session can be refreshed), redirects to /admin/dashboard.
 */
export function GuestAuthGuard({ children }: GuestAuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stateToken = useAppSelector(selectCurrentToken);
  const stateRefreshToken = useAppSelector(selectCurrentRefreshToken);

  useEffect(() => {
    let isMounted = true;

    const checkGuestAccess = async () => {
      try {
        const activeToken = stateToken || Cookies.get(authCookieNames.token);
        const refreshToken =
          stateRefreshToken || Cookies.get(authCookieNames.refreshToken);

        // 1. If active token is valid, redirect to dashboard
        if (activeToken) {
          const verification = await verifyAdminToken(activeToken);
          if (verification.isValid && isMounted) {
            router.replace("/admin/dashboard");
            return;
          }
        }

        // 2. If token is expired but refresh token exists, attempt refresh
        if (refreshToken) {
          try {
            const res = await fetch(`${env.apiBaseUrl}/auth/refresh/token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (res.ok) {
              const json = await res.json();
              const { accessToken, refreshToken: newRefreshToken } =
                extractAuthTokens(json);

              if (accessToken && isMounted) {
                dispatch(
                  setCredentials({
                    token: accessToken,
                    refreshToken: newRefreshToken || refreshToken,
                    role: "ADMIN",
                    rememberMe: true,
                  }),
                );
                router.replace("/admin/dashboard");
                return;
              }
            }
          } catch {
            // refresh failed, continue as guest
          }
        }

        // 3. Neither access token nor refresh token is valid: clear dead cookies
        if (!refreshToken) {
          Cookies.remove(authCookieNames.token, { path: "/" });
          Cookies.remove(authCookieNames.adminSession, { path: "/" });
        }
      } catch (err) {
        console.error("Guest access check error:", err);
      }
    };

    checkGuestAccess();

    return () => {
      isMounted = false;
    };
  }, [stateToken, stateRefreshToken, router, dispatch]);

  return <>{children}</>;
}
