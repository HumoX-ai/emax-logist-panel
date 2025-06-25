/* eslint-disable import/no-unresolved */
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
// import GithubSignInButton from './github-auth-button';

const formSchema = z.object({
  phone: z.string().nonempty('Telefon raqamni kiriting!'),
  password: z.string().nonempty('Parolni kiritish majburiy!')
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      const result = await signIn('credentials', {
        phone: data.phone, // "email" o‘rniga "phone" sifatida ishlatiladi
        password: data.password,
        redirect: false, // Sahifa qayta yuklanmasligi uchun
        callbackUrl: callbackUrl ?? '/dashboard'
      });

      if (result?.error) {
        toast.error('Login xatosi: Telefon yoki parol noto‘g‘ri');
      } else {
        toast.success('Muvaffaqiyatli kirish!');
        window.location.href = callbackUrl ?? '/dashboard'; // Qo‘lda yo‘naltirish
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col space-y-2'
        >
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Telefon raqamingizni kiriting...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Parol</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Parolni kiriting...'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className='mt-3 ml-auto w-full'
            type='submit'
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        {/* <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with
          </span>
        </div> */}
      </div>
      {/* <GithubSignInButton /> */}
    </>
  );
}
