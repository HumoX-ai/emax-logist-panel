/* eslint-disable import/no-unresolved */
// src/lib/api/userApi.ts
import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data: any) => ({
        url: '/users',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    getUsers: builder.query({
      query: ({
        offset = 0,
        limit = 10,
        searchText
      }: {
        offset?: number;
        limit?: number;
        searchText?: string;
      }) => ({
        url: '/users',
        params: {
          offset,
          limit,
          searchText
        }
      }),
      providesTags: ['Users']
    }),
    getUserById: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `/users/${id}`
      }),
      providesTags: (result, error, { id }) => [{ type: 'Users', id }]
    }),
    updateUser: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: ({ id }: { id: number }) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    })
  })
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useAddUserMutation,
  useDeleteUserMutation
} = userApi;
