import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { useToast } from '@/hooks/useToast';

export function useResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Supabase sends the recovery token in the URL hash.
  // onAuthStateChange fires with event 'PASSWORD_RECOVERY' once the token is parsed.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < 8 || !hasUpper || !hasLower || !hasNum || !hasSpecial) {
      toast({ 
        title: 'Weak password', 
        description: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special characters.', 
        variant: 'destructive' 
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure both passwords are the same.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      toast({ title: 'Reset failed', description: error.message, variant: 'destructive' });
    } else {
      // Clear the session so they must log in with their new password
      await supabase.auth.signOut();
      setLoading(false);
      setDone(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  // Password strength checker
  const getStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) return { label: '', color: 'transparent', width: '0%' };
    if (pwd.length < 8) return { label: 'Too short', color: 'hsl(0,84%,60%)', width: '20%' };
    if (pwd.length < 10) return { label: 'Weak', color: 'hsl(38,92%,50%)', width: '40%' };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score === 0) return { label: 'Fair', color: 'hsl(38,92%,50%)', width: '50%' };
    if (score === 1) return { label: 'Good', color: 'hsl(173,58%,39%)', width: '70%' };
    return { label: 'Strong', color: 'hsl(142,71%,45%)', width: '100%' };
  };

  const strength = getStrength(password);

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    loading,
    done,
    sessionReady,
    handleSubmit,
    strength,
    router
  };
}
