"use client";

import Link from 'next/link';
import { Input } from '@/components/common/input';
import { Loader2, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuthLogo } from '@/components/layout/AuthLogo';
import { useLogin } from '@/hooks/useLogin';

/* ── Official Google Brand-Color SVG ── */
const GoogleIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const benefits = [
  'OCR-powered handwriting recognition',
  '95% grading consistency guaranteed',
  'AI feedback reports in seconds',
  'Human-in-the-loop educator control',
];

export function LoginPageContent() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    googleLoading,
    handleSubmit,
    handleGoogleSignIn,
    router
  } = useLogin();

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand / Benefits */}
      <div
        className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, hsl(222,47%,16%) 0%, hsl(222,47%,24%) 45%, hsl(173,58%,33%) 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'hsl(173,58%,39%)' }} />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'hsl(222,47%,50%)' }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: 'hsl(173,58%,60%)' }} />

        {/* Logo */}
        <AuthLogo className="relative z-10" />

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'hsl(173,80%,72%)' }} />
              AI Smart Grading Platform
            </div>

            <h1 className="text-[2.6rem] font-black leading-tight" style={{ color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Welcome back,<br />
              <span style={{ color: 'hsl(173,80%,75%)' }}>Educator.</span>
            </h1>

            <p className="text-base font-medium leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Continue automating your academic evaluations with AI-powered OCR and rubric-based grading.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-3.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(173,80%,72%)' }} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © {new Date().getFullYear()} EvalueX — Built for modern educators.
        </p>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative"
        style={{ background: 'hsl(210,20%,99%)' }}>

        {/* Subtle ambient glows */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: 'hsl(173,58%,39%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[120px] pointer-events-none opacity-15"
          style={{ background: 'hsl(222,47%,60%)' }} />

        <div className="w-full max-w-[420px] space-y-7 relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <img src="/fevicon.ico" alt="EvalueX" className="h-9 w-9 object-contain" />
            <span className="font-black text-xl tracking-tight" style={{ color: 'hsl(222,47%,11%)' }}>
              Evalu<span style={{ color: 'hsl(173,58%,39%)' }}>e</span>X
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight" style={{ color: 'hsl(222,47%,11%)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sign in
            </h2>
            <p className="text-sm font-medium" style={{ color: 'hsl(215,16%,47%)' }}>
              New to EvalueX?{' '}
              <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'hsl(173,58%,35%)' }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: 'white',
              borderColor: 'hsl(214,32%,88%)',
              color: 'hsl(222,47%,20%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'hsl(210,20%,97%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t" style={{ borderColor: 'hsl(214,32%,91%)' }} />
            <span className="text-[11px] font-semibold uppercase tracking-widest px-1" style={{ color: 'hsl(215,16%,60%)' }}>
              or sign in with email
            </span>
            <div className="flex-1 border-t" style={{ borderColor: 'hsl(214,32%,91%)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="block text-sm font-semibold" style={{ color: 'hsl(222,47%,20%)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(215,16%,55%)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="educator@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl text-sm font-medium"
                  style={{ borderColor: 'hsl(214,32%,88%)', background: 'white' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: 'hsl(222,47%,20%)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-xs font-semibold hover:underline transition-colors"
                  style={{ color: 'hsl(173,58%,35%)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(215,16%,55%)' }} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl text-sm font-medium"
                  style={{ borderColor: 'hsl(214,32%,88%)', background: 'white' }}
                  required
                />
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, hsl(222,47%,20%) 0%, hsl(173,58%,39%) 100%)',
                boxShadow: '0 4px 20px rgba(45,165,142,0.28)'
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(45,165,142,0.44)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,165,142,0.28)')}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center leading-relaxed" style={{ color: 'hsl(215,16%,57%)' }}>
            Protected by industry-standard encryption and secure authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
