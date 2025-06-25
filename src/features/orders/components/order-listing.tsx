'use client';
import { Orders } from '@/constants/data';
import { DataTable as OrderTable } from '@/components/ui/table/data-table';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { columns } from './order-tables/column';
import { useGetOrdersQuery } from '@/lib/api/ordersApi';

export default function OrderListingPage() {
  const searchParamsCache = useSearchParams();
  const page = Number(searchParamsCache.get('offset')) || 0;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;
  const statusFilter = searchParamsCache.get('status') || '';
  const orderNumber = searchParamsCache.get('orderNumber') || '';

  const query: Record<string, any> = {
    offset: page,
    limit: pageLimit,
    searchText: search,
    orderNumber
  };

  if (statusFilter) {
    query.status = statusFilter;
  }

  const { data, isLoading, isError } = useGetOrdersQuery(query);

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;
  if (isError) return <div>Xatolik yuz berdi</div>;

  const totalProducts = data?.totalCount || 0;
  const products: Orders[] = data?.orders || [];

  return (
    <OrderTable columns={columns} data={products} totalItems={totalProducts} />
  );
}
