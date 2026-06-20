import { useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useToast } from '@/hooks/useToast';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Failed to send reset link',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSent(true);
    }
  };

  return {
    email,
    setEmail,
    loading,
    sent,
    setSent,
    handleSubmit
  };
}
