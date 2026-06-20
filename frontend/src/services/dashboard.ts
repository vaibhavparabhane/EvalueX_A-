import { supabase } from './supabaseClient';

export const dashboardService = {
  async fetchAssignments() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchSubmissionsForAssignments(assignmentIds: string[]) {
    if (assignmentIds.length === 0) return [];
    const { data, error } = await supabase
      .from('submissions')
      .select('id, student_name, final_score, graded_at, created_at, assignment_id')
      .in('assignment_id', assignmentIds);

    if (error) throw error;
    return data || [];
  },

  async deleteAssignment(assignmentId: string) {
    // Delete related items in order to prevent foreign key errors
    await supabase.from('submissions').delete().eq('assignment_id', assignmentId);
    await supabase.from('exam_questions').delete().eq('assignment_id', assignmentId);
    await supabase.from('exam_rubrics').delete().eq('assignment_id', assignmentId);
    
    const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
    if (error) throw error;
    return true;
  }
};
