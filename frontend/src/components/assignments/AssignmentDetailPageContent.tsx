"use client";

import { useAssignmentDetails } from '@/hooks/useAssignmentDetails';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Textarea } from '@/components/common/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/common/dialog';
import { Badge } from '@/components/common/badge';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Plus, Sparkles, CheckCircle2, Clock, Loader2, User, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';

export function AssignmentDetailPageContent() {
  const {
    loading,
    assignment,
    submissions,
    addOpen,
    setAddOpen,
    adding,
    grading,
    studentName,
    setStudentName,
    content,
    setContent,
    selectedSubmission,
    setSelectedSubmission,
    deletingSubmission,
    deletingAssignment,
    handleAddSubmission,
    handleGradeWithAI,
    handleFinalizeScore,
    handleDeleteSubmission,
    handleDeleteAssignment,
    router
  } = useAssignmentDetails();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Back button and title */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <ConfirmDialog
              title="Delete Examination?"
              description={`This will permanently delete "${assignment?.title}" and all its submissions, questions, and rubrics. This action cannot be undone.`}
              confirmText="Delete"
              onConfirm={handleDeleteAssignment}
              isLoading={deletingAssignment}
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Examination
                </Button>
              }
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{assignment?.title}</h1>
          {assignment?.description && (
            <p className="text-muted-foreground">{assignment.description}</p>
          )}
          <Badge variant="secondary" className="mt-2">
            Max Score: {assignment?.max_score} points
          </Badge>
        </div>

        {/* Add submission button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Student Submissions</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Submission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Student Submission</DialogTitle>
                <DialogDescription>
                  Enter the student's work to grade with AI assistance.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmission} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    placeholder="John Doe"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Submission Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type the student's work here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={adding}>
                  {adding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Submission'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Submissions list */}
        {submissions.length === 0 ? (
          <EmptyState
            icon={User}
            title="No submissions yet"
            description="Add student submissions to grade them with AI."
            action={
              <Button variant="hero" onClick={() => setAddOpesn(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Submission
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:border-accent/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {submission.student_name}
                      </CardTitle>
                      <CardDescription>
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.final_score !== null ? (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {submission.final_score}/{assignment?.max_score}
                        </Badge>
                      ) : submission.ai_score !== null ? (
                        <Badge variant="secondary" className="bg-warning/10 text-warning">
                          <Clock className="h-3 w-3 mr-1" />
                          AI: {submission.ai_score} - Pending Review
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Not graded
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {submission.content}
                    </p>

                    {submission.ai_feedback && (
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-accent font-medium mb-2">
                          <Sparkles className="h-4 w-4" />
                          AI Feedback
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {submission.ai_feedback}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {submission.final_score === null && (
                        <>
                          {submission.ai_score === null ? (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleGradeWithAI(submission)}
                              disabled={grading === submission.id}
                            >
                              {grading === submission.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Grading...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Grade with AI
                                </>
                              )}
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="hero" size="sm">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Finalize Score
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Finalize Score</DialogTitle>
                                  <DialogDescription>
                                    Review the AI suggestion and enter the final score.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div className="flex items-center gap-4">
                                    <Label>AI Suggested Score:</Label>
                                    <Badge variant="secondary">{submission.ai_score}/{assignment?.max_score}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="finalScore">Final Score</Label>
                                    <Input
                                      id="finalScore"
                                      type="number"
                                      defaultValue={submission.ai_score || ''}
                                      min="0"
                                      max={assignment?.max_score}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          const target = e.target as HTMLInputElement;
                                          handleFinalizeScore(submission.id, parseInt(target.value));
                                        }
                                      }}
                                    />
                                  </div>
                                  <Button
                                    variant="hero"
                                    className="w-full"
                                    onClick={(e) => {
                                      const input = document.getElementById('finalScore') as HTMLInputElement;
                                      handleFinalizeScore(submission.id, parseInt(input.value));
                                    }}
                                  >
                                    Save Final Score
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        View Full Submission
                      </Button>
                      <ConfirmDialog
                        title="Delete Submission?"
                        description={`This will permanently delete the submission from ${submission.student_name}. This action cannot be undone.`}
                        confirmText="Delete"
                        onConfirm={() => handleDeleteSubmission(submission.id)}
                        isLoading={deletingSubmission === submission.id}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full submission dialog */}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSubmission?.student_name}'s Submission</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <Label className="text-sm text-muted-foreground">Content</Label>
                <p className="mt-2 whitespace-pre-wrap">{selectedSubmission?.content}</p>
              </div>
              {selectedSubmission?.ai_feedback && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-accent font-medium mb-2">
                    <Sparkles className="h-4 w-4" />
                    AI Feedback
                  </div>
                  <p className="whitespace-pre-wrap">{selectedSubmission.ai_feedback}</p>
                  {selectedSubmission.ai_score !== null && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <Badge variant="secondary">
                        AI Suggested Score: {selectedSubmission.ai_score}/{assignment?.max_score}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
