/* eslint-disable react/no-unescaped-entities */
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
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';

import { Orders } from '@/constants/data';
import UserSelect from '@/features/users/components/user-select';
import {
  useAddOrderMutation,
  useUpdateOrderMutation
} from '@/lib/api/ordersApi';
import { formatPrice } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm, Controller, Control } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Base schema for fields common to new and edit
const formSchemaBase = z.object({
  name: z.string().min(2, {
    message: "Nom kamida 2 ta belgidan iborat bo'lishi kerak."
  }),
  weight: z.preprocess(
    (val) => {
      const sVal = String(val).trim();
      return sVal === '' ? undefined : Number(sVal); // Return undefined for empty for Zod to catch min(1)
    },
    z
      .number({
        invalid_type_error: "Og'irlik raqam bo'lishi kerak."
      })
      .min(0.01, {
        message: "Og'irlik kamida 0.01 kg bo'lishi kerak."
      })
  ),
  description: z.string().min(2, {
    message: "Ta'rif kamida 2 ta belgidan iborat bo'lishi kerak."
  }),
  price: z.preprocess(
    (val) => {
      const sVal = String(val).trim();
      return sVal === '' ? undefined : Number(sVal);
    },
    z
      .number({
        invalid_type_error: "Narx raqam bo'lishi kerak."
      })
      .min(1, {
        message: "Narx kamida 1 so'm bo'lishi kerak."
      })
  ),
  contractFile: z.string().min(1, {
    message: 'Shartnoma faylini kiriting yoki tanlang.'
  }),
  photo: z.string().optional() // photo yuklash optional
});

// Schema for creating a new order (includes userId)
const formSchemaNewOrder = formSchemaBase.extend({
  userId: z.string().min(1, {
    message: 'Foydalanuvchi tanlang'
  })
});

// Schema for editing an existing order (userId is not part of the editable form)
const formSchemaEditOrder = formSchemaBase;

type UserFormProps = {
  initialData: Orders | null;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  orderId: string;
};

