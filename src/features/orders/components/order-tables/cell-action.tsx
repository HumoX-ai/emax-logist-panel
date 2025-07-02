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
import { Orders, Users } from '@/constants/data';
import {
  useChangeOrderStatusMutation,
  useDeleteOrderMutation
} from '@/lib/api/ordersApi';
import { useDeleteUserMutation } from '@/lib/api/usersApi';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface CellActionProps {
  data: Orders;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, _setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [deleteUser] = useDeleteOrderMutation();
  const [changedStatus, { isLoading: isChangingStatus }] =
    useChangeOrderStatusMutation();

  const statusOptions = [
    { value: 'PENDING', label: 'Kutilmoqda' },
    { value: 'IN_WAREHOUSE', label: 'Omborda' },
    { value: 'IN_PROCESS', label: 'Jarayonda' },
    { value: 'IN_BORDER', label: 'Chegarada' },
    { value: 'IN_CUSTOMS', label: 'Bojxonada' },
    { value: 'DONE', label: 'Yakunlandi' }
  ];

  const [selectedStatus, setSelectedStatus] = useState<Orders['status']>(
    data.status
  );

  const handleStatusChange = async (value: Orders['status']) => {
    setSelectedStatus(value);
    try {
      await changedStatus({
        data: { orderId: data._id, status: value }
      }).unwrap();
      toast.success('Status muvaffaqiyatli yangilandi');
      router.refresh();
    } catch (error) {
      toast.error('Statusni yangilashda xatolik');
      setSelectedStatus(data.status); // rollback
    }
  };

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
      <div className='flex items-center gap-2'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isChangingStatus}
              >
                <SelectTrigger className='mb-1 flex w-full items-center justify-between shadow-none'>
                  <span>
                    {
                      statusOptions.find((o) => o.value === selectedStatus)
                        ?.label
                    }
                  </span>
                  {isChangingStatus && (
                    <span className='ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'></span>
                  )}
                </SelectTrigger>
                <SelectContent side='left'>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/orders/${data._id}`)}
            >
              <Edit className='mr-2 h-4 w-4' /> Yangilash
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className='mr-2 h-4 w-4' /> O&#39;chirish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
