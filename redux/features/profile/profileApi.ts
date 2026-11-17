import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminProfileResponse,
  UpdateProfileResponse,
  TeamMember,
  AuditLogEntry,
} from "@/types/settings";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<AdminProfileResponse, void>({
      query: () => ({
        url: "/admin/profile",
        method: "GET",
      }),
      providesTags: ["User", "Setting"],
    }),

    updateAdminProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => {
        // Method spoofing for PHP/Laravel multipart form data handling
        if (formData instanceof FormData && !formData.has("_method")) {
          formData.append("_method", "PATCH");
        }
        return {
          url: "/admin/profile",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User", "Setting"],
    }),

    getTeamMembers: builder.query<{ success: boolean; data: TeamMember[] }, void>({
      query: () => ({
        url: "/admin/profile/team",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    createTeamMember: builder.mutation<
      { success: boolean; data: TeamMember },
      { email: string; password: string; firstName: string; lastName?: string; roleName: string }
    >({
      query: (body) => ({
        url: "/admin/profile/team",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation<
      { success: boolean; data: TeamMember },
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/admin/profile/team/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    getAuditLogs: builder.query<{ success: boolean; data: AuditLogEntry[] }, { limit?: number } | void>({
      query: (params) => ({
        url: `/admin/audit-logs?limit=${params?.limit || 25}`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetTeamMembersQuery,
  useCreateTeamMemberMutation,
  useUpdateUserRoleMutation,
  useGetAuditLogsQuery,
} = profileApi;

export default profileApi;
