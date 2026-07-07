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
      const classIds = classesData.map(c => c.id);

      let allLinkedAssignments: any[] = [];
      if (classIds.length > 0) {
        const { data: linkedData, error: linkedError } = await supabase
          .from('assignment_classes')
          .select('class_id, assignment_id')
          .in('class_id', classIds);
        if (linkedError) throw linkedError;
        allLinkedAssignments = linkedData || [];
      }

      const allAssignmentIds = Array.from(new Set(allLinkedAssignments.map(la => la.assignment_id)));

      let allSubmissions: any[] = [];
      if (allAssignmentIds.length > 0) {
        const { data: subsData, error: subsError } = await supabase
          .from('submissions')
          .select('assignment_id, student_name, final_score')
          .in('assignment_id', allAssignmentIds);
        if (subsError) throw subsError;
        allSubmissions = subsData || [];
      }

      const classesWithStats = classesData.map((c) => {
        const linked = allLinkedAssignments.filter(la => la.class_id === c.id);
        const assignmentIds = linked.map(la => la.assignment_id);

        let studentCount = 0;
        let avgScore = 0;

        if (assignmentIds.length > 0) {
          const subs = allSubmissions.filter(s => assignmentIds.includes(s.assignment_id));
          const uniqueStudents = new Set(subs.map(s => s.student_name));
          studentCount = uniqueStudents.size;

          const gradedSubs = subs.filter(s => s.final_score !== null);
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
      });

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
