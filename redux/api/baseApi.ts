import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryReturnValue,
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

    // If Authorization header is explicitly set to empty string, strip it
    if (headers.get("Authorization") === "") {
      headers.delete("Authorization");
      return headers;
    }

    const token =
      (getState() as RootState).auth?.token ||
      (typeof window !== "undefined"
        ? Cookies.get(authCookieNames.token)
        : null);

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<
  QueryReturnValue<unknown, FetchBaseQueryError>
> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
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
    const state = api.getState() as RootState;
    const currentRefreshToken =
      state.auth?.refreshToken ||
      (typeof window !== "undefined"
        ? Cookies.get(authCookieNames.refreshToken)
        : null);

    if (!currentRefreshToken) {
      // No refresh token available, session is completely expired
      api.dispatch(logOut());
      if (typeof window !== "undefined") {
        window.location.replace("/admin/login");
      }
      return result;
    }

    try {
      if (!refreshPromise) {
        refreshPromise = Promise.resolve(
          baseQuery(
            {
              url: "/auth/refresh/token",
              method: "POST",
              body: { refreshToken: currentRefreshToken },
              headers: {
                Authorization: "", // explicitly omit any stale Authorization header
              },
            },
            api,
            extraOptions,
          ),
        );
      }

      const refreshResult = await refreshPromise;
      refreshPromise = null;

      if (refreshResult.error || !refreshResult.data) {
        throw new Error(
          getErrorMessage(refreshResult.error, "Session refresh failed."),
        );
      }

      const refreshedTokens = extractAuthTokens(refreshResult.data);

      if (!refreshedTokens.accessToken) {
        throw new Error(
          "Refresh token response did not include a valid access token.",
        );
      }

      api.dispatch(
        setCredentials({
          token: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken ?? currentRefreshToken,
          role: state.auth.role,
          user: state.auth.user,
          rememberMe: true,
        }),
      );

      // Retry original request with newly refreshed credentials
      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      refreshPromise = null;
      api.dispatch(logOut());

      if (typeof window !== "undefined") {
        window.location.replace("/admin/login");
      }

      console.error(
        getErrorMessage(error, "Session expired. Please log in again."),
      );
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
