import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminAddonsResponse,
  GetAddonsQueryParams,
  ApiAddonItem,
} from "@/types/addons";
import type { ApiEnvelope } from "@/types/packages";

export const addonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAddons: builder.query<
      AdminAddonsResponse,
      GetAddonsQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        };
        if (params?.search && params.search.trim()) {
          queryParams.search = params.search.trim();
        }
        if (params?.category) {
          queryParams.category = params.category;
        }
        if (params?.status) {
          queryParams.status = params.status;
        }
        return {
          url: "/admin/addons",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Addon" as const,
                id,
              })),
              { type: "Addon", id: "LIST" },
            ]
          : [{ type: "Addon", id: "LIST" }],
    }),

    createAdminAddon: builder.mutation<ApiEnvelope<ApiAddonItem>, FormData>({
      query: (formData) => ({
        url: "/admin/addons",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Addon", id: "LIST" },
        "Dashboard",
        "Metric",
      ],
    }),

    deleteAdminAddon: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/admin/addons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Addon", id: "LIST" },
        "Dashboard",
        "Metric",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminAddonsQuery,
  useCreateAdminAddonMutation,
  useDeleteAdminAddonMutation,
} = addonApi;

export default addonApi;
