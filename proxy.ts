import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieNames, isGuestAdminRoute } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(authCookieNames.token)?.value;

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
        // Authenticated admin should NEVER be able to visit login, forget, or reset routes!
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      // If token is invalid or expired, clear dirty cookies and let them view the guest page
      const response = NextResponse.next();
      clearAuthCookies(response);
      return response;
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
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  // Cryptographically verify token signature with JWT_SECRET and ensure role === "ADMIN"
  const verification = await verifyAdminToken(token);
  if (!verification.isValid) {
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
