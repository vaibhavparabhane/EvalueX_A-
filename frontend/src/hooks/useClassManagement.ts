import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { classService } from '@/services/classes';
import { toast } from 'sonner';

export interface ClassData {
  id: string;
  title: string;
  description: string | null;
  studentCount: number;
  avgScore: number;
}

export function useClassManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchClassesList();
    }
  }, [user]);

  const fetchClassesList = async () => {
    try {
      setLoadingData(true);
      const classesData = await classService.fetchClasses();

      const classesWithStats = await Promise.all(
        classesData.map(async (c) => {
          const linkedAssignments = await classService.fetchClassLinkedAssignments(c.id);
          const assignmentIds = linkedAssignments.map(a => a.assignment_id) || [];
          
          let studentCount = 0;
          let avgScore = 0;

          if (assignmentIds.length > 0) {
            const { data: subs } = await supabase
              .from('submissions')
              .select('student_name, final_score')
              .in('assignment_id', assignmentIds);

            const uniqueStudents = new Set(subs?.map(s => s.student_name) || []);
            studentCount = uniqueStudents.size;
            
            const gradedSubs = subs?.filter(s => s.final_score !== null) || [];
            avgScore = gradedSubs.length > 0
              ? Math.round(gradedSubs.reduce((acc, s) => acc + (s.final_score || 0), 0) / gradedSubs.length)
              : 0;
          }

          return {
            id: c.id,
            title: c.name,
            description: c.description,
            studentCount,
            avgScore
          };
        })
      );
      setClasses(classesWithStats);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !user) return;

    setIsCreating(true);
    try {
      await classService.createClass({
        name: newClassName,
        description: newClassDesc,
        userId: user.id
      });

      setNewClassName('');
      setNewClassDesc('');
      setCreateOpen(false);
      toast.success('Class created successfully!');
      fetchClassesList();
    } catch (err: any) {
      console.error('Error creating class:', err);
      toast.error(err.message || 'Failed to create class. Make sure database tables exist.');
    } finally {
      setIsCreating(false);
    }
  };

  return {
    user,
    loading: loading || loadingData,
    classes,
    createOpen,
    setCreateOpen,
    newClassName,
    setNewClassName,
    newClassDesc,
    setNewClassDesc,
    isCreating,
    handleCreateClass,
    router
  };
}
