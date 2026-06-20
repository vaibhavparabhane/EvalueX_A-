import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/40 dark:border-white/5 bg-white dark:bg-slate-950 py-12 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-semibold">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-12 w-12 flex items-center justify-center flex-shrink-0">
              <img src="/fevicon.ico" alt="EvalueX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-2xl text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              EvalueX
            </span>
          </Link>

          {/* Copyright & Info */}
          <p className="text-xs">
            © {currentYear} EvalueX. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

