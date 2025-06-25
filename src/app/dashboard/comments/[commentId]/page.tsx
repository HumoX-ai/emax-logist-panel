/* eslint-disable import/no-unresolved */
'use client';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import CommentViewPage from '@/features/comments/components/comment-view-page';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function Page() {
  const params = useParams();
  const commentId =
    typeof params.commentId === 'string' ? params.commentId : '';
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <CommentViewPage commentId={commentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
