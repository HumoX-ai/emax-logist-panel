/* eslint-disable import/no-unresolved */
import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sigin-view';

export const metadata: Metadata = {
  title: 'Kirish',
  description: 'Kirish sahifasi'
};

export default async function Page() {
  return <SignInViewPage />;
}
