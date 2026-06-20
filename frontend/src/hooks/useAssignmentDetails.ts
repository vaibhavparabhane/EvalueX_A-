import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { assignmentService } from '@/services/assignments';
import { submissionService } from '@/services/submissions';
import { gradeSubmission } from '@/services/apiClient';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  max_score: number;
}

interface Submission {
  id: string;
  student_name: string;
  content: string;
  ai_feedback: string | null;
  ai_score: number | null;
  final_score: number | null;
  graded_at: string | null;
  created_at: string;
}

export function useAssignmentDetails() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user, loading: authLoading } = useAuth();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [grading, setGrading] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [content, setContent] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deletingSubmission, setDeletingSubmission] = useState<string | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) {
      fetchAssignmentData();
      fetchSubmissionsList();
    }
  }, [user, id]);

  const fetchAssignmentData = async () => {
    if (!id) return;
    try {
      const data = await assignmentService.fetchAssignmentDetails(id);
      if (!data) throw new Error('Not found');
      setAssignment(data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Examination not found.',
        variant: 'destructive',
      });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsList = async () => {
    if (!id) return;
    try {
      const data = await submissionService.fetchSubmissions(id);
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleAddSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setAdding(true);
      await submissionService.addManualSubmission({
        assignmentId: id,
        studentName,
        content
      });
      toast({
        title: 'Submission added',
        description: 'Ready for AI grading.',
      });
      setAddOpen(false);
      setStudentName('');
      setContent('');
      fetchSubmissionsList();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleGradeWithAI = async (submission: Submission) => {
    if (!id) return;
    try {
      setGrading(submission.id);
      
      const result = await gradeSubmission(submission.id, '', '', null, 0, id);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Grading complete',
        description: `Successfully graded submission for ${submission.student_name}.`,
      });
      
      fetchSubmissionsList();
    } catch (error: any) {
      console.error('AI Grading error:', error);
      const errMsg = error?.message || '';
      if (errMsg.includes('No extracted answers found') || errMsg.includes('extract-answers first')) {
        toast({
          title: 'No Answer Sheet Found',
          description: 'AI grading requires scanned answer sheets. Please upload this student\'s answer sheet on the "Upload Answers" page first.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Grading failed',
          description: error.message || 'An error occurred during AI grading.',
          variant: 'destructive',
        });
      }
    } finally {
      setGrading(null);
    }
  };

  const handleFinalizeScore = async (submissionId: string, score: number) => {
    try {
      await submissionService.finalizeScore(submissionId, score);
      toast({
        title: 'Score finalized',
        description: 'The grade has been saved.',
      });
      fetchSubmissionsList();
      setSelectedSubmission(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      setDeletingSubmission(submissionId);
      await submissionService.deleteSubmission(submissionId);
      toast({
        title: 'Submission deleted',
        description: 'The student submission has been removed.',
      });
      fetchSubmissionsList();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingSubmission(null);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!id) return;
    try {
      setDeletingAssignment(true);
      await assignmentService.deleteAssignment(id);
      toast({
        title: 'Examination deleted',
        description: 'The examination and all related data have been removed.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingAssignment(false);
    }
  };

  return {
    id,
    loading: authLoading || loading,
    assignment,
    submissions,
    addOpen,
    setAddOpen,
    adding,
    grading,
    studentName,
    setStudentName,
    content,
    setContent,
    selectedSubmission,
    setSelectedSubmission,
    deletingSubmission,
    deletingAssignment,
    handleAddSubmission,
    handleGradeWithAI,
    handleFinalizeScore,
    handleDeleteSubmission,
    handleDeleteAssignment,
    router
  };
}
