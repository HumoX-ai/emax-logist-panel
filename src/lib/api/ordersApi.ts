/* eslint-disable import/no-unresolved */
import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://back.emaxb.uz/api/seller',
    prepareHeaders: async (headers) => {
      const token = await getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    addOrder: builder.mutation({
      query: (data: any) => ({
        url: '/orders',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Orders']
    }),
    getOrders: builder.query({
      query: ({
        offset = 0,
        limit = 10,
        searchText,
        orderNumber,
        status
      }: {
        offset?: number;
        limit?: number;
        searchText?: string;
        orderNumber?: string;
        status?: string;
      }) => ({
        url: '/orders',
        params: {
          offset,
          limit,
          searchText,
          orderNumber,
          status
        }
      }),
      providesTags: ['Orders']
    }),
    getOrderById: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `/orders/${id}`,
        method: 'GET'
      }),
      providesTags: ['Orders']
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Orders']
    }),
    deleteOrder: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/orders/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Orders']
    }),
    changeOrderStatus: builder.mutation({
      query: ({ data }: { data: any }) => ({
        url: `/orders/status`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Orders']
    })
  })
});

export const {
  useAddOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useChangeOrderStatusMutation
} = ordersApi;
