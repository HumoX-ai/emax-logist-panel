/* eslint-disable import/no-unresolved */
'use client';
import { Users } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Users>[] = [
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
    accessorKey: 'uniqueId',
    header: 'Mijoz ID',
    enableSorting: true
  },
  {
    accessorKey: 'fullName',
    header: 'To‘liq ism',
    enableSorting: true
  },

  {
    accessorKey: 'phone',
    header: 'Telefon raqami',
    enableSorting: true
  },
  {
    accessorKey: 'gender',
    cell: ({ row }) => {
      const gender = row.getValue('gender');
      return <div>{gender === 'MALE' ? 'Erkak' : 'Ayol'}</div>;
    },
    header: 'Jinsi'
  },
  {
    accessorKey: 'birthday',
    cell: ({ row }) => {
      const date = new Date(row.getValue('birthday'));
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${date.getFullYear()}`;
      return <div>{formattedDate}</div>;
    },
    header: 'Tug‘ilgan sanasi'
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
