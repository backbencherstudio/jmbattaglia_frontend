import { baseApi } from "@/redux/api/baseApi";
import type {
  ClientLookupData,
  FoundationTypeItem,
  OrderTypeItem,
  PortalPackageItem,
  PortalAddonItem,
  CalculatedQuoteData,
  AvailableSlotItem,
  AvailableSlotsData,
  DirectOrderPayload,
} from "@/types/booking";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Check whether an email exists and retrieve client details & previous fillup
    lookupClientByEmail: builder.query<ApiResponse<ClientLookupData>, string>({
      query: (email) => ({
        url: `/portal/client/lookup/${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),

    // 2. Foundation types list
    getFoundationTypes: builder.query<ApiResponse<FoundationTypeItem[]>, void>({
      query: () => ({
        url: "/portal/foundationtypes",
        method: "GET",
      }),
    }),

    // 3. Order types list
    getOrderTypes: builder.query<ApiResponse<OrderTypeItem[]>, void>({
      query: () => ({
        url: "/portal/ordertypes",
        method: "GET",
      }),
    }),

    // 4. Customer-visible inspection packages
    getPortalPackages: builder.query<ApiResponse<PortalPackageItem[]>, void>({
      query: () => ({
        url: "/portal/packages",
        method: "GET",
      }),
    }),

    // 5. Customer-visible add-ons
    getPortalAddons: builder.query<ApiResponse<PortalAddonItem[]>, void>({
      query: () => ({
        url: "/portal/addons",
        method: "GET",
      }),
    }),

    // 6. Calculate real ISN quote (retained in Redis for 30 minutes)
    calculateServiceQuote: builder.mutation<
      ApiResponse<CalculatedQuoteData>,
      {
        category: "RESALE_HOME" | "NEW_CONSTRUCTION";
        packageId?: string;
        serviceIds: string[];
        property: any;
        orderTypeId?: string;
      }
    >({
      query: (body) => ({
        url: "/portal/calculateservicequote",
        method: "POST",
        body,
      }),
    }),

    // 7. Return appointment starts that fit the quoted duration
    getAvailableSlots: builder.query<
      ApiResponse<AvailableSlotsData>,
      { date: string; quoteId: string; days?: number }
    >({
      query: ({ date, quoteId, days = 7 }) => ({
        url: "/portal/availableslots",
        method: "GET",
        params: {
          date,
          quoteId,
          days,
        },
      }),
    }),

    // 8. Submit the full order
    createDirectOrder: builder.mutation<
      ApiResponse<any>,
      { payload: DirectOrderPayload; idempotencyKey: string }
    >({
      query: ({ payload, idempotencyKey }) => ({
        url: "/portal/order",
        method: "POST",
        headers: {
          "idempotency-key": idempotencyKey,
        },
        body: payload,
      }),
    }),

    // 9. Read order receipt using its original submission key
    getOrderReceipt: builder.query<
      ApiResponse<any>,
      { id: string; idempotencyKey: string }
    >({
      query: ({ id, idempotencyKey }) => ({
        url: `/portal/order/${id}`,
        method: "GET",
        headers: {
          "idempotency-key": idempotencyKey,
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLookupClientByEmailQuery,
  useLazyLookupClientByEmailQuery,
  useGetFoundationTypesQuery,
  useGetOrderTypesQuery,
  useGetPortalPackagesQuery,
  useGetPortalAddonsQuery,
  useCalculateServiceQuoteMutation,
  useGetAvailableSlotsQuery,
  useLazyGetAvailableSlotsQuery,
  useCreateDirectOrderMutation,
  useGetOrderReceiptQuery,
  useLazyGetOrderReceiptQuery,
} = bookingApi;
