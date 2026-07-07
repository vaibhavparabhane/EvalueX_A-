import { Sparkles, Cpu, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/common/card';
import { SectionHeader } from './SectionHeader';

const coreFeatures = [
  {
    icon: Sparkles,
    title: 'Intelligent Handwriting OCR',
    description: 'Automatically extracts handwritten answers, math symbols, and formulas from student papers and converts them into editable digital text.',
    color: 'text-primary bg-primary/5 border-primary/10',
    hoverBorder: 'hover:border-primary/30 dark:hover:border-primary/20',
    glowColor: 'bg-primary shadow-[0_4px_20px_rgba(79,70,229,0.4)]'
  },
  {
    icon: Cpu,
    title: 'Rubric-Aligned AI Grading',
    description: 'Evaluates and scores student submissions against your exact, custom rubric criteria, ensuring consistent and objective grading.',
    color: 'text-accent bg-accent/5 border-accent/10',
    hoverBorder: 'hover:border-accent/30 dark:hover:border-accent/20',
    glowColor: 'bg-accent shadow-[0_4px_20px_rgba(13, 148, 136, 0.4)]'
  },
  {
    icon: MessageSquare,
    title: 'Detailed Student Feedback',
    description: 'Generates automated, constructive feedback reports explaining the exact reasoning behind every mark awarded or lost.',
    color: 'text-primary bg-primary/5 border-primary/10',
    hoverBorder: 'hover:border-primary/30 dark:hover:border-primary/20',
    glowColor: 'bg-primary shadow-[0_4px_20px_rgba(79,70,229,0.4)]'
  },
  {
    icon: BarChart3,
    title: 'Classroom Analytics',
    description: 'Tracks grade distributions, flags cohort concept deficits, and generates grading progress charts in real-time.',
    color: 'text-accent bg-accent/5 border-accent/10',
    hoverBorder: 'hover:border-accent/30 dark:hover:border-accent/20',
    glowColor: 'bg-accent shadow-[0_4px_20px_rgba(13, 148, 136, 0.4)]'
  }
];

export function Features() {
  return (
    <section id="features" className="pt-20 pb-32 scroll-mt-20 relative overflow-hidden bg-background transition-colors duration-350">
      
      {/* Background Mesh Glow Lights */}
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 dark:bg-primary/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/5 dark:bg-accent/5 blur-[130px] pointer-events-none z-0" />
 
      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-16">
        
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
              <Card className={`relative overflow-hidden border border-border/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl w-full flex flex-col justify-between transition-all duration-300 ${feature.hoverBorder} hover:shadow-[0_15px_30px_rgba(79,70,229,0.06)] dark:hover:shadow-[0_15px_30px_rgba(79,70,229,0.12)]`}>
                
                {/* Animated Bottom Glow Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
 
                <CardContent className="p-8 flex flex-col items-start text-left space-y-6 h-full relative z-10 min-h-[250px]">
                  <div className={`h-12 w-12 rounded-xl ${feature.color} border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
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

