"use client";

import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/common/table';
import { Badge } from '@/components/common/badge';
import { Button } from '@/components/common/button';
import { Loader2, FileText, Trash2, Download, Eye, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { gradeLabel } from '@/utils/helpers';
import { PageLoader } from '@/components/common/PageLoader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useResults } from '@/hooks/useResults';

export function ResultsPageContent() {
  const {
    loading,
    submissions,
    deletingId,
    generatingPdfId,
    fetchResults,
    handleDeleteSubmission,
    handleGenerateFeedbackPdf,
    exportToCSV,
    exportToPDF,
  } = useResults();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">Results</h1>
          <p className="text-muted-foreground mb-8">View all graded submissions and download individual AI feedback reports</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Graded Submissions ({submissions.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchResults}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV} disabled={submissions.length === 0}>
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF} disabled={submissions.length === 0}>
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No graded submissions yet</p>
                  <p className="text-sm mt-1">Approve grades in Grading Review to see them here.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Examination</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Graded</TableHead>
                      <TableHead>Feedback PDF</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => {
                      const percentage = Math.round((sub.final_score || 0) / sub.assignment.max_score * 100);
                      const grade = gradeLabel(percentage);
                      const isGenerating = generatingPdfId === sub.id;

                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.student_name}</TableCell>
                          <TableCell>{sub.assignment.title}</TableCell>
                          <TableCell>{sub.final_score}/{sub.assignment.max_score}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                ['A+', 'A', 'B'].includes(grade)
                                  ? 'default'
                                  : ['C', 'D'].includes(grade)
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sub.graded_at ? new Date(sub.graded_at).toLocaleDateString() : '-'}
                          </TableCell>

                          <TableCell>
                            {sub.feedback_pdf_url ? (
                              <div className="flex gap-1 items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="View feedback PDF"
                                  asChild
                                >
                                  <a href={sub.feedback_pdf_url} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                  title="Re-generate feedback PDF from grading data"
                                  onClick={() => handleGenerateFeedbackPdf(sub)}
                                  disabled={isGenerating}
                                >
                                  {isGenerating
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <RefreshCw className="h-4 w-4" />}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleGenerateFeedbackPdf(sub)}
                                disabled={isGenerating}
                              >
                                {isGenerating
                                  ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  : <FileText className="h-4 w-4 mr-1" />}
                                {isGenerating ? 'Generating…' : 'Generate PDF'}
                              </Button>
                            )}
                          </TableCell>

                          <TableCell>
                            <ConfirmDialog
                              title="Delete Result?"
                              description={`This will permanently delete the graded submission for ${sub.student_name} and its stored feedback PDF. This action cannot be undone.`}
                              confirmText="Delete"
                              onConfirm={() => handleDeleteSubmission(sub.id)}
                              isLoading={deletingId === sub.id}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Feedback PDFs are generated from the AI grading data and stored securely.
            Click <strong>Generate PDF</strong> if the column shows no link, or <strong>View</strong> to open an existing report.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
