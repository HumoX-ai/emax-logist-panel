/* eslint-disable import/no-unresolved */
// src/lib/prefetchDashboard.ts

import { createStore } from '@/stores/store';
import { dashboardApi } from './api/dashboardApi';

export async function prefetchDashboard(fromDate: string, toDate: string) {
  const store = createStore();

  // Ma'lumotlarni oldindan yuklash
  await store.dispatch(
    dashboardApi.endpoints.getMainInfo.initiate({ fromDate, toDate })
  );

  await Promise.all(store.dispatch(dashboardApi.util.getRunningQueriesThunk()));

  return store.getState();
}
