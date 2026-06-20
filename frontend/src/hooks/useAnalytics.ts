import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { analyticsService } from '@/services/analytics';

export interface ScoreData {
  name: string;
  score: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
}

export interface AnalyticsStats {
  avg: number;
  total: number;
  highest: number;
  lowest: number;
}

export function useAnalytics() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [stats, setStats] = useState<AnalyticsStats>({ avg: 0, total: 0, highest: 100, lowest: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoadingData(true);
      const assignments = await analyticsService.fetchUserAssignments(user?.id || '');

      if (assignments && assignments.length > 0) {
        const assignmentIds = assignments.map(a => a.id);
        const subs = await analyticsService.fetchAssignmentsSubmissions(assignmentIds);

        if (subs && subs.length > 0) {
          // Score data per assignment
          const assignmentScores = assignments.slice(0, 6).map(a => {
            const assignmentSubs = subs.filter(s => s.assignment_id === a.id);
            const max = a.max_score || 100;
            const avg = assignmentSubs.length > 0
              ? Math.round((assignmentSubs.reduce((acc, s) => acc + (s.final_score || 0), 0) / assignmentSubs.length) / max * 100)
              : 0;
            return { name: a.title.length > 12 ? a.title.substring(0, 12) + '...' : a.title, score: avg };
          }).filter(a => a.score > 0);
          setScoreData(assignmentScores);

          // Grade distribution
          const grades = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0 };
          let total = 0, highest = 0, lowest = 100;
          subs.forEach(s => {
            const a = assignments.find(assign => assign.id === s.assignment_id);
            const max = a?.max_score || 100;
            const percentage = Math.round((s.final_score || 0) / max * 100);
            total += percentage;
            if (percentage > highest) highest = percentage;
            if (percentage < lowest) lowest = percentage;

            if (percentage >= 90) grades['A+']++;
            else if (percentage >= 80) grades['A']++;
            else if (percentage >= 70) grades['B']++;
            else if (percentage >= 60) grades['C']++;
            else if (percentage >= 50) grades['D']++;
            else if (percentage >= 35) grades['E']++;
            else grades['F']++;
          });

          setGradeDistribution(Object.entries(grades).map(([grade, count]) => ({ grade, count })));
          setStats({
            avg: Math.round(total / subs.length),
            total: subs.length,
            highest,
            lowest: highest === 0 && lowest === 100 ? 0 : lowest
          });
        }
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoadingData(false);
    }
  };

  return {
    loading: loading || loadingData,
    scoreData,
    gradeDistribution,
    stats,
    router,
    fetchAnalyticsData
  };
}
