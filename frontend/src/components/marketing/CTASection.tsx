import Link from 'next/link';
import { Button } from '@/components/common/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section id="contact" className="py-24 scroll-mt-20 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200/40 dark:border-white/5 transition-colors duration-350">
      
      {/* Centered Colorful Background Glow Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 blur-[130px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-4xl text-center space-y-6 relative z-10">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          Start Smart Evaluation with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-purple-400">EvalueX</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium"
        >
          An AI-powered assessment tool built for modern educators and institutions.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="pt-2"
        >
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl px-8 flex items-center gap-2 mx-auto shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

