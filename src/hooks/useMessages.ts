/* eslint-disable import/no-unresolved */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useGetMessagesQuery } from '@/lib/api/chatApi';

export const useMessages = (orderId: string | null) => {
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data, isLoading, error, refetch } = useGetMessagesQuery(
    {
      orderId: orderId || '',
      offset: page,
      limit
    },
    { skip: !orderId }
  );

  const messages = data?.messages || [];
  const totalCount = data?.totalCount || 0;
  const hasMore = messages.length < totalCount;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + limit);
    }
  }, [hasMore, isLoading, limit]);

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  // Reset pagination when orderId changes
  useEffect(() => {
    resetPagination();
  }, [orderId, resetPagination]);

  return {
    messages,
    totalCount,
    hasMore,
    isLoading,
    error,
    loadMore,
    resetPagination,
    refetch
  };
};
