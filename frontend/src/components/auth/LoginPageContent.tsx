"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/common/input';
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthLogo } from '@/components/layout/AuthLogo';
import { useLogin } from '@/hooks/useLogin';
import { useToast } from '@/hooks/useToast';

/* ── Google Brand-Color SVG ── */
const GoogleIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── Microsoft Brand-Color SVG ── */
const MicrosoftIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f25022" d="M0 0h11v11H0z"/>
    <path fill="#7fba00" d="M12 0h11v11H12z"/>
    <path fill="#00a4ef" d="M0 12h11v11H0z"/>
    <path fill="#ffb900" d="M12 12h11v11H12z"/>
  </svg>
);

export function LoginPageContent() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
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

  const handleMicrosoftSignIn = () => {
    toast({
      title: "SSO Restricted",
      description: "Microsoft SSO integration is restricted to enterprise licenses. Please use Google or Email to sign in.",
    });
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-edtech-charcoal">
      {/* ── LEFT PANEL: Form Side (45% Width) ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 md:p-16 relative z-10 bg-white">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 mb-8">
          <img src="/fevicon.ico" alt="EvalueX Logo" className="h-6 w-6 object-contain" />
          <span className="font-black text-lg tracking-tight text-edtech-charcoal">EvalueX</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[380px] mx-auto my-auto space-y-7">
          {/* Header */}
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-edtech-charcoal">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-edtech-gray-muted leading-snug">
              Sign in to continue grading smarter
            </p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-edtech-border font-semibold text-sm transition-all duration-150 hover:bg-slate-50 disabled:opacity-60 bg-white text-edtech-charcoal shadow-sm"
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleMicrosoftSignIn}
              disabled={loading || googleLoading}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-edtech-border font-semibold text-sm transition-all duration-150 hover:bg-slate-50 disabled:opacity-60 bg-white text-edtech-charcoal shadow-sm"
            >
              <MicrosoftIcon />
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-edtech-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-edtech-gray-muted/80 bg-white px-1">
              or continue with email
            </span>
            <div className="flex-1 border-t border-edtech-border" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="block text-xs font-bold text-edtech-charcoal uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-edtech-gray-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="educator@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl text-sm border-edtech-border focus:border-edtech-indigo focus:ring-2 focus:ring-edtech-indigo/20 font-medium text-edtech-charcoal"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-edtech-charcoal uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-edtech-indigo hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-edtech-gray-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl text-sm border-edtech-border focus:border-edtech-indigo focus:ring-2 focus:ring-edtech-indigo/20 font-medium text-edtech-charcoal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-edtech-gray-muted hover:text-edtech-charcoal transition-colors flex items-center justify-center"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 rounded-xl font-bold text-sm text-white bg-edtech-indigo hover:bg-edtech-indigo/90 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-edtech-indigo/10 border-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className="text-xs text-center text-edtech-gray-muted">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-edtech-indigo hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Small Trust Indicator */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-edtech-gray-muted/80 mt-8">
          <ShieldCheck className="h-4 w-4 text-edtech-indigo" />
          <span>Secured with encrypted login</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: Branded Visual (55% Width) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-edtech-navy flex-col justify-center items-center p-16 overflow-hidden border-l border-white/5">
        {/* Background 3D Grid mesh */}
        <div className="bg-grid-3d opacity-30 absolute inset-0 pointer-events-none" />
        
        {/* Ambient Spotlights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-edtech-indigo/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-edtech-teal/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 w-full max-w-[480px] text-center space-y-10">
          
          {/* Header Text Overlay */}
          <div className="space-y-3.5">
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Trusted by 500+ educators for faster, fairer grading
            </h3>
            <p className="text-sm font-semibold text-edtech-slate">
              Streamlining evaluations with state-of-the-art AI rubrics.
            </p>
          </div>

          {/* Centered Simplified Visual Window */}
          <div className="relative w-full rounded-2xl border border-white/10 bg-[#1A2332]/80 backdrop-blur-xl p-4 shadow-2xl">
            {/* Floating Glass Badge 1: OCR Success */}
            <div className="absolute -left-8 top-1/4 z-30 bg-white/95 border border-edtech-border rounded-xl p-3 shadow-lg flex items-center gap-2.5 max-w-[190px]">
              <div className="h-7 w-7 rounded-lg bg-edtech-green/10 flex items-center justify-center text-edtech-green shrink-0">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-edtech-charcoal/55 uppercase tracking-wider">Answer Sheets</p>
                <p className="text-[10px] font-bold text-edtech-charcoal">99.8% OCR Accuracy</p>
              </div>
            </div>

            {/* Window header dots */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5 px-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[9px] font-bold text-edtech-indigo bg-edtech-indigo/15 border border-edtech-indigo/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Evaluation Preview
              </span>
            </div>

            {/* Mockup Image Frame */}
            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#141413]">
              <img
                src="/grading_vaibhav_3d.png"
                alt="EvalueX AI Smart Grading"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
