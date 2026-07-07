import Link from 'next/link';
import { Button } from '@/components/common/button';
import { ArrowRight, Sparkles, Activity, CheckCircle2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative pt-16 pb-32 overflow-hidden text-left bg-background transition-colors duration-350">
      
      {/* 3D Perspective Grid Floor */}
      <div className="bg-grid-3d" />

      {/* Colorful Gradient Mesh Background Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 dark:bg-primary/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-accent/10 dark:bg-accent/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[25%] left-[30%] w-[400px] h-[400px] rounded-full bg-accent/5 dark:bg-accent/5 blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and Taglines */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Minimal Project Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-bold text-primary shadow-[0_2px_12px_rgba(79,70,229,0.05)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>✨ Next-Gen Academic Evaluation</span>
            </motion.div>
  
            {/* Tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]"
            >
              Transforming <br className="hidden sm:block" />
              <span className="relative inline-block whitespace-nowrap">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Academic Evaluation</span>
                <span className="absolute left-0 -bottom-1 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
              </span> <br className="hidden sm:block" />
              with Explainable AI
            </motion.h1>
  
            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-650 dark:text-slate-400 leading-relaxed font-medium"
            >
              An advanced AI grading ecosystem using high-precision handwriting OCR and custom rubrics to evaluate, grade, and feedback student papers—with complete educator authority.
            </motion.p>
            
            {/* Action Triggers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-row gap-4 items-center"
            >
              <Link href="/signup">
                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-7 flex items-center gap-2 shadow-[0_6px_24px_rgba(79,70,229,0.25)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                  Get Started 
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="bg-card/40 dark:bg-card/20 border border-border/80 hover:border-primary/50 dark:border-white/10 text-foreground hover:bg-card/80 shadow-sm rounded-full px-7 py-2.5 font-bold text-sm backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300">
                  Educator Login
                </Button>
              </Link>
            </motion.div>
          </div>
 
          {/* Right Column: 3D Interactive Mockup */}
          <div className="lg:col-span-5 [perspective:1200px] flex justify-center items-center relative py-12">
            
            {/* Ambient Spotlight Behind Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-primary/10 blur-[90px] pointer-events-none -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateX: 10, rotateY: -12, rotateZ: 1 }}
              animate={{ opacity: 1, scale: 1, rotateX: 10, rotateY: -12, rotateZ: 1 }}
              whileHover={{ rotateX: 3, rotateY: -5, rotateZ: 0, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="relative w-full max-w-[520px] rounded-3xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-card/40 backdrop-blur-2xl p-4 shadow-[0_30px_60px_rgba(79,70,229,0.12)] preserve-3d"
            >
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-border/50 dark:border-white/5 pb-3 mb-4 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
              </div>
 
              {/* Main Image Frame (Lifts slightly in 3D) */}
              <motion.div 
                style={{ transform: "translateZ(30px)" }}
                className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-white/5 bg-muted shadow-md"
              >
                <img 
                  src="/grading_vaibhav_3d.png" 
                  alt="EvalueX AI Smart Grading" 
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
 
            </motion.div>
          </div>
 
        </div>
      </div>
    </section>
  );
}
