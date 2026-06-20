"use client";

import { useAssignmentManagement } from '@/hooks/useAssignmentManagement';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { PageLoader } from '@/components/common/PageLoader';
import { motion } from 'framer-motion';
import {
  Plus, FileText, Pencil, Trash2, Loader2,
  ArrowRight, Search
} from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';

export function AssignmentsPageContent() {
  const {
    loading,
    assignments,
    filtered,
    deletingId,
    search,
    setSearch,
    handleDelete,
    router
  } = useAssignmentManagement();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8 transition-all duration-300">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Examinations</h1>
            <p className="text-muted-foreground">
              {assignments.length} examination{assignments.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button variant="hero" onClick={() => router.push('/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            New Examination
          </Button>
        </motion.div>

        {/* Search */}
        {assignments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative mb-6"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search examinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </motion.div>
        )}

        {/* Empty state */}
        {assignments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No examinations yet"
            description="Create your first examination to start grading with AI."
            action={
              <Button variant="hero" onClick={() => router.push('/upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Examination
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No examinations match "{search}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
              >
                <Card
                  className="cursor-pointer hover:border-accent/50 hover:shadow-md transition-all duration-200 group"
                  onClick={() => router.push(`/assignment/${assignment.id}`)}
                >
                  <CardContent className="p-5">
                    {/* Title row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                          {assignment.title}
                        </h3>
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                            {assignment.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(assignment.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {assignment.avg_score > 0 && (
                          <div className="px-2 py-1 rounded-md bg-accent/10 mr-1">
                            <span className="text-sm font-bold text-accent">{assignment.avg_score}%</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-accent"
                          title="Edit examination"
                          onClick={e => {
                            e.stopPropagation();
                            router.push(`/upload/${assignment.id}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDialog
                          title="Delete Examination?"
                          description={`This will permanently delete "${assignment.title}" along with all its submissions, questions, grades, and rubrics. This action cannot be undone.`}
                          confirmText="Delete"
                          onConfirm={e => handleDelete(assignment.id, e)}
                          isLoading={deletingId === assignment.id}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={e => e.stopPropagation()}
                              title="Delete examination"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-border/50">
                      <span className="text-muted-foreground">
                        {assignment.submission_count} submission{assignment.submission_count !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-2">
                        {assignment.submission_count > 0 &&
                          assignment.submission_count - assignment.graded_count > 0 ? (
                          <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full font-medium">
                            {assignment.submission_count - assignment.graded_count} pending
                          </span>
                        ) : assignment.graded_count > 0 ? (
                          <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                            All graded
                          </span>
                        ) : null}
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
