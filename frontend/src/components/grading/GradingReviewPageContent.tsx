"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Textarea } from '@/components/common/textarea';
import { Input } from '@/components/common/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/common/collapsible';
import { Loader2, ChevronDown, ChevronRight, CheckCircle, Edit2, Save, X, RefreshCw, AlertTriangle, Trash2, Download, FileText, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { uploadAndStoreFeedbackPdf } from '@/services/apiClient';
import { generateFeedbackPdfBlob } from '@/utils/feedbackPdf';
import { formatFeedback, formatStudentText } from '@/utils/helpers';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useGradingReview, Submission, QuestionGrade } from '@/hooks/useGradingReview';

/** Button that downloads the stored feedback PDF or regenerates it on demand */
function FeedbackPdfButton({ sub }: { sub: Submission }) {
  const [generating, setGenerating] = useState(false);

  const feedbackUrl = (sub as any).feedback_pdf_url as string | null;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const pdfBlob = generateFeedbackPdfBlob({
        studentName: sub.student_name,
        assignmentTitle: sub.assignment.title,
        finalScore: sub.final_score ?? sub.ai_score ?? 0,
        maxScore: sub.assignment.max_score,
        gradedAt: sub.graded_at ?? '',
        questionGrades: (sub.question_grades || []).map(qg => ({
          question_label: qg.question_label,
          ai_score: qg.ai_score,
          max_score: qg.max_score,
          ai_feedback: qg.ai_feedback,
          educator_override: qg.educator_override,
          confidence: qg.confidence,
          is_counted: qg.is_counted,
        })),
      });
      const url = await uploadAndStoreFeedbackPdf(sub.id, pdfBlob);
      window.open(url, '_blank');
      toast.success('Feedback PDF stored and opened');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate feedback PDF');
    } finally {
      setGenerating(false);
    }
  };

  if (feedbackUrl) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href={feedbackUrl} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4 mr-2" />
          Download Feedback PDF
        </a>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
      {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
      Generate Feedback PDF
    </Button>
  );
}

