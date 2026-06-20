import Link from 'next/link';

interface AuthLogoProps {
  className?: string;
  textColor?: string;
}

export function AuthLogo({ 
  className = "absolute top-8 left-8 z-20", 
  textColor = "text-white" 
  }: AuthLogoProps) {
  return (
    <div className={className}>
      <Link href="/" className="flex items-center gap-3.5 group">
        <div 
          className="h-11 w-11 rounded-2xl flex items-center justify-center overflow-hidden bg-white/10 border border-white/20 transition-transform group-hover:scale-105 duration-200 shadow-lg shadow-indigo-500/10"
        >
          <img src="/fevicon.ico" alt="EvalueX Logo" className="w-7 h-7 object-contain" />
        </div>
        <span className={`font-black text-2xl tracking-tight font-display ${textColor}`}>
          Evalu<span className="text-emerald-400">e</span>X
        </span>
      </Link>
    </div>
  );
}

