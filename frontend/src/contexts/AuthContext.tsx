"use client";

import { useState, useEffect, createContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';
import { Profile } from '@/types/app.types';
import { authService } from '@/services/authService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, school_name')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data ?? null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if we are currently handling an OAuth redirect callback
    const hasHash = window.location.hash.includes('access_token=') || window.location.hash.includes('id_token=') || window.location.hash.includes('error=');
    const hasCode = window.location.search.includes('code=') || window.location.search.includes('error=');
    const isCallback = hasHash || hasCode;

    // Check for errors returned in the URL redirect (e.g., from Supabase database trigger errors)
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlError = searchParams.get('error') || hashParams.get('error');
    const urlErrorDesc = searchParams.get('error_description') || hashParams.get('error_description');
    
    if (urlError) {
      alert(`Authentication Error: ${urlError}\nDescription: ${urlErrorDesc || 'No details provided'}`);
      console.error("Supabase Auth Redirect Error:", urlError, urlErrorDesc);
    }

    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log("onAuthStateChange event:", event, "session:", session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          if (isMounted) setLoading(false);

          // If the user signed in from a callback flow or is on an auth page, redirect to dashboard
          // Exclude the reset-password page so users can actually update their password
          const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
          const isResetPasswordPage = window.location.pathname === '/reset-password';
          if ((isCallback && !isResetPasswordPage) || isAuthPage) {
            router.push('/dashboard');
          }

          // Fetch profile in the background so it doesn't block the redirect flow
          fetchProfile(session.user.id).catch(err => {
            console.error("Error fetching profile in background:", err);
          });
        } else {
          setProfile(null);
          // If we are in callback and this is the initial empty session,
          // do NOT set loading to false yet. Wait for the actual token exchange.
          if (!isCallback || event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        }
      }
    );

    // If we're not in an OAuth callback, check current session immediately
    if (!isCallback) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          if (isMounted) setLoading(false);
          // Fetch profile in the background
          fetchProfile(session.user.id).catch(err => {
            console.error("Error fetching profile in background:", err);
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      // If we are in callback, start a fallback timer to disable loading screen 
      // in case the callback exchange fails or hangs.
      const timer = setTimeout(() => {
        if (isMounted && loading) {
          console.warn('OAuth callback token exchange timed out.');
          setLoading(false);
        }
      }, 5000);

      return () => {
        isMounted = false;
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signUp = async (email: string, password: string, fullName: string) => {
    return await authService.signUp(email, password, fullName, window.location.origin);
  };

  const signIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle(window.location.origin);
  };

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Supabase signOut error, forcing client-side logout:", err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // Clear all Supabase client keys from localStorage to prevent state persistence issues
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, refreshProfile, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
