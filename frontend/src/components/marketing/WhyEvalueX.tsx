import { Gauge, CheckCircle2, MessageSquare, UserCheck, BarChart3, CloudLightning, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/common/card';
import { SectionHeader } from './SectionHeader';

const stats = [
  {
    value: '70% Faster',
    label: 'Evaluation Turnaround',
    description: 'AI extracts written text and evaluates answers instantly, trimming grading time from weeks to minutes.',
    icon: Gauge,
    color: 'text-purple-600 bg-purple-500/5 border-purple-500/10',
    hoverBorder: 'hover:border-purple-500/30 dark:hover:border-purple-500/20',
    glowColor: 'bg-purple-500 shadow-[0_4px_20px_rgba(168,85,247,0.4)]'
  },
  {
    value: '95% Consistency',
    label: 'Grading Reliability',
    description: 'Standardized evaluation maps scoring exactly to rubrics, eliminating grading fatigue and variation bias.',
    icon: CheckCircle2,
    color: 'text-indigo-600 bg-indigo-500/5 border-indigo-500/10',
    hoverBorder: 'hover:border-indigo-500/30 dark:hover:border-indigo-500/20',
    glowColor: 'bg-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.4)]'
  },
  {
    value: 'Instant Feedback',
    label: 'Constructive AI Insights',
    description: 'Students receive comprehensive breakdown PDFs explaining the exact logic behind their marks.',
    icon: MessageSquare,
    color: 'text-cyan-600 bg-cyan-500/5 border-cyan-500/10',
    hoverBorder: 'hover:border-cyan-500/30 dark:hover:border-cyan-500/20',
    glowColor: 'bg-cyan-500 shadow-[0_4px_20px_rgba(6,182,212,0.4)]'
  },
  {
    value: 'Human-in-the-Loop',
    label: 'Complete Educator Control',
    description: 'AI only suggests scores. Final authority, overrides, and approvals are strictly managed by educators.',
    icon: UserCheck,
    color: 'text-teal-600 bg-teal-500/5 border-teal-500/10',
    hoverBorder: 'hover:border-teal-500/30 dark:hover:border-teal-500/20',
    glowColor: 'bg-teal-500 shadow-[0_4px_20px_rgba(20,184,166,0.4)]'
  },
  {
    value: 'Smart Analytics',
    label: 'Performance Dashboards',
    description: 'Identifies student performance trends, at-risk cohorts, and topic mastery distributions visually.',
    icon: BarChart3,
    color: 'text-amber-600 bg-amber-500/5 border-amber-500/10',
    hoverBorder: 'hover:border-amber-500/30 dark:hover:border-amber-500/20',
    glowColor: 'bg-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
  },
  {
    value: 'Scalable Setup',
    label: 'Enterprise-Grade Core',
    description: 'Processes thousands of answer sheet uploads and grades concurrently with high availability.',
    icon: CloudLightning,
    color: 'text-rose-600 bg-rose-500/5 border-rose-500/10',
    hoverBorder: 'hover:border-rose-500/30 dark:hover:border-rose-500/20',
    glowColor: 'bg-rose-500 shadow-[0_4px_20px_rgba(244,63,94,0.4)]'
  }
];

export function WhyEvalueX() {
  return (
    <section id="why-evaluex" className="pt-24 pb-32 scroll-mt-20 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200/40 dark:border-white/5 transition-colors duration-350">
      
      {/* Background Mesh Glow Lights */}
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[130px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center space-y-16">
        
        {/* Header */}
        <SectionHeader 
          title="Why Academic Institutes Choose EvalueX" 
          subtitle="A comprehensive overview of our smart grading statistics and architectural core strengths."
          pillText="Platform Benefits"
          pillIcon={Sparkles}
          pillColor="teal"
          className="max-w-2xl"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 [perspective:1000px]">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.01 }}
              transition={{ type: 'spring', damping: 15, stiffness: 120, delay: idx * 0.05 }}
              className="flex group"
            >
              <Card className={`relative overflow-hidden border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm shadow-sm rounded-2xl h-full w-full transition-all duration-300 ${stat.hoverBorder} hover:shadow-[0_15px_30px_rgba(99,102,241,0.06)] dark:hover:shadow-[0_15px_30px_rgba(99,102,241,0.12)] text-left`}>
                
                {/* Animated Bottom Glow Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${stat.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-4 relative z-10">
                  <div className="space-y-3">
                    <div className={`h-10 w-10 rounded-xl ${stat.color} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-305`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{stat.value}</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-450 leading-relaxed font-medium">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

