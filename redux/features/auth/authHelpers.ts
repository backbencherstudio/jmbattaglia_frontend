import type {
  LoginResponse,
  RefreshTokenResponse,
  IUser,
} from "@/types/auth";
import { normalizeAuthRole } from "@/lib/auth/config";
import type { AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/features/auth/authSlice";

export const extractAuthTokens = (
  payload?: LoginResponse | RefreshTokenResponse | null,
) => {
  if (!payload?.data) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: payload.data.accessToken ?? null,
    refreshToken: payload.data.refreshToken ?? null,
  };
};

export const extractLoginAuthData = (payload: LoginResponse) => {
  const { accessToken, refreshToken } = extractAuthTokens(payload);
  const user = payload.data?.user ?? null;
  const role = normalizeAuthRole(user?.role ?? "ADMIN");

  return {
    accessToken,
    refreshToken,
    role,
    user,
  };
};

export const handleAuthSuccess = (
  payload: LoginResponse,
  dispatch: AppDispatch,
  rememberMe: boolean = true,
) => {
  const { accessToken, refreshToken, role, user } = extractLoginAuthData(payload);

  dispatch(
    setCredentials({
      token: accessToken,
      refreshToken,
      role,
      user,
      rememberMe,
    }),
  );
};
