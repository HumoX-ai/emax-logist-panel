/* eslint-disable import/no-unresolved */
import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Payment {
  _id: string;
  userId?: string;
  orderId?: string;
  orderNumber?: number; // Added from user's sample data
  sellerId?: string;
  document?: string;
  amount?: number;
  isDeleted?: boolean; // Added from user's sample data
  createdAt?: string;
  updatedAt?: string; // Added from user's sample data
}

export const paymentApi = createApi({
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
  reducerPath: 'paymentApi',
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    addPayment: builder.mutation({
      query: (data: any) => ({
        url: '/payments',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Payment']
    }),
    getPayments: builder.query<
      { payments: Payment[]; totalCount: number },
      {
        offset?: number;
        limit?: number;
        orderNumber?: number;
      }
    >({
      query: ({
        offset = 0,
        limit = 10,
        orderNumber
      }: {
        offset?: number;
        limit?: number;
        orderNumber?: number;
      }) => ({
        url: '/payments',
        params: {
          offset,
          limit,
          orderNumber
        }
      }),
      providesTags: ['Payment']
    }),
    getPaymentById: builder.query<Payment, { id: string }>({
      query: ({ id }) => ({
        url: `/payments/${id}`,
        method: 'GET'
      }),
      providesTags: ['Payment']
    }),
    updatePayment: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Payment']
    }),
    deletePayment: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/payments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Payment']
    })
  })
});

export const {
  useAddPaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation
} = paymentApi;
