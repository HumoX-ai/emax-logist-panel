/* eslint-disable import/no-unresolved */
'use client';
import FormCardSkeleton from '@/components/form-card-skeleton';
import UserForm from './payment-form';
import { useGetPaymentByIdQuery } from '@/lib/api/paymentApi';
import { useState } from 'react';

type TProductViewPageProps = {
  paymentId: string;
};

export default function PaymentViewPage({ paymentId }: TProductViewPageProps) {
  const [isEditing, setIsEditing] = useState(paymentId === 'new');

  const { data: payment, isLoading } = useGetPaymentByIdQuery(
    {
      id: paymentId
    },
    { skip: paymentId === 'new' }
  );

  if (paymentId !== 'new' && isLoading) {
    return <FormCardSkeleton />;
  }

  return (
    <UserForm
      initialData={paymentId === 'new' ? null : payment || null} // Ensure null if payment is undefined
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      paymentId={paymentId}
    />
  );
}
