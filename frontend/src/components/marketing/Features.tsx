import { Sparkles, Cpu, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/common/card';
import { SectionHeader } from './SectionHeader';

const coreFeatures = [
  {
    icon: Sparkles,
    title: 'OCR Answer Extraction',
    description: 'Transcribes handwritten answers and mathematical formulas into editable digital text.',
    color: 'text-indigo-600 bg-indigo-500/5 border-indigo-500/10',
    hoverBorder: 'hover:border-indigo-500/30 dark:hover:border-indigo-500/20',
    glowColor: 'bg-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.4)]'
  },
  {
    icon: Cpu,
    title: 'AI-Based Grading',
    description: 'Scores answer sheets instantly matching predefined evaluation rubric criteria.',
    color: 'text-purple-600 bg-purple-500/5 border-purple-500/10',
    hoverBorder: 'hover:border-purple-500/30 dark:hover:border-purple-500/20',
    glowColor: 'bg-purple-500 shadow-[0_4px_20px_rgba(168,85,247,0.4)]'
  },
  {
    icon: MessageSquare,
    title: 'Instant Feedback',
    description: 'Provides descriptive feedback explanations to help students understand their mistakes.',
    color: 'text-cyan-600 bg-cyan-500/5 border-cyan-500/10',
    hoverBorder: 'hover:border-cyan-500/30 dark:hover:border-cyan-500/20',
    glowColor: 'bg-cyan-500 shadow-[0_4px_20px_rgba(6,182,212,0.4)]'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Generates real-time cohort statistics, subject trends, and grading progress charts.',
    color: 'text-teal-600 bg-teal-500/5 border-teal-500/10',
    hoverBorder: 'hover:border-teal-500/30 dark:hover:border-teal-500/20',
    glowColor: 'bg-teal-500 shadow-[0_4px_20px_rgba(20,184,166,0.4)]'
  }
];

export function Features() {
  return (
    <section id="features" className="pt-20 pb-32 scroll-mt-20 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-350">
      
      {/* Background Mesh Glow Lights */}
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[130px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center space-y-16">
        
        {/* Section Header */}
        <SectionHeader 
          title="Core Platform Features" 
          subtitle="A simple breakdown of EvalueX's automated grading architecture."
          className="max-w-xl"
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]">
          {coreFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, rotateX: 3, rotateY: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: idx * 0.05 }}
              className="flex group"
            >
              <Card className={`relative overflow-hidden border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl w-full flex flex-col justify-between transition-all duration-300 ${feature.hoverBorder} hover:shadow-[0_15px_30px_rgba(99,102,241,0.06)] dark:hover:shadow-[0_15px_30px_rgba(99,102,241,0.12)]`}>
                
                {/* Animated Bottom Glow Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <CardContent className="p-8 flex flex-col items-start text-left space-y-6 h-full relative z-10 min-h-[250px]">
                  <div className={`h-12 w-12 rounded-xl ${feature.color} border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-slate-550 dark:text-slate-450 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

