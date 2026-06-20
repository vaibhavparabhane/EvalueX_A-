"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageLoader } from '@/components/common/PageLoader';
import { cn } from '@/utils/cn';
import {
  Plus,
  FileText,
  Clock,
  Loader2,
  Users,
  TrendingUp,
  Upload,
  ArrowRight,
  ArrowUpRight,
  Trash2,
  Pencil,
  Search,
  SlidersHorizontal,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  FileUp,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/common/alert-dialog";
import { useDashboard, INSIGHTS } from '@/hooks/useDashboard';

const INSIGHTS_DECORATIONS = [
  {
    icon: BookOpen,
    color: "text-accent bg-accent/10"
  },
  {
    icon: Sparkles,
    color: "text-amber-500 bg-amber-500/10"
  },
  {
    icon: Clock,
    color: "text-blue-500 bg-blue-500/10"
  },
  {
    icon: GraduationCap,
    color: "text-emerald-500 bg-emerald-500/10"
  }
];

export function DashboardPageContent() {
  const {
    userName,
    assignments,
    loading,
    totalStudents,
    deletingId,
    activities,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    currentInsight,
    setCurrentInsight,
    handleDeleteAssignment,
    pendingCount,
    avgOverall,
    filteredAssignments,
    router
  } = useDashboard();

  if (loading) return <PageLoader />;

  const activeInsight = INSIGHTS[currentInsight];
  const insightDecoration = INSIGHTS_DECORATIONS[currentInsight];

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Premium ambient background blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[15%] w-[700px] h-[700px] bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500/5 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 animate-float" />

      <Sidebar />

      <main className="flex-1 ml-[260px] p-8 transition-all duration-300 relative z-10 max-w-[1600px] mx-auto w-full">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/60 dark:border-white/5 bg-white/40 dark:bg-card/30 backdrop-blur-xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-purple-500/[0.02]"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex-1 space-y-4 z-10 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/15 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Smart Grading Engine Active
              </span>
              <span className="px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                ★ 99.8% Grading Accuracy
              </span>
              <span className="px-3 py-1 text-[10px] font-semibold text-muted-foreground bg-muted/40 rounded-full flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-accent bg-clip-text text-transparent">{userName}</span>!
              </h1>
              <p className="text-lg sm:text-xl font-bold text-foreground/80 leading-snug">
                Smart Assessment. Instant Insights. 10x Time Saved.
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Automate your class grading in minutes using EvalueX's advanced LLM pipeline. Design rubrics, upload student sheets, and instantly compile results with comprehensive feedback reports.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-foreground/80 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-purple-500" />
                Precise Rubric Compliance
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Handwritten Answer Extraction
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                Comprehensive Student Feedback
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="sm" onClick={() => router.push('/upload')} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all rounded-xl px-5 py-2 flex items-center gap-1.5 border border-purple-500/10">
                <Plus className="h-4 w-4" /> Setup Exam
              </Button>
              <Button size="sm" variant="outline" onClick={() => router.push('/upload-answers')} className="bg-white/60 dark:bg-card/60 backdrop-blur-md border border-white/80 dark:border-white/15 text-foreground hover:bg-white/80 dark:hover:bg-card/85 shadow-sm transition-all rounded-xl px-5 py-2 flex items-center gap-1.5">
                <FileUp className="h-4 w-4" /> Upload Answers
              </Button>
            </div>
          </div>

          {/* Floating Card Graphic */}
          <div className="relative z-10 w-full sm:w-72 flex-shrink-0 bg-gradient-to-br from-white/90 to-white/40 dark:from-card/90 dark:to-card/40 border border-white/80 dark:border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl shadow-purple-500/[0.03] space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider">AI Grading Engine</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Active
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-foreground">Student: Alex Carter</h4>
                  <p className="text-[10px] text-muted-foreground">Class X-A • Math Exam</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-black text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-lg">95%</span>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">Grade: A+</p>
                </div>
              </div>

              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[95%] rounded-full" />
              </div>

              <div className="space-y-1.5 pt-1 text-[10px] text-muted-foreground font-bold text-left">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Handwriting OCR Success</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Rubrics Criteria Evaluated</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-600">
                  <Sparkles className="h-3.5 w-3.5 flex-shrink-0 animate-pulse" />
                  <span>Detailed AI Report Compiled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Exams', value: assignments.length, trend: '+4.5% this month', trendType: 'positive', icon: FileText, color: 'text-purple-600 bg-purple-500/10 shadow-purple-500/5', delay: 0.1 },
            { label: 'Total Students', value: totalStudents, trend: '+8.2% new signups', trendType: 'positive', icon: Users, color: 'text-indigo-600 bg-indigo-500/10 shadow-indigo-500/5', delay: 0.15 },
            { label: 'Average Score', value: avgOverall > 0 ? `${avgOverall}%` : '-', trend: 'Top school performance', trendType: 'positive', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-500/10 shadow-emerald-500/5', delay: 0.2 },
            { label: 'Pending Sheets', value: pendingCount, trend: 'Grading queue active', trendType: 'neutral', icon: Clock, color: 'text-amber-500 bg-amber-500/10 shadow-amber-500/5', delay: 0.25 }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: stat.delay }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative group"
            >
              <Card className="overflow-hidden border border-white/50 dark:border-white/5 bg-white/50 dark:bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-purple-500/30 group-hover:bg-white/80 dark:group-hover:bg-card/60 rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 flex flex-col justify-between h-full min-h-[140px]">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-1.5">
                    {stat.trendType === 'positive' ? (
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md flex items-center gap-0.5 shadow-sm">
                        <TrendingUp className="h-2.5 w-2.5" />
                        {stat.trend}
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold text-purple-600 bg-purple-500/10 px-2.5 py-1 rounded-md flex items-center gap-0.5 shadow-sm">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Main Action Hub */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border border-white/50 dark:border-white/5 bg-white/40 dark:bg-card/30 backdrop-blur-md shadow-sm rounded-2xl">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
                    Grade Engine Quick Hub
                  </CardTitle>
                  <CardDescription className="text-xs">Setup exams, upload answer sheets and review scores</CardDescription>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Exam Setup", desc: "Upload and structure question papers", icon: Upload, path: "/upload", iconBg: "from-purple-500 to-indigo-500" },
                    { title: "Upload Answer Sheets", desc: "Process written student papers", icon: FileUp, path: "/upload-answers", iconBg: "from-blue-500 to-indigo-500" },
                    { title: "Grading Review", desc: "Verify and adjust computed grades", icon: ClipboardCheck, path: "/grading-review", iconBg: "from-emerald-500 to-teal-500" },
                    { title: "Results & PDF Reports", desc: "Export CSV/PDF feedback sheets", icon: FileText, path: "/results", iconBg: "from-amber-500 to-orange-500" }
                  ].map((act) => (
                    <motion.button
                      key={act.title}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => router.push(act.path)}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-card/50 hover:bg-white dark:hover:bg-card hover:border-purple-500/30 hover:shadow-md transition-all duration-300 text-left w-full"
                    >
                      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br", act.iconBg)}>
                        <act.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm flex items-center gap-1">
                          {act.title}
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Assignments Directory */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Recent Examinations</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Filter and navigate directly to details</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/assignments')}
                  className="self-start sm:self-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-500/5 font-semibold gap-1"
                >
                  View All Exams
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search examinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-card border border-slate-200/80 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/50 dark:border-white/5 self-start sm:self-auto shadow-sm">
                  {(['all', 'pending', 'completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors duration-200 ${
                        activeTab === tab ? 'text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-700 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="relative z-10">{tab}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-card border border-slate-200/80 dark:border-white/10 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent border-none p-0 focus:outline-none cursor-pointer text-foreground text-xs font-bold text-left"
                  >
                    <option value="newest">Newest Setup</option>
                    <option value="oldest">Oldest Setup</option>
                    <option value="score">Highest Avg Score</option>
                    <option value="submissions">Submissions Count</option>
                  </select>
                </div>
              </motion.div>

              {/* Assignment Cards List */}
              <AnimatePresence mode="popLayout">
                {filteredAssignments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-card/20 rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">No examinations found</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[320px] leading-relaxed">
                        Get started by creating your first exam paper and rubrics to unlock AI-assisted automated grading.
                      </p>
                      <Button variant="outline" size="sm" className="mt-5 bg-white border-slate-200 text-foreground hover:bg-slate-50 shadow-sm rounded-xl font-semibold gap-1.5" onClick={() => router.push('/upload')}>
                        <Plus className="h-4 w-4" /> Setup First Exam
                      </Button>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAssignments.map((assign) => {
                      const gradingRate = assign.submission_count && assign.submission_count > 0
                        ? Math.round((assign.graded_count || 0) / assign.submission_count * 100)
                        : 0;

                      const radius = 22;
                      const circumference = 2 * Math.PI * radius;
                      const offset = circumference - (gradingRate / 100) * circumference;

                      return (
                        <motion.div
                          key={assign.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", damping: 22, stiffness: 120 }}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => router.push(`/assignment/${assign.id}`)}
                          className="cursor-pointer"
                        >
                          <Card className="border border-white/50 dark:border-white/5 bg-white/50 dark:bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-colors duration-200 overflow-hidden relative group rounded-2xl">
                            <CardContent className="p-5 flex flex-col justify-between h-full min-h-[170px]">
                              <div>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 text-left">
                                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                      Max Score: {assign.max_score} pts
                                    </span>
                                    <h3 className="font-bold text-foreground group-hover:text-purple-600 transition-colors line-clamp-1 mt-0.5">
                                      {assign.title}
                                    </h3>
                                    {assign.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1 font-medium">
                                        {assign.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Circular Progress Ring */}
                                  <div className="relative h-14 w-14 flex items-center justify-center flex-shrink-0 bg-purple-500/5 rounded-full">
                                    <svg className="h-full w-full rotate-[-90deg]">
                                      <circle
                                        cx="28"
                                        cy="28"
                                        r={radius}
                                        className="stroke-muted fill-none"
                                        strokeWidth="3.5"
                                      />
                                      <circle
                                        cx="28"
                                        cy="28"
                                        r={radius}
                                        className="stroke-purple-600 dark:stroke-purple-400 fill-none transition-all duration-500 ease-out"
                                        strokeWidth="3.5"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <span className="absolute text-[10px] font-black text-foreground">
                                      {gradingRate}%
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 flex-wrap">
                                  {assign.avg_score && assign.avg_score > 0 ? (
                                    <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      Avg: {assign.avg_score}%
                                    </span>
                                  ) : null}

                                  {assign.submission_count && assign.submission_count > 0 ? (
                                    <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                                      {assign.graded_count}/{assign.submission_count} graded
                                    </span>
                                  ) : (
                                    <span className="text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                                      No submissions
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
                                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {new Date(assign.created_at).toLocaleDateString()}
                                </span>

                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-purple-600 hover:bg-purple-500/5 rounded-lg"
                                    onClick={() => router.push(`/upload/${assign.id}`)}
                                    title="Edit setup"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Examination?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete "{assign.title}" and all its submissions, rubrics, questions and grades. This action is irreversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={(e) => handleDeleteAssignment(assign.id, e)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {deletingId === assign.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          ) : null}
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Classroom Insights Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border border-white/80 dark:border-white/5 bg-white/70 dark:bg-card/50 backdrop-blur-md shadow-sm overflow-hidden relative rounded-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    Classroom Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <div className="min-h-[110px] flex flex-col justify-between">
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs font-bold text-foreground">{activeInsight.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-medium pt-1">
                        {activeInsight.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-4">
                      {INSIGHTS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentInsight(i)}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            currentInsight === i ? "w-4 bg-purple-600" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Grading Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border border-white/80 dark:border-white/5 bg-white/70 dark:bg-card/50 backdrop-blur-md shadow-sm rounded-2xl">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Recent Live Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-3">
                  {activities.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-muted-foreground">No recent evaluation feeds yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((act) => {
                        const isGraded = act.type === 'submission_graded';
                        const isUpload = act.type === 'submission_uploaded';
                        
                        return (
                          <div key={act.id} className="flex gap-3 text-left">
                            <div className={cn(
                              "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                              isGraded ? "bg-emerald-500/10 text-emerald-600" :
                              isUpload ? "bg-purple-500/10 text-purple-600" :
                              "bg-blue-500/10 text-blue-600"
                            )}>
                              {isGraded ? <CheckCircle2 className="h-4 w-4" /> :
                               isUpload ? <FileUp className="h-4 w-4" /> :
                               <FileText className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-foreground truncate">{act.title}</h4>
                                <span className="text-[9px] text-muted-foreground flex-shrink-0">{new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-normal mt-0.5 line-clamp-2">{act.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
