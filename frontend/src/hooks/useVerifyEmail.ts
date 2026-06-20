import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { useToast } from '@/hooks/useToast';

export function useVerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // Extract email from query parameters (passed from Signup)
  const email = searchParams.get('email') || '';

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setResending(false);

    if (error) {
      toast({ title: 'Failed to resend', description: error.message, variant: 'destructive' });
    } else {
      setResent(true);
      toast({ title: 'Email resent!', description: `A new link was sent to ${email}.` });
      setTimeout(() => setResent(false), 30000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    email,
    resending,
    resent,
    handleResend,
    handleLogout,
    router
  };
}
