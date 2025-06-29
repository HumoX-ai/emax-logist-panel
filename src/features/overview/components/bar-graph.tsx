/* eslint-disable import/no-unresolved */
'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useGetClientsChartQuery } from '@/lib/api/dashboardApi';
import { BarGraphSkeleton } from './bar-graph-skeleton';
import { format, startOfYear } from 'date-fns';

export const description = 'Mijozlar grafikasi';

const chartConfig = {
  count: {
    label: 'Mijozlar soni',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function BarGraph({ dateRange }: any) {
  const today = new Date();
  const startYear = startOfYear(today);

  const fromDate = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : format(startYear, 'yyyy-MM-dd');
  const toDate = dateRange?.to
    ? format(dateRange.to, 'yyyy-MM-dd')
    : format(today, 'yyyy-MM-dd');

  const { data: chartData = [], isLoading } = useGetClientsChartQuery({
    fromDate: fromDate,
    toDate: toDate
  });

  const totalClients = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (isLoading) {
    return <BarGraphSkeleton />;
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
            <CardTitle>Mijozlar grafikasi</CardTitle>
            <CardDescription>Umumiy mijozlar soni: 0</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='text-muted-foreground px-6 py-12 text-center'>
          Maʼlumot mavjud emas
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Mijozlar grafikasi</CardTitle>
          <CardDescription>
            Umumiy mijozlar soni: {totalClients} ta
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='_id'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip
              formatter={(value) => [`${value} ta`, 'Mijozlar soni']}
              labelFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <Bar dataKey='count' fill='var(--chart-1)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
