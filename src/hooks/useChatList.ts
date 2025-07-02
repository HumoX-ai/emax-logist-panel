/* eslint-disable import/no-unresolved */
'use client';

import { useState, useCallback } from 'react';
import { useGetChatsQuery } from '@/lib/api/chatApi';

export const useChatList = () => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  const { data, isLoading, error, refetch } = useGetChatsQuery({
    offset: page,
    limit
  });

  const chats = data?.chats || [];
  const totalCount = data?.totalCount || 0;
  const hasMore = chats.length < totalCount;

  const filteredChats = searchQuery
    ? chats.filter(
        (chat) =>
          chat.user.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          chat.orderNumber.toString().includes(searchQuery)
      )
    : chats;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  return {
    chats: filteredChats,
    totalCount,
    hasMore,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadMore,
    resetPagination,
    refetch
  };
};
