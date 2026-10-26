import type {
  LoginResponse,
  RefreshTokenResponse,
  IUser,
} from "@/types/auth";
import { normalizeAuthRole } from "@/lib/auth/config";
import type { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/features/auth/authSlice";

/**
 * Robustly extracts accessToken and refreshToken from various backend response formats:
 * - { success: true, data: { accessToken: "...", refreshToken: "..." } }
 * - { accessToken: "...", refreshToken: "..." }
 * - Snake_case aliases (access_token, refresh_token) or token alias
 */
export const extractAuthTokens = (
  payload?: LoginResponse | RefreshTokenResponse | unknown | null,
): { accessToken: string | null; refreshToken: string | null } => {
  if (!payload || typeof payload !== "object") {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  const payloadObj = payload as Record<string, unknown>;
  const data =
    payloadObj.data && typeof payloadObj.data === "object"
      ? (payloadObj.data as Record<string, unknown>)
      : payloadObj;

  const accessToken =
    typeof data.accessToken === "string" && data.accessToken.trim()
      ? data.accessToken.trim()
      : typeof data.access_token === "string" && data.access_token.trim()
      ? data.access_token.trim()
      : typeof data.token === "string" && data.token.trim()
      ? data.token.trim()
      : null;

  const refreshToken =
    typeof data.refreshToken === "string" && data.refreshToken.trim()
      ? data.refreshToken.trim()
      : typeof data.refresh_token === "string" && data.refresh_token.trim()
      ? data.refresh_token.trim()
      : null;

  return {
    accessToken,
    refreshToken,
  };
};

export const extractLoginAuthData = (payload: LoginResponse | unknown) => {
  const { accessToken, refreshToken } = extractAuthTokens(payload);
  const payloadObj = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const data =
    payloadObj.data && typeof payloadObj.data === "object"
      ? (payloadObj.data as Record<string, unknown>)
      : payloadObj;

  const user = data.user && typeof data.user === "object" ? (data.user as unknown as IUser) : null;
  const rawRole = (user && typeof user.role === "string" ? user.role : null) ?? (typeof data.role === "string" ? data.role : "ADMIN");
  const role = normalizeAuthRole(rawRole);

  return {
    accessToken,
    refreshToken,
    role,
    user,
  };
};

export const handleAuthSuccess = (
  payload: LoginResponse | unknown,
  dispatch: AppDispatch,
  rememberMe: boolean = true,
) => {
  const { accessToken, refreshToken, role, user } = extractLoginAuthData(payload);

  if (accessToken) {
    dispatch(
      setCredentials({
        token: accessToken,
        refreshToken,
        role,
        user,
        rememberMe,
      }),
    );
  }
};
