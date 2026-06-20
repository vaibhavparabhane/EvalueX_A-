"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/common/alert-dialog";
import { Loader2 } from 'lucide-react';
import { buttonVariants } from '@/components/common/button';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  trigger: React.ReactNode;
  variant?: 'destructive' | 'default' | 'primary';
}

export function ConfirmDialog({
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Delete",
  onConfirm,
  isLoading = false,
  trigger,
  variant = "destructive",
}: ConfirmDialogProps) {
  
  const getActionClass = () => {
    if (variant === 'destructive') {
      return cn(
        buttonVariants({ variant: 'destructive' }),
        "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      );
    }
    if (variant === 'primary') {
      return cn(
        buttonVariants({ variant: 'default' }),
        "bg-primary text-primary-foreground hover:bg-primary/90"
      );
    }
    return buttonVariants({ variant: 'default' });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={getActionClass()}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
