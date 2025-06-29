/* eslint-disable import/no-unresolved */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';

import {
  Payment,
  useAddPaymentMutation,
  useUpdatePaymentMutation
} from '@/lib/api/paymentApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import OrderSelect from './order-select';
import { Dispatch, SetStateAction, useEffect } from 'react';

const formSchema = z.object({
  orderId: z.string().min(1, {
    message: 'Buyurtma raqami kiritilishi shart'
  }),
  document: z.string().min(1, {
    message: 'Shartnoma faylini yuklang'
  }),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Soni kamida 1 ta bo'lishi kerak."
    })
  )
});

type UserFormProps = {
  initialData: Payment | null | undefined;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  paymentId: string;
};

export default function UserForm({
  initialData,
  isEditing,
  setIsEditing,
  paymentId
}: UserFormProps) {
  const route = useRouter();
  const [addPayment, { isLoading: isAdding }] = useAddPaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const isNewPayment = paymentId === 'new';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        orderId: initialData?.orderId || '',
        document: initialData?.document || '',
        amount: initialData?.amount || undefined
      });
    } else if (!isNewPayment && initialData) {
      form.reset({
        orderId: initialData.orderId,
        document: initialData.document,
        amount: initialData.amount
      });
    }
  }, [isEditing, initialData, form, isNewPayment]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isNewPayment) {
        await addPayment(values).unwrap();
        toast.success('Muvaffaqiyatli saqlandi');
        route.push('/dashboard/payments');
      } else if (initialData?._id) {
        await updatePayment({
          id: initialData._id,
          data: values
        }).unwrap();
        toast.success("Muvaffaqiyatli o'zgartirildi");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Xatolik yuz berdi', {
        style: { background: 'red', color: 'white' }
      });
    }
  }

  const pageTitle = isNewPayment
    ? "To'lov qo'shish"
    : isEditing
      ? `To'lovni tahrirlash`
      : `To'lov ma'lumotlari`;

  if (!isEditing && initialData) {
    return (
      <Card className='mx-auto w-full max-w-3xl'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-left text-2xl font-bold'>
              {pageTitle}
            </CardTitle>
            <Button onClick={() => setIsEditing(true)}>Tahrirlash</Button>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-6'>
            <div className='grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Buyurtma Raqami
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.orderNumber || initialData.orderId || 'N/A'}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Miqdori (so&#39;m)
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.amount?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>

            <div className='border-border border-t pt-6'>
              <div className='text-muted-foreground text-sm font-medium'>
                Hujjat fayli
              </div>
              <div className='mt-1 flex items-center space-x-2'>
                <p className='text-foreground text-base break-all'>
                  {initialData.document
                    ?.split('/')
                    .pop()
                    ?.replace(/^\d+-/, '') || 'N/A'}
                </p>
                {initialData.document && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      window.open(
                        `https://file.emaxb.uz/api/files?key=${encodeURIComponent(initialData.document!)}`,
                        '_blank'
                      )
                    }
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Ko&apos;rish
                  </Button>
                )}
              </div>
            </div>

            <div className='border-border grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-6 md:grid-cols-2'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Yaratilgan sana
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.createdAt
                    ? new Date(initialData.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Yangilangan sana
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.updatedAt
                    ? new Date(initialData.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='orderId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyurtma raqami</FormLabel>
                    <FormControl>
                      <OrderSelect name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miqdori</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='Miqdor' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='document'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Hujjat fayli</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange('')}
                        accept='application/pdf,image/*,.doc,.docx'
                        maxSize={10 * 1024 * 1024} // 10MB
                        placeholder='Hujjat faylini tanlang yoki sudrab qo&#39;ying'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end space-x-2 pt-4'>
              {!isNewPayment && isEditing && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                    if (initialData) {
                      form.reset({
                        orderId: initialData.orderId,
                        document: initialData.document,
                        amount: initialData.amount
                      });
                    }
                  }}
                  disabled={isUpdating || isAdding}
                >
                  Bekor qilish
                </Button>
              )}
              <Button type='submit' disabled={isUpdating || isAdding}>
                {isAdding || isUpdating
                  ? 'Yuklanmoqda...'
                  : isNewPayment
                    ? "Qo'shish"
                    : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
