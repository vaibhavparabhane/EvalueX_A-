import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { generateFeedbackPdfBlob } from '@/utils/feedbackPdf';
import { uploadAndStoreFeedbackPdf } from '@/services/apiClient';
import { gradeLabel } from '@/utils/helpers';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export interface Submission {
  id: string;
  student_name: string;
  final_score: number | null;
  ai_score: number | null;
  graded_at: string | null;
  feedback_pdf_url: string | null;
  assignment_id: string;
  assignment: {
    title: string;
    max_score: number;
  };
}

export function useResults() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    setLoadingData(true);
    try {
      const { data: assignments } = await supabase
        .from('assignments')
        .select('id, title, max_score')
        .eq('user_id', user?.id);

      if (assignments) {
        const { data: subs } = await supabase
          .from('submissions')
          .select('id, student_name, final_score, ai_score, graded_at, assignment_id, feedback_pdf_url')
          .in('assignment_id', assignments.map(a => a.id))
          .not('final_score', 'is', null)
          .order('graded_at', { ascending: false });

        if (subs) {
          const submissionsWithAssignment = subs.map((sub: any) => ({
            ...sub,
            assignment: assignments.find(a => a.id === sub.assignment_id) || { title: 'Unknown', max_score: 100 }
          }));
          setSubmissions(submissionsWithAssignment);
        }
      }
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    setDeletingId(submissionId);
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;
      toast.success('Submission deleted');
      setSubmissions(subs => subs.filter(s => s.id !== submissionId));
    } catch (error) {
      toast.error('Failed to delete submission');
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerateFeedbackPdf = async (sub: Submission) => {
    setGeneratingPdfId(sub.id);
    try {
      const { data: qg, error: qgErr } = await supabase
        .from('question_grades')
        .select('question_label, ai_score, max_score, ai_feedback, educator_override, confidence, is_counted')
        .eq('submission_id', sub.id);

      if (qgErr) throw new Error(`Failed to fetch question grades: ${qgErr.message}`);

      if (!qg || qg.length === 0) {
        toast.error('No grading data found for this submission. Make sure it has been fully graded.');
        return;
      }

      const pdfBlob = generateFeedbackPdfBlob({
        studentName: sub.student_name,
        assignmentTitle: sub.assignment.title,
        finalScore: sub.final_score ?? 0,
        maxScore: sub.assignment.max_score,
        gradedAt: sub.graded_at ?? '',
        questionGrades: qg.map(g => ({
          question_label: g.question_label,
          ai_score: g.ai_score,
          max_score: g.max_score,
          ai_feedback: g.ai_feedback,
          educator_override: g.educator_override,
          confidence: g.confidence,
          is_counted: g.is_counted,
        })),
      });

      const url = await uploadAndStoreFeedbackPdf(sub.id, pdfBlob);
      window.open(url, '_blank');

      setSubmissions(subs =>
        subs.map(s => s.id === sub.id ? { ...s, feedback_pdf_url: url } : s)
      );

      toast.success('Feedback PDF generated and stored successfully');
    } catch (err: any) {
      console.error('[handleGenerateFeedbackPdf]', err);
      toast.error(`Failed to generate feedback PDF: ${err.message}`);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Student Name',
      'Examination',
      'Score',
      'Max Score',
      'Percentage',
      'Grade',
      'Graded Date',
      'Feedback PDF',
    ];

    const rows = submissions.map(sub => {
      const percentage = Math.round((sub.final_score || 0) / sub.assignment.max_score * 100);
      const grade = gradeLabel(percentage);
      return [
        `"${sub.student_name.replace(/"/g, '""')}"`,
        `"${sub.assignment.title.replace(/"/g, '""')}"`,
        sub.final_score ?? '',
        sub.assignment.max_score,
        `${percentage}%`,
        grade,
        sub.graded_at ? new Date(sub.graded_at).toLocaleDateString() : '',
        sub.feedback_pdf_url ? sub.feedback_pdf_url : 'Not generated',
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
    const margin = 15;
    let yPos = 20;
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EvalueX — Results Report', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}  |  Total: ${submissions.length} submissions`,
      margin,
      yPos
    );
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    const cols = {
      student: margin,
      assignment: margin + 40,
      score: margin + 100,
      grade: margin + 125,
      date: margin + 140,
      feedback: margin + 168,
    };
    const feedbackColW = pageW - cols.feedback - margin;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin - 2, yPos - 5, pageW - margin * 2 + 4, 8, 'F');
    doc.text('Student', cols.student, yPos);
    doc.text('Examination', cols.assignment, yPos);
    doc.text('Score', cols.score, yPos);
    doc.text('Grade', cols.grade, yPos);
    doc.text('Date', cols.date, yPos);
    doc.text('Feedback PDF', cols.feedback, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    submissions.forEach((sub, idx) => {
      if (yPos > 185) {
        doc.addPage();
        yPos = 20;
      }

      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin - 2, yPos - 4, pageW - margin * 2 + 4, 8, 'F');
      }

      const percentage = Math.round((sub.final_score || 0) / sub.assignment.max_score * 100);
      const grade = gradeLabel(percentage);

      doc.setFontSize(8.5);
      doc.text(sub.student_name.substring(0, 20), cols.student, yPos);
      doc.text(sub.assignment.title.substring(0, 22), cols.assignment, yPos);
      doc.text(`${sub.final_score}/${sub.assignment.max_score}`, cols.score, yPos);
      doc.text(grade, cols.grade, yPos);
      doc.text(
        sub.graded_at ? new Date(sub.graded_at).toLocaleDateString() : '-',
        cols.date,
        yPos
      );

      if (sub.feedback_pdf_url) {
        doc.setTextColor(59, 130, 246);
        const truncatedUrl = doc.splitTextToSize(sub.feedback_pdf_url, feedbackColW)[0];
        doc.text(truncatedUrl, cols.feedback, yPos);
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setTextColor(180, 180, 180);
        doc.text('Not generated', cols.feedback, yPos);
        doc.setTextColor(0, 0, 0);
      }

      yPos += 8;
    });

    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `EvalueX Results Report  |  Page ${i} of ${totalPages}`,
        margin,
        doc.internal.pageSize.getHeight() - 8
      );
    }

    doc.save(`results-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully');
  };

  return {
    loading: loading || loadingData,
    submissions,
    deletingId,
    generatingPdfId,
    fetchResults,
    handleDeleteSubmission,
    handleGenerateFeedbackPdf,
    exportToCSV,
    exportToPDF,
    router
  };
}
