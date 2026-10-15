import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authCookieNames } from "@/lib/auth/config";
import { verifyAdminToken } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(authCookieNames.token)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // Protect all /admin routes except /admin/login
  if (isAdminRoute && !isLoginPage) {
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
  }

  // If already authenticated with a valid token and attempting to visit /admin/login, redirect to /admin/dashboard
  if (isLoginPage && token) {
    const verification = await verifyAdminToken(token);
    if (verification.isValid) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
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
