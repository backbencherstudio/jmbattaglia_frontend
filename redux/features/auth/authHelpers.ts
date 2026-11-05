import type { LoginResponse, IUser } from "@/types/auth";
import { normalizeAuthRole } from "@/lib/auth/config";
import type { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/features/auth/authSlice";

/**
 * Extracts Sanctum accessToken from Laravel response formats:
 * - { success: true, data: { accessToken: "...", ... } }
 * - { accessToken: "...", ... }
 * - Snake_case aliases (access_token, token)
 */
export const extractAuthTokens = (
  payload?: LoginResponse | unknown | null,
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

  return {
    accessToken,
    refreshToken: null,
  };
};

export const extractLoginAuthData = (payload: LoginResponse | unknown) => {
  const { accessToken } = extractAuthTokens(payload);
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
    role,
    user,
  };
};

export const handleAuthSuccess = (
  payload: LoginResponse | unknown,
  dispatch: AppDispatch,
) => {
  const { accessToken, role, user } = extractLoginAuthData(payload);

  if (accessToken) {
    dispatch(
      setCredentials({
        token: accessToken,
        role,
        user,
      }),
    );
  }
};
