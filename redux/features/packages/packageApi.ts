import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminPackagesResponse,
  AdminPackageDetailResponse,
  ApiEnvelope,
} from "@/types/packages";

export interface GetPackagesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPackages: builder.query<
      AdminPackagesResponse,
      GetPackagesQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, string | number> = {
          page: params?.page || 1,
          limit: params?.limit || 20,
        };
        if (params?.search && params.search.trim()) {
          queryParams.search = params.search.trim();
        }
        return {
          url: "/admin/packages",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...((Array.isArray(result.data)
                ? result.data
                : (result.data as any)?.items || []
              ).map(({ id }: { id: string }) => ({
                type: "Package" as const,
                id,
              }))),
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),

    getAdminPackageById: builder.query<AdminPackageDetailResponse, string>({
      query: (id) => ({
        url: `/admin/packages/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Package", id }],
    }),

    createAdminPackage: builder.mutation<AdminPackageDetailResponse, FormData>({
      query: (formData) => ({
        url: "/admin/packages",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),

    updateAdminPackage: builder.mutation<
      AdminPackageDetailResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/admin/packages/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Package", id: "LIST" },
        { type: "Package", id },
      ],
    }),

    deleteAdminPackage: builder.mutation<ApiEnvelope<any>, string>({
      query: (id) => ({
        url: `/admin/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminPackagesQuery,
  useGetAdminPackageByIdQuery,
  useCreateAdminPackageMutation,
  useUpdateAdminPackageMutation,
  useDeleteAdminPackageMutation,
} = packageApi;

export default packageApi;
