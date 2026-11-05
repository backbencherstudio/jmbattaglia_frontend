"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authCookieNames, normalizeAuthRole } from "@/lib/auth/config";
import type { AuthRole, IUser } from "@/types/auth";
import type { RootState } from "@/redux/store";

export interface AuthState {
  token: string | null;
  role: AuthRole;
  user: IUser | null;
}

export interface SetCredentialsPayload {
  token?: string | null;
  role?: AuthRole;
  user?: IUser | null;
  refreshToken?: string | null;
  rememberMe?: boolean;
}

const getCookieValue = (cookieName: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(cookieName) ?? null;
};

const shouldUseSecureCookies = () =>
  typeof window === "undefined" || window.location.protocol === "https:";

const initialState: AuthState = {
  token: getCookieValue(authCookieNames.token),
  role: normalizeAuthRole(getCookieValue(authCookieNames.role)),
  user: null,
};

export const clearAuthCookies = () => {
  Cookies.remove(authCookieNames.token, { path: "/" });
  Cookies.remove(authCookieNames.role, { path: "/" });
  Cookies.remove(authCookieNames.adminSession, { path: "/" });
  // Clean up any legacy refresh token cookie
  Cookies.remove("atease_refresh_token", { path: "/" });
};

const persistAuthCookies = ({
  token,
  role,
}: {
  token?: string | null;
  role?: AuthRole;
}) => {
  if (!token) {
    clearAuthCookies();
    return;
  }

  const cookieOptions: Cookies.CookieAttributes = {
    secure: shouldUseSecureCookies(),
    sameSite: "lax",
    path: "/",
    expires: 1, // 24 hours boundary; Sanctum validates TTL on API calls
  };

  Cookies.set(authCookieNames.token, token, cookieOptions);

  if (role) {
    Cookies.set(authCookieNames.role, role, cookieOptions);
  }

  // Set admin_session for route protection proxy compatibility
  Cookies.set(authCookieNames.adminSession, "authenticated", cookieOptions);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const {
        token,
        role,
        user,
      } = action.payload;

      if (token !== undefined) {
        state.token = token;
      }

      if (role !== undefined) {
        state.role = role;
      }

      if (user !== undefined && user !== null) {
        state.user = user;
      }

      persistAuthCookies({
        token: state.token,
        role: state.role,
      });
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      if (action.payload?.role) {
        state.role = normalizeAuthRole(action.payload.role);
        Cookies.set(authCookieNames.role, state.role as string, {
          secure: shouldUseSecureCookies(),
          sameSite: "lax",
          path: "/",
        });
      }
    },
    logOut: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;

      clearAuthCookies();
    },
  },
});

export const { setCredentials, setUser, logOut } = authSlice.actions;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRefreshToken = () => null;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token);

export default authSlice.reducer;
