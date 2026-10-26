import { baseApi } from "@/redux/api/baseApi";
import type {
  DashboardResponse,
  GetDashboardQueryParams,
} from "@/types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<
      DashboardResponse,
      GetDashboardQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, number> = {
          limit: params?.limit ?? 5,
          page: params?.page ?? 1,
        };
        return {
          url: "/admin/dashboard",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: [
        { type: "Dashboard", id: "OVERVIEW" },
        "Metric",
        "Package",
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAdminDashboardQuery } = dashboardApi;
export default dashboardApi;
