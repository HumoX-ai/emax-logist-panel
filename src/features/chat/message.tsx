/* eslint-disable import/no-unresolved */
import { cn } from '@/lib/utils';
import type { Message } from './mockData';

interface MessageProps {
  message: Message;
}

export default function Message({ message }: MessageProps) {
  const isSent = message.type === 'sent';

  return (
    <div className={cn('mb-2 flex', isSent ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2 break-words md:max-w-[70%]',
          isSent
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        )}
      >
        <p>{message.text}</p>
        <div
          className={cn(
            'mt-1 flex justify-end text-xs',
            isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {message.time}
          {isSent && message.isRead && <span className='ml-1'>✓✓</span>}
          {isSent && !message.isRead && <span className='ml-1'>✓</span>}
        </div>
      </div>
    </div>
  );
}
