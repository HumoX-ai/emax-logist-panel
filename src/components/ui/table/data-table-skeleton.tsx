/* eslint-disable import/no-unresolved */
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '../scroll-area';

export function DataTableSkeleton({
  columnCount = 1,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = false
}) {
  return (
    <div className='flex flex-1 flex-col space-y-3 overflow-auto'>
      {searchableColumnCount > 0 || filterableColumnCount > 0 ? (
        <div className='flex w-full items-center justify-between space-x-2 overflow-auto p-1'>
          <div className='flex flex-1 items-center space-y-4 space-x-2'>
            {searchableColumnCount > 0
              ? Array.from({ length: searchableColumnCount }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-[150px] lg:w-[250px]' />
                ))
              : null}
            {filterableColumnCount > 0
              ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                  <Skeleton key={i} className='h-10 w-[70px] border-dashed' />
                ))
              : null}
          </div>
          {showViewOptions ? (
            <Skeleton className='ml-auto hidden h-7 w-[70px] lg:flex' />
          ) : null}
        </div>
      ) : null}

      <div className='relative flex flex-1 rounded-md border'>
        <div className='absolute top-0 right-0 bottom-0 left-0 flex'>
          <ScrollArea className='flex flex-1'>
            <Table>
              <TableHeader>
                {Array.from({ length: 1 }).map((_, i) => (
                  <TableRow key={i} className='hover:bg-transparent'>
                    {Array.from({ length: columnCount }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className='h-8 w-full' />
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {Array.from({ length: rowCount }).map((_, i) => (
                  <TableRow key={i} className='hover:bg-transparent'>
                    {Array.from({ length: columnCount }).map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className='h-8 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>

      <div className='flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8'>
        <div className='flex-1'>
          <Skeleton className='h-8 w-40' />
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-8 w-[70px]' />
          </div>
          <div className='hidden w-[100px] items-center justify-center text-sm font-medium md:flex'>
            <Skeleton className='h-8 w-20' />
          </div>
          <div className='hidden items-center space-x-2 md:flex'>
            <Skeleton className='hidden size-8 lg:block' />
            <Skeleton className='size-8' />
            <Skeleton className='size-8' />
            <Skeleton className='hidden size-8 lg:block' />
          </div>
        </div>
      </div>
    </div>
  );
}
