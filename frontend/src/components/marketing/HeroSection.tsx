import Link from 'next/link';
import { Button } from '@/components/common/button';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-20 overflow-hidden text-left bg-white dark:bg-slate-950 transition-colors duration-350">
      
      {/* 3D Perspective Grid Floor */}
      <div className="bg-grid-3d" />
 
      {/* Colorful Gradient Mesh Background Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-purple-500/10 dark:bg-purple-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[25%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
 
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and Taglines */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Minimal Project Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/15 bg-indigo-500/5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-[0_2px_12px_rgba(99,102,241,0.05)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>AI Smart Grading Platform</span>
            </motion.div>
  
            {/* Tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              Automate <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 drop-shadow-sm">Academic Evaluation</span> with AI
            </motion.h1>
  
            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium"
            >
              AI-powered grading system using OCR and LLMs for faster, smarter, and transparent evaluation.
            </motion.p>
            {/* Action Triggers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-row gap-4 items-center"
            >
              <Link href="/signup">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl px-6 flex items-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition-all">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-900/90 shadow-sm rounded-xl px-6 py-2.5 font-bold text-sm backdrop-blur-sm transition-all">
                  Educator Login
                </Button>
              </Link>
            </motion.div>
          </div>
 
          {/* Right Column: 3D Interactive Mockup using grading_vaibhav_3d Image */}
          <div className="lg:col-span-6 [perspective:1200px] flex justify-center items-center relative py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateX: 10, rotateY: -12, rotateZ: 1 }}
              animate={{ opacity: 1, scale: 1, rotateX: 10, rotateY: -12, rotateZ: 1 }}
              whileHover={{ rotateX: 3, rotateY: -5, rotateZ: 0, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="relative w-full max-w-[460px] rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_rgba(99,102,241,0.12)] dark:shadow-[0_20px_50px_rgba(99,102,241,0.22)] preserve-3d"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5 mb-3.5 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-500/5 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Evaluation active
                </div>
              </div>

              {/* Main Image Frame (Lifts slightly in 3D) */}
              <motion.div 
                style={{ transform: "translateZ(30px)" }}
                className="relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-slate-950 shadow-md"
              >
                <img 
                  src="/grading_vaibhav_3d.png" 
                  alt="EvalueX AI Smart Grading" 
                  className="w-full h-auto object-cover rounded-xl"
                />
              </motion.div>

              {/* Floating 3D Sparkle Sphere (Lifts higher in 3D) */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transform: "translateZ(80px)" }}
                className="absolute -top-6 -right-6 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-500/30 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32_rgba(99,102,241,0.15)] flex items-center justify-center text-indigo-600 dark:text-indigo-300 pointer-events-none z-20"
              >
                <Sparkles className="h-5 w-5 animate-pulse" />
              </motion.div>
 
            </motion.div>
          </div>
 
        </div>
      </div>
    </section>
  );
}