export function GradingReviewPageContent() {
  const {
    loading,
    submissions,
    expandedRows,
    toggleRow,
    editingQuestionId,
    questionEditScore,
    setQuestionEditScore,
    savingId,
    regradingId,
    editingTranscriptId,
    setEditingTranscriptId,
    transcriptValue,
    setTranscriptValue,
    startQuestionEditing,
    cancelQuestionEditing,
    saveQuestionGradeOverride,
    selectOptionalQuestion,
    handleRegradeQuestion,
    startTranscriptEditing,
    saveTranscript,
    approveGrade,
    deleteSubmission,
    hasPlaceholderContent,
    getStatus,
  } = useGradingReview();

  if (loading) return <PageLoader />;

  const pendingCount = submissions.filter(s => !s.graded_at).length;
  const reviewedCount = submissions.filter(s => s.graded_at).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold text-foreground mb-1">Grading Review</h1>
          <p className="text-muted-foreground mb-6">Review per-question grades and approve for release</p>

          <div className="flex gap-4 mb-8">
            <Card className="flex-1">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{reviewedCount}</div>
                <p className="text-sm text-muted-foreground">Released</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>AI Graded Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><p>No submissions to review</p></div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => {
                    const status = getStatus(sub);
                    const isExpanded = expandedRows.has(sub.id);
                    const displayScore = sub.final_score ?? sub.ai_score ?? 0;
                    const hasPlaceholder = hasPlaceholderContent(sub.content);
                    const qgList = sub.question_grades || [];

                    return (
                      <Collapsible key={sub.id} open={isExpanded} onOpenChange={() => toggleRow(sub.id)}>
                        <div className={`border rounded-lg overflow-hidden ${hasPlaceholder ? 'border-yellow-500/50' : ''}`}>
                          <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors bg-card">
                              <div className="flex items-center gap-4">
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                <div>
                                  <p className="font-medium">{sub.student_name}</p>
                                  <p className="text-sm text-muted-foreground">{sub.assignment.title}</p>
                                </div>
                                {hasPlaceholder && <Badge variant="outline" className="text-yellow-600 bg-yellow-500/10"><AlertTriangle className="h-3 w-3 mr-1" />No OCR</Badge>}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-medium text-lg">{displayScore} <span className="text-sm text-muted-foreground font-normal">/ {sub.assignment.max_score}</span></p>
                                </div>
                                <Badge variant={status.variant}>{status.label}</Badge>
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t p-6 bg-muted/10 space-y-6">
                              {/* Per Question Breakdown */}
                              {qgList.length > 0 ? (
                                <div className="space-y-4">
                                  <h3 className="font-semibold text-lg flex items-center gap-2">Question Breakdown</h3>
                                  <div className="grid gap-4">
                                    {qgList.map(qg => {
                                      const isEditingThis = editingQuestionId === qg.id;
                                      const activeScore = qg.educator_override ?? qg.ai_score ?? 0;
                                      const isLowConfidence = qg.confidence === 'low' || qg.confidence === 'medium';

                                      return (
                                        <Card key={qg.id} className={`border ${isLowConfidence && !qg.educator_override ? 'border-orange-500/50 bg-orange-500/5' : ''}`}>
                                          <CardContent className="p-4 space-y-4">

                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <h4 className="font-semibold text-lg">{qg.question_label}</h4>
                                                {!qg.is_counted && (
                                                  <Badge variant="destructive" className="mt-1">Optional conflict - requires selection</Badge>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-3">
                                                {isLowConfidence && !qg.educator_override && (
                                                  <Badge variant="outline" className="text-orange-600 border-orange-500">
                                                    Confidence: {qg.confidence}
                                                  </Badge>
                                                )}
                                                {qg.educator_override !== null && (
                                                  <Badge className="bg-blue-500 hover:bg-blue-600">Manual Override</Badge>
                                                )}
                                                <div className="text-xl font-bold">
                                                  {activeScore} <span className="text-sm text-muted-foreground font-normal">/ {qg.max_score}</span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Exact Handwriting Text extracted */}
                                            <div className="border border-blue-500/20 rounded-xl bg-blue-500/5 overflow-hidden shadow-sm relative group">
                                              <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                  <h4 className="text-sm font-semibold m-0 text-blue-900 dark:text-blue-300">Extracted Student Text</h4>
                                                </div>
                                                {!editingTranscriptId && sub.graded_at === null && (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => startTranscriptEditing(qg)}
                                                  >
                                                    <Edit2 className="h-3 w-3 mr-1" /> Edit OCR
                                                  </Button>
                                                )}
                                              </div>

                                              {editingTranscriptId === qg.id ? (
                                                <div className="p-4 space-y-3 bg-muted/5">
                                                  <Textarea
                                                    value={transcriptValue}
                                                    onChange={(e) => setTranscriptValue(e.target.value)}
                                                    className="min-h-[120px] bg-background font-mono text-sm leading-relaxed"
                                                  />
                                                  <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingTranscriptId(null)}>Cancel</Button>
                                                    <Button size="sm" onClick={() => saveTranscript(sub, qg)} disabled={savingId === qg.id}>
                                                      {savingId === qg.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                                                      Save & Close
                                                    </Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="p-4 text-sm max-h-[400px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-card-foreground">
                                                  {qg.extracted_text === '[NO ANSWER FOUND]' ? (
                                                    <span className="text-muted-foreground italic bg-muted/50 px-2 py-1 rounded">No answer found on scanned pages. Student did not attempt this question.</span>
                                                  ) : qg.extracted_text === '[EXTRACTION FAILED — MANUAL REVIEW REQUIRED]' ? (
                                                    <span className="text-destructive font-medium bg-destructive/10 px-2 py-1 rounded">Answer extraction failed. Please review the handwritten PDF and enter the score manually.</span>
                                                  ) : qg.extracted_text ? (
                                                    formatStudentText(qg.extracted_text)
                                                  ) : (
                                                    <span className="text-muted-foreground italic">No text extracted for this question.</span>
                                                  )}
                                                </div>
                                              )}
                                            </div>

                                            {/* AI Feedback & Rubric Output */}
                                            <div className="border border-purple-500/20 rounded-xl bg-purple-500/5 overflow-hidden shadow-sm">
                                              <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-3 flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                <h4 className="text-sm font-semibold m-0 text-purple-900 dark:text-purple-300">AI Feedback</h4>
                                              </div>
                                              <div className="p-4 text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                                                {formatFeedback(qg.ai_feedback)}
                                              </div>
                                            </div>

                                            {/* Editing UI */}
                                            <div className="pt-2 border-t mt-4 flex justify-between items-center">
                                              {isEditingThis ? (
                                                <div className="flex items-center gap-3 w-full bg-muted/50 p-2 rounded-lg">
                                                  <label className="text-sm font-medium">New Score:</label>
                                                  <Input type="number" min={0} max={qg.max_score} value={questionEditScore} onChange={(e) => setQuestionEditScore(Number(e.target.value))} className="w-24 bg-background" />
                                                  <Button size="sm" onClick={() => saveQuestionGradeOverride(sub, qg)} disabled={savingId === qg.id}>
                                                    {savingId === qg.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />} Save
                                                  </Button>
                                                  <Button variant="ghost" size="sm" onClick={cancelQuestionEditing}><X className="h-4 w-4" /></Button>
                                                </div>
                                              ) : (
                                                <div className="flex gap-2 w-full">
                                                  <Button variant="outline" size="sm" onClick={() => startQuestionEditing(qg)} disabled={sub.graded_at !== null}>
                                                    <Edit2 className="h-4 w-4 mr-2" /> Modify Score
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRegradeQuestion(sub, qg)}
                                                    disabled={sub.graded_at !== null || regradingId === qg.id}
                                                    className="text-accent border-accent/20 hover:bg-accent/5"
                                                  >
                                                    {regradingId === qg.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                                    Regrade Question
                                                  </Button>
                                                  {!qg.is_counted && (
                                                    <Button variant="default" size="sm" onClick={() => selectOptionalQuestion(sub, qg.id)}>
                                                      Accept Answer
                                                    </Button>
                                                  )}
                                                </div>
                                              )}
                                            </div>

                                          </CardContent>
                                        </Card>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                // Legacy Fallback view for strictly old monolithic grades
                                <div className="space-y-6">
                                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-yellow-700">Legacy Monolithic Grading Format</p>
                                      <p className="text-sm text-muted-foreground mt-1">This submission lacks per-question breakdowns because it was graded with legacy versions of EvalueX. To see the new Question-Centric format, regrade from scratch.</p>
                                    </div>
                                  </div>

                                  <div className="border border-blue-500/20 rounded-xl bg-blue-500/5 overflow-hidden shadow-sm">
                                    <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-3 flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      <h4 className="text-sm font-semibold m-0 text-blue-900 dark:text-blue-300">Extracted Student Text</h4>
                                    </div>
                                    <div className="p-5 text-sm max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-foreground">
                                      {sub.content ? formatStudentText(sub.content) : <span className="text-muted-foreground italic">No text extracted.</span>}
                                    </div>
                                  </div>

                                  {sub.ai_feedback && (
                                    <div className="border border-purple-500/20 rounded-xl bg-purple-500/5 overflow-hidden shadow-sm">
                                      <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-3 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <h4 className="text-sm font-semibold m-0 text-purple-900 dark:text-purple-300">Legacy AI Feedback</h4>
                                      </div>
                                      <div className="p-5 text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                                        {formatFeedback(sub.ai_feedback)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Footer Actions */}
                              <div className="flex justify-between items-center pt-6 border-t">
                                {!sub.graded_at ? (
                                  <>
                                    <ConfirmDialog
                                      title="Confirm Deletion"
                                      description="This will permanently delete this student submission. This action cannot be undone."
                                      confirmText="Delete"
                                      onConfirm={() => deleteSubmission(sub.id)}
                                      trigger={
                                        <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-white">
                                          <Trash2 className="h-4 w-4 mr-2" /> Delete Submission
                                        </Button>
                                      }
                                    />

                                    <Button onClick={() => approveGrade(sub)} disabled={savingId === sub.id} size="lg">
                                      {savingId === sub.id ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                                      Finalize & Release Total Score ({displayScore}/{sub.assignment.max_score})
                                    </Button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-3 ml-auto">
                                    <FeedbackPdfButton sub={sub} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
