/* eslint-disable import/no-unresolved */
'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { STATUS, useOrderTableFilters } from './order-product-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function OrderTableAction() {
  const {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    orderNumber,
    setOrderNumber
  } = useOrderTableFilters();
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='Buyurtma nomi'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
        className='w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px]'
      />
      <DataTableSearch
        searchKey='Buyurtma raqami'
        searchQuery={orderNumber}
        setSearchQuery={setOrderNumber}
        setPage={setPage}
        className='w-1/2'
      />
      <DataTableFilterBox
        filterKey='status'
        title='Holat'
        options={STATUS}
        setFilterValue={setStatusFilter}
        filterValue={statusFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
