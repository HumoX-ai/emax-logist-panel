/* eslint-disable import/no-unresolved */
'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from './progress';

interface FileUploadProps {
  value?: string;
  onChange?: (key: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

interface UploadResponse {
  type: string;
  name: string;
  size: number;
  key: string;
  hash: string;
  url: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = '*/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className,
  placeholder = "Fayl tanlang yoki bu yerga sudrab qo'ying"
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        toast.error(
          `Fayl hajmi ${(maxSize / 1024 / 1024).toFixed(1)}MB dan katta bo'lmasligi kerak`
        );
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('type', '');

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(percentComplete);
          }
        });

        const uploadPromise = new Promise<UploadResponse[]>(
          (resolve, reject) => {
            xhr.addEventListener('load', () => {
              if (xhr.status === 200 || xhr.status === 201) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  resolve(response);
                } catch (error) {
                  reject(new Error('Invalid response format'));
                }
              } else {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
              }
            });

            xhr.addEventListener('error', () => {
              reject(new Error('Network error occurred'));
            });

            xhr.addEventListener('abort', () => {
              reject(new Error('Upload was aborted'));
            });

            xhr.open('POST', 'https://file.emaxb.uz/api/files/upload');
            xhr.send(formData);
          }
        );

        const response = await uploadPromise;

        if (response && response.length > 0) {
          const uploadedFile = response[0];
          onChange?.(uploadedFile.key);
          setFileName(uploadedFile.name);
          toast.success('Fayl muvaffaqiyatli yuklandi');
        } else {
          throw new Error('No file data received');
        }
      } catch (error: any) {
        toast.error(error.message || 'Fayl yuklashda xatolik yuz berdi');
        setFileName('');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [maxSize, onChange]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleRemove = useCallback(() => {
    setFileName('');
    onRemove?.();
  }, [onRemove]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileNameFromKey = (key: string) => {
    if (fileName) return fileName;
    const parts = key.split('/');
    const fullFileName = parts[parts.length - 1];
    // Remove timestamp prefix if exists (e.g., "1751174506984-Level 4 _ Cyber Security (1).pdf")
    const cleanFileName = fullFileName.replace(/^\d+-/, '');
    return cleanFileName;
  };

  const getFileUrl = (key: string) => {
    return `https://file.emaxb.uz/api/files?key=${encodeURIComponent(key)}`;
  };

  if (value) {
    return (
      <div
        className={cn(
          'bg-muted/50 flex items-center justify-between rounded-lg border p-3',
          className
        )}
      >
        <div className='flex items-center space-x-3'>
          <FileText className='h-5 w-5 text-blue-600' />
          <div className='min-w-0 flex-1'>
            <p className='text-foreground truncate text-sm font-medium'>
              {getFileNameFromKey(value)}
            </p>
            <p className='text-muted-foreground text-xs'>Yuklangan fayl</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => window.open(getFileUrl(value), '_blank')}
            className='text-blue-600 hover:text-blue-700'
          >
            Ko&apos;rish
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            disabled={disabled}
            className='text-red-600 hover:text-red-700'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25',
          disabled && 'cursor-not-allowed opacity-50',
          'hover:border-primary hover:bg-primary/5'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && document.getElementById('file-input')?.click()
        }
      >
        <input
          id='file-input'
          type='file'
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled}
          className='hidden'
        />

        {isUploading ? (
          <div className='space-y-3'>
            <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin' />
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Yuklanmoqda...</p>
              <p className='text-muted-foreground text-xs'>{fileName}</p>
              <Progress value={uploadProgress} className='mx-auto max-w-xs' />
              <p className='text-muted-foreground text-xs'>
                {Math.round(uploadProgress)}%
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <Upload className='text-muted-foreground mx-auto h-8 w-8' />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>{placeholder}</p>
              <p className='text-muted-foreground text-xs'>
                Maksimal hajm: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
