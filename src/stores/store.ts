// src/stores/store.ts
import { commentsApi } from '@/lib/api/commentsApi';
import { dashboardApi } from '@/lib/api/dashboardApi';
import { ordersApi } from '@/lib/api/ordersApi';
import { paymentApi } from '@/lib/api/paymentApi';
import { profileApi } from '@/lib/api/profileApi';
import { userApi } from '@/lib/api/usersApi';
import { configureStore } from '@reduxjs/toolkit';

export const createStore = (preloadedState?: any) =>
  configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
      [commentsApi.reducerPath]: commentsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        userApi.middleware,
        profileApi.middleware,
        ordersApi.middleware,
        dashboardApi.middleware,
        paymentApi.middleware,
        commentsApi.middleware
      )
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
