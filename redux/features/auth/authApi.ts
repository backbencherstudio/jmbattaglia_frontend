import { baseApi } from "@/redux/api/baseApi";
import type {
  IApiResponse,
  IUser,
} from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    logoutUser: builder.mutation<{ success?: boolean; message?: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    forgotPassword: builder.mutation<
      { success: boolean; statusCode?: number; message: string; data?: unknown },
      { email: string }
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetOtp: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: { resetToken: string; expiresIn: number };
      },
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; statusCode?: number; message: string; data?: unknown },
      { resetToken: string; newPassword: string; confirmPassword: string }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<
      { success?: boolean; message?: string },
      { currentPassword?: string; newPassword: string; confirmPassword?: string }
    >({
      query: (data) => ({
        url: "/admin/profile/password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;

export default authApi;

