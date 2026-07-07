"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/common/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      router.push('/#' + sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Workflow', id: 'workflow' },
    { label: 'Benefits', id: 'why-evaluex' },
    { label: 'Analytics', id: 'about' },
    { label: 'Get Started', id: 'contact' }
  ];

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300 flex justify-center",
        isScrolled 
          ? "top-4 px-6 w-full" 
          : "top-0 px-0 w-full"
      )}
    >
      <div
        className={cn(
          "w-full transition-all duration-300 flex items-center justify-between",
          isScrolled
            ? "max-w-5xl bg-background/80 dark:bg-[#141413]/80 backdrop-blur-md border border-border/60 shadow-lg rounded-full px-8 h-14"
            : "max-w-7xl bg-transparent border-transparent px-6 h-20"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 flex items-center justify-center flex-shrink-0">
            <img src="/fevicon.ico" alt="EvalueX Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-300">
            EvalueX
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors tracking-wide uppercase"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Get Started Button */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm rounded-full px-5 border border-primary/10 transition-all duration-300 hover:scale-[1.02]">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors tracking-wide uppercase">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm rounded-full px-5 border border-primary/10 transition-all duration-300 hover:scale-[1.02]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 dark:bg-[#141413]/95 backdrop-blur-md border-b border-border/50 dark:border-white/5 absolute top-16 left-0 w-full p-6 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-1"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-4 border-t border-border/40 dark:border-white/5 flex flex-col gap-3">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-md text-xs py-2.5">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-md text-xs py-2.5">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
