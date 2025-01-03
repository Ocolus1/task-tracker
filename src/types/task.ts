export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
  created_at: string;
  user_id: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'created_at' | 'user_id'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;