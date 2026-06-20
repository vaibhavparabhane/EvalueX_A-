import { Upload, Scan, Cpu, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';

const steps = [
  { 
    label: '1. Model Key Setup', 
    desc: 'Upload exam question papers and standard model answers.',
    icon: Upload 
  },
  { 
    label: '2. Upload Papers', 
    desc: 'Batch upload scanned student answer sheets (images or PDFs).',
    icon: Scan 
  },
  { 
    label: '3. OCR Extraction', 
    desc: 'AI automatically extracts and digitizes handwritten answers.',
    icon: Cpu 
  },
  { 
    label: '4. AI Rubric Grading', 
    desc: 'LLMs grade responses matching custom evaluation rubrics.',
    icon: MessageSquare 
  },
  { 
    label: '5. Review & Publish', 
    desc: 'Adjust scores manually and export results to the dashboard.',
    icon: CheckCircle2 
  }
];

export function Workflow() {
  return (
    <section id="workflow" className="pt-24 pb-32 scroll-mt-20 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200/40 dark:border-white/5 transition-colors duration-350">
      
      {/* Background Mesh Glow Lights */}
      <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[130px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-6xl text-center space-y-16 relative z-10">
        
        {/* Header */}
        <SectionHeader 
          title="How It Works" 
          subtitle="A simple, streamlined academic evaluation process built for modern institutions."
        />

        {/* Minimal Timeline */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4 w-full [perspective:1000px]">
          
          {/* Horizontal Line Connector */}
          <div className="hidden md:block absolute top-[28px] left-[8%] right-[8%] h-[1px] bg-slate-200 dark:bg-white/10 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, delay: idx * 0.05 }}
                className="flex flex-col items-center space-y-3 z-10 w-full md:w-44 text-center group"
              >
                <div className="h-14 w-14 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 px-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {step.label}
                  </span>
                  <p className="text-[11px] text-slate-550 dark:text-slate-450 font-medium leading-normal">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

