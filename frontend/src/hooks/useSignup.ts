import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export function useSignup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, loading: authLoading, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      return;
    }
    const { data, error } = await signUp(email, password, fullName);
    console.log("Supabase signUp response:", { data, error });
    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
    } else if (data?.session) {
      toast({ title: 'Welcome to EvalueX!', description: 'Your account has been created and you have been logged in automatically.' });
      router.push('/dashboard');
    } else {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Google sign-in failed', description: error.message, variant: 'destructive' });
      setGoogleLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    googleLoading,
    authLoading,
    user,
    handleSubmit,
    handleGoogleSignIn,
    router
  };
}
