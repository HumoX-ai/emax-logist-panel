'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useGetRecentOrdersQuery } from '@/lib/api/dashboardApi';
import { formatDate, formatPrice } from '@/lib/utils';
import { RecentSalesSkeleton } from './recent-sales-skeleton';
import { format, startOfYear } from 'date-fns';

export function RecentSales({ dateRange }: any) {
  const today = new Date();
  const startYear = startOfYear(today);

  const fromDate = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : format(startYear, 'yyyy-MM-dd');
  const toDate = dateRange?.to
    ? format(dateRange.to, 'yyyy-MM-dd')
    : format(today, 'yyyy-MM-dd');

  const { data: recentOrders = [], isLoading } = useGetRecentOrdersQuery({
    fromDate: fromDate,
    toDate: toDate
  });

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Kutilmoqda';
      case 'COMPLETED':
        return 'Tugatilgan';
      case 'CANCELED':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <RecentSalesSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>So&#39;nggi buyurtmalar</CardTitle>
        <CardDescription>
          {recentOrders.length} ta buyurtma mavjud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {recentOrders.length > 0 ? (
            recentOrders.slice(0, 4).map((order) => (
              <div key={order._id} className='flex items-center'>
                <Avatar className='h-9 w-9'>
                  <AvatarFallback>
                    {order.user?.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='ml-4 space-y-1'>
                  <p className='max-w-[160px] truncate text-sm leading-none font-medium'>
                    {order.name}
                  </p>
                  <p className='text-muted-foreground max-w-[200px] truncate text-xs'>
                    {order.user?.fullName} -{' '}
                    <span
                      className={`${
                        order.status === 'COMPLETED'
                          ? 'text-green-500'
                          : order.status === 'CANCELED'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                      }`}
                    >
                      {getOrderStatusText(order.status)}
                    </span>
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {formatDate(new Date(order.createdAt))}
                  </p>
                </div>
                <div className='ml-auto min-w-[100px] text-right font-medium'>
                  {formatPrice(order.price)}
                </div>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-center'>
              So&#39;nggi buyurtmalar mavjud emas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
