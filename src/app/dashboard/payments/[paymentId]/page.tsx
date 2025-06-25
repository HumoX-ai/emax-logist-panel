'use client';

import { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PaymentViewPage from '@/features/payment/components/payment-view-page';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const paymentId =
    typeof params.paymentId === 'string' ? params.paymentId : '';
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PaymentViewPage paymentId={paymentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
