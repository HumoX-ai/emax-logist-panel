/* eslint-disable import/no-unresolved */
'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import {
  SELECTED_COMMENT,
  useCommentTableFilters
} from './payment-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function CommentTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    isSelected,
    setIsSelected
    // searchQuery,
    // setPage,
    // setSearchQuery
  } = useCommentTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      {/* <DataTableSearch
        searchKey='Buyurtma raqami'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      /> */}
      <DataTableFilterBox
        filterKey='Holat'
        title='Holat'
        options={SELECTED_COMMENT}
        setFilterValue={(value) => {
          setIsSelected(value === null ? null : (value as string | null));
          return Promise.resolve(new URLSearchParams());
        }}
        filterValue={isSelected || ''}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
