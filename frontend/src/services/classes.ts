import { supabase } from './supabaseClient';

export interface ClassInput {
  name: string;
  description: string;
  userId: string;
}

export const classService = {
  async fetchClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async fetchClassLinkedAssignments(classId: string) {
    const { data: linkedAssignments, error } = await supabase
      .from('assignment_classes')
      .select('assignment_id')
      .eq('class_id', classId);

    if (error) throw error;
    return linkedAssignments || [];
  },

  async createClass(input: ClassInput) {
    const { error } = await supabase.from('classes').insert({
      name: input.name,
      description: input.description,
      user_id: input.userId
    });

    if (error) throw error;
  },

  async fetchClassById(classId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('name')
      .eq('id', classId)
      .single();

    if (error) throw error;
    return data;
  }
};
