"use client";

import Link from 'next/link';
import { Input } from '@/components/common/input';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import { AuthLogo } from '@/components/layout/AuthLogo';
import { useResetPassword } from '@/hooks/useResetPassword';

export function ResetPasswordContent() {
  const {
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
    strength
  } = useResetPassword();

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Sleek animated ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Reusable Logo */}
      <AuthLogo />

      <div className="relative z-10 w-full max-w-[440px] space-y-7 bg-slate-950/40 border border-slate-900 backdrop-blur-xl p-8 md:p-10 rounded-[32px] shadow-2xl">
        {/* Glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-[32px] blur-xl opacity-30 pointer-events-none" />

        {/* Done success page */}
        {done ? (
          /* ── Success State ── */
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-[0_8px_30px_rgba(16,185,129,0.25)]">
                <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Password updated!
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                All done!
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed text-center">
                Your password has been reset successfully. Redirecting you to sign in...
              </p>
            </div>
            <div className="flex justify-center">
              <div className="h-1.5 w-48 rounded-full overflow-hidden bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                  style={{
                    animation: 'progress-fill 3s linear forwards',
                    width: '0%',
                  }}
                />
              </div>
            </div>
            <style>{`@keyframes progress-fill { from { width: 0% } to { width: 100% } }`}</style>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
              Sign in now →
            </Link>
          </div>

        ) : !sessionReady ? (
          /* ── Waiting for recovery session ── */
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-[0_8px_30px_rgba(99,102,241,0.25)] animate-pulse">
                <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
                  <ShieldCheck className="h-10 w-10 text-indigo-400" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Verifying your link...
              </h2>
              <p className="text-sm text-slate-400 text-center">
                Please wait while we verify your password reset link.
              </p>
              <div className="flex justify-center pt-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              If this takes too long,{' '}
              <Link href="/forgot-password" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
                request a new reset link
              </Link>.
            </p>
          </div>

        ) : (
          /* ── Reset Form ── */
          <>
            {/* Heading */}
            <div className="space-y-2 text-left">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-[0_8px_30px_rgba(99,102,241,0.25)] flex items-center justify-center mb-4">
                <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
                  <Lock className="h-7 w-7 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Set new password
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose a strong password for your EvalueX account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2 text-left">
                <label htmlFor="new-password" className="block text-sm font-semibold text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl text-sm font-medium border-slate-800 bg-slate-950/60 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="h-1 w-full rounded-full overflow-hidden bg-slate-900">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: strength.width, background: strength.color }}
                      />
                    </div>
                    <p className="text-xs font-medium text-left" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}

                {/* Password Requirements Checklist */}
                <div className="mt-2.5 p-3.5 bg-slate-950/40 rounded-xl border border-slate-900 space-y-1 text-xs">
                  <p className="font-semibold text-slate-500 mb-1.5">Password requirements:</p>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${password.length >= 8 ? 'bg-emerald-500 animate-pulse' : (password.length === 0 ? 'bg-slate-700' : 'bg-rose-500')}`} />
                      <span className={password.length >= 8 ? 'text-emerald-400/70 line-through transition-all' : 'text-slate-400 transition-all'}>
                        Minimum 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[A-Z]/.test(password) ? 'bg-emerald-500 animate-pulse' : (password.length === 0 ? 'bg-slate-700' : 'bg-rose-500')}`} />
                      <span className={/[A-Z]/.test(password) ? 'text-emerald-400/70 line-through transition-all' : 'text-slate-400 transition-all'}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[a-z]/.test(password) ? 'bg-emerald-500 animate-pulse' : (password.length === 0 ? 'bg-slate-700' : 'bg-rose-500')}`} />
                      <span className={/[a-z]/.test(password) ? 'text-emerald-400/70 line-through transition-all' : 'text-slate-400 transition-all'}>
                        At least one lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[0-9]/.test(password) ? 'bg-emerald-500 animate-pulse' : (password.length === 0 ? 'bg-slate-700' : 'bg-rose-500')}`} />
                      <span className={/[0-9]/.test(password) ? 'text-emerald-400/70 line-through transition-all' : 'text-slate-400 transition-all'}>
                        At least one number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${/[^A-Za-z0-9]/.test(password) ? 'bg-emerald-500 animate-pulse' : (password.length === 0 ? 'bg-slate-700' : 'bg-rose-500')}`} />
                      <span className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-400/70 line-through transition-all' : 'text-slate-400 transition-all'}>
                        At least one special character
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 text-left">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl text-sm font-medium border-slate-800 bg-slate-950/60 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs font-medium text-red-500 text-left">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <p className="text-xs font-medium flex items-center gap-1 text-emerald-400 text-left">
                    <CheckCircle className="h-3.5 w-3.5" /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading || 
                  password !== confirmPassword || 
                  password.length < 8 || 
                  !/[A-Z]/.test(password) || 
                  !/[a-z]/.test(password) || 
                  !/[0-9]/.test(password) || 
                  !/[^A-Za-z0-9]/.test(password)
                }
                className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/20 mt-4"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Updating password...</>
                ) : (
                  <><ShieldCheck className="h-4 w-4" /> Update Password</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
