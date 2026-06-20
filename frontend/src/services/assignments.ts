import { supabase } from './supabaseClient';

export interface AssignmentInput {
  title: string;
  description: string;
  maxScore: number;
}

export const assignmentService = {
  async fetchAssignments() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchAssignmentSubmissionsSummary(assignmentId: string) {
    const { data: subs, error } = await supabase
      .from('submissions')
      .select('final_score')
      .eq('assignment_id', assignmentId);

    if (error) throw error;
    return subs || [];
  },

  async deleteAssignment(assignmentId: string) {
    // Delete student submissions
    await supabase.from('submissions').delete().eq('assignment_id', assignmentId);
    
    // Fetch associated questions to clear their model answers
    const { data: oldQs } = await supabase
      .from('exam_questions')
      .select('id')
      .eq('assignment_id', assignmentId);
      
    if (oldQs && oldQs.length > 0) {
      await supabase.from('model_answers').delete().in('question_id', oldQs.map(q => q.id));
    }
    
    // Delete questions and rubrics
    await supabase.from('exam_questions').delete().eq('assignment_id', assignmentId);
    await supabase.from('exam_rubrics').delete().eq('assignment_id', assignmentId);
    
    // Delete the assignment itself
    const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
    if (error) throw error;
  },

  async fetchAssignmentDetails(assignmentId: string) {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();
      
    if (error) throw error;
    return data;
  },

  async fetchAssignmentQuestions(assignmentId: string) {
    const { data, error } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('question_number', { ascending: true });
      
    if (error) throw error;
    return data || [];
  },

  async fetchQuestionModelAnswers(questionId: string) {
    const { data, error } = await supabase
      .from('model_answers')
      .select('*')
      .eq('question_id', questionId);
      
    if (error) throw error;
    return data || [];
  },

  async fetchAssignmentRubric(assignmentId: string) {
    const { data, error } = await supabase
      .from('exam_rubrics')
      .select('*')
      .eq('assignment_id', assignmentId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  }
};
