import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { rubricService } from '@/services/rubrics';
import { supabase } from '@/services/supabaseClient';

export function useRubricManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchRubricsList();
    }
  }, [user, loading, router]);

  const fetchRubricsList = async () => {
    if (!user) return;
    try {
      setFetching(true);
      const data = await rubricService.fetchRubrics(user.id);
      setRubrics(data);
    } catch (error: any) {
      console.error('Error fetching rubrics:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      setDeleteLoading(id);
      await rubricService.deleteRubric(id, filePath);
      setRubrics(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Rubric deleted successfully."
      });
    } catch (error: any) {
      console.error('Error deleting rubric:', error);
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred while deleting.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Please enter a name for the rubric.', variant: 'destructive' });
      return;
    }
    if (!file) {
      toast({ title: 'Error', description: 'Please select a PDF file.', variant: 'destructive' });
      return;
    }
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const fileUrl = await rubricService.uploadRubricFile(filePath, file);
      
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      
      let parsedText = '';
      try {
        parsedText = await rubricService.parseRubricPdf(file, token);
      } catch (parseErr) {
        console.error('Failed to parse PDF text but continuing with upload:', parseErr);
      }
        
      await rubricService.saveRubric({
        userId: user.id,
        name: name.trim(),
        fileUrl,
        filePath,
        content: parsedText
      });
      
      toast({
        title: "Success",
        description: "Rubric successfully uploaded."
      });
      
      setIsOpen(false);
      setName('');
      setFile(null);
      fetchRubricsList();
    } catch (error: any) {
      console.error('Error uploading rubric:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading. Ensure the DB is properly set up.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    user,
    loading: loading || fetching,
    rubrics,
    isOpen,
    setIsOpen,
    uploading,
    deleteLoading,
    name,
    setName,
    file,
    setFile,
    handleDelete,
    handleFileChange,
    handleUpload
  };
}
