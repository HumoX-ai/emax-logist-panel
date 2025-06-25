/* eslint-disable react/no-unescaped-entities */
/* eslint-disable import/no-unresolved */
'use client';

import { useEffect } from 'react';
import {
  useGetUserInfoQuery,
  useUpdateProfileMutation
} from '@/lib/api/profileApi';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Ism kiritilishi shart').max(100),
  phone: z
    .string()
    .min(1, 'Telefon kiritilishi shart')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Yaroqli telefon kiriting'),
  about: z.string().min(1, "Profil ma'lumotlari kiritilishi shart").max(500),
  photo: z
    .string()
    .url({ message: 'Yaroqli URL kiriting' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, 'Parol 8 belgidan kam bo‘lmasligi kerak')
    .optional()
    .or(z.literal(''))
});

export function ProfileForm() {
  const { data: userInfo, isLoading, error } = useGetUserInfoQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      about: '',
      photo: '',
      password: ''
    }
  });

  useEffect(() => {
    if (userInfo?.data) {
      form.reset({
        fullName: userInfo.data.fullName || '',
        phone: userInfo.data.phone || '',
        about: userInfo.data.about || '',
        photo: userInfo.data.photo || '',
        password: ''
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!userInfo?.data?._id) return toast.error('Foydalanuvchi ID topilmadi');

    try {
      const filteredData = {
        fullName: data.fullName,
        phone: data.phone,
        about: data.about, // about is required in UserData interface
        ...(data.photo ? { photo: data.photo } : {}),
        ...(data.password ? { password: data.password } : {})
      };

      await updateProfile({
        id: userInfo.data._id,
        data: filteredData
      }).unwrap();
      toast.success('Profil yangilandi');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Yangilashda xatolik');
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin' />{' '}
        <span className='ml-2'>Yuklanmoqda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-500'>Xatolik yuz berdi</p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => window.location.reload()}
        >
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Ma'lumotlarni yangilang</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                name='fullName'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='min-w-[250px]'>
                    <FormLabel>Ism va familiya</FormLabel>
                    <FormControl>
                      <Input placeholder='Ismingiz' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='phone'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder='+998901234567' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='photo'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rasm URL (ixtiyoriy)</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yangi parol (ixtiyoriy)</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Parol' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='about'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profil haqida</FormLabel>
                    <FormControl>
                      <Textarea
                        className='resize-none'
                        rows={4}
                        placeholder='Profil haqida'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
              disabled={isUpdating}
            >
              Bekor
            </Button>
            <Button
              type='submit'
              disabled={isUpdating || !form.formState.isDirty}
            >
              {isUpdating ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : null}
              Saqlash
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
