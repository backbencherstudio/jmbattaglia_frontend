import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { env } from "@/lib/env";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { authCookieNames } from "@/lib/auth/config";
import {
  extractAuthTokens,
  handleAuthSuccess,
} from "@/redux/features/auth/authHelpers";
import { logOut, setCredentials } from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import type {
  LoginParams,
  LoginResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
} from "@/types/auth";

const publicAuthEndpoints = new Set([
  "login",
  "refreshToken",
  "forgotPassword",
  "verifyResetOtp",
  "resetPassword",
]);

const baseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("accept", "application/json");

    // Do NOT attach Authorization token for public auth endpoints (login, forgot-password, reset-password, refresh)
    if (endpoint && publicAuthEndpoints.has(endpoint)) {
      headers.delete("Authorization");
      return headers;
    }

    const token =
      (getState() as RootState).auth?.token ||
      (typeof window !== "undefined"
        ? Cookies.get(authCookieNames.token)
        : null);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Single-flight promise to handle concurrent 401s without race conditions
let refreshPromise: Promise<unknown> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const tokenBeforeRequest = (api.getState() as RootState).auth?.token;
  let result = await baseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "object" && "url" in args ? args.url : args;
  const isAuthPublicRequest =
    requestUrl === "/auth/refresh/token" ||
    requestUrl.endsWith("/auth/refresh/token") ||
    requestUrl === "/auth/login" ||
    requestUrl.endsWith("/auth/login") ||
    requestUrl.includes("/auth/forgot-password") ||
    requestUrl.includes("/auth/verify-reset-otp") ||
    requestUrl.includes("/auth/reset-password");

  if (result.error?.status === 401 && !isAuthPublicRequest) {
    const currentState = api.getState() as RootState;

    // 1. If another concurrent request has already refreshed the token, retry immediately
    if (currentState.auth?.token && currentState.auth.token !== tokenBeforeRequest) {
      return await baseQuery(args, api, extraOptions);
    }

    try {
      // 2. If a refresh is already in progress, wait for it to complete
      if (refreshPromise) {
        await refreshPromise;
        const freshState = api.getState() as RootState;
        if (freshState.auth?.token && freshState.auth.token !== tokenBeforeRequest) {
          return await baseQuery(args, api, extraOptions);
        }
      }

      const currentRefreshToken =
        (api.getState() as RootState).auth?.refreshToken ||
        (typeof window !== "undefined"
          ? Cookies.get(authCookieNames.refreshToken)
          : null);

      if (!currentRefreshToken) {
        api.dispatch(logOut());
        if (typeof window !== "undefined") {
          window.location.replace("/admin/login");
        }
        return result;
      }

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const res = await fetch(`${env.apiBaseUrl}/auth/refresh/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({ refreshToken: currentRefreshToken.trim() }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            const errMsg =
              errData?.message ||
              `Refresh token failed with status ${res.status}`;
            throw new Error(errMsg);
          }

          return await res.json();
        })();
      }

      const refreshResponseData = await refreshPromise;
      const refreshedTokens = extractAuthTokens(refreshResponseData);

      if (!refreshedTokens.accessToken) {
        throw new Error(
          "Refresh token response did not include a valid access token.",
        );
      }

      const latestState = api.getState() as RootState;
      api.dispatch(
        setCredentials({
          token: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken ?? currentRefreshToken,
          role: latestState.auth.role,
          user: latestState.auth.user,
          rememberMe: true,
        }),
      );

      // Retry original request with newly refreshed credentials
      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      api.dispatch(logOut());

      if (typeof window !== "undefined") {
        window.location.replace("/admin/login");
      }

      console.error(
        getErrorMessage(error, "Session expired. Please log in again."),
      );
    } finally {
      refreshPromise = null;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Inspection",
    "Package",
    "Addon",
    "Metric",
    "Booking",
    "Setting",
    "Dashboard",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginParams>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe ?? false,
        },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(data, dispatch, arg.rememberMe ?? true);
        } catch {
          // handled by the caller via unwrap
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenParams>({
      query: (body) => ({
        url: "/auth/refresh/token",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken } = extractAuthTokens(data);
          if (accessToken) {
            dispatch(
              setCredentials({
                token: accessToken,
                refreshToken,
              }),
            );
          }
        } catch {
          // handled by caller
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = baseApi;
