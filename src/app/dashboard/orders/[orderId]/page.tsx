/* eslint-disable import/no-unresolved */
'use client';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import OrderViewPage from '@/features/orders/components/order-view-page';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function Page() {
  const params = useParams();
  const orderId = typeof params.orderId === 'string' ? params.orderId : '';
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <OrderViewPage orderId={orderId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
