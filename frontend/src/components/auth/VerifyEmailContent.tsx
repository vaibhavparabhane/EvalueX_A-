"use client";

import { Mail, Loader2, LogOut } from 'lucide-react';
import { AuthLogo } from '@/components/layout/AuthLogo';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';

export function VerifyEmailContent() {
  const {
    email,
    resending,
    resent,
    handleResend,
    handleLogout
  } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      
      {/* Sleek animated ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Logo top-left */}
      <AuthLogo />

      {/* Glassmorphic Content Card */}
      <div className="w-full max-w-lg z-10 bg-slate-950/40 border border-slate-900 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-2xl relative space-y-8">
        
        {/* Glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-[32px] blur-xl opacity-30 pointer-events-none" />

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verification email sent
          </div>
        </div>

        {/* Icon with Double Border Glow */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-[0_8px_30px_rgba(99,102,241,0.2)] animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
              <Mail className="h-9 w-9 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Text Header & description */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Check your email
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            We sent an email verification link to{' '}
            {email ? (
              <span className="text-emerald-400 font-semibold underline decoration-emerald-400/20 decoration-2 underline-offset-4">{email}</span>
            ) : (
              <span className="text-white font-semibold">your email address</span>
            )}{' '}
            which contains a link to activate your account.
          </p>
        </div>

        {/* Bottom actions list */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Didn't receive the email?</span>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {resending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Resending...
                </>
              ) : resent ? (
                'Sent!'
              ) : (
                'Resend'
              )}
            </button>
            <span className="text-slate-800">|</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
