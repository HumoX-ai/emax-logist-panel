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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User } from '@/constants/mock-api';
import { useAddUserMutation, useUpdateUserMutation } from '@/lib/api/usersApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak."
  }),
  uniqueId: z.string().min(2, {
    message: "Unique ID kamida 2 ta belgidan iborat bo'lishi kerak."
  }),
  phone: z
    .string()
    .min(9, {
      message: "Telefon raqam kamida 9 ta belgidan iborat bo'lishi kerak."
    })
    .max(13, {
      message: "Telefon raqam kamida 13 ta belgidan iborat bo'lishi kerak."
    }),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Jinsni tanlang' })
  }),
  birthday: z.string().min(1, {
    message: "Tug'ilgan sanani tanlang"
  })
});

export default function UserForm({
  initialData,
  pageTitle
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const route = useRouter();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const defaultValues = {
    fullName: initialData?.fullName || '',
    uniqueId: initialData?.uniqueId || '',
    phone: initialData?.phone || '',
    gender: (initialData?.gender as 'MALE' | 'FEMALE') || undefined,
    birthday: initialData?.birthday
      ? new Date(initialData.birthday).toISOString().split('T')[0]
      : ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (pageTitle === "Mijozni qo'shish") {
        await addUser({
          ...values,
          birthday: new Date(values.birthday).toISOString()
        }).unwrap();
        toast.success('Muvaffaqiyatli saqlandi');
        route.push('/dashboard/users');
        return;
      }
      await updateUser({
        id: initialData?._id || 0,
        data: values
      }).unwrap();
      toast.success("Muvaffaqiyatli o'zgartirildi");
      route.push('/dashboard/users');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Xatolik yuz berdi', {
        style: {
          background: 'red',
          color: 'white'
        }
      });
    }
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
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism Familiya</FormLabel>
                    <FormControl>
                      <Input placeholder='Ism Familiya' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='uniqueId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mijoz ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Mijoz ID' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon raqam</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='Telefon raqam'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jins</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Tanlang' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='MALE'>Erkak</SelectItem>
                        <SelectItem value='FEMALE'>Ayol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tug‘ilgan sanasi</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        placeholder='Tug‘ilgan sanasi'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='text-right'>
              <Button type='submit' disabled={isUpdating || isAdding}>
                {isUpdating || isAdding ? 'Yuklanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
