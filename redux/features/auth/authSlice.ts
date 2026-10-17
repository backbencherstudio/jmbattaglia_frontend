"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authCookieNames, normalizeAuthRole } from "@/lib/auth/config";
import type { AuthRole, IUser } from "@/types/auth";
import type { RootState } from "@/redux/store";

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: AuthRole;
  user: IUser | null;
}

export interface SetCredentialsPayload {
  token?: string | null;
  refreshToken?: string | null;
  role?: AuthRole;
  user?: IUser | null;
  rememberMe?: boolean;
}

const getCookieValue = (cookieName: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(cookieName) ?? null;
};

const initialState: AuthState = {
  token: getCookieValue(authCookieNames.token),
  refreshToken: getCookieValue(authCookieNames.refreshToken),
  role: normalizeAuthRole(getCookieValue(authCookieNames.role)),
  user: null,
};

const clearAuthCookies = () => {
  Cookies.remove(authCookieNames.token, { path: "/" });
  Cookies.remove(authCookieNames.refreshToken, { path: "/" });
  Cookies.remove(authCookieNames.role, { path: "/" });
  Cookies.remove(authCookieNames.adminSession, { path: "/" });
};

const persistAuthCookies = ({
  token,
  refreshToken,
  role,
  rememberMe = true,
}: SetCredentialsPayload) => {
  clearAuthCookies();

  if (!token) {
    return;
  }

  const cookieOptions: Cookies.CookieAttributes = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { expires: 7 } : {}),
  };

  Cookies.set(authCookieNames.token, token, cookieOptions);

  if (refreshToken) {
    Cookies.set(authCookieNames.refreshToken, refreshToken, cookieOptions);
  }

  if (role) {
    Cookies.set(authCookieNames.role, role, cookieOptions);
  }

  // Also set admin_session for Next.js route protection proxy compatibility
  Cookies.set(authCookieNames.adminSession, "authenticated", cookieOptions);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const {
        token = null,
        refreshToken = null,
        role = null,
        user = null,
        rememberMe = true,
      } = action.payload;

      state.token = token;
      state.refreshToken = refreshToken;
      state.role = role;
      if (user) {
        state.user = user;
      }

      persistAuthCookies({ token, refreshToken, role, rememberMe });
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.user = null;

      clearAuthCookies();
    },
  },
});

export const { setCredentials, setUser, logOut } = authSlice.actions;

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token);

export default authSlice.reducer;
