import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export interface Question {
  id: string;
  text: string;
  points: number;
  modelAnswer?: string;
  question_label?: string;
}

export interface Class {
  id: string;
  name: string;
}

export function useUploadExam() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string | undefined;
  const isEditMode = !!assignmentId;

  // Form state
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', points: 10 }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtractingQuestions, setIsExtractingQuestions] = useState(false);
  const [isExtractingModelAnswers, setIsExtractingModelAnswers] = useState(false);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [rubricsList, setRubricsList] = useState<any[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState('');
  const [loadingRubrics, setLoadingRubrics] = useState(false);
  const [loadingExam, setLoadingExam] = useState(isEditMode);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchClasses();
      fetchRubrics();
      if (isEditMode && assignmentId) {
        fetchExamData(assignmentId);
      }
    }
  }, [user, loading, router, isEditMode, assignmentId]);

  const fetchExamData = async (id: string) => {
    try {
      setLoadingExam(true);

      const { data: assignment, error: aErr } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', id)
        .single();
      if (aErr) throw aErr;

      setExamTitle(assignment.title || '');
      setExamDescription(assignment.description || '');
      setMaxScore(assignment.max_score || 100);

      const { data: examQuestions, error: qErr } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('assignment_id', id)
        .order('question_order');
      if (qErr) throw qErr;

      if (examQuestions && examQuestions.length > 0) {
        setQuestions(examQuestions.map(q => ({
          id: q.id,
          text: q.question_text || '',
          points: q.points || 10,
          modelAnswer: q.model_answer || undefined,
          question_label: (q as any).question_label || undefined,
        })));
      }

      const { data: classLinks, error: clErr } = await supabase
        .from('assignment_classes')
        .select('class_id')
        .eq('assignment_id', id);
      if (clErr) throw clErr;
      setSelectedClassIds((classLinks || []).map(c => c.class_id));

      const { data: rubric, error: rErr } = await supabase
        .from('exam_rubrics')
        .select('*')
        .eq('assignment_id', id)
        .maybeSingle();
      if (!rErr && rubric) {
        setSelectedRubricId('__pending__' + rubric.rubric_content);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load exam data');
    } finally {
      setLoadingExam(false);
    }
  };

  const fetchRubrics = async () => {
    try {
      setLoadingRubrics(true);
      const { data, error } = await supabase
        .from('rubrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRubricsList(data || []);

      setSelectedRubricId(prev => {
        if (prev.startsWith('__pending__')) {
          const content = prev.replace('__pending__', '');
          const matched = (data || []).find(r => r.content === content);
          return matched ? matched.id : '';
        }
        return prev;
      });
    } catch (error) {
      console.error('Error fetching rubrics:', error);
    } finally {
      setLoadingRubrics(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setAllClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: '', points: 10 }
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string | number) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, [field]: value } : q)
    );
  };

  const handleQuestionsPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file');
      return;
    }

    setIsExtractingQuestions(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/extract-questions-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract questions');
      }

      const data = await response.json();

      if (data.success && data.questions && data.questions.length > 0) {
        const newQuestions = data.questions.map((q: any) => ({
          id: crypto.randomUUID(),
          text: q.text || '',
          points: q.points || 10,
          question_label: q.question_label || undefined,
        }));

        setQuestions(prev => {
          if (prev.length === 1 && prev[0].text === '') {
            return newQuestions;
          }
          return [...prev, ...newQuestions];
        });

        toast.success(`Successfully extracted ${newQuestions.length} questions`);
      } else {
        toast.error('No questions were found in the PDF');
      }
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(error.message || 'Error parsing PDF');
    } finally {
      setIsExtractingQuestions(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleModelAnswersPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file');
      return;
    }

    if (questions.length === 0 || (questions.length === 1 && questions[0].text === '')) {
      toast.error('Please add or extract questions first');
      return;
    }

    setIsExtractingModelAnswers(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('questions', JSON.stringify(questions));

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/extract-model-answers-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract model answers');
      }

      const data = await response.json();

      if (data.success && data.modelAnswers && data.modelAnswers.length > 0) {
        setQuestions(prev => {
          return prev.map(q => {
            const match = data.modelAnswers.find((ma: any) => ma.question_text === q.text);
            if (match && match.model_answer) {
              return { ...q, modelAnswer: match.model_answer };
            }
            return q;
          });
        });
        toast.success(`Successfully extracted model answers`);
      } else {
        toast.error('No model answers were mapped from the PDF');
      }
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(error.message || 'Error parsing Model Answers PDF');
    } finally {
      setIsExtractingModelAnswers(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!examTitle.trim()) {
      toast.error('Please enter an exam title');
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      let targetId: string;

      if (isEditMode && assignmentId) {
        const { error: updateError } = await supabase
          .from('assignments')
          .update({
            title: examTitle,
            description: examDescription,
            max_score: maxScore
          })
          .eq('id', assignmentId);

        if (updateError) throw updateError;
        targetId = assignmentId;

        await supabase.from('assignment_classes').delete().eq('assignment_id', targetId);
        const { data: oldQuestions } = await supabase
          .from('exam_questions')
          .select('id')
          .eq('assignment_id', targetId);
        if (oldQuestions && oldQuestions.length > 0) {
          const oldIds = oldQuestions.map(q => q.id);
          await supabase.from('model_answers').delete().in('question_id', oldIds);
        }
        await supabase.from('exam_questions').delete().eq('assignment_id', targetId);
        await supabase.from('exam_rubrics').delete().eq('assignment_id', targetId);
      } else {
        const { data: assignment, error: assignmentError } = await supabase
          .from('assignments')
          .insert({
            user_id: user.id,
            title: examTitle,
            description: examDescription,
            max_score: maxScore
          })
          .select()
          .single();

        if (assignmentError) throw assignmentError;
        targetId = assignment.id;
      }

      if (selectedClassIds.length > 0) {
        const classMappings = selectedClassIds.map(classId => ({
          assignment_id: targetId,
          class_id: classId
        }));

        const { error: classMappingError } = await supabase
          .from('assignment_classes')
          .insert(classMappings);

        if (classMappingError) throw classMappingError;
      }

      const validQuestions = questions.filter(q => q.text.trim());
      if (validQuestions.length > 0) {
        const questionsToInsert = validQuestions.map((q, index) => ({
          assignment_id: targetId,
          question_text: q.text,
          points: q.points,
          model_answer: q.modelAnswer || null,
          question_order: index,
          question_label: q.question_label || null,
        }));

        const { data: insertedQuestions, error: questionsError } = await supabase
          .from('exam_questions')
          .insert(questionsToInsert)
          .select();

        if (questionsError) throw questionsError;

        const modelAnswersToInsert = validQuestions.map((q, i) => {
          if (!q.modelAnswer?.trim()) return null;
          const insertedQ = insertedQuestions?.find(iq => iq.question_text === q.text && iq.question_order === i);
          if (!insertedQ) return null;
          return {
            assignment_id: targetId,
            question_id: insertedQ.id,
            answer_text: q.modelAnswer.trim()
          };
        }).filter(Boolean);

        if (modelAnswersToInsert.length > 0) {
          const { error: maError } = await supabase
            .from('model_answers')
            .insert(modelAnswersToInsert);

          if (maError) throw maError;
        }
      }

      if (selectedRubricId && !selectedRubricId.startsWith('__pending__')) {
        const selectedRubric = rubricsList.find(r => r.id === selectedRubricId);
        if (selectedRubric) {
          const { error: rubricError } = await supabase
            .from('exam_rubrics')
            .insert({
              assignment_id: targetId,
              rubric_content: selectedRubric.content || ''
            });

          if (rubricError) throw rubricError;
        }
      }

      toast.success(isEditMode ? 'Examination updated successfully' : 'Examination created successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error saving examination');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditMode,
    loading: loading || loadingExam,
    examTitle,
    setExamTitle,
    examDescription,
    setExamDescription,
    maxScore,
    setMaxScore,
    questions,
    isSaving,
    isExtractingQuestions,
    isExtractingModelAnswers,
    allClasses,
    selectedClassIds,
    setSelectedClassIds,
    loadingClasses,
    rubricsList,
    selectedRubricId,
    setSelectedRubricId,
    loadingRubrics,
    addQuestion,
    removeQuestion,
    updateQuestion,
    handleQuestionsPdfUpload,
    handleModelAnswersPdfUpload,
    handleSave,
    router
  };
}
