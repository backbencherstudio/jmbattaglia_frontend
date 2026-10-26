"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authCookieNames } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { env } from "@/lib/env";
import { extractAuthTokens } from "@/redux/features/auth/authHelpers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  logOut,
  setCredentials,
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

    const checkAuth = async () => {
      try {
        const token = stateToken || Cookies.get(authCookieNames.token);
        const refreshToken =
          stateRefreshToken || Cookies.get(authCookieNames.refreshToken);

        // 1. If valid access token is present, verify it
        if (token) {
          const verification = await verifyAdminToken(token);
          if (verification.isValid && isMounted) {
            return; // Access token is active and valid
          }
        }

        // 2. If access token is missing or expired, attempt seamless refresh using refreshToken
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
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                extractAuthTokens(json);

              if (newAccessToken && isMounted) {
                dispatch(
                  setCredentials({
                    token: newAccessToken,
                    refreshToken: newRefreshToken || refreshToken,
                    role: "ADMIN",
                    rememberMe: true,
                  }),
                );
                return; // Successfully refreshed session! Do not log out!
              }
            }
          } catch (refreshErr) {
            console.error("Auto session refresh failed in layout:", refreshErr);
          }
        }

        // 3. If neither access token nor refresh token is valid, log out safely
        if (isMounted) {
          dispatch(logOut());
          router.replace("/admin/login");
        }
      } catch (err) {
        console.error("Authorization check error:", err);
        if (isMounted) {
          dispatch(logOut());
          router.replace("/admin/login");
        }
      }
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
