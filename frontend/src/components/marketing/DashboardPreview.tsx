import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, CheckCircle2, Award, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/common/card';
import { SectionHeader } from './SectionHeader';

const scoreData = [
  { test: 'Test 1', score: 62 },
  { test: 'Test 2', score: 68 },
  { test: 'Test 3', score: 75 },
  { test: 'Midterm', score: 84 },
  { test: 'Finals', score: 88 },
];

const gradeDistributionData = [
  { grade: 'A+', count: 12, color: '#6366f1' },
  { grade: 'A', count: 24, color: '#4f46e5' },
  { grade: 'B+', count: 18, color: '#a855f7' },
  { grade: 'B', count: 9, color: '#ec4899' },
  { grade: 'C', count: 3, color: '#f53f3f' },
];

export function DashboardPreview() {
  const [chartTab, setChartTab] = useState<'trend' | 'grades'>('grades');

  return (
    <section id="about" className="pt-24 pb-32 scroll-mt-20 relative overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200/40 dark:border-white/5 transition-colors duration-350">
      
      {/* Colorful Background Glow Lights */}
      <div className="absolute top-[30%] left-[-10%] w-[380px] h-[380px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[380px] h-[380px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 max-w-6xl space-y-16 relative z-10">
        
        {/* Header */}
        <SectionHeader 
          title="System Dashboard" 
          subtitle="A clean and spacious overview of automated evaluations and cohort analytics."
          className="max-w-xl"
        />

        {/* Spacious Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch [perspective:1000px]">
          
          {/* Chart Card (8 Cols) */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, rotateX: 1, scale: 1.005 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="h-full"
            >
              <Card className="border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 shadow-[0_4px_30px_rgba(99,102,241,0.02)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.08)]">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {chartTab === 'trend' ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Class Score Improvement
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Grade Distribution
                        </>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {chartTab === 'trend' 
                        ? 'Class average score progression across terms' 
                        : 'Student counts categorized by scored grade letters'}
                    </p>
                  </div>

                  {/* Tab Toggles */}
                  <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 shadow-inner">
                    <button
                      onClick={() => setChartTab('grades')}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${chartTab === 'grades' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      Grades
                    </button>
                    <button
                      onClick={() => setChartTab('trend')}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${chartTab === 'trend' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      Trend
                    </button>
                  </div>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartTab === 'trend' ? (
                      <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="test" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}
                          itemStyle={{ color: '#818cf8', fontSize: 11 }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}
                          itemStyle={{ color: '#818cf8', fontSize: 11 }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Grading Panel & Stat Widget (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Grading Card / Cohort Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, rotateX: 1, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="flex-1"
            >
              <Card className="border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between text-left hover:border-indigo-500/20 transition-all duration-300 shadow-[0_4px_30px_rgba(99,102,241,0.02)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.08)]">
                {chartTab === 'trend' ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          Grading Verification
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Current verified papers queue</p>
                      </div>
                      
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl text-xs space-y-1 relative overflow-hidden shadow-sm">
                        {/* Glowing highlight indicator */}
                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-emerald-500" />
                        <div className="flex justify-between items-center pl-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Student: Yash</span>
                          <span className="text-[10px] font-black text-emerald-600">Grade: A</span>
                        </div>
                        <p className="text-[10px] text-slate-550 dark:text-slate-450 leading-normal pl-1 font-medium">
                          "Conceptual answers correctly align with grading rubric criteria. Evaluator override complete."
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] border-t border-slate-200/40 dark:border-white/5 pt-4 mt-4 font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Status:</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        All Papers Evaluated
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          Cohort Statistics
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Grade analysis results</p>
                      </div>
                      
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl text-xs space-y-1 relative overflow-hidden shadow-sm">
                        {/* Glowing highlight indicator */}
                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-violet-500" />
                        <div className="flex justify-between items-center pl-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Peak Grade: A</span>
                          <span className="text-[10px] font-black text-violet-600">24 Students</span>
                        </div>
                        <p className="text-[10px] text-slate-550 dark:text-slate-450 leading-normal pl-1 font-medium">
                          "The class distribution aligns with standardized test rubrics. Excellent mid-cohort performance."
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] border-t border-slate-200/40 dark:border-white/5 pt-4 mt-4 font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Status:</span>
                      <span className="text-violet-600 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                        Analysis Complete
                      </span>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Performance Card / Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Card className="border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl p-5 text-left flex items-center justify-between gap-4 hover:border-indigo-500/20 transition-all duration-300 shadow-[0_4px_30px_rgba(99,102,241,0.02)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.08)]">
                {chartTab === 'trend' ? (
                  <>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Grading Efficiency</span>
                      <h4 className="text-base font-black text-slate-950 dark:text-white">70% Faster</h4>
                    </div>
                    <div className="h-9 w-9 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Overall Pass Rate</span>
                      <h4 className="text-base font-black text-slate-950 dark:text-white">98% Passed</h4>
                    </div>
                    <div className="h-9 w-9 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}

