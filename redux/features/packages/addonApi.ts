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

    getAdminAddonById: builder.query<ApiEnvelope<ApiAddonItem>, string>({
      query: (id) => ({
        url: `/admin/addons/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Addon", id }],
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

    updateAdminAddon: builder.mutation<
      ApiEnvelope<ApiAddonItem>,
      { id: string; formData: FormData } | { id: string; body: Partial<ApiAddonItem> }
    >({
      query: (arg) => {
        const isFormData = "formData" in arg;
        return {
          url: `/admin/addons/${arg.id}`,
          method: "PATCH",
          body: isFormData ? arg.formData : arg.body,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Addon", id: "LIST" },
        { type: "Addon", id: arg.id },
        "Dashboard",
        "Metric",
      ],
    }),

    deleteAdminAddon: builder.mutation<
      ApiEnvelope<unknown>,
      string | { id: string; permanent?: boolean }
    >({
      query: (arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        const permanent = typeof arg === "object" && arg.permanent;
        return {
          url: `/admin/addons/${id}`,
          method: "DELETE",
          params: permanent ? { permanent: true } : undefined,
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        return [
          { type: "Addon", id: "LIST" },
          { type: "Addon", id },
          "Dashboard",
          "Metric",
        ];
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminAddonsQuery,
  useGetAdminAddonByIdQuery,
  useCreateAdminAddonMutation,
  useUpdateAdminAddonMutation,
  useDeleteAdminAddonMutation,
} = addonApi;

export default addonApi;
