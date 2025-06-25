/* eslint-disable import/no-unresolved */
import { BarGraph } from '@/features/overview/components/bar-graph';

export default function BarStats({ dateRange }: any) {
  return <BarGraph dateRange={dateRange} />;
}
