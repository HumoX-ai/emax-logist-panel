/* eslint-disable import/no-unresolved */
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetOrdersQuery } from '@/lib/api/ordersApi';

export function OrderSelect({ name, label }: { name: string; label: string }) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetOrdersQuery({
    offset: 0,
    limit: 10,
    orderNumber: debouncedSearch
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOrder = data?.orders?.find(
            (order: any) => order._id === field.value
          );

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className='w-full justify-between'
                  >
                    {selectedOrder ? selectedOrder.name : 'Buyurtma tanlang'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput
                    placeholder='Buyurtma raqamini kiriting...'
                    onValueChange={setSearch} // bu filtering emas, backendga yuborilyapti
                  />

                  {isLoading ? (
                    <CommandEmpty>Yuklanmoqda...</CommandEmpty>
                  ) : data?.orders?.length > 0 ? (
                    <CommandGroup>
                      {data.orders.map((order: any) => (
                        <CommandItem
                          key={order._id}
                          value={`${order.name} ${order.orderNumber}`} // bu yer muhim
                          onSelect={() => {
                            field.onChange(order._id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              order._id === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {order.name} ({order.orderNumber})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>Buyurtma topilmadi.</CommandEmpty>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      <FormMessage />
    </FormItem>
  );
}

export default OrderSelect;
