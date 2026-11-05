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
  }),
  overrideExisting: true,
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} = profileApi;

export default profileApi;
