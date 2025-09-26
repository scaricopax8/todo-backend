export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Todo {
  id: number;
  userId: number;
  task: string;
  description?: string | null;
  completed: boolean;
  completed_at?: Date | null;
  due_date?: Date | null;
  priority: Priority;
  tags: string[];
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
