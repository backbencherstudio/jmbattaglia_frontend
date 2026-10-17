import type { AuthRole } from "@/types/auth";

export const authCookieNames = {
  token: "atease_auth_token",
  refreshToken: "atease_refresh_token",
  role: "atease_auth_role",
  adminSession: "admin_session",
} as const;

export const authRoutes = {
  home: "/",
  login: "/admin/login",
  forget: "/admin/forget",
  otp: "/admin/otp",
  reset: "/admin/reset",
  adminDashboard: "/admin/dashboard",
} as const;

export const guestAdminAuthRoutes = [
  "/admin/login",
  "/admin/forget",
  "/admin/otp",
  "/admin/verify-otp",
  "/admin/reset",
  "/admin/forgot",
  "/admin/forgot-password",
  "/admin/forget-password",
  "/admin/reset-password",
] as const;

export const isGuestAdminRoute = (pathname?: string | null): boolean => {
  if (!pathname) return false;
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  return guestAdminAuthRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(`${route}/`),
  );
};

export const normalizeAuthRole = (role?: string | null): AuthRole => {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (upper === "ADMIN" || upper === "SUPER_ADMIN") {
    return "ADMIN";
  }
  if (upper === "CLIENT" || upper === "USER") {
    return upper;
  }
  return role;
};

export const getDefaultRouteForRole = (role?: string | null) => {
  const normalizedRole = normalizeAuthRole(role);

  if (normalizedRole === "ADMIN") {
    return authRoutes.adminDashboard;
  }

  return authRoutes.adminDashboard;
};

export const isAllowedRedirectForRole = (
  role: AuthRole,
  pathname?: string | null,
) => {
  if (!pathname || !pathname.startsWith("/")) {
    return false;
  }

  if (role === "ADMIN") {
    return pathname.startsWith("/admin");
  }

  return false;
};

export const resolvePostLoginPath = (
  role: AuthRole,
  requestedPath?: string | null,
) => {
  if (isAllowedRedirectForRole(role, requestedPath)) {
    return requestedPath!;
  }

  return getDefaultRouteForRole(role);
};
