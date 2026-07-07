"use client";

import Link from 'next/link';
import { Input } from '@/components/common/input';
import { Loader2, Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import { AuthLogo } from '@/components/layout/AuthLogo';
import { useForgotPassword } from '@/hooks/useForgotPassword';

export function ForgotPasswordContent() {
  const {
    email,
    setEmail,
    loading,
    sent,
    setSent,
    handleSubmit
  } = useForgotPassword();

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Sleek animated ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      {/* Reusable Logo */}
      <AuthLogo />

      <div className="relative z-10 w-full max-w-[440px] space-y-7 bg-slate-950/40 border border-slate-900 backdrop-blur-xl p-8 md:p-10 rounded-[32px] shadow-2xl">
        {/* Glow behind the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[32px] blur-xl opacity-30 pointer-events-none" />

        {/* Back to login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {!sent ? (
          <>
            {/* Heading */}
            <div className="space-y-2 text-left">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent p-[1.5px] shadow-[0_8px_30px_rgba(79,70,229,0.25)] flex items-center justify-center mb-4">
                <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
                  <Mail className="h-7 w-7 text-primary animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Forgot password?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                No worries! Enter your registered email and we'll send you a secure reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-semibold text-slate-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="educator@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl text-sm font-medium border-slate-800 bg-slate-950/60 text-white placeholder-slate-600 focus:border-primary focus:ring-primary/20"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-primary-foreground flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 mt-4"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending link...</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Reset Link</>
                )}
              </button>
            </form>

            <p className="text-sm text-center text-slate-500">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          /* ── Success State ── */
          <div className="space-y-6 text-center">
            {/* Success icon */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[1.5px] shadow-[0_8px_30px_rgba(79,70,229,0.25)]">
                <div className="h-full w-full rounded-2xl bg-[#07090e] flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Reset link sent!
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Check your email
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We sent a password reset link to{' '}
                <span className="text-emerald-400 font-semibold underline decoration-emerald-400/20 decoration-2 underline-offset-4">{email}</span>.
                {' '}Click the link to set a new password.
              </p>
            </div>

            {/* Steps */}
            <div className="rounded-2xl p-5 text-left space-y-3 bg-slate-950/60 border border-slate-900">
              {[
                { step: '1', text: 'Open your email inbox' },
                { step: '2', text: 'Find the email from EvalueX' },
                { step: '3', text: 'Click "Reset password" in the email' },
                { step: '4', text: 'Enter and confirm your new password' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white bg-gradient-to-br from-primary to-accent">
                    {step}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Resend */}
            <p className="text-sm text-slate-500">
              Didn't receive it?{' '}
              <button
                onClick={() => setSent(false)}
                className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
