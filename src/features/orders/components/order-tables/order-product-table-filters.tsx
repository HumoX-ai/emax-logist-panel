/* eslint-disable import/no-unresolved */
'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STATUS = [
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'IN_WAREHOUSE', label: 'Omborda' },
  { value: 'IN_PROCESS', label: "Tayyor&Yo'lda" },
  { value: 'IN_BORDER', label: 'Chegarada' },
  { value: 'IN_CUSTOMS', label: 'Bojxonada' },
  { value: 'DONE', label: 'Tayyor' }
];

export function useOrderTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );
  const [orderNumber, setOrderNumber] = useQueryState(
    'orderNumber',
    searchParams.orderNumber
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    searchParams.status.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'offset',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);

    setPage(1);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    statusFilter,
    setStatusFilter,
    orderNumber,
    setOrderNumber
  };
}
