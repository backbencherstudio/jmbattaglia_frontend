import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { env } from "@/lib/env";
import { authCookieNames } from "@/lib/auth/config";
import { handleAuthSuccess } from "@/redux/features/auth/authHelpers";
import { logOut } from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import type {
  LoginParams,
  LoginResponse,
} from "@/types/auth";

const publicAuthEndpoints = new Set([
  "login",
  "forgotPassword",
  "verifyResetOtp",
  "resetPassword",
]);

const baseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers, { getState, endpoint }) => {
    headers.set("accept", "application/json");

    // Do NOT attach Authorization token for public auth endpoints (login, forgot-password, reset-password)
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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "object" && "url" in args ? args.url : args;
  const isAuthPublicRequest =
    requestUrl === "/auth/login" ||
    requestUrl.endsWith("/auth/login") ||
    requestUrl.includes("/auth/forgot-password") ||
    requestUrl.includes("/auth/verify-reset-otp") ||
    requestUrl.includes("/auth/reset-password");

  // Under Sanctum bearer authentication:
  // On 401, clear local auth state and route to login. Never trigger refresh or retry loops.
  if (result.error?.status === 401 && !isAuthPublicRequest) {
    api.dispatch(logOut());

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
        window.location.replace(`/admin/login?from=${encodeURIComponent(currentPath)}`);
      }
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
          email: credentials.email.trim(),
          password: credentials.password,
        },
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          handleAuthSuccess(data, dispatch);
        } catch {
          // handled by the caller via unwrap
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const { useLoginMutation } = baseApi;
