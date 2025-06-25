/* eslint-disable import/no-unresolved */
'use client';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { useGetOrderByIdQuery } from '@/lib/api/ordersApi';
import UserForm from './order-form';
import { Orders } from '@/constants/data';
import { useState } from 'react';

type TProductViewPageProps = {
  orderId: string;
};

export default function OrderViewPage({ orderId }: TProductViewPageProps) {
  const isNew = orderId === 'new';
  const { data, isLoading, isFetching } = useGetOrderByIdQuery(
    { id: orderId },
    { skip: isNew } // Skip query if it's a new order
  );
  // Start in editing mode if it's a new order, otherwise start in view mode.
  const [isEditing, setIsEditing] = useState(isNew);

  // Show skeleton if loading data for an existing order and not in new order mode.
  if (!isNew && (isLoading || isFetching)) {
    return <FormCardSkeleton />;
  }

  // initialData is null for a new order, or the fetched data for an existing one.
  const initialData = isNew ? null : (data as Orders | undefined) || null;

  return (
    <UserForm
      initialData={initialData}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      orderId={orderId}
    />
  );
}
