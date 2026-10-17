import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminProfileResponse,
  UpdateProfileResponse,
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
      query: (body) => ({
        url: "/admin/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User", "Setting"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} = profileApi;

export default profileApi;
