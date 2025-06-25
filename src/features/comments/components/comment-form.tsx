/* eslint-disable import/no-unresolved */
'use client';
// import { FileUploader } from '@/components/file-uploader';
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Comment, useUpdateCommentMutation } from '@/lib/api/commentsApi';
import { Textarea } from '@/components/ui/textarea';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  stars: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsedVal = parseInt(val, 10);
      return isNaN(parsedVal) ? undefined : parsedVal;
    }
    return val;
  }, z.number().min(1).max(5).optional()),
  text: z.string().min(1).max(500),
  hasSelected: z.boolean().optional()
});

type UserFormProps = {
  initialData: Comment | null | undefined;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  commentId: string;
};

export default function UserForm({
  initialData,
  isEditing,
  setIsEditing,
  commentId
}: UserFormProps) {
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();

  const isNewComment = commentId === 'new';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    if (isEditing) {
      form.reset({
        stars: initialData?.stars,
        text: initialData?.text || '',
        hasSelected: initialData?.hasSelected || false
      });
    } else if (!isNewComment && initialData) {
      form.reset({
        stars: initialData.stars,
        text: initialData.text,
        hasSelected: initialData.hasSelected
      });
    }
  }, [isEditing, initialData, form, isNewComment]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const submissionValues: any = { ...values };
    if (submissionValues.stars === undefined && initialData?.stars) {
      submissionValues.stars = initialData.stars;
    }

    try {
      if (isNewComment) {
        toast.info(
          "Yangi komment qo'shish funksiyasi hali implement qilinmagan."
        );
      } else if (initialData?._id) {
        await updateComment({
          id: initialData._id,
          data: submissionValues
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

  const pageTitle = isNewComment
    ? "Komment qo'shish"
    : isEditing
      ? `Kommentni tahrirlash`
      : `Komment ma\'lumotlari`;

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
                  Foydalanuvchi
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.user?.fullName || 'N/A'} ({initialData.userId})
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Buyurtma Raqami
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.orderNumber || 'N/A'} ({initialData.orderId})
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Yulduzlar
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.stars || 'N/A'}
                </p>
              </div>
              <div>
                <div className='text-muted-foreground text-sm font-medium'>
                  Tanlanganmi?
                </div>
                <p className='text-foreground mt-1 text-base'>
                  {initialData.hasSelected ? 'Ha' : "Yo'q"}
                </p>
              </div>
            </div>

            <div className='border-border border-t pt-6'>
              <div className='text-muted-foreground text-sm font-medium'>
                Matn
              </div>
              <p className='text-foreground mt-1 text-base whitespace-pre-wrap'>
                {initialData.text || 'N/A'}
              </p>
            </div>

            <div className='border-border grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-6 md:grid-cols-2'>
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
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='stars'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yulduzlar (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={5}
                        placeholder='Yulduzlar'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseInt(e.target.value, 10) || undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='hasSelected'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Tanlangan Komment
                      </FormLabel>
                      <p className='text-muted-foreground text-sm'>
                        Bu kommentni asosiy ro&#39;yxatda ko&#39;rsatish.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='text'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matn</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      rows={4}
                      placeholder='Komment matni...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2 pt-4'>
              {!isNewComment && isEditing && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                    if (initialData) {
                      form.reset({
                        stars: initialData.stars,
                        text: initialData.text,
                        hasSelected: initialData.hasSelected
                      });
                    }
                  }}
                  disabled={isUpdating}
                >
                  Bekor qilish
                </Button>
              )}
              <Button type='submit' disabled={isUpdating}>
                {isUpdating
                  ? 'Yuklanmoqda...'
                  : isNewComment
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
