/* eslint-disable import/no-unresolved */
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Comment } from '@/lib/api/commentsApi';

export const columns: ColumnDef<Comment>[] = [
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
    accessorKey: 'user',
    header: 'Foydalanuvchi',
    cell: ({ row }) => {
      const user = row.getValue('user') as Record<string, any> & {
        fullName: string;
      };

      return <div>{user?.fullName || 'N/A'}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'orderNumber',
    header: 'Buyurtma raqami',
    enableSorting: true
  },
  {
    accessorKey: 'stars',
    header: 'Baho',
    enableSorting: true
  },
  {
    accessorKey: 'text',
    header: 'Kommentlar',
    cell: ({ row }) => {
      const text = row.getValue('text') as string;
      const truncatedText =
        text && text.length > 70 ? text?.substring(0, 70) + '...' : text;
      return <div>{truncatedText || 'N/A'}</div>;
    },
    enableSorting: true
  },
  {
    accessorKey: 'hasSelected',
    header: 'Tanlangan',
    cell: ({ row }) => {
      const hasSelected = row.getValue('hasSelected') as boolean;
      return <div>{hasSelected ? 'Ha' : "Yo'q"}</div>;
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
