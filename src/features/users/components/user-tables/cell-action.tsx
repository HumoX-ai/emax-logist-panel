/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Users } from '@/constants/data';
import { useDeleteUserMutation } from '@/lib/api/usersApi';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
  data: Users;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, _setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteUser] = useDeleteUserMutation();

  const onConfirm = async () => {
    _setLoading(true);
    try {
      await deleteUser({ id: data._id }).unwrap();
      toast.success("Muvaffaqiyatli o'chirildi");
      router.refresh();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setOpen(false);
      _setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/users/${data._id}`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Yangilash
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> O&#39;chirish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
