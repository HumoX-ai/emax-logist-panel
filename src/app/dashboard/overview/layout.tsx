/* eslint-disable import/no-unresolved */
'use client';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useGetMainInfoQuery } from '@/lib/api/dashboardApi';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, startOfYear } from 'date-fns';
import BarStats from './@bar_stats/page';
import Sales from './@sales/page';
import { Skeleton } from '@/components/ui/skeleton';

export default function OverViewLayout({
  sales,
  bar_stats
}: {
  sales: React.ReactNode;
  bar_stats: React.ReactNode;
}) {
  // Get default date range (start of year to today)
  const today = new Date();
  const startYear = startOfYear(today);

  // Initialize date state from localStorage or default values
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const savedRange =
      typeof window !== 'undefined' ? localStorage.getItem('dateRange') : null;

    if (savedRange) {
      const parsed = JSON.parse(savedRange);
      return {
        from: new Date(parsed.from),
        to: new Date(parsed.to)
      };
    }

    return {
      from: startYear,
      to: today
    };
  });

  // Format dates for API
  const fromDate = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : format(startYear, 'yyyy-MM-dd');
  const toDate = dateRange?.to
    ? format(dateRange.to, 'yyyy-MM-dd')
    : format(today, 'yyyy-MM-dd');

  const { data: mainInfo } = useGetMainInfoQuery({
    fromDate,
    toDate
  });

  // Save date range to localStorage when it changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      localStorage.setItem(
        'dateRange',
        JSON.stringify({
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString()
        })
      );
    }
  }, [dateRange]);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Salom, yana ko‘rishganimizdan xursandmiz 👋
          </h2>
          <div className='flex items-center space-x-2'>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Umumiy Daromad
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mainInfo ? (
                  mainInfo.totalPayment.toLocaleString() + " so'm"
                ) : (
                  // <div className='bg-muted h-7 w-24 animate-pulse rounded' />
                  <Skeleton className='h-7 w-24' />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Mijozlar soni
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                <circle cx='9' cy='7' r='4' />
                <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mainInfo ? (
                  mainInfo.clientsCount + " ta"
                ) : (
                  <Skeleton className='h-7 w-10' />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Buyurtmalar soni
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <rect width='20' height='14' x='2' y='5' rx='2' />
                <path d='M2 10h20' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mainInfo ? (
                  mainInfo.ordersCount + " ta"
                ) : (
                  <Skeleton className='h-7 w-10' />
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Izohlar soni
              </CardTitle>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-muted-foreground h-4 w-4'
              >
                <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
              </svg>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mainInfo ? (
                  mainInfo.commentsCount + " ta"
                ) : (
                  <Skeleton className='h-7 w-10' />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <BarStats dateRange={dateRange} />
          </div>
          <div className='col-span-4 md:col-span-3'>
            <Sales dateRange={dateRange} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
