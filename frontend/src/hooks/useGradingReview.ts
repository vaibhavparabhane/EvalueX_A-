import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { gradingService } from '@/services/grading';
import { aggregateScores, regradeSingleQuestion, uploadAndStoreFeedbackPdf } from '@/services/apiClient';
import { generateFeedbackPdfBlob } from '@/utils/feedbackPdf';
import { toast } from 'sonner';

export interface QuestionGrade {
  id: string;
  submission_id: string;
  question_id: string;
  question_label: string;
  ai_score: number;
  max_score: number;
  ai_feedback: string;
  confidence: string;
  is_counted: boolean;
  educator_override: number | null;
  extracted_text?: string;
}

export interface Submission {
  id: string;
  student_name: string;
  content: string;
  ai_score: number | null;
  ai_feedback: string | null;
  final_score: number | null;
  graded_at: string | null;
  created_at: string;
  assignment_id: string;
  assignment: {
    id: string;
    title: string;
    max_score: number;
  };
  question_grades?: QuestionGrade[];
  feedback_pdf_url?: string | null;
}

export function useGradingReview() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Specific question editing state
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionEditScore, setQuestionEditScore] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [regradingId, setRegradingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Transcript editing state
  const [editingTranscriptId, setEditingTranscriptId] = useState<string | null>(null);
  const [transcriptValue, setTranscriptValue] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchSubmissionsList();
    }
  }, [user]);

  const fetchSubmissionsList = async () => {
    try {
      setLoadingData(true);
      const { data: assignments } = await supabase
        .from('assignments')
        .select('id, title, max_score')
        .eq('user_id', user?.id);

      if (assignments && assignments.length > 0) {
        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .in('assignment_id', assignments.map(a => a.id))
          .not('ai_score', 'is', null)
          .order('created_at', { ascending: false });

        if (subs) {
          const { data: qg } = await supabase
            .from('question_grades')
            .select('*')
            .in('submission_id', subs.map(s => s.id));

          const { data: sa } = await supabase
            .from('submission_answers')
            .select('submission_id, question_id, extracted_text')
            .in('submission_id', subs.map(s => s.id));

          const submissionsWithData = subs.map(sub => {
            const subQg = (qg || []).filter(g => g.submission_id === sub.id)
              .map(g => {
                const answer = (sa || []).find(a => a.submission_id === sub.id && a.question_id === g.question_id);
                return { ...g, extracted_text: answer?.extracted_text };
              })
              .sort((a, b) => {
                const numA = parseInt(a.question_label.replace(/\D+/g, ''), 10);
                const numB = parseInt(b.question_label.replace(/\D+/g, ''), 10);
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return a.question_label.localeCompare(b.question_label);
              });

            return {
              ...sub,
              assignment: assignments.find(a => a.id === sub.assignment_id) || { id: '', title: 'Unknown', max_score: 100 },
              question_grades: subQg
            };
          });
          setSubmissions(submissionsWithData);
        }
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const startQuestionEditing = (qg: QuestionGrade) => {
    setEditingQuestionId(qg.id);
    setQuestionEditScore(qg.educator_override ?? qg.ai_score ?? 0);
  };

  const cancelQuestionEditing = () => {
    setEditingQuestionId(null);
    setQuestionEditScore(0);
  };

  const saveQuestionGradeOverride = async (sub: Submission, qg: QuestionGrade) => {
    setSavingId(qg.id);
    try {
      await gradingService.updateQuestionOverride(qg.id, questionEditScore);
      toast.success('Question grade updated.');

      const aggRes = await aggregateScores(sub.id, sub.assignment_id);

      setSubmissions(subs => subs.map(s => {
        if (s.id === sub.id) {
          return {
            ...s,
            ai_score: aggRes.final_score,
            final_score: aggRes.final_score,
            question_grades: s.question_grades?.map(g =>
              g.id === qg.id ? { ...g, educator_override: questionEditScore } : g
            ),
          };
        }
        return s;
      }));
      setEditingQuestionId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save override');
    } finally {
      setSavingId(null);
    }
  };

  const selectOptionalQuestion = async (sub: Submission, qgId: string) => {
    setSavingId(qgId);
    try {
      await gradingService.updateQuestionCounted(qgId, true);
      toast.success('Optional question selected');
      await aggregateScores(sub.id, sub.assignment_id);
      await fetchSubmissionsList();
    } catch (err) {
      toast.error('Failed selection');
    } finally {
      setSavingId(null);
    }
  };

  const handleRegradeQuestion = async (sub: Submission, qg: QuestionGrade) => {
    setRegradingId(qg.id);
    try {
      const result = await regradeSingleQuestion(sub.id, qg.question_id, sub.assignment_id);

      toast.success(`Question ${qg.question_label} regraded successfully.`);

      setSubmissions(subs => subs.map(s => {
        if (s.id === sub.id) {
          const updatedQg = s.question_grades?.map(g =>
            g.id === qg.id ? { ...g, ...result.question_grade, extracted_text: g.extracted_text } : g
          );
          return { ...s, question_grades: updatedQg };
        }
        return s;
      }));

      const aggRes = await aggregateScores(sub.id, sub.assignment_id);
      setSubmissions(subs => subs.map(s => {
        if (s.id === sub.id) {
          return {
            ...s,
            ai_score: aggRes.final_score,
            final_score: aggRes.final_score
          };
        }
        return s;
      }));

    } catch (err) {
      console.error(err);
      toast.error('Failed to regrade question');
    } finally {
      setRegradingId(null);
    }
  };

  const startTranscriptEditing = (qg: QuestionGrade) => {
    setEditingTranscriptId(qg.id);
    setTranscriptValue(qg.extracted_text || '');
  };

  const saveTranscript = async (sub: Submission, qg: QuestionGrade) => {
    setSavingId(qg.id);
    try {
      const { error } = await supabase
        .from('submission_answers')
        .update({ extracted_text: transcriptValue })
        .eq('submission_id', sub.id)
        .eq('question_id', qg.question_id);

      if (error) throw error;

      toast.success('Transcript updated locally.');

      setSubmissions(subs => subs.map(s => {
        if (s.id === sub.id) {
          return {
            ...s,
            question_grades: s.question_grades?.map(g =>
              g.id === qg.id ? { ...g, extracted_text: transcriptValue } : g
            )
          };
        }
        return s;
      }));
      setEditingTranscriptId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transcript');
    } finally {
      setSavingId(null);
    }
  };

  const approveGrade = async (sub: Submission) => {
    setSavingId(sub.id);
    const finalScore = sub.final_score ?? sub.ai_score;
    const gradedAt = new Date().toISOString();

    const { error } = await supabase
      .from('submissions')
      .update({
        final_score: finalScore,
        graded_at: gradedAt,
      })
      .eq('id', sub.id);

    if (error) {
      toast.error('Failed to approve grade');
      setSavingId(null);
      return;
    }

    try {
      const pdfBlob = generateFeedbackPdfBlob({
        studentName: sub.student_name,
        assignmentTitle: sub.assignment.title,
        finalScore: finalScore ?? 0,
        maxScore: sub.assignment.max_score,
        gradedAt,
        questionGrades: (sub.question_grades || []).map(qg => ({
          question_label: qg.question_label,
          ai_score: qg.ai_score,
          max_score: qg.max_score,
          ai_feedback: qg.ai_feedback,
          educator_override: qg.educator_override,
          confidence: qg.confidence,
          is_counted: qg.is_counted,
        })),
      });
      await uploadAndStoreFeedbackPdf(sub.id, pdfBlob);
      toast.success('Grade released & feedback report saved');
    } catch (pdfErr) {
      console.error('[approveGrade] PDF generation failed:', pdfErr);
      toast.success('Grade approved and released');
      toast.warning('Feedback PDF could not be stored — download manually from Results');
    }

    setSubmissions(subs => subs.map(s =>
      s.id === sub.id ? { ...s, final_score: finalScore, graded_at: gradedAt } : s
    ));
    setSavingId(null);
  };

  const deleteSubmission = async (subId: string) => {
    setDeletingId(subId);
    try {
      const { error } = await supabase.from('submissions').delete().eq('id', subId);
      if (error) throw error;
      toast.success('Submission deleted');
      setSubmissions(subs => subs.filter(s => s.id !== subId));
    } catch (error) {
      toast.error('Failed to delete submission');
    } finally {
      setDeletingId(null);
    }
  };

  const hasPlaceholderContent = (content: string) => {
    return content.includes('[Note: For actual grading') ||
      content.includes('[Text extraction failed') ||
      content.includes('Uploaded file:');
  };

  const getStatus = (sub: Submission) => {
    if (sub.graded_at) return { label: 'Released', variant: 'default' as const };
    if (sub.final_score !== null) return { label: 'Reviewed', variant: 'secondary' as const };
    return { label: 'Pending Review', variant: 'outline' as const };
  };

  return {
    user,
    loading: loading || loadingData,
    submissions,
    expandedRows,
    toggleRow,
    editingQuestionId,
    setEditingQuestionId,
    questionEditScore,
    setQuestionEditScore,
    savingId,
    regradingId,
    deletingId,
    editingTranscriptId,
    setEditingTranscriptId,
    transcriptValue,
    setTranscriptValue,
    startQuestionEditing,
    cancelQuestionEditing,
    saveQuestionGradeOverride,
    selectOptionalQuestion,
    handleRegradeQuestion,
    startTranscriptEditing,
    saveTranscript,
    approveGrade,
    deleteSubmission,
    hasPlaceholderContent,
    getStatus,
    router
  };
}
