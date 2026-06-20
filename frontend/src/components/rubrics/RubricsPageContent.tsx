"use client";

import { useRubricManagement } from '@/hooks/useRubricManagement';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/common/dialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader2, BookOpen, Plus, FileText, Upload, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageLoader } from '@/components/common/PageLoader';

export function RubricsPageContent() {
  const {
    loading,
    rubrics,
    isOpen,
    setIsOpen,
    uploading,
    deleteLoading,
    name,
    setName,
    handleDelete,
    handleFileChange,
    handleUpload
  } = useRubricManagement();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Rubrics</h1>
            <p className="text-muted-foreground">Create and manage grading rubrics</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                New Rubric
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Rubric</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rubric Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Midterm Programming Guidelines" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">PDF File</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="file" 
                      type="file" 
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full mt-4" disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? 'Uploading...' : 'Save Rubric'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {rubrics.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No rubrics yet"
            description="Click on the 'New Rubric' button at the top right to create grading criteria for AI-powered assessments."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rubrics.map((rubric) => (
              <Card key={rubric.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1" title={rubric.name}>{rubric.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(rubric.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={rubric.file_url} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    </Button>
                    <ConfirmDialog
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete the rubric document and remove it from our servers."
                      confirmText="Delete"
                      onConfirm={() => handleDelete(rubric.id, rubric.file_path)}
                      isLoading={deleteLoading === rubric.id}
                      trigger={
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
