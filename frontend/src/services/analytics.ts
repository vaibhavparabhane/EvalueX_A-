import { supabase } from './supabaseClient';

export const analyticsService = {
  async fetchUserAssignments(userId: string) {
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, max_score')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async fetchAssignmentsSubmissions(assignmentIds: string[]) {
    if (assignmentIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('submissions')
      .select('id, student_name, final_score, ai_score, graded_at, assignment_id, feedback_pdf_url')
      .in('assignment_id', assignmentIds)
      .not('final_score', 'is', null)
      .order('graded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
