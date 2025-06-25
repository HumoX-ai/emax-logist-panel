/* eslint-disable import/no-unresolved */
'use client';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as CommentTable } from '@/components/ui/table/data-table';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { columns } from './comment-tables/column';
import { useGetCommentsQuery } from '@/lib/api/commentsApi';

export default function CommentListingPage() {
  const searchParamsCache = useSearchParams();
  const page = Number(searchParamsCache.get('offset')) || 0;
  const pageLimit = Number(searchParamsCache.get('limit')) || 10;
  const isSelected = searchParamsCache.get('isSelected') || '';

  const { data, isLoading, isError } = useGetCommentsQuery({
    offset: page,
    limit: pageLimit,
    hasSelected:
      isSelected === 'true' ? true : isSelected === 'false' ? false : undefined
  });

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;
  if (isError) return <div>Xatolik yuz berdi</div>;

  const totalComments = data?.totalCount || 0;
  const comments = data?.comments || [];

  return (
    <CommentTable
      columns={columns}
      data={comments}
      totalItems={totalComments}
    />
  );
}
