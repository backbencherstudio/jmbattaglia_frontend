import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieNames, isGuestAdminRoute } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";

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
        // Authenticated admin should not visit guest login/reset pages
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
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
  // Allow access if either a token OR a refreshToken is present in cookies
  // (client-side baseApi handles automatic seamless token refresh on 401 without race conditions)
  if (!token && !refreshToken) {
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
