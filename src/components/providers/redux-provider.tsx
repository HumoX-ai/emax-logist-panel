// src/components/layout/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { ReactNode, useRef } from 'react';
import { createStore } from '@/stores/store';

export default function ReduxProvider({
  children,
  preloadedState
}: {
  children: ReactNode;
  preloadedState?: any;
}) {
  const storeRef = useRef(createStore(preloadedState));
  return <Provider store={storeRef.current}>{children}</Provider>;
}
