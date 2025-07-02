/* eslint-disable import/no-unresolved */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation
} from '@/lib/api/chatApi';
import { useSocket } from '@/lib/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Loader2
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { uz } from 'date-fns/locale';

interface Chat {
  _id: string;
  userId: string;
  orderId: string;
  orderNumber: number;
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: string;
  user: {
    _id: string;
    fullName: string;
    phone: string;
  };
}

interface Message {
  _id: string;
  userId: string;
  orderId: string;
  chatId: string;
  orderNumber: number;
  sellerId: string;
  text: string;
  senderType: 'USER' | 'SELLER';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ModernChatInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatsPage, setChatsPage] = useState(0);
  const [messagesPage, setMessagesPage] = useState(0);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  const CHATS_LIMIT = 20;
  const MESSAGES_LIMIT = 50;

  // API queries
  const {
    data: chatsData,
    isLoading: chatsLoading,
    refetch: refetchChats
  } = useGetChatsQuery(
    {
      offset: chatsPage,
      limit: CHATS_LIMIT
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useGetMessagesQuery(
    {
      orderId: selectedChat?.orderId || '',
      offset: messagesPage,
      limit: MESSAGES_LIMIT
    },
    {
      skip: !selectedChat,
      refetchOnMountOrArgChange: true
    }
  );

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();

  // Update local chat list when new data arrives
  useEffect(() => {
    if (chatsData?.chats) {
      if (chatsPage === 0) {
        setAllChats(chatsData.chats);
      } else {
        setAllChats((prev) => [...prev, ...chatsData.chats]);
      }
    }
  }, [chatsData, chatsPage]);

  // Update local messages when new data arrives
  useEffect(() => {
    if (messagesData?.messages) {
      if (messagesPage === 0) {
        setAllMessages(messagesData.messages);
      } else {
        setAllMessages((prev) => [...messagesData.messages, ...prev]);
      }
    }
  }, [messagesData, messagesPage]);

  // Reset messages when chat changes
  useEffect(() => {
    if (selectedChat) {
      setMessagesPage(0);
      setAllMessages([]);
    }
  }, [selectedChat]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      // Update messages if this is the active chat
      if (selectedChat && message.chatId === selectedChat._id) {
        setAllMessages((prev) => [...prev, message]);
        refetchMessages();
      }
      // Update chat's lastMessage and updatedAt locally for instant sidebar update
      setAllChats((prevChats) => {
        return prevChats.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                lastMessage: message.text,
                updatedAt: message.createdAt
              }
            : chat
        );
      });
      // Always refetch chats to update last message from server as well
      refetchChats();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedChat, refetchMessages, refetchChats]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [allMessages]);

  // Filter chats based on search
  const filteredChats = allChats
    .filter(
      (chat) =>
        chat.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.orderNumber.toString().includes(searchQuery)
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    try {
      await sendMessage({
        chatId: selectedChat._id,
        text: newMessage.trim()
      }).unwrap();
      setNewMessage('');
    } catch (error) {
      // Error handling could be added here
    }
  };

  const handleLoadMoreChats = () => {
    if (chatsData && allChats.length < chatsData.totalCount) {
      setChatsPage((prev) => prev + CHATS_LIMIT);
    }
  };

  const handleLoadMoreMessages = () => {
    if (messagesData && allMessages.length < messagesData.totalCount) {
      setMessagesPage((prev) => prev + MESSAGES_LIMIT);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Kecha';
    } else {
      return format(date, 'dd.MM.yyyy');
    }
  };

  return (
    <div className='flex h-full max-h-screen overflow-hidden'>
      {/* Chat List Sidebar */}
      <div className='bg-background flex w-80 flex-col border-r'>
        {/* Header */}
        <div className='border-b p-4'>
          <h2 className='mb-3 text-xl font-semibold'>Chatlar</h2>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Chat qidirish...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
          {isConnected && (
            <div className='mt-2 flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-muted-foreground text-sm'>Ulangan</span>
            </div>
          )}
        </div>

        {/* Chat List */}
        <ScrollArea className='flex-1'>
          {chatsLoading && chatsPage === 0 ? (
            <div className='p-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='flex animate-pulse items-center space-x-3 p-3'
                >
                  <div className='bg-muted h-12 w-12 rounded-full'></div>
                  <div className='flex-1 space-y-2'>
                    <div className='bg-muted h-4 w-3/4 rounded'></div>
                    <div className='bg-muted h-3 w-1/2 rounded'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-1 p-2'>
              {filteredChats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`hover:bg-muted/50 w-full rounded-lg p-3 text-left transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-muted' : ''
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <Avatar>
                      <AvatarFallback>
                        {chat.user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between'>
                        <h3 className='truncate font-medium'>
                          {chat.user.fullName}
                        </h3>
                        <span className='text-muted-foreground text-xs'>
                          {formatTime(chat.updatedAt)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground max-w-[150px] truncate text-sm'>
                          {chat.lastMessage || ''}
                        </p>
                        <Badge variant='secondary' className='text-xs'>
                          #{chat.orderNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {chatsData && allChats.length < chatsData.totalCount && (
                <Button
                  variant='ghost'
                  className='mt-2 w-full'
                  onClick={handleLoadMoreChats}
                  disabled={chatsLoading}
                >
                  {chatsLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Yuklanmoqda...
                    </>
                  ) : (
                    'Ko&apos;proq yuklash'
                  )}
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Messages Area */}
      <div className='flex flex-1 flex-col'>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className='bg-background border-b p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <Avatar>
                    <AvatarFallback>
                      {selectedChat.user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium'>
                      {selectedChat.user.fullName}
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Buyurtma #{selectedChat.orderNumber} •{' '}
                      {selectedChat.user.phone}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <Button variant='ghost' size='icon'>
                    <Phone className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Video className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4'>
              {messagesLoading && messagesPage === 0 ? (
                <div className='space-y-4'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className='max-w-xs animate-pulse space-y-2'>
                        <div className='bg-muted h-4 w-full rounded'></div>
                        <div className='bg-muted h-4 w-3/4 rounded'></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='space-y-4'>
                  {messagesData &&
                    allMessages.length < messagesData.totalCount && (
                      <Button
                        variant='ghost'
                        className='w-full'
                        onClick={handleLoadMoreMessages}
                        disabled={messagesLoading}
                      >
                        {messagesLoading && (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Yuklanmoqda...
                          </>
                        )}
                      </Button>
                    )}

                  {allMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderType === 'SELLER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                          message.senderType === 'SELLER'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className='text-sm'>{message.text}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.senderType === 'SELLER'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className='border-t p-4'>
              <form onSubmit={handleSendMessage} className='flex space-x-2'>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder='Xabar yozing...'
                  disabled={sendingMessage}
                  className='flex-1'
                />
                <Button
                  type='submit'
                  disabled={sendingMessage || !newMessage.trim()}
                >
                  {sendingMessage ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Send className='h-4 w-4' />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center'>
              <h3 className='text-muted-foreground mb-2 text-lg font-medium'>
                Chat tanlang
              </h3>
              <p className='text-muted-foreground text-sm'>
                Suhbatni boshlash uchun chap tomondagi ro&apos;yxatdan chat
                tanlang
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
