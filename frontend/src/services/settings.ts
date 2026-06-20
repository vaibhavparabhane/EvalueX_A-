import { supabase } from './supabaseClient';

export const settingsService = {
  async updateProfile(userId: string, displayName: string, schoolName: string) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        full_name: displayName.trim() || null,
        school_name: schoolName.trim() || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
  },

  async updateEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) throw error;
    return true;
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return true;
  }
};
