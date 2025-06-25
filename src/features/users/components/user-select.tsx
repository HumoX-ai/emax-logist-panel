/* eslint-disable react-hooks/rules-of-hooks */
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
import { useGetUsersQuery } from '@/lib/api/usersApi';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useDebounce } from '@/hooks/use-debounce';

export function UserSelect({ name, label }: { name: string; label: string }) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetUsersQuery({
    offset: 0,
    limit: 10,
    searchText: debouncedSearch
  });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedUser = data?.users?.find(
            (user: any) => user._id === field.value
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
                    {selectedUser
                      ? `${selectedUser.fullName} (${selectedUser.phone})`
                      : 'Foydalanuvchi tanlang'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput
                    placeholder='Ism kiriting...'
                    onValueChange={setSearch} // bu filtering emas, backendga yuborilyapti
                  />

                  {isLoading ? (
                    <CommandEmpty>Yuklanmoqda...</CommandEmpty>
                  ) : data?.users?.length > 0 ? (
                    <CommandGroup>
                      {data.users.map((user: any) => (
                        <CommandItem
                          key={user._id}
                          value={`${user.fullName} ${user.phone}`} // bu yer muhim
                          onSelect={() => {
                            field.onChange(user._id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              user._id === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {user.fullName} ({user.phone})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>Foydalanuvchi topilmadi.</CommandEmpty>
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

export default UserSelect;
