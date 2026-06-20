import { supabase } from './supabaseClient';

export const gradingService = {
  async fetchGradingSubmission(submissionId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, assignment:assignments(*), question_grades:question_grades(*)')
      .eq('id', submissionId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateQuestionOverride(qgId: string, overrideScore: number | null) {
    const { error } = await supabase
      .from('question_grades')
      .update({ educator_override: overrideScore })
      .eq('id', qgId);

    if (error) throw error;
  },

  async updateQuestionCounted(qgId: string, counted: boolean) {
    const { error } = await supabase
      .from('question_grades')
      .update({ is_counted: counted })
      .eq('id', qgId);

    if (error) throw error;
  },

  async updateQuestionFeedback(qgId: string, feedback: string) {
    const { error } = await supabase
      .from('question_grades')
      .update({ ai_feedback: feedback })
      .eq('id', qgId);

    if (error) throw error;
  }
};
