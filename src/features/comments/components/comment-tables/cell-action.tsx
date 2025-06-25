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
import {
  Comment,
  useAddCommentMutation,
  useDeleteCommentMutation
} from '@/lib/api/commentsApi';
import { CheckCircle2, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
  data: Comment;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();
  const [addCommentAsSelected, { isLoading: isAdding }] =
    useAddCommentMutation();

  const onAddCommentAsSelected = async () => {
    try {
      await addCommentAsSelected({
        id: data._id
      }).unwrap();
      toast.success(
        data ? 'Muvaffaqiyatli tanlandi' : 'Muvaffaqiyatli tanlanmadi'
      );
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setOpen(false);
    }
  };

  const onConfirm = async () => {
    try {
      await deleteComment(data._id).unwrap();
      toast.success("Muvaffaqiyatli o'chirildi");
      router.refresh();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isLoading}
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

          {!data.hasSelected && (
            <DropdownMenuItem onClick={() => onAddCommentAsSelected()}>
              <CheckCircle2 className='mr-2 h-4 w-4' /> Asosiyga qo&#39;shish
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/comments/${data._id}`)}
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
