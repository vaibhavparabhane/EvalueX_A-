import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { extractAnswers, gradeSubmission } from '@/services/apiClient';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'extracting' | 'processing' | 'complete' | 'error';
  progress: number;
  preview?: string;
  errorMessage?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  max_score: number;
}

export function useUploadAnswers() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [autoGrade, setAutoGrade] = useState(false);
  const [gradingProgress, setGradingProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAssignmentsList();
    }
  }, [user]);

  const fetchAssignmentsList = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('id, title, description, max_score')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAssignments(data);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validTypes = [
      'application/pdf'
    ];
    
    const newFiles: UploadedFile[] = [];
    
    files.forEach(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return;
      }

      const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, preview: e.target?.result as string } : f)
          );
        };
        reader.readAsDataURL(file);
      }
      
      newFiles.push(newFile);
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const fileToPagesBase64 = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve([base64]);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAutoGradeSubmission = async (submissionId: string, assignmentId: string): Promise<boolean> => {
    try {
      const data = await gradeSubmission(submissionId, '', '', null, 0, assignmentId);
      if (data?.error) throw new Error(data.error);
      return true;
    } catch (error) {
      console.error('Grading error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to grade submission');
      return false;
    }
  };

  const processFiles = async () => {
    if (!selectedAssignment) {
      toast.error('Please select an examination first');
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please upload some files first');
      return;
    }

    setIsProcessing(true);
    const submissionsToGrade: { id: string; assignmentId: string }[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      setUploadedFiles(prev =>
        prev.map(f => f.id === file.id ? { ...f, status: 'uploading', progress: 10 } : f)
      );

      let submissionId: string | null = null;

      try {
        const studentName = file.name.replace(/\.[^/.]+$/, '');

        const { data: submission, error } = await supabase.from('submissions').insert({
          assignment_id: selectedAssignment,
          student_name: studentName,
          content: '',
          grading_status: 'pending',
        }).select('id').single();

        if (error || !submission) throw error || new Error('Failed to create submission row');
        submissionId = submission.id;

        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, progress: 30 } : f)
        );

        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, status: 'extracting', progress: 40 } : f)
        );

        const pages = await fileToPagesBase64(file.file);
        const extractResult = await extractAnswers(
          submissionId,
          selectedAssignment,
          pages,
          file.type
        );

        if (extractResult?.partial_extraction) {
          toast.warning(
            `Partial extraction for ${file.name}: ${extractResult.submission_answers_count}/${extractResult.expected_count} questions extracted. Grading may be incomplete.`
          );
        }

        if (!extractResult?.submission_answers_count || extractResult.submission_answers_count === 0) {
          throw new Error(`Answer extraction returned 0 rows for ${file.name}. Cannot grade.`);
        }

        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, progress: 80 } : f)
        );

        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? { ...f, status: 'complete', progress: 100 } : f)
        );

        if (autoGrade) {
          submissionsToGrade.push({ id: submissionId, assignmentId: selectedAssignment });
        }

      } catch (error) {
        console.error('Error processing file:', file.name, error);
        setUploadedFiles(prev =>
          prev.map(f => f.id === file.id ? {
            ...f,
            status: 'error',
            errorMessage: error instanceof Error ? error.message : 'Processing failed',
          } : f)
        );
      }
    }

    const successCount = uploadedFiles.filter(f => f.status === 'complete').length;
    if (successCount > 0) {
      toast.success(`Successfully processed ${successCount} file(s) — answers extracted and ready for grading`);
    }

    if (autoGrade && submissionsToGrade.length > 0) {
      setGradingProgress({ current: 0, total: submissionsToGrade.length });

      for (let i = 0; i < submissionsToGrade.length; i++) {
        setGradingProgress({ current: i + 1, total: submissionsToGrade.length });
        const sub = submissionsToGrade[i];
        await handleAutoGradeSubmission(sub.id, sub.assignmentId);
        if (i < submissionsToGrade.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setGradingProgress(null);
      toast.success(`AI grading complete for ${submissionsToGrade.length} submission(s)`);
    }

    setIsProcessing(false);
  };

  return {
    loading,
    assignments,
    selectedAssignment,
    setSelectedAssignment,
    uploadedFiles,
    setUploadedFiles,
    isDragging,
    isProcessing,
    previewFile,
    setPreviewFile,
    autoGrade,
    setAutoGrade,
    gradingProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    removeFile,
    processFiles,
    router
  };
}
