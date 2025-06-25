/* eslint-disable import/no-unresolved */
'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50]
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useQueryState(
    'offset',
    parseAsInteger.withOptions({ shallow: false }).withDefault(0)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger
      .withOptions({ shallow: false, history: 'push' })
      .withDefault(10)
  );

  // Add sort query parameters
  const [sortColumn, setSortColumn] = useQueryState(
    'sortColumn',
    parseAsString.withOptions({ shallow: false }).withDefault('')
  );
  const [sortOrder, setSortOrder] = useQueryState(
    'sortOrder',
    parseAsString.withOptions({ shallow: false }).withDefault('')
  );

  // Create sorting state from URL parameters
  const [sorting, setSorting] = useState<SortingState>(
    sortColumn && sortOrder
      ? [{ id: sortColumn, desc: sortOrder === 'desc' }]
      : []
  );

  // Update URL when sorting changes
  useEffect(() => {
    if (sorting.length > 0) {
      setSortColumn(sorting[0].id);
      setSortOrder(sorting[0].desc ? 'desc' : 'asc');
    } else {
      setSortColumn('');
      setSortOrder('');
    }
  }, [sorting, setSortColumn, setSortOrder]);

  const paginationState = {
    pageIndex: Math.floor(currentPage / pageSize), // sahifa raqami
    pageSize: pageSize
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    const newOffset = pagination.pageIndex * pagination.pageSize;
    setCurrentPage(newOffset);
    setPageSize(pagination.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
      sorting
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting, // Add sorting handler
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Add sorting model
    manualPagination: true,
    manualFiltering: true
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='relative flex flex-1'>
        <div className='absolute top-0 right-0 bottom-0 left-0 flex overflow-scroll rounded-md border md:overflow-auto'>
          <ScrollArea className='flex-1'>
            <Table className='relative'>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'flex cursor-pointer items-center gap-1 select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <CaretUpIcon className='ml-1 h-4 w-4' />,
                              desc: <CaretDownIcon className='ml-1 h-4 w-4' />
                            }[header.column.getIsSorted() as string] ??
                              (header.column.getCanSort() ? (
                                <CaretSortIcon className='ml-1 h-4 w-4' />
                              ) : null)}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      Ma&#39;lumotlar topilmadi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>

      <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row'>
        <div className='flex w-full items-center justify-between'>
          <div className='text-muted-foreground flex-1 text-sm'>
            {totalItems > 0 ? (
              <>
                {paginationState.pageIndex * paginationState.pageSize + 1} dan{' '}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  totalItems
                )}{' '}
                gacha ko‘rsatilmoqda — jami {totalItems} ta yozuv
              </>
            ) : (
              'No entries found'
            )}
          </div>
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium whitespace-nowrap'>Sahifada</p>
              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className='h-8 w-[70px]'>
                  <SelectValue placeholder={paginationState.pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
          <div className='flex w-[150px] items-center justify-center text-sm font-medium'>
            {totalItems > 0 ? (
              <>
                {paginationState.pageIndex + 1}-sahifa, jami{' '}
                {table.getPageCount()} ta sahifa
              </>
            ) : (
              'No pages'
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              aria-label='Go to first page'
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to previous page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to next page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to last page'
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
