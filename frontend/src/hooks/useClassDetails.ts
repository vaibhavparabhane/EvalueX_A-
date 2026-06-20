import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { classService } from '@/services/classes';
import { toast } from 'sonner';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  submission_count: number;
  avg_score: number;
}

export function useClassDetails() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      fetchClassDetails();
    }
  }, [user, id]);

  const fetchClassDetails = async () => {
    try {
      setLoadingData(true);
      
      const classData = await classService.fetchClassById(id);
      if (classData) setClassName(classData.name);

      const linkedAssignments = await classService.fetchClassLinkedAssignments(id);
      const assignmentIds = linkedAssignments.map(a => a.assignment_id) || [];

      if (assignmentIds.length > 0) {
        const { data: assData } = await supabase
          .from('assignments')
          .select('*')
          .in('id', assignmentIds);

        if (assData) {
          const assWithStats = await Promise.all(
            assData.map(async (a) => {
              const { data: subs } = await supabase
                .from('submissions')
                .select('final_score')
                .eq('assignment_id', a.id);

              const gradedSubs = subs?.filter(s => s.final_score !== null) || [];
              const avgScore = gradedSubs.length > 0
                ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score || 0), 0) / gradedSubs.length)
                : 0;

              return {
                id: a.id,
                title: a.title,
                description: a.description,
                submission_count: subs?.length || 0,
                avg_score: avgScore
              };
            })
          );
          setAssignments(assWithStats);
        }
      }
    } catch (err: any) {
      console.error('Error fetching class details:', err);
      toast.error(err.message || 'Failed to load class details');
    } finally {
      setLoadingData(false);
    }
  };

  return {
    id,
    loading: loading || loadingData,
    className,
    assignments,
    router
  };
}
