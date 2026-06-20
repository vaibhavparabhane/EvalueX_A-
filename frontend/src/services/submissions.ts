import { supabase } from './supabaseClient';

export interface SubmissionInput {
  assignmentId: string;
  studentName: string;
  content: string;
}

export const submissionService = {
  async fetchSubmissions(assignmentId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addManualSubmission(submission: SubmissionInput) {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        assignment_id: submission.assignmentId,
        student_name: submission.studentName,
        content: submission.content,
      });

    if (error) throw error;
    return data;
  },

  async finalizeScore(submissionId: string, score: number) {
    const { error } = await supabase
      .from('submissions')
      .update({
        final_score: score,
        graded_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) throw error;
  },

  async deleteSubmission(submissionId: string) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId);

    if (error) throw error;
  }
};
