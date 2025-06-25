/* eslint-disable import/no-unresolved */
'use client';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as PaymentTable } from '@/components/ui/table/data-table';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Payment, useGetPaymentsQuery } from '@/lib/api/paymentApi';
import { columns } from './payment-tables/column';

export default function PaymentListingPage() {
  const searchParamsCache = useSearchParams();
  const page = Number(searchParamsCache.get('offset')) || 0;
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;
  const orderNumber = searchParamsCache.get('q') || '';

  const { data, isLoading, isError } = useGetPaymentsQuery({
    offset: page,
    limit: pageLimit,
    orderNumber: orderNumber ? Number(orderNumber) : undefined
  });

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;
  if (isError) return <div>Xatolik yuz berdi</div>;

  const totalPayments = data?.totalCount || 0;
  const payments: Payment[] = data?.payments || [];

  return (
    <PaymentTable
      columns={columns}
      data={payments}
      totalItems={totalPayments}
    />
  );
}
