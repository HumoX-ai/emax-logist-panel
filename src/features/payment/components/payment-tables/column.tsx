/* eslint-disable import/no-unresolved */
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Payment } from '@/lib/api/paymentApi';
import { formatAmount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// import { CellAction } from './cell-action';

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: 'order',
    cell: ({ row }) => {
      const order = row.getValue('order') as Record<string, any>;
      return <div>{order.orderNumber || 'N/A'}</div>;
    },
    header: 'Buyurtma raqami',
    enableSorting: true
  },
  {
    accessorKey: 'user',
    header: "To'lovchi",
    cell: ({ row }) => {
      const user = row.getValue('user') as Record<string, any> & {
        fullName: string;
      };

      return <div>{user.fullName || 'N/A'}</div>;
    },
    enableSorting: true
  },

  {
    accessorKey: 'order.name',
    cell: ({ row }) => {
      const order = row.getValue('order') as Record<string, any>;
      return <div>{order.name || 'N/A'}</div>;
    },
    header: 'Buyurtma nomi',
    enableSorting: true
  },
  {
    accessorKey: 'amount',
    header: 'Miqdori',
    cell: ({ row }) => {
      return <div>{formatAmount(row.getValue('amount'))} so&#39;m</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'document',
    header: 'Hujjat fayli',
    cell: ({ row }) => {
      const document = row.getValue('document') as string;
      if (!document) return <div>N/A</div>;

      const fileName =
        document.split('/').pop()?.replace(/^\d+-/, '') || 'Fayl';

      return (
        <div className='flex items-center space-x-2'>
          <span className='max-w-32 truncate text-sm'>{fileName}</span>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() =>
              window.open(
                `https://file.emaxb.uz/api/files?key=${encodeURIComponent(document)}`,
                '_blank'
              )
            }
            className='h-auto p-1 text-blue-600 hover:text-blue-700'
          >
            Ko&apos;rish
          </Button>
        </div>
      );
    },
    enableSorting: false
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
