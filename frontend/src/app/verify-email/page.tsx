"use client";

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { VerifyEmailContent } from '@/components/auth/VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
