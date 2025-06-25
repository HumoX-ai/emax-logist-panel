/* eslint-disable import/no-unresolved */
'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const SELECTED_COMMENT = [
  { value: 'true', label: 'Tanlangan' },
  { value: 'false', label: 'Tanlanmagan' }
];
export function useCommentTableFilters() {
  const [isSelected, setIsSelected] = useQueryState(
    'isSelected',
    searchParams.isSelected.withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState(
    'offset',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setIsSelected(null);
    setPage(1);
  }, [setIsSelected, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return isSelected !== null;
  }, [isSelected]);

  return {
    page,
    setPage,
    resetFilters,
    isSelected,
    setIsSelected,
    isAnyFilterActive
  };
}
