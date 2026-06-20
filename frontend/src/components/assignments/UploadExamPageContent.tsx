"use client";

import { useUploadExam } from '@/hooks/useUploadExam';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Textarea } from '@/components/common/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/tabs';
import {
  Upload, Loader2, FileText, X,
  Plus, Trash2, GripVertical, Save, BookOpen, Users
} from 'lucide-react';
import { Badge } from '@/components/common/badge';
import { Checkbox } from '@/components/common/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader } from '@/components/common/PageLoader';

export function UploadExamPageContent() {
  const {
    isEditMode,
    loading,
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
  } = useUploadExam();

  const toggleClass = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

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
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {isEditMode ? 'Edit Exam' : 'Exam Setup'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? 'Update exam details, questions and rubric' : 'Create exam templates with questions and rubrics'}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditMode ? 'Update Exam' : 'Save Template'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="details" className="gap-2">
                <FileText className="h-4 w-4" />
                Exam Details
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="rubric" className="gap-2">
                <FileText className="h-4 w-4" />
                Rubric
              </TabsTrigger>
            </TabsList>

            {/* Exam Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Set up the basic details for your exam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Midterm Exam - Biology 101"
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a brief description of the exam..."
                        value={examDescription}
                        onChange={(e) => setExamDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxScore">Maximum Score</Label>
                        <Input
                          type="number"
                          id="maxScore"
                          placeholder="100"
                          value={maxScore || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMaxScore(val === '' ? 0 : parseInt(val));
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" />
                        Attach to Classes
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {loadingClasses ? (
                          <div className="col-span-full flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : allClasses.length > 0 ? (
                          allClasses.map((cls) => (
                            <div
                              key={cls.id}
                              onClick={() => toggleClass(cls.id)}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedClassIds.includes(cls.id)
                                  ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                                  : 'border-border hover:border-accent/40 bg-card'
                              }`}
                            >
                              <Checkbox
                                id={`class-${cls.id}`}
                                checked={selectedClassIds.includes(cls.id)}
                                onCheckedChange={() => toggleClass(cls.id)}
                                className="border-accent data-[state=checked]:bg-accent"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Label
                                htmlFor={`class-${cls.id}`}
                                className="flex-1 font-medium cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {cls.name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full p-4 rounded-lg border border-dashed text-center">
                            <p className="text-sm text-muted-foreground mb-2">No classes found</p>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-accent underline"
                              onClick={() => router.push('/classes')}
                            >
                              Create your first class in the Classes tab
                            </Button>
                          </div>
                        )}
                      </div>
                      {selectedClassIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs text-muted-foreground w-full">Selected:</span>
                          {selectedClassIds.map(id => {
                            const cls = allClasses.find(c => c.id === id);
                            return cls ? (
                              <Badge key={id} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                {cls.name}
                                <X 
                                  className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleClass(id);
                                  }} 
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Questions</CardTitle>
                  <CardDescription>Add questions with point values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                            <GripVertical className="h-4 w-4 cursor-grab" />
                            <span className="font-medium text-sm">Q{index + 1}</span>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Question Text</Label>
                              <Textarea
                                placeholder="Enter the question..."
                                value={question.text}
                                onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  placeholder="10"
                                  value={question.points || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateQuestion(question.id, 'points', val === '' ? 0 : parseInt(val));
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Model Answer (Optional)</Label>
                              <Textarea
                                placeholder="Enter the expected model answer..."
                                value={question.modelAnswer || ''}
                                onChange={(e) => updateQuestion(question.id, 'modelAnswer', e.target.value)}
                                rows={2}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                            disabled={questions.length === 1}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input
                        id="questions-pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleQuestionsPdfUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById('questions-pdf-upload')?.click()} disabled={isExtractingQuestions || isExtractingModelAnswers} className="w-full gap-2">
                        {isExtractingQuestions ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isExtractingQuestions ? 'Extracting...' : 'Upload Questions (PDF)'}
                      </Button>
                    </div>
                    <div>
                      <input
                        id="model-answers-pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleModelAnswersPdfUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById('model-answers-pdf-upload')?.click()} disabled={isExtractingModelAnswers || isExtractingQuestions} className="w-full gap-2">
                        {isExtractingModelAnswers ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {isExtractingModelAnswers ? 'Extracting...' : 'Upload Model Answers (PDF)'}
                      </Button>
                    </div>
                    <Button variant="outline" onClick={addQuestion} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rubric Tab */}
            <TabsContent value="rubric" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grading Rubric</CardTitle>
                  <CardDescription>Select a grading rubric from your previously uploaded rubrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Select Rubric</Label>
                    {loadingRubrics ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading rubrics...
                      </div>
                    ) : rubricsList.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rubricsList.map((rubric) => (
                          <div
                            key={rubric.id}
                            onClick={() => setSelectedRubricId(rubric.id)}
                            className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedRubricId === rubric.id
                                ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                                : 'border-border hover:border-accent/40 bg-card'
                            }`}
                          >
                            <Checkbox
                              id={`rubric-${rubric.id}`}
                              checked={selectedRubricId === rubric.id}
                              onCheckedChange={() => setSelectedRubricId(rubric.id)}
                              className="border-accent data-[state=checked]:bg-accent mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`rubric-${rubric.id}`}
                                className="font-medium cursor-pointer block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {rubric.name}
                              </Label>
                              <a 
                                href={rubric.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline mt-1 inline-block"
                                onClick={e => e.stopPropagation()}
                              >
                                View PDF
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed rounded-lg bg-muted/20 text-center">
                        <p className="text-sm text-muted-foreground mb-2">No rubrics found</p>
                        <Button variant="link" onClick={() => router.push('/rubrics')} className="text-accent h-auto p-0">
                          Go to Rubrics tab to upload one
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
