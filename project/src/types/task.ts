export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  user_id: string;
  labels: string[];
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}