/* eslint-disable import/no-unresolved */
import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for user data
export interface UserData {
  fullName: string;
  phone: string;
  about: string;
  photo?: string;
  password?: string;
}

interface UserResponse {
  message: string;
  success: boolean;
  status: number;
  data: {
    _id: string;
    fullName: string;
    phone: string;
    photo: string;
    about: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    Type: string;
  };
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://back.emaxb.uz/api',
    prepareHeaders: async (headers) => {
      const token = await getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserResponse, void>({
      query: () => ({
        url: '/auth/get-user-information',
        method: 'GET'
      }),
      providesTags: ['Profile']
    }),
    updateProfile: builder.mutation<any, { id: string; data: UserData }>({
      query: ({ id, data }) => ({
        url: `/sellers/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Profile']
    })
  })
});

export const { useUpdateProfileMutation, useGetUserInfoQuery } = profileApi;
