/* eslint-disable import/no-unresolved */
'use client';
import { Orders } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { cn } from '@/lib/utils';
// import { CellAction } from './cell-action';

export const columns: ColumnDef<Orders>[] = [
  // {
  //   accessorKey: 'photo_url',
  //   header: 'IMAGE',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='relative aspect-square'>
  //         <Image
  //           src={row.getValue('photo_url')}
  //           alt={row.getValue('name')}
  //           fill
  //           className='rounded-lg'
  //         />
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'orderNumber',
    header: 'Buyurtma raqami',
    enableSorting: true
  },
  {
    accessorKey: 'user',
    header: 'Buyurtmachi',
    cell: ({ row }) => {
      const users = row.getValue('user') as Array<{ fullName: string }>;
      const fullName = users && users.length > 0 ? users[0].fullName : 'N/A';

      return <div>{fullName}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'name',
    header: 'Buyurtma nomi',
    enableSorting: true
  },

  {
    accessorKey: 'weight',
    header: "Og'irligi",
    cell: ({ row }) => {
      const weight = row.getValue('weight');
      return <div>{weight + ' kg'}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'price',
    header: 'Narxi',
    cell: ({ row }) => {
      const price = row.getValue('price');
      const formattedPrice =
        typeof price === 'number'
          ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          : price;
      return <div>{formattedPrice + " so'm"}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'paidAmount',
    header: "To'langan summa",
    cell: ({ row }) => {
      const paidAmount = row.getValue('paidAmount');
      const formattedPaidAmount =
        typeof paidAmount === 'number'
          ? paidAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          : paidAmount;
      return <div>{formattedPaidAmount + " so'm"}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'status',
    header: 'Holati',
    cell: ({ row }) => {
      const status = row.getValue('status');

      return (
        <span
          className={cn('rounded-full px-3 py-1 text-sm font-medium', {
            'border border-orange-300 bg-orange-100 text-orange-700':
              status === 'PENDING',
            'border border-sky-300 bg-sky-100 text-sky-700':
              status === 'IN_PROCESS',
            'border border-emerald-300 bg-emerald-100 text-emerald-700':
              status === 'DONE',
            'border border-red-300 bg-red-100 text-red-700':
              status === 'IN_BORDER',
            'border border-gray-300 bg-gray-100 text-gray-700': ![
              'PENDING',
              'IN_PROCESS',
              'DONE',
              'IN_BORDER'
            ].includes(status as string)
          })}
        >
          {status === 'PENDING' ? (
            <span className='text-orange-700'>Kutilmoqda</span>
          ) : status === 'IN_PROCESS' ? (
            <span className='text-sky-700'>Jarayonda</span>
          ) : status === 'DONE' ? (
            <span className='text-emerald-700'>Tugallangan</span>
          ) : status === 'IN_BORDER' ? (
            <span className='text-red-700'>Chegarada</span>
          ) : (
            <span className='text-gray-700'>Noma&#39;lum</span>
          )}
        </span>
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'paymentStatus',
    header: "To'lov holati",
    cell: ({ row }) => {
      const paymentStatus = row.getValue('paymentStatus');

      return (
        <span
          className={cn('rounded-full px-3 py-1 text-sm font-medium', {
            'border border-rose-300 bg-rose-100 text-rose-800':
              paymentStatus === 'UNPAID',
            'border border-emerald-300 bg-emerald-100 text-emerald-800':
              paymentStatus === 'PAID',
            'border border-red-300 bg-red-100 text-red-800':
              paymentStatus === 'CANCELED',
            'border border-gray-300 bg-gray-100 text-gray-800':
              paymentStatus === 'UNKNOWN'
          })}
        >
          {paymentStatus === 'UNPAID' ? (
            <span className='text-orange-700'>To&#39;lanmagan</span>
          ) : paymentStatus === 'PAID' ? (
            <span className='text-emerald-700'>To&#39;langan</span>
          ) : paymentStatus === 'CANCELED' ? (
            <span className='text-red-700'>Bekor qilingan</span>
          ) : (
            <span className='text-gray-700'>Noma&#39;lum</span>
          )}
        </span>
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${date.getFullYear()}`;
      return <div>{formattedDate}</div>;
    },
    header: 'Yaratilgan vaqti'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
