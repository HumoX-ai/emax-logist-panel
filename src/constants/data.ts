import { NavItem } from 'types';

export type Users = {
  photo_url: string;
  fullName: string;
  phone: string;
  name: string;
  description: string;
  orderNumber: number;
  created_at: string;
  price: number;
  _id: number;
  category: string;
  gender: string;
  birthday: string;
  updated_at: string;
};

export type Orders = {
  _id: string;
  userId: string;
  sellerId: string;
  orderNumber: number;
  name: string;
  weight: number;
  price: number;
  description: string;
  contractFile: string;
  status:
    | 'PENDING'
    | 'IN_WAREHOUSE'
    | 'IN_PROCESS'
    | 'IN_BORDER'
    | 'IN_CUSTOMS'
    | 'DONE';
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  paidAmount: number;
  user: Users;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Mijozlar',
    url: '/dashboard/users',
    icon: 'user2',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Buyurtmalar',
    url: '/dashboard/orders',
    icon: 'order',
    shortcut: ['f', 'f'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: "To'lovlar",
    url: '/dashboard/payments',
    icon: 'payment',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Chat',
    url: '/dashboard/chat',
    icon: 'chat',
    shortcut: ['c', 'c'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Izohlar',
    url: '/dashboard/comments',
    icon: 'comment',
    shortcut: ['c', 'c'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Profil',
    url: '/dashboard/profile',
    icon: 'userPen',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
