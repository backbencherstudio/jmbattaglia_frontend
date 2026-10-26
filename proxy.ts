import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieNames, isGuestAdminRoute } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

async function attemptServerRefresh(refreshToken: string) {
  try {
    const res = await fetch(`${env.apiBaseUrl}/auth/refresh/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data ?? json;

    const newAccessToken =
      typeof data?.accessToken === "string" && data.accessToken.trim()
        ? data.accessToken.trim()
        : typeof data?.access_token === "string" && data.access_token.trim()
        ? data.access_token.trim()
        : typeof data?.token === "string" && data.token.trim()
        ? data.token.trim()
        : null;

    const newRefreshToken =
      typeof data?.refreshToken === "string" && data.refreshToken.trim()
        ? data.refreshToken.trim()
        : typeof data?.refresh_token === "string" && data.refresh_token.trim()
        ? data.refresh_token.trim()
        : refreshToken;

    if (!newAccessToken) return null;

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    console.error("Proxy middleware refresh error:", err);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(authCookieNames.token)?.value;
  const refreshToken = request.cookies.get(authCookieNames.refreshToken)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const isGuestAuthRoute = isGuestAdminRoute(pathname);

  // 1. Guest Auth Routes (/admin/login, /admin/forget, /admin/reset, etc.)
  if (isGuestAuthRoute) {
    if (token) {
      const verification = await verifyAdminToken(token);
      if (verification.isValid) {
        // Authenticated admin should not visit login/reset routes
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    // If token is missing/expired but refreshToken exists, attempt refresh
    if (refreshToken) {
      const refreshed = await attemptServerRefresh(refreshToken);
      if (refreshed) {
        const response = NextResponse.redirect(
          new URL("/admin/dashboard", request.url),
        );
        const cookieOpts = {
          path: "/",
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60,
        };
        response.cookies.set(authCookieNames.token, refreshed.accessToken, cookieOpts);
        response.cookies.set(authCookieNames.refreshToken, refreshed.refreshToken, cookieOpts);
        response.cookies.set(authCookieNames.role, "ADMIN", cookieOpts);
        response.cookies.set(authCookieNames.adminSession, "authenticated", cookieOpts);
        return response;
      }
    }

    // Friendly aliases for unauthenticated visitors
    if (
      pathname === "/admin/forgot" ||
      pathname === "/admin/forgot-password" ||
      pathname === "/admin/forget-password"
    ) {
      return NextResponse.redirect(new URL("/admin/forget", request.url));
    }
    if (pathname === "/admin/verify-otp") {
      const otpUrl = new URL("/admin/otp", request.url);
      otpUrl.search = request.nextUrl.search;
      return NextResponse.redirect(otpUrl);
    }
    if (pathname === "/admin/reset-password") {
      const resetUrl = new URL("/admin/reset", request.url);
      resetUrl.search = request.nextUrl.search;
      return NextResponse.redirect(resetUrl);
    }

    return NextResponse.next();
  }

  // 2. Protected Admin Routes (/admin/dashboard, /admin/packages, /admin/settings, etc.)
  let isValidSession = false;

  if (token) {
    const verification = await verifyAdminToken(token);
    if (verification.isValid) {
      isValidSession = true;
    }
  }

  // If token is expired or invalid, attempt seamless refresh using refreshToken
  if (!isValidSession) {
    if (refreshToken) {
      const refreshed = await attemptServerRefresh(refreshToken);
      if (refreshed) {
        const response = NextResponse.next();
        const cookieOpts = {
          path: "/",
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60,
        };
        response.cookies.set(authCookieNames.token, refreshed.accessToken, cookieOpts);
        response.cookies.set(authCookieNames.refreshToken, refreshed.refreshToken, cookieOpts);
        response.cookies.set(authCookieNames.role, "ADMIN", cookieOpts);
        response.cookies.set(authCookieNames.adminSession, "authenticated", cookieOpts);
        return response;
      }
    }

    // Neither access token nor refresh token is valid: redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.next();
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(authCookieNames.token);
  response.cookies.delete(authCookieNames.refreshToken);
  response.cookies.delete(authCookieNames.role);
  response.cookies.delete(authCookieNames.adminSession);
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
