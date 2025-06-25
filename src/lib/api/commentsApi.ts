import { getAccessToken } from '@/app/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Interfeyslar
export interface User {
  _id: string;
  fullName: string;
}

export interface Comment {
  _id: string;
  stars: number;
  text: string;
  hasSelected: boolean;
  sellerId: string;
  orderId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: number;
  user: User;
}

export interface CommentsResponse {
  totalCount: number;
  comments: Comment[];
}

export interface GetCommentsQueryParams {
  offset?: number;
  limit?: number;
  hasSelected?: boolean;
}

export interface GetCommentByIdParams {
  id: string;
}

export interface UpdateCommentParams {
  id: string;
  data: Partial<Omit<Comment, '_id' | 'user' | 'createdAt' | 'updatedAt'>>;
}

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
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
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    addComment: builder.mutation<Comment, { id: string }>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: 'POST',
        body: JSON.stringify({ id })
      }),
      invalidatesTags: ['Comments']
    }),
    getComments: builder.query<CommentsResponse, GetCommentsQueryParams>({
      query: ({ offset = 0, limit = 10, hasSelected }) => ({
        url: '/comments',
        params: {
          offset,
          limit,
          hasSelected
        }
      }),
      providesTags: ['Comments']
    }),
    getCommentById: builder.query<Comment, GetCommentByIdParams>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: 'GET'
      }),
      providesTags: ['Comments']
    }),
    updateComment: builder.mutation<Comment, UpdateCommentParams>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Comments']
    }),
    deleteComment: builder.mutation<Comment, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Comments']
    })
  })
});

// Hooklar
export const {
  useAddCommentMutation,
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation
} = commentsApi;