export default function UserForm({
  initialData,
  isEditing,
  setIsEditing,
  orderId
}: UserFormProps) {
  const route = useRouter();
  const [addOrder, { isLoading: isAdding }] = useAddOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const isNewOrder = orderId === 'new';

  const currentSchema = isNewOrder ? formSchemaNewOrder : formSchemaEditOrder;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema)
  });

  useEffect(() => {
    if (isEditing) {
      const defaultValues: any = {
        name: initialData?.name || '',
        description: initialData?.description || '',
        weight:
          initialData?.weight === 0 ? '0' : initialData?.weight || undefined,
        price: initialData?.price === 0 ? '0' : initialData?.price || undefined,
        contractFile: initialData?.contractFile || '',
        photo: initialData?.photo || ''
      };
      if (isNewOrder) {
        defaultValues.userId = initialData?.userId || '';
      }
      form.reset(defaultValues as z.infer<typeof currentSchema>);
    } else if (!isNewOrder && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        weight: initialData.weight,
        price: initialData.price,
        contractFile: initialData.contractFile,
        photo: initialData.photo || ''
      } as z.infer<typeof formSchemaEditOrder>);
    }
  }, [isEditing, initialData, form, isNewOrder, currentSchema]);

  async function onSubmit(values: z.infer<typeof currentSchema>) {
    try {
      if (isNewOrder) {
        await addOrder(values as z.infer<typeof formSchemaNewOrder>).unwrap();
        toast.success('Muvaffaqiyatli saqlandi');
        route.push('/dashboard/orders');
      } else if (initialData?._id) {
        await updateOrder({
          id: initialData._id,
          data: values as z.infer<typeof formSchemaEditOrder>
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

  const pageTitle = isNewOrder
    ? "Buyurtma qo'shish"
    : isEditing
      ? `Buyurtmani tahrirlash`
      : `Buyurtma ma'lumotlari`;

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
            <div className='grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Buyurtma raqami
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.orderNumber || 'N/A'}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Buyurtma nomi
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.name}
                </p>
              </div>
              {initialData.user && (
                <>
                  <div>
                    <div className='text-muted-foreground text-sm font-medium'>
                      Foydalanuvchi F.I.O
                    </div>
                    <p className='text-foreground mt-1 text-base'>
                      {initialData.user.fullName}
                    </p>
                  </div>
                  <div>
                    <div className='text-muted-foreground text-sm font-medium'>
                      Foydalanuvchi telefoni
                    </div>
                    <p className='text-foreground mt-1 text-base'>
                      {initialData.user.phone}
                    </p>
                  </div>
                  <div>
                    <div className='text-muted-foreground text-sm font-medium'>
                      Foydalanuvchi jinsi
                    </div>
                    <p className='text-foreground mt-1 text-base'>
                      {initialData.user.gender}
                    </p>
                  </div>
                  <div>
                    <div className='text-muted-foreground text-sm font-medium'>
                      Tug'ilgan sana
                    </div>
                    <p className='text-foreground mt-1 text-base'>
                      {initialData.user.birthday
                        ? new Date(
                            initialData.user.birthday
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </>
              )}
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Og'irligi (kg)
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.weight}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Narxi (so'm)
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {formatPrice(initialData.price)}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  To'langan summa (so'm)
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {formatPrice(initialData.paidAmount)}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Status
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.status}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  To'lov statusi
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.paymentStatus}
                </p>
              </div>
            </div>

            <div className='border-border border-t pt-3'>
              <div className='text-muted-foreground text-sm font-medium'>
                Shartnoma fayli
              </div>
              <div className='mt-1 flex items-center space-x-2'>
                <p className='text-foreground text-base break-all'>
                  {initialData.contractFile
                    ?.split('/')
                    .pop()
                    ?.replace(/^\d+-/, '') || 'N/A'}
                </p>
                {initialData.contractFile && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      window.open(
                        `https://file.emaxb.uz/api/files?key=${encodeURIComponent(initialData.contractFile)}`,
                        '_blank'
                      )
                    }
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Ko'rish
                  </Button>
                )}
              </div>
            </div>

            {initialData.photo && (
              <div className='border-border border-t pt-3'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Rasm
                </div>
                <div className='mt-1 flex items-center space-x-2'>
                  <p className='text-foreground text-base break-all'>
                    {initialData.photo
                      ?.split('/')
                      .pop()
                      ?.replace(/^\d+-/, '') || 'N/A'}
                  </p>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      window.open(
                        `https://file.emaxb.uz/api/files?key=${encodeURIComponent(initialData.photo!)}`,
                        '_blank'
                      )
                    }
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Ko'rish
                  </Button>
                </div>
              </div>
            )}

            <div className='border-border border-t pt-3'>
              <div className='text-muted-foreground text-sm font-medium'>
                Ta'rif
              </div>
              <p className='text-foreground mt-1 text-base whitespace-pre-wrap'>
                {initialData.description}
              </p>
            </div>

            <div className='border-border grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-3 md:grid-cols-2'>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Yaratilgan sana
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.createdAt
                    ? new Date(initialData.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Yangilangan sana
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.updatedAt
                    ? new Date(initialData.updatedAt).toLocaleString()
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
            <div className='grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyurtma nomi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masalan: Yuk tashish xizmati'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isNewOrder && (
                <Controller
                  control={
                    form.control as unknown as Control<
                      z.infer<typeof formSchemaNewOrder>
                    >
                  }
                  name='userId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foydalanuvchi</FormLabel>
                      <FormControl>
                        <UserSelect name={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Og&#39;irligi (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='Masalan: 10.5'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narxi (so&#39;m)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Masalan: 50000'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='w-full md:col-span-2'>
                <FormField
                  control={form.control}
                  name='contractFile'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shartnoma fayli</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => field.onChange('')}
                          accept='application/pdf,image/*,.doc,.docx'
                          maxSize={10 * 1024 * 1024} // 10MB
                          placeholder='Shartnoma faylini tanlang yoki sudrab qo&#39;ying'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='w-full md:col-span-2'>
                <FormField
                  control={form.control}
                  name='photo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rasm (ixtiyoriy)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => field.onChange('')}
                          accept='image/*'
                          maxSize={10 * 1024 * 1024} // 10MB
                          placeholder='Rasmni tanlang yoki sudrab qo&#39;ying (ixtiyoriy)'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Ta&#39;rif</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Buyurtma haqida batafsil ma`lumot yozing...'
                        className='!resize-none'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end space-x-2 pt-4'>
              {!isNewOrder && isEditing && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  disabled={isUpdating || isAdding}
                >
                  Bekor qilish
                </Button>
              )}
              <Button type='submit' disabled={isUpdating || isAdding}>
                {isAdding || isUpdating
                  ? 'Yuklanmoqda...'
                  : isNewOrder
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
