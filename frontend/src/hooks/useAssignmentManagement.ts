import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { assignmentService } from '@/services/assignments';
import { toast } from 'sonner';
import { Assignment } from '@/types/app.types';

export function useAssignmentManagement() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filtered, setFiltered] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchAssignmentsList();
  }, [user]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? assignments.filter(a =>
            a.title.toLowerCase().includes(q) ||
            (a.description || '').toLowerCase().includes(q)
          )
        : assignments
    );
  }, [search, assignments]);

  const fetchAssignmentsList = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.fetchAssignments();
      
      const withStats = await Promise.all(
        data.map(async (a) => {
          const subs = await assignmentService.fetchAssignmentSubmissionsSummary(a.id);
          const total = subs.length || 0;
          const graded = subs.filter(s => s.final_score !== null) || [];
          const avg = graded.length > 0
            ? Math.round(graded.reduce((acc, s) => acc + (s.final_score || 0), 0) / graded.length)
            : 0;

          return {
            ...a,
            submission_count: total,
            graded_count: graded.length,
            avg_score: avg,
          };
        })
      );

      setAssignments(withStats);
    } catch (err: any) {
      toast.error('Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(assignmentId);
    try {
      await assignmentService.deleteAssignment(assignmentId);
      toast.success('Examination deleted successfully');
      fetchAssignmentsList();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete examination');
    } finally {
      setDeletingId(null);
    }
  };

  return {
    user,
    loading: authLoading || loading,
    assignments,
    filtered,
    deletingId,
    search,
    setSearch,
    handleDelete,
    router
  };
}
