import { supabase } from './supabaseClient';

export const authService = {
  async signUp(email: string, password: string, fullName: string, origin: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: origin,
        data: { full_name: fullName },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  async signInWithGoogle(origin: string) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/dashboard` },
    });
    return { error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
};
