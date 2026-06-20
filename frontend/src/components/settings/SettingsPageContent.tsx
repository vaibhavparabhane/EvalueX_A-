"use client";

import { Sidebar } from '@/components/layout/Sidebar';
import { PageLoader } from '@/components/common/PageLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Sun, Moon, Building2, Loader2, Check } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function SettingsPageContent() {
  const {
    user,
    loading,
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
    handleChangePassword
  } = useSettings();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        <div className="space-y-6">

          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your display name and organisation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Dr. Jane Smith"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School / Organisation</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="schoolName"
                      placeholder="Springfield High School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2">
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                      Current: <span className="font-medium text-foreground">{user?.email}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isGoogleUser ? (
                  <p className="text-sm text-muted-foreground">
                    Your email is managed by Google and cannot be changed here.
                  </p>
                ) : (
                  <form onSubmit={handleChangeEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        placeholder="newemail@school.edu"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        A confirmation link will be sent to your new address.
                      </p>
                    </div>
                    <Button type="submit" disabled={savingEmail} className="gap-2">
                      {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Update Email
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Password */}
          {!isGoogleUser && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Set a new password for your account</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />

                      {/* Password Requirements Checklist */}
                      <div className="mt-2 p-3 bg-muted/30 rounded-xl border border-border space-y-1 text-xs">
                        <p className="font-semibold text-muted-foreground mb-1.5">Password requirements:</p>
                        <div className="grid grid-cols-1 gap-1 text-left">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${newPassword.length >= 8 ? 'bg-emerald-500' : (newPassword.length === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-rose-400')}`} />
                            <span className={newPassword.length >= 8 ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-65 transition-all' : 'text-foreground/75 transition-all'}>
                              Minimum 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[A-Z]/.test(newPassword) ? 'bg-emerald-500' : (newPassword.length === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-rose-400')}`} />
                            <span className={/[A-Z]/.test(newPassword) ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-65 transition-all' : 'text-foreground/75 transition-all'}>
                              At least one uppercase letter (A-Z)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[a-z]/.test(newPassword) ? 'bg-emerald-500' : (newPassword.length === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-rose-400')}`} />
                            <span className={/[a-z]/.test(newPassword) ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-65 transition-all' : 'text-foreground/75 transition-all'}>
                              At least one lowercase letter (a-z)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[0-9]/.test(newPassword) ? 'bg-emerald-500' : (newPassword.length === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-rose-400')}`} />
                            <span className={/[0-9]/.test(newPassword) ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-65 transition-all' : 'text-foreground/75 transition-all'}>
                              At least one number (0-9)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-emerald-500' : (newPassword.length === 0 ? 'bg-slate-300 dark:bg-slate-700' : 'bg-rose-400')}`} />
                            <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 dark:text-emerald-400 line-through opacity-65 transition-all' : 'text-foreground/75 transition-all'}>
                              At least one special character
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                        <p className="text-xs font-medium text-red-500 text-left">
                          Passwords do not match
                        </p>
                      )}
                      {confirmPassword.length > 0 && newPassword === confirmPassword && (
                        <p className="text-xs font-medium flex items-center gap-1 text-emerald-500 text-left">
                          <Check className="h-3.5 w-3.5" /> Passwords match
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={
                        savingPassword || 
                        newPassword !== confirmPassword || 
                        newPassword.length < 8 || 
                        !/[A-Z]/.test(newPassword) || 
                        !/[a-z]/.test(newPassword) || 
                        !/[0-9]/.test(newPassword) || 
                        !/[^A-Za-z0-9]/.test(newPassword)
                      } 
                      className="gap-2"
                    >
                      {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Choose your preferred colour scheme</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-allLight ${
                      theme === 'light'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/40'
                    }`}
                  >
                    <div className="h-16 w-full rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <Sun className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      {theme === 'light' && <Check className="h-4 w-4 text-accent" />}
                      <span className="text-sm font-medium">Light</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-allDark ${
                      theme === 'dark'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/40'
                    }`}
                  >
                    <div className="h-16 w-full rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center shadow-sm">
                      <Moon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      {theme === 'dark' && <Check className="h-4 w-4 text-accent" />}
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
