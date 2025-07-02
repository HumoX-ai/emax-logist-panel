import { getAccessToken } from '@/app/helpers/index';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Interfaces
export interface ChatUser {
  _id: string;
  fullName: string;
  phone: string;
}

export interface Chat {
  _id: string;
  userId: string;
  orderId: string;
  orderNumber: number;
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: string;
  user: ChatUser;
}

export interface ChatsResponse {
  chats: Chat[];
  totalCount: number;
}

export interface Message {
  _id: string;
  userId: string;
  orderId: string;
  chatId: string;
  orderNumber: number;
  sellerId: string;
  text: string;
  senderType: 'USER' | 'SELLER';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MessagesResponse {
  messages: Message[];
  totalCount: number;
}

export interface GetChatsQueryParams {
  offset?: number;
  limit?: number;
}

export interface GetMessagesQueryParams {
  orderId: string;
  offset?: number;
  limit?: number;
}

export interface SendMessageParams {
  chatId: string;
  text: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://back.emaxb.uz/api/seller',
    prepareHeaders: async (headers) => {
      const token = await getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    getChats: builder.query<ChatsResponse, GetChatsQueryParams>({
      query: ({ offset = 0, limit = 10 }) => ({
        url: '/chats',
        params: { offset, limit }
      }),
      providesTags: (result) => [
        'Chats',
        ...(result?.chats?.map(({ _id }) => ({
          type: 'Chats' as const,
          id: _id
        })) ?? [])
      ]
    }),
    getMessages: builder.query<MessagesResponse, GetMessagesQueryParams>({
      query: ({ orderId, offset = 0, limit = 10 }) => ({
        url: '/messages',
        params: { orderId, offset, limit }
      }),
      providesTags: (result, error, { orderId }) => [
        { type: 'Messages', id: orderId },
        ...(result?.messages?.map(({ _id }) => ({
          type: 'Messages' as const,
          id: _id
        })) ?? [])
      ]
    }),
    sendMessage: builder.mutation<Message, SendMessageParams>({
      query: ({ chatId, text }) => ({
        url: '/messages',
        method: 'POST',
        body: { chatId, text }
      }),
      invalidatesTags: (result, error, { chatId }) => [
        'Chats',
        { type: 'Messages', id: result?.orderId }
      ],
      // Optimistically add message to cache
      onQueryStarted: async (
        { chatId, text },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: newMessage } = await queryFulfilled;

          // Update messages cache
          dispatch(
            chatApi.util.updateQueryData(
              'getMessages',
              { orderId: newMessage.orderId },
              (draft) => {
                draft.messages.push(newMessage);
                draft.totalCount += 1;
              }
            )
          );

          // Update chats cache to reflect new last message
          dispatch(
            chatApi.util.updateQueryData('getChats', {}, (draft) => {
              const chatIndex = draft.chats.findIndex(
                (chat) => chat._id === chatId
              );
              if (chatIndex !== -1) {
                draft.chats[chatIndex].lastMessage = text;
                draft.chats[chatIndex].updatedAt = newMessage.createdAt;
                // Move this chat to top
                const [chat] = draft.chats.splice(chatIndex, 1);
                draft.chats.unshift(chat);
              }
            })
          );
        } catch {}
      }
    })
  })
});

export const { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation } =
  chatApi;
