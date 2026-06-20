import { supabase } from './supabaseClient';

export interface RubricInput {
  userId: string;
  name: string;
  fileUrl: string;
  filePath: string;
  content: string;
}

export const rubricService = {
  async fetchRubrics(userId: string) {
    const { data, error } = await supabase
      .from('rubrics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  async deleteRubric(id: string, filePath: string) {
    const { error: storageError } = await supabase.storage
      .from('rubrics')
      .remove([filePath]);
      
    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('rubrics')
      .delete()
      .eq('id', id);
      
    if (dbError) throw dbError;
  },

  async uploadRubricFile(filePath: string, file: File) {
    const { error: uploadError } = await supabase.storage
      .from('rubrics')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage
      .from('rubrics')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  async parseRubricPdf(file: File, token?: string) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/parse-rubric-pdf`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success && data.extractedText) {
      return data.extractedText;
    }
    return '';
  },

  async saveRubric(rubric: RubricInput) {
    const { error: dbError } = await supabase
      .from('rubrics')
      .insert({
        user_id: rubric.userId,
        name: rubric.name,
        file_url: rubric.fileUrl,
        file_path: rubric.filePath,
        content: rubric.content
      } as any);
      
    if (dbError) throw dbError;
  }
};
