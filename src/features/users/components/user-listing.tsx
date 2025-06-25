/* eslint-disable import/no-unresolved */
'use client';
import { Users } from '@/constants/data';
import { useGetUsersQuery } from '@/lib/api/usersApi';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './user-tables/columns';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function UserListingPage() {
  const searchParamsCache = useSearchParams();
  const page = Number(searchParamsCache.get('offset')) || 0;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;

  const { data, isLoading, isError } = useGetUsersQuery({
    offset: page,
    limit: pageLimit,
    searchText: search
  });

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;
  if (isError) return <div>Xatolik yuz berdi</div>;

  const totalUsers = data?.totalCount || 0;
  const users: Users[] = data?.users || [];

  return (
    <ProductTable columns={columns} data={users} totalItems={totalUsers} />
  );
}
