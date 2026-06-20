import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { settingsService } from '@/services/settings';
import { toast } from 'sonner';

export function useSettings() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Profile section
  const [displayName, setDisplayName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Email section
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Password section
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const isGoogleUser = user?.app_metadata?.provider === 'google';

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.full_name ?? '');
      setSchoolName(profile.school_name ?? '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await settingsService.updateProfile(user.id, displayName, schoolName);
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSavingEmail(true);
    try {
      await settingsService.updateEmail(newEmail);
      toast.success('Confirmation sent to your new email address. Please check your inbox.');
      setNewEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update email');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (newPassword.length < 8 || !hasUpper || !hasLower || !hasNum || !hasSpecial) {
      toast.error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await settingsService.updatePassword(newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return {
    user,
    loading: authLoading,
    profile,
    theme,
    setTheme,
    displayName,
    setDisplayName,
    schoolName,
    setSchoolName,
    savingProfile,
    newEmail,
    setNewEmail,
    savingEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    savingPassword,
    isGoogleUser,
    handleSaveProfile,
    handleChangeEmail,
    handleChangePassword,
    router
  };
}
