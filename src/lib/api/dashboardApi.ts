/* eslint-disable import/no-unresolved */
// // src/lib/api/dashboardApi.ts
import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface MainInfo {
  totalPayment: number;
  clientsCount: number;
  ordersCount: number;
  commentsCount: number;
}

export interface ClientsChart {
  _id: string;
  count: number;
}

export interface RecentOrders {
  _id: string;
  name: string;
  price: number;
  status: string;
  createdAt: string;
  user: {
    _id: string;
    fullName: string;
  };
}

interface Params {
  fromDate: string;
  toDate: string;
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://back.emaxb.uz/api/seller/statistics',
    prepareHeaders: async (headers) => {
      const token = await getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getMainInfo: builder.query<MainInfo, Params>({
      query: ({ fromDate, toDate }: { fromDate: string; toDate: string }) => ({
        url: `/main-info?fromDate=${fromDate}&toDate=${toDate}`,
        method: 'GET'
      }),
      providesTags: ['Dashboard']
    }),
    getClientsChart: builder.query<ClientsChart[], Params>({
      query: ({ fromDate, toDate }: { fromDate: string; toDate: string }) => ({
        url: `/clients-chart?fromDate=${fromDate}&toDate=${toDate}`,
        method: 'GET'
      }),
      providesTags: ['Dashboard']
    }),
    getRecentOrders: builder.query<RecentOrders[], Params>({
      query: ({ fromDate, toDate }: { fromDate: string; toDate: string }) => ({
        url: `/recent-orders?fromDate=${fromDate}&toDate=${toDate}`,
        method: 'GET'
      }),
      providesTags: ['Dashboard']
    })
  })
});

export const {
  useGetMainInfoQuery,
  useGetClientsChartQuery,
  useGetRecentOrdersQuery
} = dashboardApi;
