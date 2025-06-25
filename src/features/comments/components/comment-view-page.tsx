/* eslint-disable import/no-unresolved */
'use client';
import FormCardSkeleton from '@/components/form-card-skeleton';
import UserForm from './comment-form';
import { useGetCommentByIdQuery } from '@/lib/api/commentsApi';
import { useState } from 'react';

type TProductViewPageProps = {
  commentId: string;
};

export default function CommentViewPage({ commentId }: TProductViewPageProps) {
  const [isEditing, setIsEditing] = useState(commentId === 'new');

  const { data: comment, isLoading } = useGetCommentByIdQuery(
    { id: commentId },
    { skip: commentId === 'new' }
  );

  if (commentId !== 'new' && isLoading) {
    return <FormCardSkeleton />;
  }

  return (
    <UserForm
      initialData={commentId === 'new' ? null : comment || null}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      commentId={commentId}
    />
  );
}
