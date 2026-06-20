import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { dashboardService } from '@/services/dashboard';
import { Assignment, Activity } from '@/types/app.types';

export const INSIGHTS = [
  {
    title: "Explicit Rubrics Count",
    text: "Exams with clear, question-specific grading criteria reduce standard grading deviations by up to 20%.",
  },
  {
    title: "Granular Student Feedback",
    text: "Auto-generated feedback PDFs provide detailed explanations that decrease manual review requests.",
  },
  {
    title: "AI Time Savings",
    text: "EvalueX's automated grading pipeline evaluates written assessments up to 10x faster than manual grading.",
  },
  {
    title: "Educator Overrides",
    text: "Review and fine-tune AI scores easily in the Grading Review screen before final publishing.",
  }
];

export function useDashboard() {
  const { user, loading: authLoading, profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score' | 'submissions'>('newest');

  // Insights State
  const [currentInsight, setCurrentInsight] = useState(0);

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Rotate Insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % INSIGHTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.fetchAssignments();

      const assignmentIds = data.map(a => a.id);
      const allSubmissions = await dashboardService.fetchSubmissionsForAssignments(assignmentIds);

      const assignmentsWithCounts = data.map((assignment) => {
        const subs = allSubmissions.filter(s => s.assignment_id === assignment.id);
        const submissionCount = subs.length;
        const gradedCount = subs.filter(s => s.final_score !== null).length;
        
        const gradedSubmissions = subs.filter(s => s.final_score !== null);
        const avgScore = gradedSubmissions.length > 0
          ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.final_score || 0), 0) / gradedSubmissions.length)
          : 0;

        return {
          ...assignment,
          submission_count: submissionCount,
          graded_count: gradedCount,
          avg_score: avgScore,
        };
      });

      setAssignments(assignmentsWithCounts);

      // Get unique students count
      const uniqueStudents = new Set(allSubmissions.map(s => s.student_name));
      setTotalStudents(uniqueStudents.size);

      // Fetch recent activities
      if (assignmentsWithCounts.length > 0) {
        await fetchRecentActivities(assignmentsWithCounts, allSubmissions);
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching dashboard data',
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async (assignmentsList: Assignment[], submissionsList: any[]) => {
    try {
      const mergedActivities: Activity[] = [];

      assignmentsList.forEach(a => {
        mergedActivities.push({
          id: `assignment-${a.id}`,
          type: 'assignment_created',
          title: 'New Exam Setup',
          description: `"${a.title}" was successfully created.`,
          timestamp: a.created_at
        });
      });

      // Sort recent submissions by created_at desc, limit 10
      const recentSubmissions = [...submissionsList]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      recentSubmissions.forEach(s => {
        const assign = assignmentsList.find(a => a.id === s.assignment_id);
        const examTitle = assign ? `"${assign.title}"` : 'an examination';

        mergedActivities.push({
          id: `sub-upload-${s.id}`,
          type: 'submission_uploaded',
          title: 'Sheet Uploaded',
          description: `Uploaded answer sheet for ${s.student_name} under ${examTitle}.`,
          timestamp: s.created_at
        });

        if (s.graded_at && s.final_score !== null) {
          mergedActivities.push({
            id: `sub-grade-${s.id}`,
            type: 'submission_graded',
            title: 'Grading Complete',
            description: `Evaluated ${s.student_name}'s exam sheet. Score: ${s.final_score}/${assign?.max_score || 100}.`,
            timestamp: s.graded_at
          });
        }
      });

      const sorted = mergedActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setActivities(sorted);
    } catch (err) {
      console.error('Error compiling activities:', err);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(assignmentId);

    try {
      await dashboardService.deleteAssignment(assignmentId);
      toast({
        title: 'Examination deleted',
        description: 'The examination and all related data have been removed.',
      });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: 'Error deleting examination',
        description: error.message || 'Failed to delete',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = assignments.reduce((acc, a) => acc + (a.submission_count || 0) - (a.graded_count || 0), 0);
  const gradedCount = assignments.reduce((acc, a) => acc + (a.graded_count || 0), 0);
  const avgOverall = assignments.length > 0 && assignments.some(a => a.avg_score && a.avg_score > 0)
    ? Math.round(assignments.filter(a => a.avg_score && a.avg_score > 0).reduce((acc, a) => acc + (a.avg_score || 0), 0) / assignments.filter(a => a.avg_score && a.avg_score > 0).length)
    : 0;

  // Filtered & Sorted Assignments
  const filteredAssignments = assignments.filter((assign) => {
    const matchesSearch = assign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assign.description && assign.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'pending') {
      return (assign.submission_count || 0) > (assign.graded_count || 0);
    }
    if (activeTab === 'completed') {
      return (assign.submission_count || 0) > 0 && (assign.submission_count === assign.graded_count);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'score') {
      return (b.avg_score || 0) - (a.avg_score || 0);
    }
    if (sortBy === 'submissions') {
      return (b.submission_count || 0) - (a.submission_count || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return {
    user,
    userName,
    assignments,
    loading: authLoading || loading,
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
    gradedCount,
    avgOverall,
    filteredAssignments,
    router,
    fetchDashboardData
  };
}
