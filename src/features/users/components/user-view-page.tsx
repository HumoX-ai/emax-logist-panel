/* eslint-disable import/no-unresolved */
'use client';
import { useGetUserByIdQuery } from '@/lib/api/usersApi';
import { User } from '@/constants/mock-api';
import UserForm from './user-form';
import FormCardSkeleton from '@/components/form-card-skeleton';

type TProductViewPageProps = {
  userId: string;
};

export default function UserViewPage({ userId }: TProductViewPageProps) {
  const { data, isLoading } = useGetUserByIdQuery({ id: userId });
  let user = null;
  let pageTitle = "Mijozni qo'shish";

  if (userId !== 'new') {
    user = data as User;
    pageTitle = `Mijozni tahrirlash`;
  }

  if (isLoading) {
    return <FormCardSkeleton />;
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
