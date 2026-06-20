export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  max_score: number;
  created_at: string;
  submission_count?: number;
  graded_count?: number;
  avg_score?: number;
}

export interface Activity {
  id: string;
  type: 'submission_uploaded' | 'submission_graded' | 'assignment_created';
  title: string;
  description: string;
  timestamp: string;
}

export interface Profile {
  full_name: string | null;
  school_name: string | null;
}

